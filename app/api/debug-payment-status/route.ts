import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const debugSchema = z.object({
  registration_id: z.string().uuid()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = debugSchema.parse(body)
    
    const { registration_id } = validatedData
    
    // Get current payment and registration status
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('registration_id', registration_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('id', registration_id)
      .single()
    
    return NextResponse.json({
      success: true,
      payment: payment || null,
      registration: registration || null,
      paymentError: paymentError ? String(paymentError) : null,
      regError: regError ? String(regError) : null
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
      error: 'Failed to debug payment status',
      details: String(error)
    }, { status: 500 })
  }
}
