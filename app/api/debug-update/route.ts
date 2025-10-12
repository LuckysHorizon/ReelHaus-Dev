import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().or(z.literal('')),
  cover_image_url: z.string().optional().or(z.literal('')),
  start_datetime: z.string().optional().or(z.literal('')),
  end_datetime: z.string().optional().or(z.literal('')),
  seats_total: z.coerce.number().min(0, 'Seats must be 0 or greater'),
  seats_available: z.coerce.number().min(0, 'Available seats must be 0 or greater'),
  price_cents: z.coerce.number().min(0, 'Price must be 0 or greater'),
  currency: z.string().default('INR'),
  is_active: z.coerce.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Debug Update - Received data:', JSON.stringify(body, null, 2))
    console.log('Debug Update - Data types:', Object.entries(body).map(([key, value]) => `${key}: ${typeof value} (${value})`))
    
    const validatedData = eventSchema.parse(body)
    console.log('Debug Update - Validation passed:', JSON.stringify(validatedData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Update validation passed',
      originalData: body,
      validatedData: validatedData
    })
  } catch (error) {
    console.error('Debug Update - Validation error:', error)
    
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        received: err.received,
        expected: err.expected
      }))
      
      return NextResponse.json({ 
        success: false,
        error: 'Update validation failed',
        details: errorMessages,
        rawErrors: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Unknown error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
