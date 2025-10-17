# 🚀 Cashfree Integration - Quick Start Guide

## Get Started in 5 Minutes!

This is a quick reference guide to get Cashfree working in your ReelHaus application.

---

## Step 1: Get Your Credentials (2 minutes)

1. Go to https://www.cashfree.com/
2. Sign up / Log in
3. Go to **Dashboard** → **Developers** → **API Keys**
4. Copy your:
   - **App ID (x-client-id)**
   - **Secret Key (x-secret-key)**

---

## Step 2: Update Environment Variables (1 minute)

Add these to your `.env.local`:

```bash
# Cashfree Credentials
CASHFREE_APP_ID=your_app_id_here
CASHFREE_SECRET_KEY=your_secret_key_here
CASHFREE_ENVIRONMENT=sandbox

# Public Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
```

---

## Step 3: Configure Webhooks (2 minutes)

1. Go to **Cashfree Dashboard** → **Developers** → **Webhooks**
2. Click **Add Webhook**
3. Enter Webhook URL: `https://yourdomain.com/api/webhooks/cashfree`
4. Select Events:
   - ✅ PAYMENT_SUCCESS_WEBHOOK
   - ✅ PAYMENT_FAILED_WEBHOOK
   - ✅ PAYMENT_USER_DROPPED
   - ✅ ORDER_PAID
5. Click **Save**

---

## Step 4: Test Payment (1 minute)

### Test Card (Success):
- **Card Number**: `4111 1111 1111 1111`
- **CVV**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)
- **Name**: Any name

### Test UPI (Success):
- **UPI ID**: `success@payments`

---

## ✅ That's It!

Your Cashfree integration is ready to use!

---

## 🧪 Quick Test

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to your events page and register for an event

3. Use the test card above to complete payment

4. Check:
   - ✅ Payment success page loads
   - ✅ Database updated (check `payments` table)
   - ✅ Email confirmation sent
   - ✅ Event seats decremented

---

## 🔄 Going Live

When ready for production:

1. **Update Environment Variables**:
   ```bash
   CASHFREE_ENVIRONMENT=production
   NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

2. **Update Webhook URL**:
   - Change to your production domain
   - Test webhook delivery

3. **Deploy**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📊 API Endpoints

### Create Order
```
POST /api/payments/create-order
```

### Verify Payment
```
POST /api/payments/verify
```

### Webhook Handler
```
POST /api/webhooks/cashfree
```

---

## 🆘 Troubleshooting

### Issue: "Invalid signature"
**Solution**: Check your `CASHFREE_SECRET_KEY` is correct

### Issue: Webhook not receiving events
**Solution**: 
- Verify webhook URL is correct
- Check webhook is enabled in Cashfree dashboard
- Ensure your server is accessible from internet

### Issue: Payment not completing
**Solution**:
- Check browser console for errors
- Verify `NEXT_PUBLIC_CASHFREE_ENVIRONMENT` is set
- Ensure Cashfree SDK is loading

---

## 📚 More Information

- **Complete Guide**: `CASHFREE_INTEGRATION_GUIDE.md`
- **Webhooks Details**: `CASHFREE_WEBHOOKS_AND_ENDPOINTS.md`
- **Migration Guide**: `MIGRATION_RAZORPAY_TO_CASHFREE.md`
- **Summary**: `CASHFREE_INTEGRATION_SUMMARY.md`

---

## 📞 Support

- **Cashfree Support**: support@cashfree.com
- **Cashfree Docs**: https://docs.cashfree.com/

---

## 🎉 You're All Set!

Your Cashfree integration is complete and ready to use!

