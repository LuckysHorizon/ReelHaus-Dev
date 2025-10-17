# Cashfree Webhook Test Issue - Solution

## Issue
Cashfree webhook test is failing with: "The endpoint did not respond properly to the test"

## Why This Happens
1. **Local Development**: Your server is running on `localhost:3000` which Cashfree can't reach
2. **HTTPS Required**: Cashfree requires HTTPS for webhook URLs in production
3. **Server Not Running**: The webhook endpoint might not be accessible

## Solutions

### Option 1: Use ngrok for Local Testing (Recommended)

1. **Install ngrok**:
   ```bash
   npm install -g ngrok
   # or download from https://ngrok.com/
   ```

2. **Start your development server**:
   ```bash
   npm run dev
   ```

3. **In another terminal, expose your local server**:
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

5. **Update webhook URL**:
   ```
   https://abc123.ngrok.io/api/webhooks/cashfree
   ```

6. **Test webhook** in Cashfree dashboard

### Option 2: Deploy to Production First

1. **Deploy your app** to production (Vercel, Netlify, etc.)
2. **Use production URL** for webhook:
   ```
   https://reelhaus.in/api/webhooks/cashfree
   ```
3. **Test webhook** in Cashfree dashboard

### Option 3: Skip Test and Continue (Temporary)

1. **Click "Continue"** in Cashfree dashboard
2. **Webhook will be added** but not tested
3. **Test manually** when you have a live server

## Manual Webhook Test

Once your webhook is configured, you can test it manually:

### 1. Create a Test Order
```bash
curl -X POST https://yourdomain.com/api/payments/create-order \
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

### 2. Complete Payment
- Use test card: `4111 1111 1111 1111`
- Complete payment in Cashfree checkout

### 3. Check Webhook Delivery
- Go to Cashfree Dashboard → Developers → Webhooks
- Check delivery status
- View webhook logs

## Webhook Endpoint Verification

Your webhook endpoint should return:

### Success Response:
```json
{
  "status": "success"
}
```

### Error Response:
```json
{
  "error": "Invalid signature"
}
```

## Common Issues & Solutions

### Issue: "Invalid signature"
**Solution**: Check your `CASHFREE_SECRET_KEY` is correct

### Issue: "Missing signature"
**Solution**: Ensure webhook is sending `x-webhook-signature` header

### Issue: "Payment record not found"
**Solution**: Check if order was created properly in database

### Issue: "Registration not found"
**Solution**: Verify registration was created before payment

## Testing Checklist

- [ ] Server is running and accessible
- [ ] Webhook URL is correct and HTTPS
- [ ] Environment variables are set
- [ ] Webhook events are subscribed
- [ ] Test payment completes successfully
- [ ] Webhook receives and processes events
- [ ] Database updates correctly
- [ ] Email confirmations sent

## Production Deployment

For production deployment:

1. **Update Environment Variables**:
   ```bash
   CASHFREE_ENVIRONMENT=production
   NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
   NEXT_PUBLIC_BASE_URL=https://reelhaus.in
   ```

2. **Update Webhook URL**:
   ```
   https://reelhaus.in/api/webhooks/cashfree
   ```

3. **Test Webhook**:
   - Complete a test payment
   - Check webhook delivery status
   - Verify database updates

## Quick Fix for Now

**Click "Continue"** in Cashfree dashboard to add the webhook without testing. The webhook will work once your server is accessible.

## Next Steps

1. **Use ngrok** for local testing, or
2. **Deploy to production** and test there, or
3. **Continue without test** and test manually later

The webhook endpoint is correctly implemented - it just needs to be accessible from the internet for Cashfree to test it.

