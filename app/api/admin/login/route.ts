import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = loginSchema.parse(body)
    
    // Verify admin credentials
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD
    
    if (!adminUsername || !adminPassword) {
      return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 })
    }
    
    // Constant-time comparison to prevent timing attacks
    const usernameMatch = crypto.timingSafeEqual(
      Buffer.from(username),
      Buffer.from(adminUsername)
    )
    
    const passwordMatch = crypto.timingSafeEqual(
      Buffer.from(password),
      Buffer.from(adminPassword)
    )
    
    if (!usernameMatch || !passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        role: 'admin',
        username: adminUsername,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )
    
    return NextResponse.json({ 
      token,
      expiresIn: 3600 // 1 hour in seconds
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
