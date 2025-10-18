# Cashfree Webhook Setup Guide

## Environment Variables Required

Add these to your `.env.local` and production environment:

```bash
# Cashfree API Configuration
CASHFREE_APP_ID=your_app_id_here
CASHFREE_SECRET_KEY=your_secret_key_here
CASHFREE_ENVIRONMENT=production  # or sandbox for testing

# Email Configuration
RESEND_API_KEY=your_resend_api_key_here
```

**Note**: Cashfree webhooks use the same `CASHFREE_SECRET_KEY` for signature verification (not a separate webhook secret).

## Webhook Configuration in Cashfree Dashboard

1. **Go to Cashfree Dashboard** → **Developers** → **Webhooks**

2. **Add New Webhook** with these settings:
   - **Webhook URL**: `https://yourdomain.com/api/webhooks/cashfree`
   - **Events to Subscribe**:
     - ✅ `PAYMENT_SUCCESS_WEBHOOK`
     - ✅ `ORDER_PAID` 
     - ✅ `PAYMENT_FAILED_WEBHOOK`
     - ✅ `PAYMENT_USER_DROPPED`
     - ✅ `abandoned checkout`
     - ✅ `failed payment`
     - ✅ `success payment`
     - ✅ `user dropped payment`

3. **Use your existing `CASHFREE_SECRET_KEY`** for webhook signature verification

## Testing the Webhook

### Option 1: Test with Real Payment
1. Make a test payment
2. Check your server logs for webhook calls
3. Verify database updates

### Option 2: Test with Simulated Webhook
```bash
curl -X POST https://yourdomain.com/api/test-webhook-cashfree \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "ORDER_your_order_id_here",
    "registration_id": "your_registration_id_here"
  }'
```

## Troubleshooting

### Webhook Not Receiving Calls
- ✅ Ensure webhook URL is publicly accessible (HTTPS)
- ✅ Check CASHFREE_SECRET_KEY is correctly set
- ✅ Verify webhook events are subscribed in dashboard
- ✅ Check server logs for signature verification errors

### Database Not Updating
- ✅ Check webhook signature verification (uses timestamp + rawBody)
- ✅ Verify CASHFREE_SECRET_KEY matches your API credentials
- ✅ Check database connection and permissions
- ✅ Review webhook event structure

### Email Not Sending
- ✅ Verify RESEND_API_KEY is set
- ✅ Check email template configuration
- ✅ Review email sending logs

## Expected Flow

1. **User pays** → Cashfree processes payment
2. **Cashfree sends webhook** → Your server receives it
3. **Webhook verifies signature** → Ensures authenticity
4. **Webhook updates database** → Payment status = 'succeeded', Registration status = 'paid'
5. **Webhook sends email** → Confirmation to user
6. **User sees success page** → Shows real data from database

## Key Fixes Applied

1. **Fixed webhook signature verification** - Now uses `timestamp + rawBody` with `CASHFREE_SECRET_KEY`
2. **Added raw body handling** - Required for signature verification
3. **Updated payload parsing** - Handles exact Cashfree webhook structure
4. **Simplified success page** - Relies on webhook for database updates
5. **Added comprehensive logging** - For debugging webhook issues
6. **Created test endpoint** - For testing webhook logic without real payments

## Signature Verification Formula

```javascript
// Cashfree signature verification
const expectedSignature = crypto
  .createHmac('sha256', CASHFREE_SECRET_KEY)
  .update(timestamp + rawBody)
  .digest('base64')
```
