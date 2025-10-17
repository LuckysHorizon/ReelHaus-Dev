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
    this.appId = process.env.CASHFREE_APP_ID!
    this.secretKey = process.env.CASHFREE_SECRET_KEY!
    this.environment = (process.env.CASHFREE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
    
    // Set base URL based on environment
    this.baseURL = this.environment === 'production' 
      ? 'https://api.cashfree.com' 
      : 'https://sandbox.cashfree.com'
  }

  /**
   * Create a payment order in Cashfree
   */
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    const url = `${this.baseURL}/pg/orders`
    
    const payload = {
      order_id: params.orderId,
      order_amount: params.orderAmount,
      order_currency: params.orderCurrency,
      order_note: params.orderNote,
      customer_details: params.customerDetails,
      order_meta: {
        return_url: params.orderMeta?.returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/events/payment/success`,
        notify_url: params.orderMeta?.notifyUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/cashfree`,
        payment_methods: params.orderMeta?.paymentMethods || 'cc,dc,upi,wallet,netbanking,paylater'
      }
    }

    try {
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
        const errorData = await response.json()
        throw new Error(`Cashfree API Error: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      
      if (data.message !== 'OK') {
        throw new Error(`Cashfree Error: ${data.message}`)
      }

      return {
        cf_order_id: data.cf_order_id,
        payment_session_id: data.payment_session_id,
        order_token: data.order_token,
        order_id: data.order_id
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
    const url = `${this.baseURL}/pg/orders/${orderId}`
    
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
    const url = `${this.baseURL}/pg/orders/${orderId}/payments`
    
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

