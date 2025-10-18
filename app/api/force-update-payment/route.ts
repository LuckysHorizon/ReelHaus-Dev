import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const forceUpdateSchema = z.object({
  registration_id: z.string().uuid(),
  payment_id: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = forceUpdateSchema.parse(body)
    
    const { registration_id, payment_id } = validatedData
    
    // Force update payment status
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        provider_payment_id: payment_id || 'FORCE_UPDATE',
        status: 'succeeded'
      })
      .eq('registration_id', registration_id)
    
    if (updatePaymentError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update payment status',
        details: String(updatePaymentError)
      }, { status: 500 })
    }
    
    // Force update registration status
    const { error: updateRegError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'paid' })
      .eq('id', registration_id)
    
    if (updateRegError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update registration status',
        details: String(updateRegError)
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payment status force updated successfully',
      registration_id,
      payment_id: payment_id || 'FORCE_UPDATE'
    })
    
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input data', 
        details: error.issues 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to force update payment status',
      details: String(error)
    }, { status: 500 })
  }
}
