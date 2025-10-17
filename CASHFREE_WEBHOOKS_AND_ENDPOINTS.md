# Cashfree Integration - Webhooks & Endpoints Summary

## 🔑 API Credentials

You need these credentials from your Cashfree Dashboard:

- **App ID (x-client-id)**: Your Cashfree App ID
- **Secret Key (x-secret-key)**: Your Cashfree Secret Key

---

## 📡 Webhook Configuration

### Webhook URL
```
https://yourdomain.com/api/webhooks/cashfree
```

### Events to Subscribe

In your Cashfree Dashboard (Developers → Webhooks), subscribe to these events:

1. ✅ **PAYMENT_SUCCESS_WEBHOOK** - Payment successfully captured
2. ✅ **PAYMENT_FAILED_WEBHOOK** - Payment failed
3. ✅ **PAYMENT_USER_DROPPED** - User closed payment page
4. ✅ **ORDER_PAID** - Order paid successfully

---

## 🔄 API Endpoints

### 1. Create Payment Order
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
  "success": true,
  "order": {
    "id": "ORDER_abc123",
    "amount": 3000,
    "currency": "INR",
    "receipt": "registration_uuid"
  },
  "registration_id": "uuid",
  "cashfree_order_id": "ORDER_abc123",
  "cashfree_payment_session_id": "session_xyz789",
  "cashfree_order_token": "token_123",
  "event": {
    "title": "Event Name",
    "price_cents": 1500
  }
}
```

---

### 2. Verify Payment
**Endpoint**: `POST /api/payments/verify`

**Request Body**:
```json
{
  "cashfree_order_id": "ORDER_abc123",
  "cashfree_payment_id": "payment_xyz789",
  "registration_id": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "registration": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "tickets": 2,
    "event": {
      "title": "Event Name",
      "start_datetime": "2025-01-15T10:00:00Z"
    }
  }
}
```

---

### 3. Webhook Handler
**Endpoint**: `POST /api/webhooks/cashfree`

**Headers**:
```
x-webhook-signature: <signature>
Content-Type: application/json
```

**Webhook Payload** (PAYMENT_SUCCESS_WEBHOOK):
```json
{
  "type": "PAYMENT_SUCCESS_WEBHOOK",
  "data": {
    "payment": {
      "cf_payment_id": "payment_xyz789",
      "order_id": "ORDER_abc123",
      "order_amount": 3000,
      "payment_status": "SUCCESS",
      "payment_message": "Transaction successful",
      "payment_time": "2025-01-15T10:30:00Z",
      "payment_method": "UPI",
      "payment_gateway": "razorpay"
    },
    "order": {
      "order_id": "ORDER_abc123",
      "order_amount": 3000,
      "order_currency": "INR"
    }
  }
}
```

---

## 🔐 Webhook Signature Verification

Cashfree sends a signature in the `x-webhook-signature` header. The webhook handler automatically verifies this signature:

```typescript
const signature = request.headers.get('x-webhook-signature')
const expectedSignature = crypto
  .createHmac('sha256', process.env.CASHFREE_SECRET_KEY!)
  .update(body)
  .digest('base64')
```

---

## 🎨 Frontend Integration

### Load Cashfree SDK
```html
<script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
```

### Initialize Payment
```javascript
const cashfree = new Cashfree({
  mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || "sandbox"
})

const checkoutOptions = {
  paymentSessionId: paymentSessionId,
  redirectTarget: "_self"
}

cashfree.checkout(checkoutOptions)
```

---

## 🧪 Testing

### Test Cards (Sandbox Mode)

**Success Card**:
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failure Card**:
- Card Number: `4111 1111 1111 1112`
- CVV: Any 3 digits
- Expiry: Any future date

**UPI**:
- `success@payments` - Success
- `failure@payments` - Failure

---

## 📊 Database Schema

No changes needed! Your existing `payments` table supports Cashfree:

```sql
payments (
  id uuid PRIMARY KEY,
  registration_id uuid REFERENCES registrations(id),
  provider text,  -- Will be 'cashfree'
  provider_order_id text,  -- Cashfree order ID
  provider_payment_id text,  -- Cashfree payment ID
  amount_cents integer,
  currency text,
  status text,  -- 'initiated', 'succeeded', 'failed'
  raw_event jsonb,  -- Full webhook payload
  created_at timestamptz,
  updated_at timestamptz
)
```

---

## 🔄 Payment Flow

```
1. User fills registration form
   ↓
2. POST /api/payments/create-order
   - Creates registration in database
   - Creates Cashfree order
   - Returns payment session ID
   ↓
3. Frontend loads Cashfree checkout
   - User completes payment
   ↓
4. Cashfree sends webhook to /api/webhooks/cashfree
   - Verifies signature
   - Updates payment status
   - Updates registration status
   - Decrements event seats
   - Sends confirmation emails
   ↓
5. User redirected to success page
   ↓
6. Optional: POST /api/payments/verify
   - Double-checks payment status
```

---

## ⚙️ Environment Variables

Add these to your `.env.local`:

```bash
# Cashfree Credentials
CASHFREE_APP_ID=your_app_id_here
CASHFREE_SECRET_KEY=your_secret_key_here
CASHFREE_ENVIRONMENT=sandbox  # or 'production'

# Public URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox  # or 'production'
```

---

## 📝 Setup Checklist

### 1. Cashfree Account Setup
- [ ] Sign up at https://www.cashfree.com/
- [ ] Complete KYC verification
- [ ] Get App ID and Secret Key from Dashboard

### 2. Environment Configuration
- [ ] Add CASHFREE_APP_ID to .env.local
- [ ] Add CASHFREE_SECRET_KEY to .env.local
- [ ] Set CASHFREE_ENVIRONMENT to 'sandbox'
- [ ] Set NEXT_PUBLIC_CASHFREE_ENVIRONMENT to 'sandbox'

### 3. Webhook Configuration
- [ ] Go to Cashfree Dashboard → Developers → Webhooks
- [ ] Add webhook URL: `https://yourdomain.com/api/webhooks/cashfree`
- [ ] Subscribe to events: PAYMENT_SUCCESS_WEBHOOK, PAYMENT_FAILED_WEBHOOK, ORDER_PAID
- [ ] Save and test webhook

### 4. Testing
- [ ] Test payment flow in sandbox
- [ ] Verify webhook delivery
- [ ] Check database updates
- [ ] Test email confirmations

### 5. Production
- [ ] Update CASHFREE_ENVIRONMENT to 'production'
- [ ] Update NEXT_PUBLIC_CASHFREE_ENVIRONMENT to 'production'
- [ ] Update NEXT_PUBLIC_BASE_URL to production domain
- [ ] Update webhook URL to production domain
- [ ] Test in production mode

---

## 🆚 Cashfree vs Razorpay

| Feature | Razorpay | Cashfree |
|---------|----------|----------|
| Order Creation | `razorpay.orders.create()` | `cashfree.createOrder()` |
| Payment ID | `razorpay_payment_id` | `cf_payment_id` |
| Order ID | `razorpay_order_id` | `cf_order_id` |
| Signature | `X-Razorpay-Signature` | `x-webhook-signature` |
| SDK Script | `checkout.razorpay.com/v1/checkout.js` | `sdk.cashfree.com/js/v3/cashfree.js` |
| Provider Name | `'razorpay'` | `'cashfree'` |

---

## 📞 Support

- **Cashfree Documentation**: https://docs.cashfree.com/
- **Cashfree Support**: support@cashfree.com
- **API Reference**: https://docs.cashfree.com/docs

---

## 🎯 Next Steps

1. ✅ Review this document
2. ✅ Get Cashfree credentials
3. ✅ Update environment variables
4. ✅ Configure webhooks in Cashfree dashboard
5. ✅ Test payment flow in sandbox
6. ✅ Switch to production mode
7. ✅ Monitor webhook deliveries

---

## 🔒 Security Notes

1. **Never expose** your Secret Key in frontend code
2. **Always verify** webhook signatures
3. **Use HTTPS** for webhook URLs in production
4. **Implement idempotency** to handle duplicate webhooks
5. **Log all webhook events** for debugging
6. **Monitor failed payments** and implement retry logic

---

## 📚 Additional Resources

- [Cashfree API Documentation](https://docs.cashfree.com/)
- [Cashfree Webhook Guide](https://docs.cashfree.com/docs/webhooks)
- [Cashfree Test Cards](https://docs.cashfree.com/docs/test-cards)
- [Cashfree Dashboard](https://merchant.cashfree.com/)

