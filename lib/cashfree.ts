/**
 * Cashfree Payment Gateway SDK Wrapper
 * 
 * This module provides a wrapper around Cashfree's payment APIs
 * for creating orders and managing payments.
 */

interface CreateOrderParams {
  orderId: string
  orderAmount: number
  orderCurrency: string
  orderNote: string
  customerDetails: {
    customerId: string
    customerName: string
    customerEmail: string
    customerPhone: string
  }
  orderMeta?: {
    returnUrl: string
    notifyUrl: string
    paymentMethods?: string
  }
}

interface CreateOrderResponse {
  cf_order_id: string
  payment_session_id: string
  order_token: string
  order_id: string
}

interface VerifyPaymentParams {
  orderId: string
  orderAmount: number
  orderCurrency: string
  referenceId: string
  txStatus: string
  paymentMode: string
  txMsg: string
  txTime: string
  signature: string
}

class CashfreeSDK {
  private appId: string
  private secretKey: string
  private environment: 'sandbox' | 'production'
  private baseURL: string

  constructor() {
    this.appId = process.env.CASHFREE_APP_ID || ''
    this.secretKey = process.env.CASHFREE_SECRET_KEY || ''
    const rawEnv = (process.env.CASHFREE_ENVIRONMENT || '').toLowerCase().trim()
    // Accept common aliases
    const normalizedEnv = rawEnv === 'production' || rawEnv === 'prod' ? 'production' : 'sandbox'
    this.environment = normalizedEnv
    
    // Set base URL based on environment
    // Cashfree PG endpoints live under /pg
    this.baseURL = this.environment === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg'

    // Basic validation to surface clear errors during build/runtime
    if (!this.appId || !this.secretKey) {
      console.error('[Cashfree] Missing credentials. Ensure CASHFREE_APP_ID and CASHFREE_SECRET_KEY are set.')
      throw new Error('Cashfree credentials are not configured')
    }

    console.log(`[Cashfree] Initialized with environment: ${this.environment}`)
    console.log(`[Cashfree] Base URL: ${this.baseURL}`)
  }

  /**
   * Create a payment order in Cashfree
   */
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    const url = `${this.baseURL}/orders`

    // Map to Cashfree's expected snake_case keys and validate required values
    const normalizedAmount = Number(Number(params.orderAmount).toFixed(2))
    const customerId = (params.customerDetails?.customerId || '').toString().trim()
    if (!customerId) {
      throw new Error('Cashfree createOrder: customer_details.customer_id is required')
    }

    const payload = {
      order_id: params.orderId,
      order_amount: normalizedAmount,
      order_currency: params.orderCurrency || 'INR',
      order_note: params.orderNote,
      customer_details: {
        customer_id: customerId,
        customer_name: params.customerDetails.customerName,
        customer_email: params.customerDetails.customerEmail,
        customer_phone: params.customerDetails.customerPhone,
      },
      order_meta: {
        return_url: params.orderMeta?.returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/events/payment/success`,
        notify_url: params.orderMeta?.notifyUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/cashfree`,
        // Allowed tokens: cc, dc, ppc, ccc, emi, paypal, upi, nb, app, paylater
        payment_methods: params.orderMeta?.paymentMethods || 'cc,dc,upi,nb,paylater'
      }
    }

    try {
      console.log(`[Cashfree] Creating order: ${url}`)
      console.log(`[Cashfree] Payload:`, JSON.stringify(payload, null, 2))
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-client-id': this.appId,
          'x-client-secret': this.secretKey,
          'x-api-version': '2023-08-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        let errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          errorText = errorData.message || errorText
        } catch {}
        throw new Error(`Cashfree API Error (${response.status}): ${errorText}`)
      }

      const data = await response.json()

      // Validate required fields instead of relying on a non-standard message property
      const cfOrderId = data?.cf_order_id
      const sessionId = data?.payment_session_id
      const orderToken = data?.order_token
      const orderIdResp = data?.order_id

      if (!cfOrderId || !sessionId) {
        // Include raw body for easier debugging
        throw new Error(`Cashfree createOrder invalid response: ${JSON.stringify(data)}`)
      }

      return {
        cf_order_id: cfOrderId,
        payment_session_id: sessionId,
        order_token: orderToken,
        order_id: orderIdResp
      }
    } catch (error) {
      console.error('Cashfree createOrder error:', error)
      throw error
    }
  }

  /**
   * Verify payment signature
   */
  verifyPaymentSignature(params: VerifyPaymentParams): boolean {
    const message = `${params.orderId}${params.orderAmount}${params.referenceId}${params.txStatus}${params.paymentMode}${params.txMsg}${params.txTime}`
    
    const crypto = require('crypto')
    const generatedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(message)
      .digest('base64')

    return generatedSignature === params.signature
  }

  /**
   * Get order details
   */
  async getOrderDetails(orderId: string) {
    const url = `${this.baseURL}/orders/${orderId}`
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-client-id': this.appId,
          'x-client-secret': this.secretKey,
          'x-api-version': '2023-08-01'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Cashfree getOrderDetails error:', error)
      throw error
    }
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(orderId: string) {
    const url = `${this.baseURL}/orders/${orderId}/payments`
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-client-id': this.appId,
          'x-client-secret': this.secretKey,
          'x-api-version': '2023-08-01'
        }
      })

      if (!response.ok) {
        // If payment details are not found, it might mean the payment is still processing
        if (response.status === 404) {
          console.log(`[Cashfree] Payment details not found for order ${orderId} - payment may still be processing`)
          return null
        }
        throw new Error(`Failed to fetch payment details: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Cashfree getPaymentDetails error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const cashfree = new CashfreeSDK()

// Export types
export type { CreateOrderParams, CreateOrderResponse, VerifyPaymentParams }

