# Crypto Exchange Platform - Complete Documentation

![Laravel](https://img.shields.io/badge/Laravel-11.x-red)
![PHP](https://img.shields.io/badge/PHP-8.2-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A comprehensive, production-ready cryptocurrency exchange platform built with Laravel 11, React (Inertia.js), and real-time features powered by Laravel Reverb.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Requirements](#-system-requirements)
- [Installation](#-installation)
  - [Local Setup](#local-setup)
  - [Docker Setup](#docker-setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Database](#-database)
- [Queue System](#-queue-system)
- [Real-Time Features](#-real-time-features)
- [Email System](#-email-system)
- [API Integrations](#-api-integrations)
- [Admin Panel](#-admin-panel)
- [Security Features](#-security-features)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### User Features

#### Authentication & Security
- **Google OAuth Integration** - One-click sign-in with Google
- **Two-Factor Authentication (2FA)** - Google Authenticator support with backup codes
- **Email Verification** - Secure email verification system
- **Password Reset** - Secure password recovery via email
- **Session Management** - Track and manage active sessions
- **Activity Logging** - Complete audit trail of user activities

#### Trading Platform
- **Real-Time Trading** - Live cryptocurrency trading with multiple order types
  - Market Orders (instant execution)
  - Limit Orders (price-targeted execution)
  - Stop-Limit Orders (advanced order types)
- **Order Management** - View, cancel, and manage open orders
- **Trading History** - Complete history of all executed trades
- **Live Price Updates** - Real-time price data via CoinGecko API
- **Trading Charts** - Interactive price charts and market data
- **Multiple Trading Pairs** - Support for 150+ cryptocurrencies

#### Wallet Management
- **Multi-Currency Wallets** - Automatic wallet creation for each cryptocurrency
- **Deposit System** - Deposit funds via multiple methods
- **Withdrawal System** - Secure withdrawal process with admin approval
- **Transaction History** - Complete record of all wallet transactions
- **Balance Tracking** - Real-time balance updates across all currencies
- **Portfolio Overview** - Visual representation of asset distribution

#### KYC Verification
- **Identity Verification** - Upload ID documents (Passport, Driver's License, National ID)
- **Proof of Address** - Upload utility bills or bank statements
- **Selfie Verification** - Live selfie with ID document
- **Status Tracking** - Real-time KYC status updates
- **Verification Levels** - Tiered verification for different withdrawal limits

#### Notifications & Communication
- **Real-Time Notifications** - Instant notifications via Laravel Reverb
- **Email Notifications** - Configurable email alerts for:
  - Trading activities
  - Wallet transactions
  - Security events
  - KYC status updates
  - Order fills and updates
- **Browser Notifications** - Push notifications for critical events
- **In-App Notifications** - Notification center with read/unread status
- **Notification Preferences** - Granular control over notification types

#### AI-Powered Support
- **Live Chat Assistant** - 24/7 AI chatbot powered by multiple providers:
  - Groq (Primary - Fast & Free)
  - Google Gemini (Backup)
  - OpenRouter (Alternative)
  - Local FAQ fallback
- **Intelligent Responses** - Context-aware answers to common questions
- **FAQ Knowledge Base** - Comprehensive FAQ system covering:
  - Account management
  - Trading operations
  - Wallet functions
  - Security features
  - Troubleshooting
- **Support Ticket System** - Create and track support tickets
- **Help Center** - Searchable knowledge base

#### User Profile & Settings
- **Profile Management** - Update personal information and profile picture
- **Security Settings** - Manage passwords, 2FA, and security preferences
- **Notification Preferences** - Customize email and browser notifications
- **Display Preferences** - Theme, language, timezone, and currency display
- **API Keys** - Generate and manage API keys for programmatic access

### Admin Panel Features

#### Dashboard & Analytics
- **Comprehensive Dashboard** - Real-time platform statistics
- **User Analytics** - User growth, active users, verification stats
- **Trading Analytics** - Trading volume, revenue, fee collection
- **Revenue Charts** - Visual representation of platform revenue
- **System Health Monitoring** - Track system performance and status

#### User Management
- **User Directory** - Search, filter, and manage all users
- **User Profiles** - View complete user information and activity
- **Wallet Management** - Credit/debit user wallets
- **Account Actions** - Activate, suspend, or ban user accounts
- **Bulk Operations** - Perform actions on multiple users simultaneously
- **User Export** - Export user data to CSV

#### Transaction Management
- **Transaction Overview** - Monitor all platform transactions
- **Approval System** - Approve or reject pending transactions
- **Transaction Details** - View complete transaction information
- **Status Updates** - Update transaction status
- **Transaction Search** - Advanced filtering and search capabilities

#### Order Management
- **Order Monitoring** - View all trading orders
- **Order Status** - Track pending, filled, and cancelled orders
- **Order Details** - Complete order information and matching history
- **Order Actions** - Approve, reject, or cancel orders
- **Order Export** - Export order data for analysis

#### KYC Management
- **Verification Queue** - Review pending KYC submissions
- **Document Review** - View uploaded ID documents and selfies
- **Approval Workflow** - Approve or reject KYC submissions with notes
- **Status Tracking** - Monitor KYC verification status
- **Bulk Actions** - Process multiple KYC requests

#### Cryptocurrency Management
- **Crypto Directory** - Manage all supported cryptocurrencies
- **Add New Coins** - Add support for new cryptocurrencies
- **Price Updates** - Automatic price updates via CoinGecko API
- **Status Control** - Enable/disable trading for specific coins
- **Bulk Operations** - Toggle status for multiple cryptocurrencies
- **Crypto Export** - Export cryptocurrency data

#### Support & Communication
- **Ticket Management** - View and respond to support tickets
- **Notification System** - Send notifications to users
- **Email Templates** - Manage email notification templates
- **Broadcast Messages** - Send announcements to all users

#### Reports & Exports
- **Custom Reports** - Generate reports for various metrics
- **Data Export** - Export data to CSV format
- **Transaction Reports** - Detailed transaction analytics
- **User Reports** - User activity and growth reports

---

## 🛠 Tech Stack

### Backend
- **Framework**: Laravel 11.x
- **PHP Version**: 8.2+
- **Database**: MySQL 8.0
- **Cache/Queue**: Redis 7.x
- **WebSockets**: Laravel Reverb
- **Authentication**: Laravel Sanctum, Socialite (Google OAuth)

### Frontend
- **Framework**: React 18.x
- **Router**: Inertia.js
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (Alpine)
- **Process Manager**: Supervisor
- **Development Tools**: PHPMyAdmin, Mailhog
- **Version Control**: Git

### External Services
- **Email**: Resend (production), Mailhog (development)
- **OAuth**: Google OAuth 2.0
- **Market Data**: CoinGecko API
- **AI Chatbot**: Groq, Google Gemini, OpenRouter APIs

---

## 📋 System Requirements

### For Local Development
- PHP 8.2 or higher
- Composer 2.x
- Node.js 18.x or higher
- NPM 9.x or higher
- MySQL 8.0 or higher
- Redis 7.x or higher

### For Docker Deployment
- Docker 20.x or higher
- Docker Compose 2.x or higher
- Minimum 4GB RAM
- 20GB free disk space

---

## 🚀 Installation

### Local Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/crypto-exchange.git
cd crypto-exchange
```

#### 2. Install PHP Dependencies

```bash
composer install
```

#### 3. Install Node Dependencies

```bash
npm install
```

#### 4. Environment Configuration

```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### 5. Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Application
APP_NAME="Crypto Exchange"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=crypto_exchange
DB_USERNAME=root
DB_PASSWORD=your_password

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Cache & Queue
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=database

# Broadcasting
BROADCAST_DRIVER=reverb
REVERB_HOST=0.0.0.0
REVERB_PORT=8080
REVERB_APP_ID=your_app_id
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_app_secret

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=your_resend_api_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourapp.com
MAIL_FROM_NAME="${APP_NAME}"

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"

# CoinGecko API
COINGECKO_API_KEY=your_coingecko_api_key

# AI Chatbot APIs
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

#### 6. Database Setup

```bash
# Create database (MySQL)
mysql -u root -p
CREATE DATABASE crypto_exchange;
EXIT;

# Run migrations
php artisan migrate

# Seed database with sample data (optional)
php artisan db:seed
```

#### 7. Storage Setup

```bash
# Create symbolic link for storage
php artisan storage:link

# Set proper permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

#### 8. Build Frontend Assets

```bash
# Development
npm run dev

# Production
npm run build
```

---

### Docker Setup

Docker setup provides a fully containerized environment with all services pre-configured.

#### 1. Prerequisites

Ensure Docker and Docker Compose are installed:

```bash
docker --version
docker-compose --version
```

#### 2. Clone and Configure

```bash
# Clone repository
git clone https://github.com/yourusername/crypto-exchange.git
cd crypto-exchange

# Copy Docker environment file
cp .env.docker .env
```

#### 3. Update Environment Variables

Edit `.env` file with your API keys and credentials:

```env
# Database credentials (used by Docker)
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=crypto_exchange
DB_USERNAME=crypto_user
DB_PASSWORD=your_secure_password

# Redis
REDIS_HOST=redis
CACHE_DRIVER=redis
SESSION_DRIVER=database
QUEUE_CONNECTION=redis

# Add your external API keys
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
COINGECKO_API_KEY=your_coingecko_api_key
VITE_GROQ_API_KEY=your_groq_api_key
```

#### 4. Run Setup Script

The setup script automates the entire Docker setup process:

```bash
# Make script executable
chmod +x docker-setup.sh

# Run setup
./docker-setup.sh
```

The script will:
- Check Docker installation
- Create necessary directories
- Copy environment files
- Generate application key
- Build Docker containers
- Start all services
- Wait for MySQL to be ready
- Install Composer dependencies
- Run database migrations
- Create storage link
- Install NPM dependencies
- Set proper permissions

#### 5. Verify Installation

After setup completes, verify all services are running:

```bash
docker-compose ps
```

You should see these services running:
- `crypto_app` - Laravel application (PHP-FPM)
- `crypto_nginx` - Web server
- `crypto_mysql` - MySQL database
- `crypto_redis` - Redis cache/queue
- `crypto_queue` - Queue worker
- `crypto_reverb` - WebSocket server
- `crypto_scheduler` - Task scheduler
- `crypto_node` - Vite dev server
- `crypto_phpmyadmin` - Database management UI
- `crypto_mailhog` - Email testing

#### 6. Access Your Application

Once all services are running, access the application at:

- **Main Application**: http://localhost
- **PHPMyAdmin**: http://localhost:8081
- **Mailhog** (Email testing): http://localhost:8025
- **Vite Dev Server**: http://localhost:5173
- **WebSocket Server**: http://localhost:8080

#### 7. Create Admin Account

```bash
# Access app container
docker-compose exec app bash

# Create admin user
php artisan tinker

# In tinker console:
$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'admin@example.com';
$user->password = bcrypt('password');
$user->is_admin = true;
$user->email_verified_at = now();
$user->save();
exit
```

#### Docker Management Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f queue
docker-compose logs -f reverb

# Restart specific service
docker-compose restart queue
docker-compose restart reverb

# Access app container shell
docker-compose exec app bash

# Run artisan commands
docker-compose exec app php artisan migrate
docker-compose exec app php artisan cache:clear

# Run composer commands
docker-compose exec app composer install

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

#### Troubleshooting Docker Issues

If you encounter issues, use the fix script:

```bash
chmod +x fix-docker-issues.sh
./fix-docker-issues.sh
```

This script will:
- Create missing database tables (cache, jobs, failed_jobs)
- Run all migrations
- Clear all caches
- Restart queue and reverb services
- Verify service status

---

## ⚙️ Configuration

### Application Configuration

#### Email Configuration

For production, configure Resend:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=re_your_api_key_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

For development with Docker, Mailhog is pre-configured:

```env
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```

#### Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost/auth/google/callback` (local)
   - `https://yourdomain.com/auth/google/callback` (production)
6. Copy Client ID and Secret to `.env`

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
```

#### CoinGecko API Configuration

1. Sign up at [CoinGecko](https://www.coingecko.com/en/api)
2. Get your free API key (Pro for production)
3. Add to `.env`:

```env
COINGECKO_API_KEY=your_api_key_here
```

#### AI Chatbot Configuration

The chatbot supports multiple providers with automatic fallback:

**Groq** (Recommended - Free & Fast):
```env
VITE_GROQ_API_KEY=your_groq_api_key
```

**Google Gemini** (Free tier with limits):
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**OpenRouter** (Alternative):
```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

Configure fallback chain in `resources/js/config/chatbotConfig.js`:

```javascript
fallbackChain: ['groq', 'gemini', 'openrouter', 'huggingface', 'local_faq']
```

---

## 🏃 Running the Application

### Local Development

#### Start All Services

Open 4 terminal windows and run:

**Terminal 1 - Application Server:**
```bash
php artisan serve
```

**Terminal 2 - Queue Worker:**
```bash
php artisan queue:work --tries=3
```

**Terminal 3 - Laravel Reverb (WebSockets):**
```bash
php artisan reverb:start --host=0.0.0.0 --port=8080
```

**Terminal 4 - Vite Dev Server:**
```bash
npm run dev
```

Alternatively, use Laravel's process management:

```bash
php artisan queue:restart
php artisan reverb:restart
npm run dev &
php artisan serve
```

### Docker Development

All services start automatically with Docker Compose:

```bash
docker-compose up -d
```

Services are managed automatically:
- **App**: PHP-FPM running on port 9000
- **Nginx**: Web server on port 80
- **Queue**: Background queue worker
- **Reverb**: WebSocket server on port 8080
- **Scheduler**: Cron job runner
- **Node**: Vite dev server on port 5173

### Access Points

- **Frontend**: http://localhost
- **Admin Panel**: http://localhost/admin (requires admin account)
- **PHPMyAdmin** (Docker only): http://localhost:8081
- **Mailhog** (Docker only): http://localhost:8025

---

## 🗄️ Database

### Migrations

```bash
# Run all migrations
php artisan migrate

# Docker
docker-compose exec app php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Rollback all migrations and re-run
php artisan migrate:fresh

# Run migrations with seeding
php artisan migrate --seed
```

### Database Schema

#### Core Tables

**users** - User accounts and authentication
- Google OAuth integration
- 2FA support
- Email verification
- Notification preferences
- Display settings

**cryptocurrencies** - Supported cryptocurrencies
- CoinGecko integration
- Market data (price, volume, market cap)
- Active/inactive status
- Fiat currency support

**wallets** - User cryptocurrency wallets
- One wallet per user per cryptocurrency
- Balance tracking (available + locked)
- Wallet addresses

**transactions** - All financial transactions
- Deposits, withdrawals, trades
- Transaction status tracking
- Fee calculation
- Blockchain transaction IDs

**orders** - Trading orders
- Market, limit, stop-limit order types
- Buy/sell sides
- Order matching engine
- Fill tracking

**user_kycs** - KYC verification data
- Document uploads
- Verification status
- Admin approval workflow

**notifications** - User notifications
- Real-time delivery via Reverb
- Email delivery
- Read/unread status

**activity_logs** - Audit trail
- User actions
- Admin actions
- IP tracking
- Timestamp tracking

#### Queue Tables

**jobs** - Pending queue jobs
**failed_jobs** - Failed queue jobs for retry
**job_batches** - Batch job tracking
**cache** - Cache storage

#### Session Tables

**sessions** - User sessions
**password_reset_tokens** - Password reset tokens

### Seeders

```bash
# Run all seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=CryptocurrencySeeder
php artisan db:seed --class=UserSeeder

# Docker
docker-compose exec app php artisan db:seed
```

Available seeders:
- `DatabaseSeeder` - Runs all seeders
- `CryptocurrencySeeder` - Seeds popular cryptocurrencies
- `UserSeeder` - Creates sample users

---

## 📬 Queue System

The application uses queues for background processing:

### Queue Workers

#### Local Development

```bash
# Start queue worker
php artisan queue:work

# With specific options
php artisan queue:work --tries=3 --timeout=90

# Process only specific queue
php artisan queue:work --queue=high,default

# Run as daemon (production)
php artisan queue:work --daemon

# Restart queue workers
php artisan queue:restart
```

#### Docker

Queue worker runs automatically as a container:

```bash
# View queue logs
docker-compose logs -f queue

# Restart queue worker
docker-compose restart queue

# Access queue container
docker-compose exec queue bash
```

### Queued Jobs

The following operations are queued:

- **Email Notifications**
  - Welcome emails
  - Verification emails
  - Transaction confirmations
  - KYC status updates
  - Password reset emails

- **Transaction Processing**
  - Deposit processing
  - Withdrawal processing
  - Order matching
  - Fee calculations

- **Market Data Updates**
  - Price updates from CoinGecko
  - Market cap calculations
  - Volume tracking

- **Notifications**
  - Push notifications
  - In-app notifications
  - Email notifications

### Monitoring Queues

```bash
# Check queue status
php artisan queue:work --once

# Failed jobs
php artisan queue:failed

# Retry failed job
php artisan queue:retry {id}

# Retry all failed jobs
php artisan queue:retry all

# Flush failed jobs
php artisan queue:flush
```

### Queue Configuration

Edit `config/queue.php`:

```php
'default' => env('QUEUE_CONNECTION', 'redis'),

'connections' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => env('REDIS_QUEUE', 'default'),
        'retry_after' => 90,
        'block_for' => null,
    ],
],
```

---

## ⚡ Real-Time Features

### Laravel Reverb WebSocket Server

Laravel Reverb provides real-time communication for:
- Live trading updates
- Real-time notifications
- Price updates
- Order status changes

#### Starting Reverb

**Local:**
```bash
php artisan reverb:start --host=0.0.0.0 --port=8080
```

**Docker:**
Reverb runs automatically in its own container.

```bash
# View Reverb logs
docker-compose logs -f reverb

# Restart Reverb
docker-compose restart reverb
```

#### Reverb Configuration

`.env` configuration:

```env
BROADCAST_DRIVER=reverb

REVERB_HOST=0.0.0.0
REVERB_PORT=8080
REVERB_SCHEME=http

REVERB_APP_ID=your_app_id
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_app_secret

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

#### Broadcasting Channels

The application uses several broadcast channels:

**Private Channels:**
- `notifications.{userId}` - User notifications
- `wallet.{userId}` - Wallet updates
- `orders.{userId}` - Order updates

**Public Channels:**
- `prices` - Real-time price updates
- `market.{pair}` - Market data for trading pairs

#### Frontend Integration

Laravel Echo is configured in `resources/js/echo.js`:

```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});
```

#### Using Real-Time Notifications

Custom React hook for notifications (`resources/js/Hooks/useNotifications.js`):

```javascript
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function useNotifications(userId) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const channel = window.Echo.private(`notifications.${userId}`);
        
        channel.listen('NotificationSent', (data) => {
            setNotifications(prev => [data.notification, ...prev]);
        });

        return () => {
            channel.stopListening('NotificationSent');
        };
    }, [userId]);

    return { notifications };
}
```

---

## 📧 Email System

### Email Providers

#### Resend (Production)

Resend is configured for production email delivery:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=re_your_api_key
MAIL_ENCRYPTION=tls
```

#### Mailhog (Development/Docker)

Mailhog catches all emails in development:

```env
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
```

Access Mailhog UI: http://localhost:8025

### Email Templates

The application sends various transactional emails:

#### Authentication Emails
- **Welcome Email** - Sent on registration
- **Email Verification** - Email address verification
- **Password Reset** - Password recovery link
- **2FA Setup** - Two-factor authentication codes

#### Transaction Emails
- **Deposit Confirmed** - Deposit successful
- **Withdrawal Approved** - Withdrawal processed
- **Order Filled** - Trade executed
- **Order Cancelled** - Order cancellation

#### KYC Emails
- **KYC Submitted** - Verification under review
- **KYC Approved** - Verification successful
- **KYC Rejected** - Verification failed with reason

#### Security Emails
- **Login Alert** - New device login
- **Password Changed** - Password update confirmation
- **2FA Enabled** - 2FA activation
- **Suspicious Activity** - Security alert

### Email Notifications Configuration

Users can configure email preferences in Settings > Notifications:

```php
// User model has notification preferences
'email_notifications_enabled' => true,
'email_trading_alerts' => true,
'email_wallet_transactions' => true,
'email_security_alerts' => true,
'email_marketing' => false,
```

### Testing Emails

```bash
# Test email configuration
php artisan tinker
Mail::raw('Test email', function ($message) {
    $message->to('test@example.com')->subject('Test');
});

# Docker
docker-compose exec app php artisan tinker
```

---

## 🔌 API Integrations

### CoinGecko API

CoinGecko provides real-time cryptocurrency market data.

#### Setup

1. Get API key from [CoinGecko](https://www.coingecko.com/en/api)
2. Add to `.env`:

```env
COINGECKO_API_KEY=your_api_key
```

#### Usage

Update cryptocurrency prices:

```bash
# Manual update
php artisan cryptocurrencies:update-prices

# Docker
docker-compose exec app php artisan cryptocurrencies:update-prices
```

#### Scheduled Updates

Prices update automatically via Laravel Scheduler:

```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->command('cryptocurrencies:update-prices')
             ->everyFiveMinutes();
}
```

#### API Endpoints Used

- `/simple/price` - Current prices
- `/coins/markets` - Market data (volume, market cap)
- `/coins/{id}` - Detailed coin information

### Google OAuth API

#### Setup

1. Create project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API
3. Create OAuth credentials
4. Configure in `.env`:

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
```

#### Implementation

OAuth flow handled by `App\Http\Controllers\Auth\GoogleAuthController`:

```php
// Login with Google
public function redirect()
{
    return Socialite::driver('google')->redirect();
}

// Handle callback
public function callback()
{
    $googleUser = Socialite::driver('google')->user();
    // Create or update user...
}
```

### AI Chatbot APIs

The chatbot integrates with multiple AI providers:

#### Groq API (Primary)

Fast and free LLM inference:

```env
VITE_GROQ_API_KEY=your_groq_api_key
```

- **Model**: llama-3.1-8b-instant
- **Features**: Free, very fast response times
- **Best for**: Production use

#### Google Gemini API (Backup)

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

- **Model**: gemini-pro
- **Features**: Free tier with 60 req/min
- **Best for**: Backup when Groq is unavailable

#### OpenRouter API (Alternative)

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

- **Model**: meta-llama/llama-3-8b-instruct:free
- **Features**: Free models available
- **Best for**: Additional fallback option

#### Configuration

Edit `resources/js/config/chatbotConfig.js`:

```javascript
export const chatbotConfig = {
  api: {
    provider: 'groq', // Primary provider
    fallbackChain: ['groq', 'gemini', 'openrouter', 'local_faq'],
  },
  
  behavior: {
    useFaqFirst: true, // Try FAQ before API
    faqOnlyMode: false, // Set true to disable all API calls
  }
};
```

---

## 🎛️ Admin Panel

### Accessing Admin Panel

1. Create admin user or set existing user as admin:

```bash
# Via tinker
php artisan tinker

$user = User::find(1);
$user->is_admin = true;
$user->save();

# Or via SQL
UPDATE users SET is_admin = 1 WHERE email = 'admin@example.com';
```

2. Login and navigate to: http://localhost/admin

### Admin Dashboard

The dashboard provides:

- **User Statistics**
  - Total users, new users, active users
  - Verification status breakdown
  
- **Trading Statistics**
  - Total trades, trading volume
  - Active orders, completed orders
  
- **Financial Metrics**
  - Total revenue, daily revenue
  - Platform fees collected
  
- **Transaction Overview**
  - Pending approvals
  - Recent transactions
  
- **System Health**
  - Database status
  - Queue status
  - Cache status
  - WebSocket status

### User Management Features

#### User Directory
- Search users by name, email, or ID
- Filter by status (active, suspended, banned)
- Filter by KYC status
- Bulk actions (activate, suspend, ban)
- Export users to CSV

#### User Profile View
- Complete user information
- Account status management
- Activity log
- Transaction history
- Order history
- KYC documents review

#### Wallet Management
- View all user wallets
- Credit/debit wallets manually
- Transaction history per wallet
- Notify user on balance changes

### Transaction Management

- View all platform transactions
- Filter by type, status, cryptocurrency
- Approve/reject pending transactions
- View detailed transaction information
- Add admin notes to transactions
- Export transaction data

### Order Management

- Monitor all trading orders
- View order details and matching history
- Approve/reject/cancel orders
- Filter by status, type, trading pair
- Export order data

### KYC Management

- Review pending verifications
- View uploaded documents (ID, selfie, proof of address)
- Approve with notes
- Reject with reasons
- Bulk KYC processing
- Email notifications to users

### Cryptocurrency Management

- Add new cryptocurrencies
- Edit cryptocurrency details
- Enable/disable trading pairs
- Update prices manually
- Automatic price updates via CoinGecko
- Bulk status toggle

### Support Management

- View all support tickets
- Respond to tickets
- Mark tickets as resolved
- Filter by status and priority
- User communication history

---

## 🔒 Security Features

### Authentication Security

#### Password Security
- Minimum 8 characters required
- Bcrypt hashing (cost factor 10)
- Password reset with email verification
- Password change requires current password

#### Two-Factor Authentication (2FA)
- Google Authenticator support
- QR code generation for easy setup
- Backup codes (8 codes per user)
- Required for withdrawals
- Optional for login

#### Email Verification
- Required for account activation
- Verification link expires after 24 hours
- Resend verification email option

#### Session Management
- Database-backed sessions
- Session timeout after 120 minutes
- Track last login time and IP
- Multi-device session support

### Account Security

#### Activity Logging
- All user actions logged
- IP address tracking
- Timestamp tracking
- Admin actions audited

#### Account Protection
- Account suspension/ban capability
- Suspicious activity detection
- Login attempt monitoring
- Failed login tracking

### Transaction Security

#### Withdrawal Security
- 2FA required for all withdrawals
- Admin approval required for large withdrawals
- Withdrawal limits based on KYC level
- Withdrawal whitelist option

#### Trading Security
- Balance verification before orders
- Locked balance during pending orders
- Atomic transaction processing
- Order validation

### Data Security

#### Encryption
- HTTPS in production (recommended)
- Encrypted database passwords
- Encrypted API keys in .env
- Encrypted session data

#### Input Validation
- CSRF protection on all forms
- XSS protection
- SQL injection prevention (Eloquent ORM)
- Request validation

#### Rate Limiting
- API rate limiting
- Login attempt limiting
- Password reset limiting

### Best Practices

1. **Always use HTTPS in production**
2. **Keep .env file secure** - Never commit to git
3. **Regular security updates** - Keep Laravel and packages updated
4. **Strong database passwords**
5. **Enable 2FA for all admin accounts**
6. **Regular security audits**
7. **Backup database regularly**
8. **Monitor failed login attempts**
9. **Use firewall rules** - Restrict database access
10. **Enable logging** - Monitor suspicious activity

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test --filter=UserTest

# Run tests with coverage
php artisan test --coverage

# Docker
docker-compose exec app php artisan test
```

### Test Structure

```
tests/
├── Feature/          # Feature tests
│   ├── Auth/        # Authentication tests
│   ├── Trading/     # Trading feature tests
│   ├── Wallet/      # Wallet tests
│   └── Admin/       # Admin panel tests
├── Unit/            # Unit tests
│   ├── Models/      # Model tests
│   └── Services/    # Service class tests
└── TestCase.php     # Base test case
```

### Writing Tests

Example feature test:

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TradingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_place_order()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->post('/orders', [
                'type' => 'market',
                'side' => 'buy',
                'quantity' => 0.1,
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

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] Update `.env` for production
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure production database
- [ ] Set up Redis for production
- [ ] Configure email service (Resend)
- [ ] Set up SSL certificate
- [ ] Configure domain DNS
- [ ] Set up backup strategy
- [ ] Configure monitoring
- [ ] Test all features
- [ ] Run security audit

### Production Environment Variables

```env
APP_NAME="Your App Name"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=your_db_host
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=strong_password

REDIS_HOST=your_redis_host
REDIS_PASSWORD=your_redis_password

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=database
BROADCAST_DRIVER=reverb

MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=re_your_api_key
```

### Docker Production Deployment

#### 1. Build Production Image

```bash
# Build production image
docker build --target production -t crypto-exchange:latest .
```

#### 2. Update Docker Compose for Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      target: production
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
    restart: always

  nginx:
    restart: always
    volumes:
      - ./docker/nginx/ssl:/etc/nginx/ssl:ro

  # Remove development tools
  # phpmyadmin, mailhog, etc.
```

#### 3. Deploy

```bash
# Pull latest code
git pull origin main

# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose exec app php artisan migrate --force

# Optimize Laravel
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
docker-compose exec app php artisan view:cache

# Build frontend assets
docker-compose exec node npm run build
```

### Traditional Server Deployment

#### 1. Server Requirements

- Ubuntu 20.04 or 22.04 LTS
- Nginx or Apache
- PHP 8.2-FPM
- MySQL 8.0
- Redis
- Supervisor (for queues)
- SSL certificate (Let's Encrypt)

#### 2. Deploy Code

```bash
# Clone repository
git clone https://github.com/yourusername/crypto-exchange.git
cd crypto-exchange

# Install dependencies
composer install --no-dev --optimize-autoloader
npm install && npm run build

# Set up environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate --force

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

#### 3. Configure Nginx

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name yourdomain.com;
    root /var/www/crypto-exchange/public;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### 4. Configure Supervisor

Create `/etc/supervisor/conf.d/crypto-exchange.conf`:

```ini
[program:crypto-exchange-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/crypto-exchange/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/crypto-exchange/storage/logs/worker.log

[program:crypto-exchange-reverb]
process_name=%(program_name)s
command=php /var/www/crypto-exchange/artisan reverb:start
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/crypto-exchange/storage/logs/reverb.log
```

Reload supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

#### 5. Set Up Cron Job

```bash
crontab -e

# Add this line:
* * * * * cd /var/www/crypto-exchange && php artisan schedule:run >> /dev/null 2>&1
```

### Monitoring & Maintenance

#### Application Monitoring

```bash
# Check application health
php artisan about

# View logs
tail -f storage/logs/laravel.log

# Check queue status
php artisan queue:monitor

# Docker
docker-compose logs -f app
docker-compose logs -f queue
docker-compose logs -f reverb
```

#### Database Backups

```bash
# Manual backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Automated daily backups (crontab)
0 2 * * * mysqldump -u username -p'password' database_name > /backups/backup_$(date +\%Y\%m\%d).sql

# Docker backup
docker-compose exec mysql mysqldump -u root -p database_name > backup.sql
```

#### Performance Optimization

```bash
# Cache optimization
php artisan optimize

# Clear all caches
php artisan optimize:clear

# Generate route cache
php artisan route:cache

# Generate config cache
php artisan config:cache

# Generate view cache
php artisan view:cache
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Queue Not Processing Jobs

**Problem**: Jobs stuck in queue, not processing

**Solution**:
```bash
# Restart queue workers
php artisan queue:restart

# Check failed jobs
php artisan queue:failed

# Retry all failed jobs
php artisan queue:retry all

# Docker
docker-compose restart queue
docker-compose logs -f queue
```

#### 2. Reverb WebSocket Not Connecting

**Problem**: Real-time features not working

**Solution**:
```bash
# Check Reverb is running
ps aux | grep reverb

# Restart Reverb
php artisan reverb:restart

# Check configuration
php artisan config:clear

# Docker
docker-compose restart reverb
docker-compose logs -f reverb

# Verify ports are open
netstat -tuln | grep 8080
```

#### 3. Database Connection Failed

**Problem**: Cannot connect to database

**Solution**:
```bash
# Verify credentials in .env
DB_HOST=mysql
DB_DATABASE=crypto_exchange
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Test connection
php artisan tinker
DB::connection()->getPdo();

# Docker: Ensure MySQL is running
docker-compose ps
docker-compose logs mysql

# Wait for MySQL to be ready
docker-compose exec mysql mysqladmin ping -h localhost
```

#### 4. Permission Denied Errors

**Problem**: Cannot write to storage or cache

**Solution**:
```bash
# Fix permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Docker
docker-compose exec app chown -R appuser:www-data storage bootstrap/cache
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

#### 5. 500 Server Error

**Problem**: Application shows 500 error

**Solution**:
```bash
# Enable debug mode temporarily
APP_DEBUG=true

# Check logs
tail -f storage/logs/laravel.log

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Check file permissions
ls -la storage/logs
```

#### 6. Email Not Sending

**Problem**: Emails not being delivered

**Solution**:
```bash
# Verify mail configuration
php artisan config:clear

# Test email
php artisan tinker
Mail::raw('Test', function($m) { $m->to('test@example.com')->subject('Test'); });

# Check queue
php artisan queue:work --once

# Docker: Check Mailhog
# Visit http://localhost:8025
docker-compose logs mailhog
```

#### 7. Assets Not Loading

**Problem**: CSS/JS not loading or 404 errors

**Solution**:
```bash
# Rebuild assets
npm run build

# Clear cache
php artisan view:clear

# Verify public folder permissions
chmod -R 755 public

# Check storage link
php artisan storage:link

# Docker: Rebuild node container
docker-compose restart node
docker-compose logs node
```

#### 8. Docker Containers Won't Start

**Problem**: Services fail to start

**Solution**:
```bash
# Check container status
docker-compose ps

# View logs for specific service
docker-compose logs app
docker-compose logs mysql
docker-compose logs redis

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Use fix script
./fix-docker-issues.sh
```

### Debugging Tools

#### Laravel Telescope (Optional)

Install for detailed debugging:

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

Access at: http://localhost/telescope

#### Log Viewer

```bash
# View logs in real-time
tail -f storage/logs/laravel.log

# Docker
docker-compose logs -f app
```

#### Database Query Logging

Enable in `.env`:

```env
DB_LOG=true
LOG_QUERY_SLOW_THRESHOLD=1000
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Write tests** for new features
5. **Run tests**
   ```bash
   php artisan test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request**

### Code Style

- Follow PSR-12 coding standards
- Use meaningful variable and function names
- Add comments for complex logic
- Write PHPDoc blocks for methods
- Use type hints for parameters and return types

### Testing Requirements

- All new features must include tests
- Maintain test coverage above 70%
- Test both success and failure cases
- Include integration tests for critical features

### Pull Request Guidelines

- Provide clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 Crypto Exchange Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support

### Getting Help

- **Documentation**: Read this comprehensive guide
- **GitHub Issues**: Report bugs and request features
- **Community**: Join our Discord/Slack community
- **Email**: support@yourapp.com

### Reporting Issues

When reporting issues, please include:

1. **Environment details** (OS, PHP version, Laravel version)
2. **Steps to reproduce** the issue
3. **Expected behavior**
4. **Actual behavior**
5. **Error messages** and logs
6. **Screenshots** if applicable

### Feature Requests

We're always looking to improve! Submit feature requests with:

1. **Clear description** of the feature
2. **Use case** and benefits
3. **Proposed implementation** (if technical)
4. **Mockups** or examples (if UI-related)

---

## 🙏 Acknowledgments

### Technologies

- [Laravel](https://laravel.com) - The PHP framework
- [React](https://react.dev) - UI library
- [Inertia.js](https://inertiajs.com) - Modern monolith stack
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [CoinGecko](https://www.coingecko.com) - Cryptocurrency data
- [Resend](https://resend.com) - Email delivery
- [Groq](https://groq.com) - AI inference

### Libraries

- Laravel Reverb - WebSocket server
- Laravel Socialite - OAuth authentication
- Recharts - Data visualization
- Framer Motion - Animation library
- Lucide React - Icon library

---

## 📚 Additional Resources

### Documentation Links

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Inertia.js Documentation](https://inertiajs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com)

### Learning Resources

- [Laravel Bootcamp](https://bootcamp.laravel.com)
- [Laracasts](https://laracasts.com)
- [React Tutorial](https://react.dev/learn)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs/installation)

### Community

- [Laravel Discord](https://discord.gg/laravel)
- [React Community](https://react.dev/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/laravel)

---

## 🎯 Roadmap

### Planned Features

- [ ] Mobile applications (iOS/Android)
- [ ] Advanced charting tools
- [ ] Margin trading
- [ ] Futures trading
- [ ] Staking platform
- [ ] NFT marketplace
- [ ] Referral program
- [ ] API v2 with rate limiting
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced order types
- [ ] Copy trading
- [ ] Social trading features
- [ ] Price alerts
- [ ] Portfolio analytics

---

**Built with ❤️ using Laravel, React, and modern web technologies**

For questions or support, please open an issue on GitHub or contact our support team.