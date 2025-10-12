#!/bin/bash

# ===========================================
# ReelHaus - Environment Setup Script
# ===========================================
# This script helps generate secure secrets for your .env.local file

echo "🚀 ReelHaus Environment Setup"
echo "=============================="
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

echo "📝 Generating secure secrets..."

# Generate JWT Secret
JWT_SECRET=$(openssl rand -base64 64 2>/dev/null || python3 -c "import secrets; print(secrets.token_urlsafe(64))" 2>/dev/null || echo "CHANGE_THIS_JWT_SECRET_$(date +%s)")

# Generate QR HMAC Secret
QR_HMAC_SECRET=$(openssl rand -base64 32 2>/dev/null || python3 -c "import secrets; print(secrets.token_urlsafe(32))" 2>/dev/null || echo "CHANGE_THIS_QR_SECRET_$(date +%s)")

# Generate Admin Password (if not provided)
ADMIN_PASSWORD=$(openssl rand -base64 16 2>/dev/null || python3 -c "import secrets; print(secrets.token_urlsafe(16))" 2>/dev/null || echo "admin$(date +%s)")

echo "✅ Secrets generated successfully!"
echo ""

# Create .env.local file
cat > .env.local << EOF
# ===========================================
# ReelHaus - Environment Variables
# Generated on $(date)
# ===========================================

# ===========================================
# SUPABASE CONFIGURATION
# ===========================================
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# ===========================================
# ADMIN AUTHENTICATION
# ===========================================
ADMIN_USERNAME=admin
ADMIN_PASSWORD=${ADMIN_PASSWORD}

# ===========================================
# RAZORPAY PAYMENT INTEGRATION
# ===========================================
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here

# ===========================================
# QR CODE SECURITY
# ===========================================
QR_HMAC_SECRET=${QR_HMAC_SECRET}

# ===========================================
# EMAIL SERVICE (SENDGRID)
# ===========================================
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here

# ===========================================
# REDIS CONFIGURATION
# ===========================================
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_here

# ===========================================
# JWT SECRET
# ===========================================
JWT_SECRET=${JWT_SECRET}

# ===========================================
# APPLICATION CONFIGURATION
# ===========================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===========================================
# DEVELOPMENT ONLY
# ===========================================
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
EOF

echo "📄 .env.local file created successfully!"
echo ""
echo "🔐 Generated Admin Credentials:"
echo "   Username: admin"
echo "   Password: ${ADMIN_PASSWORD}"
echo ""
echo "⚠️  IMPORTANT: Save these credentials securely!"
echo ""
echo "📋 Next Steps:"
echo "1. Fill in your Supabase credentials"
echo "2. Add your Razorpay keys"
echo "3. Configure SendGrid API key"
echo "4. Set up Redis instance"
echo "5. Run database migrations"
echo "6. Start the development server: pnpm dev"
echo ""
echo "🎉 Setup complete! Happy coding!"
