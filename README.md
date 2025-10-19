# 🚀 Crypto Exchange Platform

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A modern, feature-rich cryptocurrency exchange platform built with **Laravel 11**, **React 18**, and **Inertia.js**. Featuring real-time trading, secure wallet management, AI-powered support, and comprehensive admin controls.

![Platform Preview](https://via.placeholder.com/1200x600/667eea/ffffff?text=Crypto+Exchange+Platform)

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- Google OAuth integration for seamless login
- Two-Factor Authentication (2FA) with backup codes
- Email verification and password recovery
- Complete activity logging and audit trails

### 💱 **Trading Platform**
- Real-time cryptocurrency trading with live price updates
- Multiple order types (Market, Limit, Stop-Limit)
- Order management and trading history
- 150+ supported cryptocurrencies via CoinGecko API
- Interactive trading charts and market data

### 💼 **Wallet Management**
- Multi-currency wallet system (one wallet per crypto)
- Secure deposit and withdrawal processing
- Real-time balance updates
- Complete transaction history
- Portfolio overview with asset distribution

### ✅ **KYC Verification**
- Identity verification with document upload
- Proof of address validation
- Selfie verification
- Tiered verification levels for withdrawal limits

### 🔔 **Real-Time Notifications**
- Instant notifications via Laravel Reverb WebSockets
- Configurable email notifications
- Browser push notifications
- In-app notification center

### 🤖 **AI-Powered Support**
- 24/7 AI chatbot with multiple provider support (Groq, Gemini, OpenRouter)
- Intelligent FAQ knowledge base
- Support ticket system
- Comprehensive help center

### 👨‍💼 **Admin Panel**
- Comprehensive dashboard with analytics
- User management (activate, suspend, ban)
- Transaction approval workflow
- Order monitoring and management
- KYC verification system
- Cryptocurrency management
- Support ticket handling
- Advanced reporting and data export

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Laravel 11, PHP 8.2, MySQL 8.0, Redis 7.x |
| **Frontend** | React 18, Inertia.js, Tailwind CSS, Vite |
| **Real-time** | Laravel Reverb (WebSockets) |
| **Authentication** | Laravel Sanctum, Socialite (Google OAuth) |
| **Queue System** | Redis-backed Laravel Queues |
| **Email** | Resend (Production), Mailhog (Development) |
| **APIs** | CoinGecko (Market Data), Groq/Gemini (AI) |
| **DevOps** | Docker, Docker Compose, Nginx, Supervisor |
| **Testing** | PHPUnit, Pest |

---

## 📋 Quick Start

### Option 1: Docker Setup (Recommended)

Docker provides a complete, pre-configured environment with all services ready to go.

```bash
# Clone the repository
git clone https://github.com/yaqoubhassan/crypto-exchange.git
cd crypto-exchange

# Copy environment file
cp .env.docker .env

# Run the automated setup script
chmod +x docker-setup.sh
./docker-setup.sh
```

**That's it!** The script automatically:
- ✅ Builds all Docker containers
- ✅ Installs dependencies (Composer & NPM)
- ✅ Runs database migrations
- ✅ Configures storage
- ✅ Sets up all services

**Access your application:**
- 🌐 Main App: http://localhost
- 📊 PHPMyAdmin: http://localhost:8081
- 📧 Mailhog: http://localhost:8025
- ⚡ Vite Dev: http://localhost:5173
- 🔌 WebSocket: http://localhost:8080

### Option 2: Local Development

```bash
# Clone repository
git clone https://github.com/yaqoubhassan/crypto-exchange.git
cd crypto-exchange

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database (edit .env with your credentials)
# Then run migrations
php artisan migrate

# Build assets
npm run dev

# Start services (in separate terminals)
php artisan serve                              # App server
php artisan queue:work                         # Queue worker
php artisan reverb:start --host=0.0.0.0 --port=8080  # WebSocket server
```

---

## ⚙️ Configuration

### Required API Keys

Get your API keys and add them to `.env`:

```env
# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# CoinGecko API (https://www.coingecko.com/en/api)
COINGECKO_API_KEY=your_coingecko_api_key

# Resend Email (https://resend.com)
MAIL_PASSWORD=re_your_resend_api_key

# AI Chatbot - Choose at least one provider
VITE_GROQ_API_KEY=your_groq_api_key         # Recommended (Free & Fast)
VITE_GEMINI_API_KEY=your_gemini_api_key     # Backup
VITE_OPENROUTER_API_KEY=your_openrouter_api_key  # Alternative
```

### Create Admin Account

```bash
# Via Tinker
php artisan tinker

$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'admin@example.com';
$user->password = bcrypt('password');
$user->is_admin = true;
$user->email_verified_at = now();
$user->save();
exit

# Or use SQL
docker-compose exec mysql mysql -u root -p
UPDATE users SET is_admin = 1 WHERE email = 'admin@example.com';
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
docker-compose logs -f app      # Specific service

# Access container shell
docker-compose exec app bash

# Run artisan commands
docker-compose exec app php artisan migrate
docker-compose exec app php artisan cache:clear

# Restart specific service
docker-compose restart queue
docker-compose restart reverb

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

### Troubleshooting Script

If you encounter issues with Docker setup:

```bash
chmod +x fix-docker-issues.sh
./fix-docker-issues.sh
```

This script automatically:
- Creates missing database tables
- Runs migrations
- Clears all caches
- Restarts services
- Verifies setup

---

## 📚 Documentation

Comprehensive documentation is available in [DOCUMENTATION.md](DOCUMENTATION.md), covering:

- **Complete Feature Overview** - Detailed description of all features
- **Installation Guide** - Step-by-step setup instructions
- **Configuration** - Environment variables and API setup
- **Database Schema** - Complete database structure
- **Queue System** - Background job processing
- **Real-Time Features** - WebSocket implementation with Reverb
- **Email System** - Transactional emails and notifications
- **API Integrations** - CoinGecko, Google OAuth, AI providers
- **Admin Panel** - Complete admin functionality guide
- **Security Features** - Security best practices
- **Deployment** - Production deployment guide
- **Troubleshooting** - Common issues and solutions

---

## 🎯 Main Features Breakdown

### For Users

#### 💳 Trading & Orders
```
✓ Market Orders - Instant execution at current price
✓ Limit Orders - Execute at your target price
✓ Stop-Limit Orders - Advanced order types
✓ Order History - Track all your trades
✓ Real-time Price Updates - Live cryptocurrency prices
✓ Trading Charts - Visual market data
```

#### 👛 Wallet & Transactions
```
✓ Multi-Currency Wallets - Automatic wallet for each crypto
✓ Deposits - Multiple deposit methods
✓ Withdrawals - Secure withdrawal with 2FA
✓ Transaction History - Complete audit trail
✓ Portfolio View - Asset distribution visualization
```

#### 🔒 Security & Verification
```
✓ 2FA Authentication - Google Authenticator support
✓ KYC Verification - Identity and address verification
✓ Email Verification - Secure account activation
✓ Activity Logs - Monitor account activity
✓ Session Management - Control active sessions
```

#### 💬 Support & Help
```
✓ AI Chatbot - 24/7 intelligent support
✓ Support Tickets - Create and track tickets
✓ Help Center - Searchable knowledge base
✓ FAQ System - Comprehensive Q&A
```

### For Administrators

#### 📊 Dashboard & Analytics
```
✓ User Statistics - Growth, active users, KYC status
✓ Trading Metrics - Volume, revenue, fees
✓ Revenue Charts - Visual financial data
✓ System Health - Monitor platform status
```

#### 👥 User Management
```
✓ User Directory - Search and filter users
✓ Account Actions - Activate, suspend, ban
✓ Wallet Management - Credit/debit wallets
✓ Bulk Operations - Process multiple users
✓ Data Export - Export to CSV
```

#### 💼 Financial Management
```
✓ Transaction Approval - Review pending transactions
✓ Order Management - Monitor all trading orders
✓ KYC Review - Approve/reject verifications
✓ Fee Configuration - Manage platform fees
```

#### 🔧 Platform Management
```
✓ Cryptocurrency Management - Add/edit supported coins
✓ Price Updates - Automatic via CoinGecko
✓ Support Tickets - Handle user inquiries
✓ Reports & Analytics - Custom reports
```

---

## 🚀 Running the Application

### Development Mode

#### Using Docker (All services auto-start)
```bash
docker-compose up -d
```

#### Local Development (Manual)
```bash
# Terminal 1 - Application
php artisan serve

# Terminal 2 - Queue Worker
php artisan queue:work --tries=3

# Terminal 3 - WebSocket Server
php artisan reverb:start --host=0.0.0.0 --port=8080

# Terminal 4 - Frontend Dev Server
npm run dev
```

### Production Mode

```bash
# Build production assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Use Supervisor for queue workers (see docs)
# Use systemd for Reverb service (see docs)
```

---

## 📁 Project Structure

```
crypto-exchange/
├── app/
│   ├── Console/           # Artisan commands
│   ├── Events/            # Event classes (NotificationSent, etc.)
│   ├── Http/
│   │   ├── Controllers/   # Application controllers
│   │   │   ├── Admin/    # Admin panel controllers
│   │   │   └── Auth/     # Authentication controllers
│   │   └── Middleware/   # Custom middleware
│   ├── Models/           # Eloquent models
│   ├── Notifications/    # Email notifications
│   ├── Services/         # Business logic services
│   └── Traits/           # Reusable traits
├── bootstrap/
├── config/               # Configuration files
├── database/
│   ├── migrations/       # Database migrations
│   ├── seeders/         # Database seeders
│   └── factories/       # Model factories
├── docker/              # Docker configuration
│   ├── nginx/          # Nginx configs
│   ├── php/            # PHP configs
│   └── mysql/          # MySQL configs
├── public/             # Public assets
├── resources/
│   ├── js/
│   │   ├── Components/ # React components
│   │   ├── Pages/      # Inertia pages
│   │   ├── Hooks/      # Custom React hooks
│   │   ├── Layouts/    # Layout components
│   │   └── config/     # Frontend config (chatbot, etc.)
│   ├── views/          # Blade templates (emails)
│   └── css/            # Stylesheets
├── routes/
│   ├── web.php         # Web routes
│   ├── channels.php    # Broadcast channels
│   └── console.php     # Console routes
├── storage/            # Application storage
├── tests/              # Application tests
├── docker-compose.yml  # Docker Compose config
├── Dockerfile          # Docker image definition
├── docker-setup.sh     # Automated Docker setup
├── fix-docker-issues.sh # Docker troubleshooting
├── package.json        # NPM dependencies
├── composer.json       # PHP dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS config
└── .env.example        # Environment template
```

---

## 🔌 API Endpoints

### User Endpoints

```
Authentication
POST   /register                 - Register new user
POST   /login                    - Login user
POST   /logout                   - Logout user
POST   /forgot-password          - Request password reset
POST   /reset-password           - Reset password
GET    /auth/google              - Google OAuth redirect
GET    /auth/google/callback     - Google OAuth callback

Dashboard
GET    /dashboard                - User dashboard

Trading
GET    /trading                  - Trading interface
POST   /orders                   - Place order
GET    /orders                   - Get user orders
DELETE /orders/{id}              - Cancel order

Wallet
GET    /wallet                   - Wallet overview
POST   /wallet/deposit           - Create deposit
POST   /wallet/withdraw          - Create withdrawal

KYC
GET    /kyc                      - KYC form
POST   /kyc                      - Submit KYC
GET    /kyc/status               - Check KYC status

Settings
GET    /settings                 - Settings page
POST   /settings/profile         - Update profile
POST   /settings/password        - Change password
POST   /settings/2fa/enable      - Enable 2FA
POST   /settings/2fa/disable     - Disable 2FA

Support
GET    /support                  - Support center
POST   /support/ticket           - Create ticket
POST   /support/chat             - AI chatbot endpoint
```

### Admin Endpoints

```
Dashboard
GET    /admin/dashboard          - Admin dashboard

User Management
GET    /admin/users              - User list
GET    /admin/users/{id}         - User details
POST   /admin/users/{id}/status  - Update user status
POST   /admin/users/credit-wallet - Credit user wallet

Transaction Management
GET    /admin/transactions       - Transaction list
GET    /admin/transactions/{id}  - Transaction details
POST   /admin/transactions/{id}/approve - Approve transaction
POST   /admin/transactions/{id}/reject  - Reject transaction

Order Management
GET    /admin/orders             - Order list
GET    /admin/orders/{id}        - Order details
POST   /admin/orders/{id}/status - Update order status

KYC Management
GET    /admin/kyc                - KYC queue
POST   /admin/kyc/{id}/approve   - Approve KYC
POST   /admin/kyc/{id}/reject    - Reject KYC

Cryptocurrency Management
GET    /admin/cryptocurrencies   - Crypto list
POST   /admin/cryptocurrencies   - Add cryptocurrency
PUT    /admin/cryptocurrencies/{id} - Update cryptocurrency
POST   /admin/cryptocurrencies/update-prices - Update prices

Reports
GET    /admin/reports            - Reports dashboard
POST   /admin/reports/export     - Export data
```

---

## 🔔 Notification System

### Real-Time Notifications (Reverb)

The platform uses Laravel Reverb for WebSocket-based real-time notifications:

```javascript
// Frontend: Listen to notifications
import { useEffect } from 'react';

useEffect(() => {
    const channel = window.Echo.private(`notifications.${userId}`);
    
    channel.listen('NotificationSent', (event) => {
        console.log('New notification:', event.notification);
        // Update UI
    });

    return () => channel.stopListening('NotificationSent');
}, [userId]);
```

### Email Notifications

Configurable email alerts for:
- Trading activities (order fills, cancellations)
- Wallet transactions (deposits, withdrawals)
- Security events (login, 2FA, password changes)
- KYC status updates
- Platform announcements

Users can configure preferences in Settings > Notifications.

---

## 🤖 AI Chatbot

The platform includes an intelligent AI chatbot with multiple provider support:

### Features
- 24/7 availability
- Context-aware responses
- FAQ fallback system
- Multi-provider support (Groq, Gemini, OpenRouter)
- Automatic failover

### Configuration

Edit `resources/js/config/chatbotConfig.js`:

```javascript
export const chatbotConfig = {
  api: {
    provider: 'groq',  // Primary provider
    fallbackChain: ['groq', 'gemini', 'openrouter', 'local_faq'],
  },
  behavior: {
    useFaqFirst: true,     // Try FAQ before API
    faqOnlyMode: false,    // Set true to disable APIs
  }
};
```

### Adding Custom FAQs

Add to the FAQ knowledge base in `chatbotConfig.js`:

```javascript
faq: {
  custom_category: {
    keywords: ['keyword1', 'keyword2'],
    responses: {
      'specific_question': {
        answer: "Your detailed answer here",
        confidence: 0.95,
        tags: ['tag1', 'tag2'],
      }
    }
  }
}
```

---

## 🔒 Security Best Practices

### For Production Deployment

1. **Environment Security**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

2. **Use HTTPS**
   - Install SSL certificate (Let's Encrypt recommended)
   - Force HTTPS in production

3. **Secure Database**
   - Use strong passwords
   - Restrict database access by IP
   - Regular backups

4. **Enable 2FA**
   - Require 2FA for all admin accounts
   - Encourage users to enable 2FA

5. **Rate Limiting**
   - Configure rate limits for API endpoints
   - Protect against brute force attacks

6. **Regular Updates**
   - Keep Laravel and packages updated
   - Monitor security advisories

7. **Backup Strategy**
   - Automated daily database backups
   - Off-site backup storage
   - Test restoration procedures

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage

# Docker
docker-compose exec app php artisan test
```

### Test Structure

```
tests/
├── Feature/
│   ├── Auth/
│   │   ├── RegistrationTest.php
│   │   ├── LoginTest.php
│   │   └── TwoFactorTest.php
│   ├── Trading/
│   │   ├── OrderTest.php
│   │   └── TradingTest.php
│   └── Admin/
│       ├── UserManagementTest.php
│       └── TransactionApprovalTest.php
└── Unit/
    ├── Models/
    └── Services/
```

### Writing Tests

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_place_market_order()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->post('/orders', [
            'type' => 'market',
            'side' => 'buy',
            'quantity' => 0.1,
            'base_currency_id' => 1,
            'quote_currency_id' => 2,
        ]);
        
        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'type' => 'market',
        ]);
    }
}
```

---

## 📊 Monitoring & Logs

### Application Logs

```bash
# View Laravel logs
tail -f storage/logs/laravel.log

# Docker
docker-compose logs -f app
docker-compose logs -f queue
docker-compose logs -f reverb
```

### Queue Monitoring

```bash
# Check queue status
php artisan queue:monitor

# View failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

### Performance Monitoring

```bash
# Application health check
php artisan about

# Cache statistics
php artisan cache:status

# Database connections
php artisan db:show
```

---

## 🐛 Common Issues & Solutions

### Issue: Queue jobs not processing

**Solution:**
```bash
php artisan queue:restart
docker-compose restart queue  # Docker
```

### Issue: Reverb not connecting

**Solution:**
```bash
php artisan reverb:restart
docker-compose restart reverb  # Docker

# Check if port 8080 is available
netstat -tuln | grep 8080
```

### Issue: Assets not loading

**Solution:**
```bash
npm run build
php artisan view:clear
php artisan storage:link
```

### Issue: Permission errors

**Solution:**
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Issue: Database connection failed

**Solution:**
```bash
# Verify .env credentials
# Test connection
php artisan tinker
DB::connection()->getPdo();

# Docker: Wait for MySQL
docker-compose exec mysql mysqladmin ping
```

For more troubleshooting, see [DOCUMENTATION.md](DOCUMENTATION.md#troubleshooting).

---

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

### Code Style

- Follow PSR-12 standards
- Write meaningful commit messages
- Add PHPDoc blocks
- Include tests for new features

---

## 📝 Changelog

### Version 1.0.0 (Current)

#### Features
- ✅ User authentication with Google OAuth
- ✅ Two-factor authentication
- ✅ Real-time cryptocurrency trading
- ✅ Multi-currency wallet system
- ✅ KYC verification workflow
- ✅ Real-time notifications via Reverb
- ✅ AI-powered support chatbot
- ✅ Comprehensive admin panel
- ✅ Email notification system
- ✅ Docker deployment support

#### Integrations
- ✅ CoinGecko API for market data
- ✅ Resend for email delivery
- ✅ Groq, Gemini, OpenRouter for AI
- ✅ Google OAuth for authentication

---

## 📞 Support & Contact

### Getting Help

- 📚 **Documentation**: [DOCUMENTATION.md](DOCUMENTATION.md)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yaqoubhassan/crypto-exchange.git/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yaqoubhassan/crypto-exchange.git/discussions)
- 📧 **Email**: yaqoubdramani@gmail.com

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
Copyright (c) 2024 Crypto Exchange Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

## 🙏 Acknowledgments

### Built With

- [Laravel](https://laravel.com) - The PHP Framework
- [React](https://react.dev) - UI Library
- [Inertia.js](https://inertiajs.com) - Modern Monolith
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Docker](https://docker.com) - Containerization
- [CoinGecko](https://coingecko.com) - Crypto Data API
- [Groq](https://groq.com) - AI Inference

### Special Thanks

- Laravel community for excellent documentation
- CoinGecko for free API tier
- All open-source contributors

## 📸 Screenshots

### User Dashboard
![Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=User+Dashboard)

### Trading Interface
![Trading](https://via.placeholder.com/800x400/667eea/ffffff?text=Trading+Interface)

### Admin Panel
![Admin](https://via.placeholder.com/800x400/667eea/ffffff?text=Admin+Panel)

---

**Made with ❤️ by Your Team**

**⭐ Star us on GitHub — it motivates us a lot!**

[Report Bug](https://github.com/yaqoubhassan/crypto-exchange.git/issues) · [Request Feature](https://github.com/yaqoubhassan/crypto-exchange.git/issues) · [Documentation](DOCUMENTATION.md)