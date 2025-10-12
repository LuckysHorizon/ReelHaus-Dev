# Environment Setup Guide

This guide will help you set up all the required environment variables for the ReelHaus project.

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

**For Linux/Mac:**
```bash
./setup-env.sh
```

**For Windows:**
```cmd
setup-env.bat
```

### Option 2: Manual Setup

1. Copy the template file:
   ```bash
   cp env.template .env.local
   ```

2. Fill in all the required values (see sections below)

## 📋 Required Services

### 1. Supabase (Database & Storage)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings → API
4. Copy the following values:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Razorpay (Payments)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up/Login to your account
3. Go to Settings → API Keys
4. Generate test keys:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
5. Go to Settings → Webhooks
6. Create a webhook with URL: `https://yourdomain.com/api/webhooks/razorpay`
7. Copy the webhook secret: `RAZORPAY_WEBHOOK_SECRET`

### 3. SendGrid (Email Service)

1. Go to [SendGrid Dashboard](https://app.sendgrid.com)
2. Sign up/Login to your account
3. Go to Settings → API Keys
4. Create a new API key with "Full Access"
5. Copy the API key: `SENDGRID_API_KEY`

### 4. Redis (Background Jobs)

**Option A: Local Redis**
```bash
# Install Redis locally
# macOS: brew install redis
# Ubuntu: sudo apt install redis-server
# Windows: Download from https://redis.io/download

# Start Redis
redis-server
```

**Option B: Redis Cloud**
1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Create a free account
3. Create a new database
4. Copy the connection details

### 5. Admin Credentials

Set secure credentials for admin access:
- `ADMIN_USERNAME`: Choose a username
- `ADMIN_PASSWORD`: Generate a strong password

## 🔐 Security Secrets

### Generate Secure Secrets

**JWT Secret (64 characters):**
```bash
# Linux/Mac
openssl rand -base64 64

# Windows PowerShell
[System.Web.Security.Membership]::GeneratePassword(64, 0)
```

**QR HMAC Secret (32 characters):**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Web.Security.Membership]::GeneratePassword(32, 0)
```

## 📝 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `secure_password_123` |
| `RAZORPAY_KEY_ID` | Razorpay key ID | `rzp_test_1234567890` |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | `secret_key_here` |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | `webhook_secret_here` |
| `QR_HMAC_SECRET` | QR code signing secret | `qr_secret_32_chars` |
| `SENDGRID_API_KEY` | SendGrid API key | `SG.abc123...` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | `jwt_secret_64_chars` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | (empty) |

## 🗄️ Database Setup

After setting up Supabase, run the database migrations:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Execute the SQL script

This will create:
- All necessary tables (events, registrations, payments, etc.)
- Row Level Security (RLS) policies
- Database functions and triggers
- Indexes for performance

## 🧪 Testing Your Setup

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Visit `http://localhost:3000`

3. Test admin login at `http://localhost:3000/admin/login`

4. Create a test event in the admin dashboard

5. Test the registration flow

## 🚨 Security Checklist

- [ ] Never commit `.env.local` to version control
- [ ] Use strong, unique passwords for all services
- [ ] Enable 2FA on all service accounts
- [ ] Use different credentials for development/staging/production
- [ ] Rotate secrets regularly in production
- [ ] Monitor access logs regularly
- [ ] Use HTTPS in production
- [ ] Set up proper CORS policies
- [ ] Implement rate limiting

## 🔧 Troubleshooting

### Common Issues

**1. Supabase Connection Error**
- Verify your Supabase URL and keys
- Check if your Supabase project is active
- Ensure RLS policies are properly set up

**2. Razorpay Payment Issues**
- Verify you're using test keys in development
- Check webhook URL configuration
- Ensure webhook secret matches

**3. Email Not Sending**
- Verify SendGrid API key
- Check SendGrid account status
- Ensure sender email is verified

**4. Redis Connection Error**
- Verify Redis is running
- Check Redis URL and credentials
- Ensure Redis server is accessible

**5. Admin Login Issues**
- Verify admin credentials in `.env.local`
- Check JWT secret is set
- Ensure admin routes are properly protected

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Check service status (Supabase, Razorpay, SendGrid, Redis)
4. Review the logs for detailed error information

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)
- [Redis Documentation](https://redis.io/documentation)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
