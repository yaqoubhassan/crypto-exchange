import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function HelpCenter({ auth }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account & Security', icon: '🔐' },
    { id: 'trading', name: 'Trading', icon: '💹' },
    { id: 'wallet', name: 'Wallet & Payments', icon: '💰' },
    { id: 'verification', name: 'Verification', icon: '✅' },
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I create an account?',
      answer: 'Click on the "Sign Up" button in the top right corner, fill in your details including email, password, and personal information. You\'ll receive a verification email to confirm your account.'
    },
    {
      category: 'getting-started',
      question: 'What documents do I need for verification?',
      answer: 'You\'ll need a valid government-issued ID (passport, driver\'s license, or national ID card) and proof of address (utility bill or bank statement not older than 3 months).'
    },
    {
      category: 'account',
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to Settings > Security > Two-Factor Authentication. Download an authenticator app like Google Authenticator, scan the QR code, and enter the verification code to enable 2FA.'
    },
    {
      category: 'account',
      question: 'I forgot my password. What should I do?',
      answer: 'Click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
    },
    {
      category: 'trading',
      question: 'How do I place my first trade?',
      answer: 'Navigate to the Trading page, select your cryptocurrency pair, choose between Market or Limit order, enter the amount you want to trade, and click "Buy" or "Sell".'
    },
    {
      category: 'trading',
      question: 'What\'s the difference between Market and Limit orders?',
      answer: 'A Market order executes immediately at the current market price. A Limit order lets you set a specific price at which you want to buy or sell, and only executes when the market reaches that price.'
    },
    {
      category: 'trading',
      question: 'What are trading fees?',
      answer: 'We charge a 0.1% fee for makers and 0.2% for takers on all trades. Volume-based discounts are available for high-frequency traders.'
    },
    {
      category: 'wallet',
      question: 'How do I deposit funds?',
      answer: 'Go to Wallet > Deposit, select your cryptocurrency, copy the wallet address or scan the QR code, and send funds from your external wallet. Wait for network confirmations before the funds appear.'
    },
    {
      category: 'wallet',
      question: 'How long do withdrawals take?',
      answer: 'Cryptocurrency withdrawals typically take 10-30 minutes depending on network congestion. Bank transfers can take 1-5 business days depending on your bank.'
    },
    {
      category: 'wallet',
      question: 'Are there withdrawal limits?',
      answer: 'Unverified accounts have a limit of $2,000 per day. Verified accounts can withdraw up to $50,000 per day. Higher limits are available upon request for institutional clients.'
    },
    {
      category: 'verification',
      question: 'How long does verification take?',
      answer: 'Most verifications are completed within 24 hours. During high-volume periods, it may take up to 72 hours. You\'ll receive an email notification once your verification is complete.'
    },
    {
      category: 'verification',
      question: 'Why was my verification rejected?',
      answer: 'Common reasons include blurry documents, expired IDs, mismatched information, or poor lighting. Please ensure your documents are clear, current, and all information matches your account details.'
    },
  ];

  const quickLinks = [
    { title: 'API Documentation', href: '#', icon: '📖', description: 'Developer guides and API references' },
    { title: 'Trading Guide', href: '#', icon: '📊', description: 'Learn how to trade effectively' },
    { title: 'Security Best Practices', href: '#', icon: '🔒', description: 'Keep your account secure' },
    { title: 'Fee Structure', href: '#', icon: '💵', description: 'Understand our pricing' },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Help Center
        </h2>
      }
    >
      <Head title="Help Center" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
            <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
            <p className="text-indigo-100 mb-6">Search our knowledge base or browse categories below</p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <svg className="absolute right-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="text-3xl mb-3">{link.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </a>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Categories Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === category.id
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href="/support"
                    className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeCategory === 'all' ? 'All Questions' : categories.find(c => c.id === activeCategory)?.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredFaqs.length} {filteredFaqs.length === 1 ? 'article' : 'articles'} found
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                      <details key={index} className="group p-6 cursor-pointer">
                        <summary className="flex items-start justify-between font-medium text-gray-900 list-none">
                          <span className="flex-1">{faq.question}</span>
                          <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <p className="mt-4 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </details>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-600 mb-6">Try adjusting your search or browse different categories</p>
                      <Link
                        href="/support"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Contact Support
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Still Need Help */}
              <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Still need help?</h3>
                    <p className="text-gray-700 mb-4">Our support team is available 24/7 to assist you</p>
                    <Link
                      href="/support"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Create Support Ticket
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}