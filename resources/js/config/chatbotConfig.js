export const chatbotConfig = {
  // API Configuration with multiple provider options
  api: {
    // Primary provider - 'groq' recommended for production
    provider: 'groq', // Options: 'groq', 'gemini', 'openrouter', 'huggingface', 'local_faq'

    // Groq - FREE and VERY FAST (Recommended)
    groq: {
      apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
      model: 'llama-3.1-8b-instant', // Fast and free model
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    },

    // Google Gemini - FREE tier with 60 req/min
    gemini: {
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      model: 'gemini-pro',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    },

    // Hugging Face - Keep as backup option (less reliable)
    huggingface: {
      token: import.meta.env.VITE_HUGGINGFACE_API_TOKEN || '',
      model: 'facebook/blenderbot-400M-distill',
      endpoint: 'https://api-inference.huggingface.co/models/',
    },

    // OpenRouter - Free models available
    openrouter: {
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
      model: 'meta-llama/llama-3-8b-instruct:free',
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    },

    timeout: 30000,
    maxRetries: 2,

    // Fallback chain - tries providers in order, ends with local FAQ
    fallbackChain: ['groq', 'gemini', 'openrouter', 'huggingface', 'local_faq'],
  },

  // UI Configuration
  ui: {
    welcomeMessage: "Hi! I'm your AI Support Assistant. I can help you with common questions about accounts, trading, wallets, and more. How can I assist you today?",
    theme: {
      primaryColor: 'indigo',
      secondaryColor: 'purple',
      headerGradient: 'from-indigo-600 to-purple-600',
    },
    quickActions: [
      'How do I reset my password?',
      'How to deposit crypto?',
      'What are the trading fees?',
      'How to enable 2FA?',
    ],
    showFeedback: true,
    showTimestamp: true,
    maxMessageLength: 500,
  },

  // Behavior Configuration
  behavior: {
    useFaqFirst: true, // Always try FAQ before API (recommended)
    faqOnlyMode: false, // Set to true to disable ALL API calls
    escalateThreshold: 3, // Suggest ticket after N unresolved queries
    saveConversations: true,
    showTypingIndicator: true,
    autoScrollToBottom: true,
  },

  // Enhanced FAQ Knowledge Base
  faq: {
    // Account Related
    account: {
      keywords: ['account', 'login', 'password', 'reset', 'verify', 'email', 'username', 'sign in', 'register', 'kyc', 'profile', 'logout', 'create account'],
      responses: {
        'forgot password': {
          answer: "To reset your password:\n\n1️⃣ Click 'Forgot Password' on the login page\n2️⃣ Enter your registered email address\n3️⃣ Check your email for a reset link (check spam folder too!)\n4️⃣ Click the link and create a new strong password\n5️⃣ Use a mix of letters, numbers, and symbols\n\n💡 Tips:\n• Password must be at least 8 characters\n• Use a unique password you don't use elsewhere\n• Consider using a password manager\n\nIf you don't receive the email within 5 minutes, contact our support team.",
          confidence: 0.95,
          tags: ['password', 'reset', 'forgot'],
        },
        'verify account': {
          answer: "To verify your account and unlock full features:\n\n📧 **Email Verification** (Required):\n1️⃣ Check your email for verification link\n2️⃣ Click the link to verify\n3️⃣ If expired, request a new link in Settings\n\n🆔 **KYC Verification** (For higher limits):\n1️⃣ Go to Settings > Verification\n2️⃣ Upload valid ID:\n   • Passport\n   • Driver's License\n   • National ID Card\n3️⃣ Upload proof of address (less than 3 months old):\n   • Utility bill\n   • Bank statement\n   • Government letter\n4️⃣ Take a selfie with your ID\n5️⃣ Wait 24-48 hours for review\n\n✅ Benefits:\n• Higher deposit/withdrawal limits\n• Access to all trading pairs\n• Priority support",
          confidence: 0.95,
          tags: ['verify', 'kyc', 'verification'],
        },
        'change email': {
          answer: "To change your email address:\n\n1️⃣ Log in to your account\n2️⃣ Go to Settings > Account Security\n3️⃣ Click 'Change Email Address'\n4️⃣ Enter your new email\n5️⃣ Verify with your password and 2FA code\n6️⃣ Confirm via emails sent to both:\n   • Your old email (confirmation)\n   • Your new email (verification)\n\n⚠️ Important:\n• You must have access to your old email\n• 2FA must be enabled\n• Process takes 5-10 minutes\n\nFor security reasons, you can't change email if:\n• You have pending withdrawals\n• Your account is under review",
          confidence: 0.9,
          tags: ['email', 'change', 'update'],
        },
        'cant login': {
          answer: "If you can't log in, try these steps:\n\n1️⃣ **Check your credentials**\n   • Verify email address is correct\n   • Caps Lock is off\n   • No extra spaces\n\n2️⃣ **Reset your password**\n   • Click 'Forgot Password'\n   • Check spam folder for reset email\n\n3️⃣ **Check 2FA**\n   • Ensure device time is synced\n   • Try generating a new code\n   • Use backup codes if needed\n\n4️⃣ **Clear browser cache**\n   • Try incognito/private mode\n   • Try different browser\n\n5️⃣ **Check account status**\n   • Account might be temporarily locked\n   • Check email for notifications\n\nStill stuck? Create a support ticket with:\n• Your registered email\n• Screenshot of error message\n• Last successful login date",
          confidence: 0.9,
          tags: ['login', 'access', 'locked'],
        },
        'default': {
          answer: "I can help with account-related issues:\n\n🔐 **Account Access**\n• Password reset\n• Login problems\n• Account locked/suspended\n\n✉️ **Email & Verification**\n• Email verification\n• Change email address\n• Resend verification email\n\n🆔 **KYC & Identity**\n• Identity verification\n• Document upload\n• Verification status\n\n⚙️ **Account Settings**\n• Profile updates\n• Security settings\n• Account closure\n\nWhat specific issue are you experiencing? Please describe your problem and I'll provide detailed help!",
          confidence: 0.7,
          tags: ['account', 'general'],
        }
      }
    },

    // Trading Related
    trading: {
      keywords: ['trade', 'buy', 'sell', 'order', 'market', 'limit', 'price', 'fee', 'commission', 'exchange', 'pair', 'chart', 'execute', 'cancel order'],
      responses: {
        'trading fees': {
          answer: "Our competitive trading fee structure:\n\n💰 **Standard Fees**\n• Maker Fee: 0.1% (when you add liquidity)\n• Taker Fee: 0.2% (when you take liquidity)\n\n📊 **Volume-Based Discounts**\n• $100K+ monthly volume: 10% fee discount\n• $1M+ monthly volume: 20% fee discount  \n• $10M+ monthly volume: 30% fee discount\n• $100M+ monthly volume: Contact for VIP rates\n\n🎁 **Additional Discounts**\n• Pay fees with our native token: -25%\n• Referral bonuses available\n• Market maker programs for institutions\n\n💡 **Fee Example:**\nBuy $1,000 worth of Bitcoin:\n• Taker fee: $1,000 × 0.2% = $2\n• Maker fee: $1,000 × 0.1% = $1\n\nFees are automatically deducted from your trade.\n\nView your current fee tier in Settings > Trading Fees",
          confidence: 0.95,
          tags: ['fees', 'commission', 'cost'],
        },
        'how to trade': {
          answer: "Complete guide to placing your first trade:\n\n**📱 Step-by-Step:**\n\n1️⃣ **Go to Trading Page**\n   • Click 'Trade' in main menu\n   • Or go to Markets and select a pair\n\n2️⃣ **Select Trading Pair**\n   • Example: BTC/USDT means buying BTC with USDT\n   • Use search to find your desired coin\n\n3️⃣ **Choose Order Type**\n   • **Market Order**: Executes immediately at current price (fastest)\n   • **Limit Order**: Executes when price reaches your target (more control)\n   • **Stop-Limit**: Advanced - triggers at stop price\n\n4️⃣ **Enter Amount**\n   • Can enter in crypto or fiat\n   • Use percentage buttons (25%, 50%, 75%, 100%)\n   • Check available balance\n\n5️⃣ **Review & Confirm**\n   • Check total cost including fees\n   • Verify you're buying/selling correct amount\n   • Click 'Buy' or 'Sell'\n\n💡 **Pro Tips:**\n• Start with small amounts to learn\n• Market orders for speed, Limit orders for price control\n• Check depth chart before large orders\n• Enable price alerts for your targets",
          confidence: 0.95,
          tags: ['trade', 'buy', 'sell', 'how'],
        },
        'cancel order': {
          answer: "To cancel an open order:\n\n**Quick Method:**\n1️⃣ Go to Trading page\n2️⃣ Scroll to 'Open Orders' section (bottom)\n3️⃣ Find your order\n4️⃣ Click red 'Cancel' button\n5️⃣ Confirm cancellation\n\n**From Orders Page:**\n1️⃣ Click 'Orders' in menu\n2️⃣ Go to 'Open Orders' tab\n3️⃣ Find order and click 'Cancel'\n4️⃣ Confirm\n\n✅ **What Happens:**\n• Order removed from order book immediately\n• Funds returned to your wallet instantly\n• No fees for cancellation\n\n⚠️ **Important Notes:**\n• Can only cancel orders with 'Open' status\n• Partially filled orders: unfilled portion cancelled\n• Fully filled orders: cannot be cancelled\n• No refunds on filled orders\n\n💡 **Bulk Actions:**\n• 'Cancel All' button to cancel all open orders\n• Filter by trading pair before cancelling",
          confidence: 0.9,
          tags: ['cancel', 'order', 'stop'],
        },
        'market vs limit': {
          answer: "Understanding order types:\n\n**🚀 Market Order**\n• Executes IMMEDIATELY at best available price\n• Guaranteed execution\n• Price may vary slightly (slippage)\n• Higher taker fee (0.2%)\n• Best for: Quick trades, liquid markets\n\n**🎯 Limit Order**\n• Executes ONLY at your specified price or better\n• No guarantee of execution\n• No slippage - you set the price\n• Lower maker fee (0.1%)\n• Best for: Price targeting, patient traders\n\n**📊 Example:**\nBitcoin is at $50,000\n\n*Market Order:*\n• Click 'Buy' → Executes at ~$50,000-$50,005\n• You get Bitcoin immediately\n\n*Limit Order:*\n• Set limit at $49,500\n• Order waits until price drops\n• Executes at $49,500 or better\n• Might never execute if price doesn't reach\n\n**💡 Which to Choose?**\n• Need it now? → Market Order\n• Want specific price? → Limit Order\n• Large order? → Limit Order (avoid slippage)\n• Volatile market? → Limit Order (price control)",
          confidence: 0.95,
          tags: ['market', 'limit', 'order type'],
        },
        'default': {
          answer: "I can help you with trading:\n\n📈 **Getting Started**\n• How to place trades\n• Understanding order types\n• Reading price charts\n• Trading interface guide\n\n💰 **Fees & Costs**\n• Trading fee structure\n• Volume discounts\n• Fee calculation\n\n📊 **Order Management**\n• Placing orders\n• Cancelling orders\n• Order history\n• Partial fills\n\n⚙️ **Advanced Features**\n• Stop-loss orders\n• Take-profit orders\n• Trading bots\n• API trading\n\nWhat would you like to know about trading? Please be specific and I'll provide detailed guidance!",
          confidence: 0.7,
          tags: ['trading', 'general'],
        }
      }
    },

    // Wallet & Payments
    wallet: {
      keywords: ['wallet', 'deposit', 'withdraw', 'balance', 'payment', 'transfer', 'crypto', 'bitcoin', 'ethereum', 'transaction', 'address', 'send', 'receive'],
      responses: {
        'deposit crypto': {
          answer: "How to deposit cryptocurrency:\n\n**📥 Step-by-Step:**\n\n1️⃣ **Navigate to Wallet**\n   • Click 'Wallet' in main menu\n   • Or go to user menu > Wallet\n\n2️⃣ **Select Cryptocurrency**\n   • Find the coin you want to deposit\n   • Click on it or use search\n\n3️⃣ **Click 'Deposit'**\n   • You'll see your unique wallet address\n   • Also see a QR code\n\n4️⃣ **Copy Address or Scan QR**\n   • Click 'Copy Address' button\n   • Or scan QR code with external wallet\n\n5️⃣ **Send from External Wallet**\n   • Open your external wallet/exchange\n   • Paste the address\n   • ⚠️ IMPORTANT: Select correct network!\n   • Send your crypto\n\n6️⃣ **Wait for Confirmations**\n   • Bitcoin: 3 confirmations (~30 min)\n   • Ethereum: 12 confirmations (~3 min)\n   • BSC: 15 confirmations (~45 sec)\n   • Other coins: varies\n\n7️⃣ **Funds Appear**\n   • Check transaction status in Wallet > History\n   • Funds available after confirmations\n\n⚠️ **Critical Warnings:**\n• ALWAYS double-check the address\n• ALWAYS select correct network (ERC-20, BEP-20, TRC-20, etc.)\n• Wrong network = Lost funds!\n• Start with small test amount first\n• Don't deposit tokens to wrong network addresses\n\n💡 **Pro Tips:**\n• Bookmark your deposit address securely\n• Higher fees = faster confirmations\n• Check network congestion before sending\n• Save transaction hash for reference",
          confidence: 0.95,
          tags: ['deposit', 'crypto', 'send'],
        },
        'withdraw': {
          answer: "How to withdraw cryptocurrency:\n\n**📤 Step-by-Step:**\n\n1️⃣ **Go to Wallet**\n   • Select the cryptocurrency\n   • Click 'Withdraw'\n\n2️⃣ **Enter Destination Address**\n   • Paste recipient's wallet address\n   • Double-check it's correct!\n   • Select correct network\n\n3️⃣ **Enter Amount**\n   • Type amount to withdraw\n   • Or use percentage buttons\n   • Check minimum/maximum limits\n\n4️⃣ **Review Fees**\n   • Network fee shown\n   • You receive: Amount - Fee\n   • Example: Withdraw 1 BTC, fee 0.0005 BTC, receive 0.9995 BTC\n\n5️⃣ **Complete Verification**\n   • Enter 2FA code (required)\n   • Email confirmation code\n   • SMS code (if enabled)\n\n6️⃣ **Confirm Withdrawal**\n   • Review all details carefully\n   • Click 'Confirm'\n   • Check confirmation email\n\n7️⃣ **Processing**\n   • Manual review if large amount\n   • Usually processed within 30 minutes\n   • Track in Withdrawal History\n\n⏱️ **Processing Times:**\n• Crypto withdrawals: 10-30 minutes\n• Bank transfers: 1-3 business days\n• Peak times may be longer\n\n⚠️ **Important Notes:**\n• Minimum withdrawal amounts apply\n• 24-hour withdrawal limit: Check in settings\n• First withdrawal may take longer (security)\n• Whitelist addresses for faster future withdrawals\n\n🔒 **Security Tips:**\n• Always enable 2FA\n• Use address whitelist feature\n• Verify withdrawal emails carefully\n• Never share 2FA codes\n\n💰 **Withdrawal Fees:**\nVary by cryptocurrency:\n• Bitcoin: 0.0005 BTC\n• Ethereum: 0.005 ETH\n• USDT (ERC-20): 10 USDT\n• USDT (TRC-20): 1 USDT\n• Check specific fee when withdrawing",
          confidence: 0.95,
          tags: ['withdraw', 'withdrawal', 'send out'],
        },
        'minimum deposit': {
          answer: "Minimum & Maximum deposit amounts:\n\n**💰 Cryptocurrency Minimums:**\n• Bitcoin (BTC): 0.001 BTC (~$50)\n• Ethereum (ETH): 0.01 ETH (~$30)\n• USDT: 10 USDT\n• USDC: 10 USDC\n• BNB: 0.1 BNB\n• Other altcoins: Varies (check wallet page)\n\n**💵 Fiat Currency Minimums:**\n• Bank Transfer (ACH): $50\n• Wire Transfer: $100\n• Credit/Debit Card: $20\n• Other methods: Varies by country\n\n**📊 Maximum Limits:**\n• No maximum for crypto deposits\n• Fiat limits based on verification level:\n  - Unverified: $1,000/day\n  - Basic KYC: $10,000/day\n  - Full KYC: $100,000/day\n  - Institutional: Unlimited\n\n**⚠️ Small Deposits:**\nDeposits below minimum:\n• Will not be credited\n• Cannot be recovered\n• Lost forever - be careful!\n\n**💡 Pro Tip:**\nTo check minimums before depositing:\n1. Go to Wallet\n2. Select cryptocurrency  \n3. Click 'Deposit'\n4. Minimum shown on deposit page\n\nFor custom limits, contact VIP support.",
          confidence: 0.9,
          tags: ['minimum', 'maximum', 'limits'],
        },
        'deposit fiat': {
          answer: "How to deposit fiat currency (USD, EUR, etc.):\n\n**💳 Available Methods:**\n\n**1️⃣ Bank Transfer (ACH/SEPA)**\n• Lowest fees (often free)\n• Takes 1-3 business days\n• Best for large amounts\n• Steps:\n  - Go to Wallet > Fiat\n  - Select 'Deposit' > Bank Transfer\n  - Note our bank details\n  - Transfer from your bank\n  - Use reference code provided\n\n**2️⃣ Wire Transfer**\n• Same-day processing\n• Higher fees ($15-30)\n• Best for urgent large deposits\n• Requires verification\n\n**3️⃣ Credit/Debit Card**\n• INSTANT deposit\n• 3-5% fee\n• Best for small amounts\n• Steps:\n  - Select 'Card Deposit'\n  - Enter amount\n  - Add card details (saved for future)\n  - Confirm\n  - Funds available immediately\n\n**4️⃣ Other Methods** (varies by country)\n• PayPal\n• Apple Pay\n• Google Pay\n• Local payment methods\n\n**📋 Requirements:**\n• Email verified\n• Phone verified\n• KYC completed (for higher limits)\n• Bank account in your name\n\n**💰 Fees Comparison:**\n• Bank Transfer: $0-5\n• Wire: $15-30\n• Card: 3-5% of amount\n• PayPal: 2.5%\n\n**⏱️ Processing Times:**\n• Card: Instant\n• ACH: 1-3 days\n• Wire: Same day\n• International: 3-5 days\n\n💡 **Tips:**\n• Bank transfer cheapest for $1000+\n• Card best for urgent small amounts\n• Always use correct reference code\n• First deposit may take longer (verification)",
          confidence: 0.95,
          tags: ['fiat', 'deposit', 'bank', 'card'],
        },
        'default': {
          answer: "I can help with wallet & payment issues:\n\n💰 **Deposits**\n• How to deposit crypto\n• How to deposit fiat\n• Minimum/maximum limits\n• Deposit not showing up\n• Network selection\n\n💸 **Withdrawals**\n• How to withdraw crypto\n• How to withdraw fiat\n• Withdrawal limits\n• Withdrawal fees\n• Processing times\n\n📊 **Account Management**\n• Check balance\n• Transaction history\n• Pending transactions\n• Failed transactions\n\n🔍 **Troubleshooting**\n• Missing deposit\n• Stuck withdrawal\n• Wrong network\n• Address issues\n\nWhat specific wallet or payment question do you have? Please provide details and I'll give you step-by-step help!",
          confidence: 0.7,
          tags: ['wallet', 'general'],
        }
      }
    },

    // Security Related
    security: {
      keywords: ['security', '2fa', 'two factor', 'secure', 'hack', 'safety', 'protect', 'suspicious', 'authentication', 'google authenticator', 'scam', 'phishing'],
      responses: {
        '2fa': {
          answer: "Complete guide to Two-Factor Authentication (2FA):\n\n**🔐 What is 2FA?**\nAdds an extra security layer beyond your password. Requires both:\n1. Something you know (password)\n2. Something you have (phone with authenticator app)\n\n**📱 How to Enable 2FA:**\n\n1️⃣ **Download Authenticator App**\n   • Google Authenticator (recommended)\n   • Authy\n   • Microsoft Authenticator\n   • Available on iOS and Android\n\n2️⃣ **Enable in Settings**\n   • Go to Settings > Security\n   • Click 'Enable 2FA'\n   • Keep backup codes safe!\n\n3️⃣ **Scan QR Code**\n   • Open authenticator app\n   • Tap '+' or 'Add Account'\n   • Scan QR code shown on screen\n   • Or manually enter the key\n\n4️⃣ **Enter Verification Code**\n   • App generates 6-digit code\n   • Code changes every 30 seconds\n   • Enter code to confirm setup\n\n5️⃣ **Save Backup Codes**\n   • Download and print backup codes\n   • Store in safe place\n   • Use if you lose your phone\n\n**✅ Benefits:**\n• Blocks unauthorized access\n• Required for withdrawals\n• Protects against password theft\n• Industry best practice\n\n**💡 Pro Tips:**\n• Enable on all crypto platforms\n• Never screenshot QR codes\n• Don't share 2FA codes with anyone\n• Keep backup codes offline\n• Sync device time for correct codes\n\n**⚠️ Important:**\n• You'll need 2FA for:\n  - Login (optional but recommended)\n  - Withdrawals (required)\n  - Security changes (required)\n  - API access (required)",
          confidence: 0.95,
          tags: ['2fa', 'security', 'authentication'],
        },
        'lost 2fa': {
          answer: "If you've lost access to your 2FA device:\n\n**🔑 Use Backup Codes** (If you saved them):\n1️⃣ Go to login page\n2️⃣ Enter email and password\n3️⃣ When prompted for 2FA, click 'Use backup code'\n4️⃣ Enter one of your backup codes\n5️⃣ Immediately set up 2FA on new device\n\n**📧 No Backup Codes? Account Recovery:**\n\n1️⃣ **Start Recovery Process**\n   • Click 'Can't access 2FA?' on login\n   • Or create support ticket\n\n2️⃣ **Provide Verification**\n   You'll need to submit:\n   • Government-issued ID\n   • Selfie holding your ID and paper with:\n     - Your email address\n     - Today's date\n     - Signature\n   • Proof of address\n   • Recent transaction details\n   • Any other account information\n\n3️⃣ **Security Review**\n   • Our team manually reviews (24-48 hours)\n   • Additional verification may be requested\n   • For security, this process cannot be rushed\n\n4️⃣ **Account Access Restored**\n   • 2FA will be disabled\n   • Withdrawals suspended for 48 hours\n   • You must re-enable 2FA immediately\n\n**⚠️ Security Measures:**\n• Process takes 24-48 hours minimum\n• No exceptions for security reasons\n• Withdrawals frozen during recovery\n• Must complete full KYC if not done\n\n**🛡️ Prevent This:**\n• Save backup codes when enabling 2FA\n• Keep codes in multiple safe places\n• Consider 2+ authenticator apps\n• Update phone number as backup\n\n**💡 Best Practice:**\nWhen setting up 2FA:\n1. Download backup codes\n2. Print them\n3. Store in safe/security box\n4. Keep digital copy in password manager",
          confidence: 0.95,
          tags: ['2fa', 'lost', 'recovery', 'locked'],
        },
        'suspicious activity': {
          answer: "🚨 **If you notice suspicious activity:**\n\n**⚡ IMMEDIATE ACTIONS** (Do Now!):\n\n1️⃣ **Change Password Immediately**\n   • Use strong, unique password\n   • Never reuse old passwords\n   • Min 12 characters, mix of types\n\n2️⃣ **Enable 2FA** (if not already)\n   • Go to Settings > Security\n   • Enable immediately\n   • Use authenticator app (not SMS)\n\n3️⃣ **Check Recent Activity**\n   • Settings > Security > Login History\n   • Look for unfamiliar:\n     - Locations\n     - Devices\n     - IP addresses\n     - Login times\n\n4️⃣ **Review Transactions**\n   • Wallet > Transaction History\n   • Check for unauthorized:\n     - Withdrawals\n     - Trades\n     - Transfers\n\n5️⃣ **Revoke API Keys**\n   • Settings > API Management\n   • Delete all API keys\n   • Create new ones only if needed\n\n6️⃣ **Contact Support IMMEDIATELY**\n   • Create urgent support ticket\n   • Include:\n     - What you noticed\n     - Approximate time\n     - Screenshots if possible\n     - Your concerns\n\n**🔒 Additional Security Steps:**\n\n• **Enable Withdrawal Whitelist**\n  - Only allow withdrawals to pre-approved addresses\n  - 24-hour activation delay\n\n• **Set Anti-Phishing Code**\n  - Personal code in all our emails\n  - Verify code before clicking links\n\n• **Enable Login Notifications**\n  - Get alerted for every login\n  - Know immediately if someone else logs in\n\n• **Check Email Security**\n  - Change email password\n  - Enable 2FA on email\n  - Review email forwarding rules\n\n**🚩 Signs of Compromise:**\n• Unfamiliar login locations\n• Unexpected emails about changes\n• Missing funds\n• Orders you didn't place\n• Password suddenly not working\n• 2FA codes you didn't request\n\n**❌ What NOT to Do:**\n• Don't ignore warning signs\n• Don't delay contacting support\n• Don't share 2FA codes with anyone claiming to be support\n• Don't click suspicious links in emails\n\n**💡 Prevention:**\n• Use unique password for crypto\n• Enable all security features\n• Never share credentials\n• Beware of phishing emails\n• Use hardware wallet for large amounts\n• Keep software updated\n• Use VPN on public WiFi\n\n**🆘 Need Help?**\nContact us immediately:\n• Emergency: Create urgent ticket\n• Include \"SECURITY BREACH\" in subject\n• We respond within 30 minutes for security issues\n\nWe take security seriously and will investigate promptly.",
          confidence: 0.95,
          tags: ['suspicious', 'hack', 'security', 'breach'],
        },
        'secure account': {
          answer: "Complete guide to securing your account:\n\n**🔐 ESSENTIAL Security (Do These Now!):**\n\n✅ **1. Enable 2FA**\n   • Settings > Security > Enable 2FA\n   • Use authenticator app (not SMS)\n   • Save backup codes securely\n\n✅ **2. Strong Unique Password**\n   • Minimum 12 characters\n   • Mix: uppercase, lowercase, numbers, symbols\n   • Never reuse passwords\n   • Use password manager\n\n✅ **3. Withdrawal Whitelist**\n   • Settings > Security > Address Management\n   • Only allow withdrawals to approved addresses\n   • 24-hour activation delay for new addresses\n\n✅ **4. Anti-Phishing Code**\n   • Settings > Security > Anti-Phishing\n   • Set personal code\n   • Appears in all our official emails\n   • Verify before clicking any links\n\n**🛡️ ADVANCED Security:**\n\n✅ **5. Email Security**\n   • Use unique email for crypto\n   • Enable 2FA on email account\n   • Check for email forwarding rules\n   • Review connected devices\n\n✅ **6. Device Management**\n   • Review authorized devices regularly\n   • Remove unknown devices\n   • Logout from unused sessions\n\n✅ **7. API Key Security**\n   • Only create if absolutely needed\n   • Never share API keys\n   • Set IP whitelist restrictions\n   • Enable read-only when possible\n   • Review and rotate regularly\n\n✅ **8. Login Notifications**\n   • Enable email alerts for every login\n   • Get notified of suspicious activity\n   • Review login history weekly\n\n**🌐 BEST PRACTICES:**\n\n• **Never share:**\n  - Password\n  - 2FA codes\n  - Backup codes\n  - API keys\n\n• **Watch for phishing:**\n  - Check email sender carefully\n  - Never click suspicious links\n  - We never ask for passwords\n  - Verify anti-phishing code\n\n• **Device security:**\n  - Keep OS and apps updated\n  - Use antivirus software\n  - Don't use public computers\n  - Use VPN on public WiFi\n\n• **Smart habits:**\n  - Logout after each session\n  - Don't save passwords in browser\n  - Use hardware wallet for large amounts\n  - Enable all available security features\n\n**🏆 SECURITY SCORE:**\nCheck your security score:\nSettings > Security Score\n\nAim for 100/100:\n• 2FA enabled: +30 points\n• Withdrawal whitelist: +25 points\n• Anti-phishing code: +20 points\n• Strong password: +15 points\n• Email verified: +10 points\n\n**💪 Maximum Security Setup:**\n1. Enable 2FA ✓\n2. Use hardware security key (YubiKey) ✓\n3. Enable withdrawal whitelist ✓\n4. Set anti-phishing code ✓\n5. Use dedicated email ✓\n6. Enable all notifications ✓\n7. Use hardware wallet ✓\n8. Regular security audits ✓\n\nOur platform security:\n• 95% of funds in cold storage\n• Multi-signature wallets\n• Regular security audits\n• Insurance coverage\n• 24/7 security monitoring",
          confidence: 0.95,
          tags: ['security', 'protect', 'safe'],
        },
        'default': {
          answer: "I can help with security concerns:\n\n🔐 **Account Security**\n• Enable 2FA\n• Secure your password\n• Withdrawal whitelist\n• Anti-phishing code\n\n🚨 **Security Issues**\n• Suspicious activity\n• Unauthorized access\n• Lost 2FA device\n• Account recovery\n\n🛡️ **Best Practices**\n• Security checklist\n• Avoiding scams\n• Phishing prevention\n• Device security\n\n📧 **Common Scams**\n• Phishing emails\n• Fake support\n• Social engineering\n• Impersonation\n\nWhat security concern do you have? Please describe your situation and I'll provide detailed guidance!",
          confidence: 0.7,
          tags: ['security', 'general'],
        }
      }
    },

    general: {
      keywords: ['help', 'support', 'contact', 'hours', 'response time', 'phone', 'email', 'question', 'issue', 'problem'],
      responses: {
        'contact support': {
          answer: "Multiple ways to reach our support team:\n\n💬 **Live Chat** (You're here!)\n• Instant AI responses\n• Available 24/7\n• Best for quick questions\n\n🎫 **Support Ticket**\n• Create from this page\n• Response within 12 hours\n• Best for complex issues\n• Attach screenshots/documents\n\n📧 **Email Support**\n• support@cryptoexchange.com\n• Response within 24 hours\n• Best for detailed inquiries\n\n📱 **Social Media**\n• Twitter: @CryptoExchange\n• Telegram: @CryptoExchangeOfficial\n• Discord: discord.gg/cryptoexchange\n\n⏰ **Response Times:**\n• Live Chat: Instant\n• Support Ticket: 12 hours average\n• Email: 24 hours average\n• Priority/VIP: 1 hour\n• Security Issues: 30 minutes\n\n🚨 **Emergency Support:**\nFor urgent security issues:\n• Create ticket with \"URGENT\" in subject\n• Tweet @CryptoExchangeSupport\n• Response within 30 minutes\n\n💎 **VIP Support:**\nFor accounts with $100K+ balance:\n• Dedicated account manager\n• Priority response\n• Direct phone line\n• Video call support\n\n📋 **Before Contacting:**\nHave ready:\n• Your registered email\n• Account verification status\n• Description of issue\n• Screenshots (if applicable)\n• Transaction IDs (if relevant)\n\n🌍 **Available 24/7**\nOur support team never sleeps!",
          confidence: 0.95,
          tags: ['contact', 'support', 'help'],
        },
        'default': {
          answer: "I'm here to help! I can assist with:\n\n🔐 **Account Issues**\n• Login problems\n• Password reset\n• Verification\n• Account settings\n\n💰 **Financial Questions**\n• Deposits & withdrawals\n• Trading help\n• Fee information\n• Balance inquiries\n\n🛡️ **Security**\n• 2FA setup\n• Security best practices\n• Suspicious activity\n• Account protection\n\n📚 **General Info**\n• Platform features\n• How-to guides\n• Policies & terms\n• Getting started\n\nWhat can I help you with today? Please describe your question or issue, and I'll provide detailed assistance!",
          confidence: 0.8,
          tags: ['help', 'general'],
        }
      }
    }
  },


  // Response Confidence Thresholds
  confidence: {
    high: 0.85,
    medium: 0.6,
    low: 0.4,
  },

  // Rate Limiting
  rateLimit: {
    enabled: true,
    maxMessagesPerMinute: 10,
    maxMessagesPerHour: 50,
  },

  // Analytics
  analytics: {
    trackConversations: true,
    trackFeedback: true,
    trackEscalations: true,
  },
};

// Enhanced FAQ response matching with better fuzzy search
export const getFaqResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase().trim();
  let bestMatch = {
    response: null,
    confidence: 0,
    category: null,
  };

  // Check each category
  for (const [categoryName, categoryData] of Object.entries(chatbotConfig.faq)) {
    const hasKeyword = categoryData.keywords.some(kw => lowerMessage.includes(kw));

    if (hasKeyword) {
      // Try to find specific response
      for (const [key, responseData] of Object.entries(categoryData.responses)) {
        if (key !== 'default') {
          // Check if message matches this response key
          const keywordParts = key.toLowerCase().split(' ');
          const matchCount = keywordParts.filter(part => lowerMessage.includes(part)).length;
          const matchScore = (matchCount / keywordParts.length) * responseData.confidence;

          // Also check tags if available
          if (responseData.tags) {
            const tagMatches = responseData.tags.filter(tag =>
              lowerMessage.includes(tag.toLowerCase())
            ).length;
            const tagBonus = (tagMatches / responseData.tags.length) * 0.1;
            const finalScore = matchScore + tagBonus;

            if (finalScore > bestMatch.confidence) {
              bestMatch = {
                response: responseData.answer,
                confidence: finalScore,
                category: categoryName,
                tags: responseData.tags,
              };
            }
          } else if (matchScore > bestMatch.confidence) {
            bestMatch = {
              response: responseData.answer,
              confidence: matchScore,
              category: categoryName,
            };
          }
        }
      }

      // Use default if no specific match
      if (bestMatch.confidence < chatbotConfig.confidence.medium) {
        const defaultResponse = categoryData.responses.default;
        if (defaultResponse.confidence > bestMatch.confidence) {
          bestMatch = {
            response: defaultResponse.answer,
            confidence: defaultResponse.confidence * 0.8,
            category: categoryName,
          };
        }
      }
    }
  }

  return bestMatch;
};

// Determine if AI should be called
export const shouldUseAI = (confidence) => {
  return confidence < chatbotConfig.confidence.medium && !chatbotConfig.behavior.faqOnlyMode;
};

// Format response with metadata
export const formatResponse = (response, confidence, category) => {
  return {
    text: response,
    metadata: {
      confidence: confidence,
      category: category,
      source: confidence >= chatbotConfig.confidence.high ? 'faq' : 'ai',
      timestamp: new Date().toISOString(),
    }
  };
};

// API calling functions for different providers

// Groq API - Fast and reliable
export const callGroqAPI = async (userMessage) => {
  const response = await fetch(chatbotConfig.api.groq.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${chatbotConfig.api.groq.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: chatbotConfig.api.groq.model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful cryptocurrency exchange support assistant. Provide clear, concise, and accurate information about crypto trading, accounts, wallets, and security. Keep responses under 300 words. Be friendly and professional.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API failed: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Google Gemini API
export const callGeminiAPI = async (userMessage) => {
  const url = `${chatbotConfig.api.gemini.endpoint}?key=${chatbotConfig.api.gemini.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a cryptocurrency exchange support assistant. Answer this question concisely and helpfully in under 300 words: ${userMessage}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API failed: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

// Hugging Face API (less reliable, kept as backup)
export const callHuggingFaceAPI = async (userMessage) => {
  const endpoint = `${chatbotConfig.api.huggingface.endpoint}${chatbotConfig.api.huggingface.model}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${chatbotConfig.api.huggingface.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: userMessage,
      parameters: {
        max_length: 200,
        temperature: 0.7,
        top_p: 0.9,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API failed: ${error}`);
  }

  const data = await response.json();

  if (data && data[0] && data[0].generated_text) {
    return data[0].generated_text;
  }

  throw new Error('Invalid Hugging Face API response format');
};

// OpenRouter API
export const callOpenRouterAPI = async (userMessage) => {
  const response = await fetch(chatbotConfig.api.openrouter.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${chatbotConfig.api.openrouter.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'CryptoExchange Support Bot',
    },
    body: JSON.stringify({
      model: chatbotConfig.api.openrouter.model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful cryptocurrency exchange support assistant. Provide clear, concise answers under 300 words.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API failed: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export default chatbotConfig;