import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface JWTPayload {
  role: string
  username: string
  iat: number
  exp: number
}

export function verifyAdminToken(request: NextRequest): JWTPayload | null {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    
    if (payload.role !== 'admin') {
      return null
    }
    
    return payload
  } catch (error) {
    return null
  }
}

export function withAdminAuth(handler: (request: NextRequest, admin: JWTPayload) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const admin = verifyAdminToken(request)
    
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return handler(request, admin)
  }
}

// For client-side authentication
export function getAdminToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token')
  }
  return null
}

export function setAdminToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token)
  }
}

export function removeAdminToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token')
  }
}
