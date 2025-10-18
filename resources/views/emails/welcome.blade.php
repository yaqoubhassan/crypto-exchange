<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ config('app.name') }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 50px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
            font-weight: 700;
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.95;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #2d3748;
        }
        .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 25px;
            line-height: 1.8;
        }
        .features {
            margin: 30px 0;
        }
        .feature-item {
            display: flex;
            align-items: start;
            margin-bottom: 20px;
            padding: 15px;
            background: #f7fafc;
            border-radius: 6px;
        }
        .feature-icon {
            font-size: 24px;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .feature-content h3 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #2d3748;
        }
        .feature-content p {
            margin: 0;
            font-size: 14px;
            color: #666;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: #667eea;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
        }
        .button:hover {
            background: #5568d3;
        }
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            font-size: 13px;
            color: #666;
            border-top: 1px solid #e9ecef;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to {{ config('app.name') }}!</h1>
            <p>Your journey to smarter trading starts here</p>
        </div>
        <div class="content">
            <div class="greeting">
                Hi {{ $user->name }},
            </div>
            <div class="message">
                <p>Welcome aboard! We're thrilled to have you join our community of traders. You've taken the first step towards smart and secure cryptocurrency trading.</p>
            </div>
            
            <div class="features">
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <div class="feature-content">
                        <h3>Manage Your Wallet</h3>
                        <p>Deposit, withdraw, and track your crypto assets all in one place.</p>
                    </div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <div class="feature-content">
                        <h3>Start Trading</h3>
                        <p>Access real-time markets and place orders with competitive fees.</p>
                    </div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">✅</div>
                    <div class="feature-content">
                        <h3>Complete KYC</h3>
                        <p>Verify your identity to unlock higher withdrawal limits and full platform access.</p>
                    </div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔒</div>
                    <div class="feature-content">
                        <h3>Secure Your Account</h3>
                        <p>Enable two-factor authentication for enhanced security.</p>
                    </div>
                </div>
            </div>
            
            <div class="button-container">
                <a href="{{ config('app.url') }}/dashboard" class="button">
                    Go to Dashboard
                </a>
            </div>
            
            <div class="message">
                <p>If you have any questions or need assistance, our support team is available 24/7. Just reach out!</p>
            </div>
        </div>
        <div class="footer">
            <p>Need help? <a href="{{ config('app.url') }}/support">Contact Support</a></p>
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>