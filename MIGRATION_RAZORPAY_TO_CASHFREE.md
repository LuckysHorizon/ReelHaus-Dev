# Migration Guide: Razorpay to Cashfree

## Overview
This guide helps you migrate from Razorpay to Cashfree Payment Gateway in your ReelHaus application.

---

## 📋 Pre-Migration Checklist

- [ ] Backup your current database
- [ ] Test the migration in a staging environment first
- [ ] Have your Cashfree credentials ready
- [ ] Plan a maintenance window (if needed)

---

## 🔄 Migration Steps

### Step 1: Install Dependencies

No new dependencies needed! We're using native fetch API.

### Step 2: Update Environment Variables

Add these to your `.env.local`:

```bash
# Cashfree Configuration
CASHFREE_APP_ID=your_app_id_here
CASHFREE_SECRET_KEY=your_secret_key_here
CASHFREE_ENVIRONMENT=sandbox  # Change to 'production' for live

# Public Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
```

**Remove or keep these Razorpay variables** (optional - for rollback):
```bash
# RAZORPAY_KEY_ID=...
# RAZORPAY_KEY_SECRET=...
# RAZORPAY_WEBHOOK_SECRET=...
```

### Step 3: Files Created/Updated

#### ✅ New Files Created:
1. `lib/cashfree.ts` - Cashfree SDK wrapper
2. `app/api/webhooks/cashfree/route.ts` - Cashfree webhook handler
3. `components/cashfree-checkout.tsx` - Frontend checkout component
4. `CASHFREE_INTEGRATION_GUIDE.md` - Complete integration guide
5. `CASHFREE_WEBHOOKS_AND_ENDPOINTS.md` - Webhooks documentation
6. `env.cashfree.template` - Environment variables template

#### ✅ Files Updated:
1. `app/api/payments/create-order/route.ts` - Now uses Cashfree
2. `app/api/payments/verify/route.ts` - Now verifies Cashfree payments

#### ⚠️ Files to Update (Frontend):
1. `app/events/[id]/register/page.tsx` - Update checkout flow
2. `app/events/payment/page.tsx` - Update payment page

### Step 4: Update Frontend Components

#### Update `app/events/[id]/register/page.tsx`:

**Before (Razorpay)**:
```typescript
const response = await fetch('/api/payments/create-order', {
  method: 'POST',
  body: JSON.stringify({...})
})

const data = await response.json()

// Load Razorpay
const script = document.createElement('script')
script.src = 'https://checkout.razorpay.com/v1/checkout.js'
script.onload = () => {
  const options = {
    key: data.razorpay_key_id,
    amount: data.amount * 100,
    currency: data.currency,
    order_id: data.razorpay_order_id,
    handler: function(response) {
      // Handle success
    }
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
}
```

**After (Cashfree)**:
```typescript
const response = await fetch('/api/payments/create-order', {
  method: 'POST',
  body: JSON.stringify({...})
})

const data = await response.json()

// Load Cashfree
const script = document.createElement('script')
script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
script.onload = () => {
  const cashfree = new window.Cashfree({
    mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'sandbox'
  })
  
  const checkoutOptions = {
    paymentSessionId: data.cashfree_payment_session_id,
    redirectTarget: "_self"
  }
  
  cashfree.checkout(checkoutOptions)
}
```

### Step 5: Configure Webhooks in Cashfree Dashboard

1. Log in to [Cashfree Dashboard](https://merchant.cashfree.com/)
2. Go to **Developers** → **Webhooks**
3. Add Webhook URL: `https://yourdomain.com/api/webhooks/cashfree`
4. Select Events:
   - ✅ PAYMENT_SUCCESS_WEBHOOK
   - ✅ PAYMENT_FAILED_WEBHOOK
   - ✅ PAYMENT_USER_DROPPED
   - ✅ ORDER_PAID
5. Click **Save**
6. Test webhook delivery

### Step 6: Update Database (Optional)

No database schema changes needed! Your existing `payments` table already supports multiple providers:

```sql
-- The 'provider' column will now contain 'cashfree' instead of 'razorpay'
-- All other columns remain the same
```

### Step 7: Testing

#### Test in Sandbox Mode:

1. **Create Test Order**:
   ```bash
   curl -X POST http://localhost:3000/api/payments/create-order \
     -H "Content-Type: application/json" \
     -d '{
       "event_id": "your-event-uuid",
       "name": "Test User",
       "email": "test@example.com",
       "phone": "+919876543210",
       "roll_no": "2024CS001",
       "tickets": 1
     }'
   ```

2. **Test Payment**:
   - Use test card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

3. **Verify Webhook**:
   - Check Cashfree dashboard for webhook delivery status
   - Check your application logs
   - Verify database updates

4. **Check Email**:
   - Verify confirmation emails are sent

### Step 8: Go Live

1. **Update Environment Variables**:
   ```bash
   CASHFREE_ENVIRONMENT=production
   NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

2. **Update Webhook URL**:
   - Change webhook URL to production domain
   - Test webhook delivery

3. **Monitor**:
   - Monitor webhook deliveries
   - Check payment success rates
   - Monitor error logs

---

## 🔙 Rollback Plan

If you need to rollback to Razorpay:

1. **Revert Code Changes**:
   ```bash
   git revert <commit-hash>
   ```

2. **Update Environment Variables**:
   ```bash
   # Restore Razorpay variables
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   ```

3. **Deploy**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📊 Key Differences

| Aspect | Razorpay | Cashfree |
|--------|----------|----------|
| **Order Creation** | `razorpay.orders.create()` | `cashfree.createOrder()` |
| **Payment ID Field** | `razorpay_payment_id` | `cf_payment_id` |
| **Order ID Field** | `razorpay_order_id` | `cf_order_id` |
| **Signature Header** | `X-Razorpay-Signature` | `x-webhook-signature` |
| **SDK Script** | `checkout.razorpay.com/v1/checkout.js` | `sdk.cashfree.com/js/v3/cashfree.js` |
| **Amount Format** | Paise (multiply by 100) | Rupees (no conversion) |
| **Provider Name** | `'razorpay'` | `'cashfree'` |

---

## ⚠️ Important Notes

1. **Existing Payments**: Existing Razorpay payments in your database will remain unchanged
2. **New Payments**: All new payments will use Cashfree
3. **Webhooks**: Make sure to configure Cashfree webhooks before going live
4. **Testing**: Always test in sandbox mode first
5. **Monitoring**: Monitor webhook deliveries and payment success rates

---

## 🆘 Troubleshooting

### Issue: Webhook not receiving events
**Solution**: 
- Check webhook URL is correct and accessible
- Verify webhook is configured in Cashfree dashboard
- Check firewall/security settings

### Issue: Payment verification fails
**Solution**:
- Verify Cashfree credentials are correct
- Check environment variables are set
- Ensure webhook signature verification is working

### Issue: Frontend checkout not loading
**Solution**:
- Check Cashfree SDK script is loading
- Verify `NEXT_PUBLIC_CASHFREE_ENVIRONMENT` is set
- Check browser console for errors

---

## 📞 Support

- **Cashfree Support**: support@cashfree.com
- **Cashfree Docs**: https://docs.cashfree.com/
- **ReelHaus Team**: reelhaus.in@gmail.com

---

## ✅ Post-Migration Checklist

- [ ] All tests passing
- [ ] Webhooks configured and tested
- [ ] Payment flow working in sandbox
- [ ] Email confirmations working
- [ ] Database updates working
- [ ] Monitoring set up
- [ ] Documentation updated
- [ ] Team trained on new system

---

## 🎉 Success!

Once all steps are complete, you've successfully migrated from Razorpay to Cashfree!

Monitor the system for the first few days and address any issues promptly.

