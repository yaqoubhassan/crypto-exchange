import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, AlertCircle, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import chatbotConfig, {
  getFaqResponse,
  shouldUseAI,
  formatResponse,
  callGroqAPI,
  callGeminiAPI
} from '@/config/chatbotConfig';

export default function AIChatbot({ onClose, onEscalateToTicket }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: chatbotConfig.ui.welcomeMessage,
      timestamp: new Date(),
      source: 'system',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Rate limiting
  const lastMessageTime = useRef(Date.now());
  const messagesThisMinute = useRef(0);
  const messagesThisHour = useRef(0);

  useEffect(() => {
    if (chatbotConfig.behavior.autoScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (chatbotConfig.behavior.saveConversations && messages.length > 1) {
      const conversationData = {
        messages: messages,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('chatbot_last_conversation', JSON.stringify(conversationData));
    }
  }, [messages]);

  const checkRateLimit = () => {
    if (!chatbotConfig.rateLimit.enabled) return true;

    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime.current;

    if (timeSinceLastMessage > 60000) messagesThisMinute.current = 0;
    if (timeSinceLastMessage > 3600000) messagesThisHour.current = 0;

    if (messagesThisMinute.current >= chatbotConfig.rateLimit.maxMessagesPerMinute) {
      setError('Please slow down. Wait a moment before sending another message.');
      return false;
    }
    if (messagesThisHour.current >= chatbotConfig.rateLimit.maxMessagesPerHour) {
      setError('Message limit reached. Please try again in an hour or create a support ticket.');
      return false;
    }

    messagesThisMinute.current++;
    messagesThisHour.current++;
    lastMessageTime.current = now;
    return true;
  };

  // Main AI response function with fallback chain
  const getAIResponse = async (userMessage, retryCount = 0) => {
    // ALWAYS try FAQ first (most reliable and free)
    const faqResult = getFaqResponse(userMessage);

    // High confidence FAQ = instant return (no API needed)
    if (faqResult.confidence >= chatbotConfig.confidence.high) {
      console.log('✅ FAQ match found - no API call needed');
      return formatResponse(faqResult.response, faqResult.confidence, faqResult.category);
    }

    // If FAQ-only mode enabled, return FAQ or helpful message
    if (chatbotConfig.behavior.faqOnlyMode) {
      if (faqResult.confidence >= chatbotConfig.confidence.low) {
        return formatResponse(faqResult.response, faqResult.confidence, faqResult.category);
      }
      return formatResponse(
        "I don't have a specific answer for that. Please create a support ticket for personalized assistance, or try rephrasing your question.",
        0.5,
        'fallback'
      );
    }

    // Medium confidence FAQ with disclaimer
    if (faqResult.confidence >= chatbotConfig.confidence.medium) {
      const response = `${faqResult.response}\n\n💡 Need more specific help? Feel free to ask or create a support ticket for detailed assistance.`;
      return formatResponse(response, faqResult.confidence, faqResult.category);
    }

    // Low confidence - try AI APIs with fallback chain
    const providers = chatbotConfig.api.fallbackChain;

    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];

      try {
        console.log(`Trying provider: ${provider}`);

        switch (provider) {
          case 'groq':
            if (chatbotConfig.api.groq.apiKey) {
              const response = await callGroqAPI(userMessage);
              console.log('✅ Groq API success');
              return formatResponse(response, 0.85, 'ai-groq');
            }
            break;

          case 'gemini':
            if (chatbotConfig.api.gemini.apiKey) {
              const response = await callGeminiAPI(userMessage);
              console.log('✅ Gemini API success');
              return formatResponse(response, 0.85, 'ai-gemini');
            }
            break;

          case 'local_faq':
            // Use FAQ as fallback
            if (faqResult.confidence > 0) {
              console.log('⚠️  Using FAQ as fallback');
              return formatResponse(faqResult.response, faqResult.confidence, faqResult.category);
            }
            break;

          default:
            continue;
        }
      } catch (error) {
        console.error(`❌ ${provider} failed:`, error.message);
        // Continue to next provider in fallback chain
        continue;
      }
    }

    // All providers failed - return helpful fallback
    console.log('⚠️  All providers failed, using final fallback');
    return formatResponse(
      "I'm having trouble processing complex questions right now. However, I can help with:\n\n• Account & login issues\n• Trading questions\n• Wallet & deposits\n• Security concerns\n\nPlease try asking about one of these topics, or create a support ticket for personalized help.",
      0.3,
      'fallback'
    );
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (input.length > chatbotConfig.ui.maxMessageLength) {
      setError(`Message too long. Maximum ${chatbotConfig.ui.maxMessageLength} characters.`);
      return;
    }

    if (!checkRateLimit()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponseData = await getAIResponse(input);

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: aiResponseData.text,
        timestamp: new Date(),
        metadata: aiResponseData.metadata,
        source: aiResponseData.metadata.source,
      };

      setMessages(prev => [...prev, botMessage]);

      // Track unresolved queries
      if (aiResponseData.metadata.confidence < chatbotConfig.confidence.medium) {
        setUnresolvedCount(prev => prev + 1);
      } else {
        setUnresolvedCount(0);
      }

      // Suggest ticket creation after threshold
      if (unresolvedCount >= chatbotConfig.behavior.escalateThreshold - 1) {
        setTimeout(() => {
          const suggestionMessage = {
            id: messages.length + 3,
            type: 'bot',
            text: "I notice you have several questions I couldn't fully answer. Would you like to create a support ticket? Our team can provide more detailed, personalized assistance.",
            timestamp: new Date(),
            source: 'system',
            showEscalate: true,
          };
          setMessages(prev => [...prev, suggestionMessage]);
          setUnresolvedCount(0);
        }, 1000);
      }

    } catch (err) {
      console.error('Error getting response:', err);
      setError('Sorry, I encountered an error. Please try again or create a support ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action) => {
    setInput(action);
    inputRef.current?.focus();
  };

  const handleFeedback = (messageId, isPositive) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, feedback: isPositive ? 'positive' : 'negative' }
          : msg
      )
    );

    if (chatbotConfig.analytics.trackFeedback) {
      const message = messages.find(m => m.id === messageId);
      console.log('Feedback:', {
        messageId,
        isPositive,
        messageText: message?.text?.substring(0, 50),
        source: message?.source,
      });
    }
  };

  const handleEscalate = () => {
    if (chatbotConfig.analytics.trackEscalations) {
      console.log('Escalation:', {
        messageCount: messages.length,
        unresolvedCount,
        conversationDuration: Date.now() - messages[0].timestamp.getTime(),
      });
    }
    onEscalateToTicket(messages);
  };

  const { primaryColor, secondaryColor, headerGradient } = chatbotConfig.ui.theme;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col animate-slideUp">
        {/* Header */}
        <div className={`bg-gradient-to-r ${headerGradient} text-white p-4 rounded-t-2xl flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center">
                AI Support Assistant
                <Sparkles className="w-4 h-4 ml-2" />
              </h3>
              <p className="text-xs text-indigo-100">
                {chatbotConfig.behavior.faqOnlyMode ? 'FAQ Mode' : 'Online'} • Instant responses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'bot'
                  ? `bg-gradient-to-br from-${primaryColor}-500 to-${secondaryColor}-600`
                  : 'bg-gradient-to-br from-gray-600 to-gray-800'
                  }`}>
                  {message.type === 'bot' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1">
                  <div className={`rounded-2xl p-3 ${message.type === 'bot'
                    ? 'bg-white border border-gray-200 shadow-sm'
                    : `bg-gradient-to-r from-${primaryColor}-600 to-${secondaryColor}-600 text-white shadow-md`
                    }`}>
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>

                    {/* Source indicator */}
                    {message.type === 'bot' && message.metadata && (
                      <div className="mt-2 flex items-center space-x-2">
                        {message.metadata.source === 'faq' && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            FAQ • Instant
                          </span>
                        )}
                        {message.metadata.source?.startsWith('ai-') && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {message.metadata.source.replace('ai-', '').toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Escalation button */}
                    {message.showEscalate && (
                      <button
                        onClick={handleEscalate}
                        className={`mt-3 w-full px-4 py-2 bg-gradient-to-r from-${primaryColor}-600 to-${secondaryColor}-600 text-white rounded-lg hover:from-${primaryColor}-700 hover:to-${secondaryColor}-700 transition-all text-sm font-medium shadow-md`}
                      >
                        Create Support Ticket
                      </button>
                    )}
                  </div>

                  {/* Feedback buttons */}
                  {chatbotConfig.ui.showFeedback && message.type === 'bot' && message.id !== 1 && !message.showEscalate && (
                    <div className="flex items-center space-x-2 mt-2 ml-1">
                      <span className="text-xs text-gray-500">Helpful?</span>
                      <button
                        onClick={() => handleFeedback(message.id, true)}
                        className={`p-1 rounded hover:bg-gray-200 transition-colors ${message.feedback === 'positive' ? 'text-green-600 bg-green-50' : 'text-gray-400'
                          }`}
                        aria-label="Thumbs up"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(message.id, false)}
                        className={`p-1 rounded hover:bg-gray-200 transition-colors ${message.feedback === 'negative' ? 'text-red-600 bg-red-50' : 'text-gray-400'
                          }`}
                        aria-label="Thumbs down"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Timestamp */}
                  {chatbotConfig.ui.showTimestamp && (
                    <p className="text-xs text-gray-500 mt-1 ml-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && chatbotConfig.behavior.showTypingIndicator && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-${primaryColor}-500 to-${secondaryColor}-600`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div className={`w-2 h-2 bg-${primaryColor}-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 bg-${primaryColor}-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 bg-${primaryColor}-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 max-w-md">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && chatbotConfig.ui.quickActions.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-white">
            <p className="text-xs text-gray-600 mb-2 font-medium">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {chatbotConfig.ui.quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className={`text-xs bg-${primaryColor}-50 text-${primaryColor}-700 px-3 py-1.5 rounded-full hover:bg-${primaryColor}-100 transition-colors border border-${primaryColor}-200`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                rows="1"
                maxLength={chatbotConfig.ui.maxMessageLength}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {input.length}/{chatbotConfig.ui.maxMessageLength}
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`bg-gradient-to-r from-${primaryColor}-600 to-${secondaryColor}-600 text-white p-3 rounded-lg hover:from-${primaryColor}-700 hover:to-${secondaryColor}-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex-shrink-0`}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">
              Press Enter to send • Shift+Enter for new line
            </p>
            <button
              onClick={handleEscalate}
              className={`text-xs text-${primaryColor}-600 hover:text-${primaryColor}-700 font-medium flex items-center`}
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              Create Support Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}