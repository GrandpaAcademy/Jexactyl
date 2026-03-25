#!/bin/bash

# Zero-Bot Environment Setup Script
# Works on Debian/Ubuntu based systems

# Exit on error
set -e

echo "🚀 Starting Zero-Bot Environment Setup..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root or with sudo"
  exit 1
fi

# Update system
echo "🔄 Updating system packages..."
apt update && apt upgrade -y

# Install common dependencies
echo "📦 Installing common dependencies..."
apt install -y software-properties-common curl ca-certificates lsb-release apt-transport-https zip unzip git gnupg2 supervisor mariadb-server redis-server cron

# Add PHP repository
echo "🐘 Adding PHP repository (Ondrej Sury)..."
add-apt-repository -y ppa:ondrej/php
apt update

# Install PHP 8.2 and extensions
echo "🐘 Installing PHP 8.2 and extensions..."
apt install -y php8.2 php8.2-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip,intl,sqlite3,pgsql,gmp,redis,memcached,soap,tokenizer}

# Install Composer
echo "🎼 Installing Composer..."
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js 18 (LTS)
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install pnpm
echo "📦 Installing pnpm..."
npm install -g pnpm

# Project directory check
PROJECT_DIR="$(pwd)"
if [ ! -f "$PROJECT_DIR/artisan" ]; then
    echo "❌ artisan not found! Please run this script in the project root."
    exit 1
fi

# Setup environment file first to prevent Artisan errors
if [ ! -f ".env" ]; then
    echo "📄 Creating .env file from .env.example..."
    cp .env.example .env
fi

# Pre-populate with a random key to satisfy EncryptionServiceProvider during boot if empty
if grep -q "^APP_KEY=$" .env; then
    DUMMY_KEY="base64:$(openssl rand -base64 32)"
    sed -i "s|^APP_KEY=.*|APP_KEY=$DUMMY_KEY|" .env
    echo "✅ Dummy key pre-initialized."
fi

# Set directory permissions
echo "🔒 Setting directory permissions..."
chown -R ${SUDO_USER:-$USER}:${SUDO_USER:-$USER} storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache

# Setup Database & Redis
echo "🗄️  Enabling MariaDB and Redis..."
systemctl enable --now mariadb 2>/dev/null || echo "⚠️  Make sure MariaDB is running"
systemctl enable --now redis-server 2>/dev/null || echo "⚠️  Make sure Redis is running"

# Automate Database Configuration
echo "🗄️  Configuring MariaDB (Panel Database)..."
# We use root access to create the DB and User. Local setup, so simple credentials.
mysql -v -e "CREATE DATABASE IF NOT EXISTS panel;"
mysql -v -e "CREATE USER IF NOT EXISTS 'zerobot'@'localhost' IDENTIFIED BY 'zerobot_pass';"
mysql -v -e "GRANT ALL PRIVILEGES ON panel.* TO 'zerobot'@'localhost' WITH GRANT OPTION;"
mysql -v -e "FLUSH PRIVILEGES;"

# Update .env with database credentials
sed -i "s/^DB_DATABASE=.*/DB_DATABASE=panel/" .env
sed -i "s/^DB_USERNAME=.*/DB_USERNAME=zerobot/" .env
sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=zerobot_pass/" .env
sed -i "s|^DB_HOST=.*|DB_HOST=127.0.0.1|" .env
echo "✅ Database configured in .env"

# Install PHP dependencies
echo "📝 Installing PHP dependencies..."
composer install --optimize-autoloader

# Properly generate key (overwrites dummy)
echo "🔑 Generating final application key..."
php artisan key:generate --force

# Run Migrations
echo "🚀 Running Database Migrations..."
php artisan migrate --force

# Create Admin User (admin / admin123)
echo "👤 Creating Admin User (admin / admin123)..."
# We try to create it. If it exists, it might fail, but that's fine.
php artisan p:user:make --email="admin@admin.com" --username="admin" --password="admin123" --admin=1 || echo "⚠️  User might already exist."

# Install Node dependencies and build assets
echo "🏗️ Installing Node dependencies and building assets..."
pnpm install
pnpm build

# Setup Cron Job (Only if hosting, but helpful for local testing)
echo "⏰ Setting up Cron Job..."
(crontab -l 2>/dev/null | grep -v "$PROJECT_DIR/artisan"; echo "* * * * * php $PROJECT_DIR/artisan schedule:run >> /dev/null 2>&1") | crontab -

echo "✅ Zero-Bot Environment Setup Complete!"
echo "---"
echo "👤 Admin Access:"
echo "   User: admin"
echo "   Password: admin123"
echo ""
echo "💡 To start local development server (Backend):"
echo "   php artisan serve"
echo ""
echo "💡 To start frontend development (Vite):"
echo "   pnpm dev"
echo ""
echo "💡 Note: Open http://localhost:8000 (standard php artisan serve port)"
