# 🚀 ReelHaus Events Portal - Complete Setup Guide

## ✅ **Current Status: All Core Features Implemented**

Your ReelHaus Events Portal is now fully implemented with all SRS requirements! Here's what's working:

### **✅ Implemented Features:**

1. **✅ Mobile-first Landing Pages** - Home, AboutUs, Team, Join Us, Blog
2. **✅ Event Pages** - Animated cards with ReelHaus videos
3. **✅ Registration Form** - Phone validation (+91), dynamic attendee details
4. **✅ Razorpay Integration** - Order creation, webhook handling, payment verification
5. **✅ Worker Queue** - QR generation, email sending, Excel export
6. **✅ Admin Dashboard** - ENV-based login, CRUD operations, Excel export
7. **✅ Supabase Integration** - Auth, Postgres, Storage
8. **✅ Security** - JWT authentication, HMAC QR signing, webhook verification

---

## 🔧 **Final Setup Steps**

### **Step 1: Set Up Supabase Storage**

Run this SQL in your Supabase SQL Editor:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
('event-media', 'event-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4']),
('exports', 'exports', false, 104857600, ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
('qrs', 'qrs', false, 1048576, ARRAY['image/png', 'image/svg+xml']);

-- Create storage policies
CREATE POLICY "Public can view event media" ON storage.objects FOR SELECT USING (bucket_id = 'event-media');
CREATE POLICY "Admins can manage event media" ON storage.objects FOR ALL USING (bucket_id = 'event-media' AND auth.role() = 'service_role');
CREATE POLICY "Admins can manage exports" ON storage.objects FOR ALL USING (bucket_id = 'exports' AND auth.role() = 'service_role');
CREATE POLICY "Admins can manage QR codes" ON storage.objects FOR ALL USING (bucket_id = 'qrs' AND auth.role() = 'service_role');
```

### **Step 2: Complete Environment Variables**

Create `.env.local` with ALL required variables:

```env
# ===========================================
# SUPABASE CONFIGURATION
# ===========================================
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ===========================================
# ADMIN AUTHENTICATION
# ===========================================
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_here

# ===========================================
# RAZORPAY INTEGRATION
# ===========================================
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# ===========================================
# QR CODE SECURITY
# ===========================================
QR_HMAC_SECRET=your_qr_hmac_secret_key

# ===========================================
# EMAIL SERVICE
# ===========================================
SENDGRID_API_KEY=SG.your_sendgrid_api_key

# ===========================================
# REDIS (for worker queues)
# ===========================================
REDIS_URL=redis://localhost:6379
# OR for production:
# REDIS_URL=redis://username:password@host:port

# ===========================================
# APPLICATION CONFIGURATION
# ===========================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Step 3: Set Up Razorpay Webhook**

1. Go to your Razorpay Dashboard
2. Navigate to Settings → Webhooks
3. Add webhook URL: `https://your-domain.com/api/webhooks/razorpay`
4. Select events: `payment.captured`
5. Copy the webhook secret to your `.env.local`

### **Step 4: Set Up SendGrid (Optional)**

1. Create SendGrid account
2. Generate API key
3. Add to `.env.local`

### **Step 5: Set Up Redis (for Production)**

For local development, Redis is optional. For production:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or use Redis Cloud
# Get connection string from Redis Cloud dashboard
```

---

## 🧪 **Testing Your Setup**

### **Test 1: Basic Connection**
Visit: `http://localhost:3000/api/test-supabase`
Should return: `{"success": true, "message": "Supabase connection successful"}`

### **Test 2: Admin Dashboard**
1. Visit: `http://localhost:3000/admin/login`
2. Login with: admin/your_password
3. Should see dashboard with events

### **Test 3: Event Registration**
1. Visit: `http://localhost:3000/events`
2. Click on an event
3. Click "Register Now"
4. Fill form and test payment flow

### **Test 4: Worker Queue (Optional)**
If Redis is set up, workers will automatically process:
- QR code generation
- Email sending
- Excel exports

---

## 🚀 **Production Deployment**

### **Environment Variables for Production:**
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
REDIS_URL=redis://your-redis-host:6379
# Use production Razorpay keys
# Use production Supabase project
```

### **Deployment Checklist:**
- [ ] Set all environment variables in your hosting platform
- [ ] Configure Razorpay webhook URL
- [ ] Set up Redis for worker queues
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and logging

---

## 📊 **API Endpoints Summary**

### **Public APIs:**
- `GET /api/events` - List active events
- `GET /api/events/[id]` - Event details
- `POST /api/events/[id]/register` - Create registration

### **Admin APIs:**
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/events` - List all events
- `POST /api/admin/events` - Create event
- `GET /api/admin/registrations` - View registrations
- `POST /api/admin/export/registrations` - Export Excel

### **Webhook APIs:**
- `POST /api/webhooks/razorpay` - Razorpay payment webhook

---

## 🎯 **All SRS Requirements Met:**

✅ **Mobile-first Landing** - Home, AboutUs, Team, Join Us, Blog  
✅ **Event Pages** - Animated cards with ReelHaus videos  
✅ **Registration Form** - Phone validation, dynamic attendee details  
✅ **Razorpay Integration** - Order creation, webhook handling  
✅ **Worker Queue** - QR generation, email, Excel export  
✅ **Admin Dashboard** - ENV login, CRUD, Excel export  
✅ **Supabase** - Auth, Postgres, Storage  
✅ **Security** - JWT, HMAC, webhook verification  
✅ **No OpenAI** - As requested  

---

## 🎉 **You're All Set!**

Your ReelHaus Events Portal is now fully functional with all SRS requirements implemented. The system is ready for production deployment!
