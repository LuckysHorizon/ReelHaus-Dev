import { NextRequest, NextResponse } from 'next/server'
import { cashfree } from '@/lib/cashfree'

export async function GET(request: NextRequest) {
  try {
    // Test Cashfree connection
    const testOrder = await cashfree.createOrder({
      orderId: `TEST_${Date.now()}`,
      orderAmount: 1, // 1 rupee test
      orderCurrency: 'INR',
      orderNote: 'Test order for connection verification',
      customerDetails: {
        customerId: 'test_customer',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '9999999999'
      },
      orderMeta: {
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/events/payment/success`,
        notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/cashfree`,
        paymentMethods: 'cc,dc,upi,nb,paylater'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cashfree connection successful',
      testOrder: {
        cf_order_id: testOrder.cf_order_id,
        payment_session_id: testOrder.payment_session_id
      }
    })

  } catch (error: any) {
    console.error('Cashfree test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
