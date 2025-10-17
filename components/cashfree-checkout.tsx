"use client"

import { useEffect } from 'react'

declare global {
  interface Window {
    Cashfree: any
  }
}

interface CashfreeCheckoutProps {
  paymentSessionId: string
  onSuccess?: (response: any) => void
  onFailure?: (error: any) => void
  onDismiss?: () => void
}

/**
 * Cashfree Checkout Component
 * 
 * Loads and initializes Cashfree checkout modal
 */
export function CashfreeCheckout({ 
  paymentSessionId, 
  onSuccess, 
  onFailure, 
  onDismiss 
}: CashfreeCheckoutProps) {
  
  useEffect(() => {
    // Load Cashfree SDK
    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async = true
    
    script.onload = () => {
      if (window.Cashfree) {
        const cashfree = new window.Cashfree({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'sandbox'
        })
        
        const checkoutOptions = {
          paymentSessionId: paymentSessionId,
          redirectTarget: "_self"
        }
        
        cashfree.checkout(checkoutOptions)
          .then((response: any) => {
            if (onSuccess) {
              onSuccess(response)
            }
          })
          .catch((error: any) => {
            console.error('Cashfree checkout error:', error)
            if (onFailure) {
              onFailure(error)
            }
          })
      }
    }
    
    script.onerror = () => {
      console.error('Failed to load Cashfree SDK')
      if (onFailure) {
        onFailure({ message: 'Failed to load payment gateway' })
      }
    }
    
    document.body.appendChild(script)
    
    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [paymentSessionId, onSuccess, onFailure, onDismiss])
  
  return null
}

