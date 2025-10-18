import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Webhook test received:', JSON.stringify(body, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook endpoint is working',
      received_data: body
    })
  } catch (error) {
    console.error('Webhook test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Cashfree webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
