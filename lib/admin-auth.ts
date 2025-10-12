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
