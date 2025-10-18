<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
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
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #2d3748;
        }
        .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
            line-height: 1.8;
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
            margin: 30px 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            font-size: 13px;
            color: #666;
            border-top: 1px solid #e9ecef;
        }
        .warning-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning-box p {
            margin: 0;
            font-size: 14px;
            color: #856404;
        }
        .info-box {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Reset Your Password</h1>
        </div>
        <div class="content">
            <div class="greeting">
                Hello!
            </div>
            <div class="message">
                <p>You are receiving this email because we received a password reset request for your account.</p>
            </div>
            
            <div class="button-container">
                <a href="{{ $url }}" class="button">
                    Reset Password
                </a>
            </div>
            
            <div class="info-box">
                <p><strong>⏱️ This password reset link will expire in 60 minutes.</strong></p>
            </div>
            
            <div class="warning-box">
                <p><strong>⚠️ Security Note:</strong> If you did not request a password reset, no further action is required. Your account remains secure.</p>
            </div>
            
            <div class="message" style="font-size: 13px; color: #888; margin-top: 30px;">
                <p><strong>Having trouble clicking the button?</strong> Copy and paste the URL below into your web browser:</p>
                <p style="word-break: break-all; color: #667eea;">{{ $url }}</p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated email from {{ config('app.name') }}</p>
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>