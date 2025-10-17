# Cashfree Payment Gateway Integration Guide

## Overview
This guide outlines the complete integration of Cashfree Payment Gateway to replace Razorpay in your ReelHaus event management platform.

---

## 🔑 API Credentials Required

You'll need the following from your Cashfree account:

1. **App ID (x-client-id)** - Your Cashfree App ID
2. **Secret Key (x-secret-key)** - Your Cashfree Secret Key

### Environment Variables
Add these to your `.env.local`:

```bash
# Cashfree Credentials
CASHFREE_APP_ID=your_app_id_here
CASHFREE_SECRET_KEY=your_secret_key_here

# Cashfree Environment (test or production)
CASHFREE_ENVIRONMENT=test  # Change to 'production' for live payments
```

---

## 📡 Webhook Endpoints

### 1. **Payment Success Webhook**
- **URL**: `https://yourdomain.com/api/webhooks/cashfree`
- **Events Handled**:
  - `PAYMENT_SUCCESS_WEBHOOK` - Payment successfully captured
  - `PAYMENT_FAILED_WEBHOOK` - Payment failed
  - `PAYMENT_USER_DROPPED` - User closed payment page

### 2. **Order Status Webhook**
- **URL**: `https://yourdomain.com/api/webhooks/cashfree`
- **Events Handled**:
  - `ORDER_ACTIVATED` - Order activated
  - `ORDER_PAID` - Order paid successfully

---

## 🔄 Payment Flow

### Step 1: Create Order
**Endpoint**: `POST /api/payments/create-order`

**Request Body**:
```json
{
  "event_id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "roll_no": "2024CS001",
  "tickets": 2,
  "ticket_details": [
    {
      "name": "Jane Doe",
      "roll_no": "2024CS002",
      "email": "jane@example.com"
    }
  ]
}
```

**Response**:
```json
{
  "registration_id": "uuid",
  "cashfree_order_id": "order_abc123",
  "cashfree_payment_session_id": "session_xyz789",
  "amount": 3000,
  "currency": "INR",
  "order_token": "token_123"
}
```

### Step 2: Initiate Payment (Frontend)
Load Cashfree Checkout and pass the payment session ID.

### Step 3: Webhook Callback
Cashfree sends webhook to `/api/webhooks/cashfree` with payment status.

### Step 4: Payment Verification
**Endpoint**: `POST /api/payments/verify`

**Request Body**:
```json
{
  "cashfree_order_id": "order_abc123",
  "cashfree_payment_id": "payment_xyz789",
  "registration_id": "uuid"
}
```

---

## 🛠️ Implementation Files

### Files to Create/Update:

1. **`lib/cashfree.ts`** - Cashfree SDK wrapper
2. **`app/api/payments/create-order/route.ts`** - Update to use Cashfree
3. **`app/api/webhooks/cashfree/route.ts`** - New webhook handler
4. **`app/api/payments/verify/route.ts`** - Update to verify Cashfree payments
5. **`app/events/[id]/register/page.tsx`** - Update frontend checkout
6. **`app/events/payment/page.tsx`** - Update payment page

---

## 🔐 Webhook Signature Verification

Cashfree sends a signature in the `x-webhook-signature` header for verification:

```typescript
const signature = request.headers.get('x-webhook-signature')
const expectedSignature = crypto
  .createHmac('sha256', process.env.CASHFREE_SECRET_KEY!)
  .update(body)
  .digest('base64')
```

---

## 📊 Database Schema

No changes needed! Your existing `payments` table already supports multiple providers:

```sql
payments (
  id uuid PRIMARY KEY,
  registration_id uuid REFERENCES registrations(id),
  provider text,  -- Will be 'cashfree' instead of 'razorpay'
  provider_order_id text,
  provider_payment_id text,
  amount_cents integer,
  currency text,
  status text,
  raw_event jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
```

---

## 🎨 Frontend Integration

### Cashfree Checkout Script
```html
<script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
```

### Initialize Payment
```javascript
const cashfree = new Cashfree({
  mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || "sandbox"
})

const checkoutOptions = {
  paymentSessionId: paymentData.cashfree_payment_session_id,
  redirectTarget: "_self"
}

cashfree.checkout(checkoutOptions)
```

---

## 🧪 Testing

### Test Cards (Sandbox Mode)
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4111 1111 1111 1112`
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **UPI**: `success@payments`

---

## 📝 Webhook Configuration in Cashfree Dashboard

1. Log in to Cashfree Dashboard
2. Go to **Developers** → **Webhooks**
3. Add Webhook URL: `https://yourdomain.com/api/webhooks/cashfree`
4. Select Events:
   - ✅ PAYMENT_SUCCESS_WEBHOOK
   - ✅ PAYMENT_FAILED_WEBHOOK
   - ✅ PAYMENT_USER_DROPPED
   - ✅ ORDER_PAID
5. Save and verify webhook

---

## ⚠️ Important Notes

1. **Environment**: Always test in sandbox mode first before switching to production
2. **Webhook URL**: Must be HTTPS in production
3. **Signature Verification**: Always verify webhook signatures to prevent fraud
4. **Idempotency**: Handle duplicate webhook calls (already implemented)
5. **Error Handling**: Implement proper error handling for failed payments
6. **Refunds**: Cashfree refunds are processed through their dashboard or API

---

## 🔄 Migration Checklist

- [ ] Add Cashfree environment variables
- [ ] Install Cashfree SDK (if needed)
- [ ] Update `lib/cashfree.ts`
- [ ] Update `app/api/payments/create-order/route.ts`
- [ ] Create `app/api/webhooks/cashfree/route.ts`
- [ ] Update `app/api/payments/verify/route.ts`
- [ ] Update frontend checkout components
- [ ] Configure webhooks in Cashfree dashboard
- [ ] Test payment flow in sandbox
- [ ] Test webhook delivery
- [ ] Switch to production mode
- [ ] Update frontend environment variables

---

## 📞 Support

- **Cashfree Documentation**: https://docs.cashfree.com/
- **Cashfree Support**: support@cashfree.com
- **API Reference**: https://docs.cashfree.com/docs

---

## 🎯 Next Steps

1. Review this guide
2. Set up Cashfree account and get credentials
3. I'll create all the implementation files
4. Test in sandbox mode
5. Configure webhooks
6. Go live!

