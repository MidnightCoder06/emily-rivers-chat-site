import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const getSecretKey = () => {
  const secret = process.env.SESSION_SECRET || 'default-secret-key-change-me-in-production'
  return new TextEncoder().encode(secret)
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('emily_session')?.value

    if (!token) {
      return NextResponse.json({ valid: false, reason: 'no_token' })
    }

    // Verify the JWT
    const { payload } = await jwtVerify(token, getSecretKey())

    if (!payload.paid) {
      return NextResponse.json({ valid: false, reason: 'not_paid' })
    }

    // Check if session is still valid (within 24 hours)
    const createdAt = payload.createdAt as number
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000

    if (now - createdAt > twentyFourHours) {
      return NextResponse.json({ valid: false, reason: 'expired' })
    }

    return NextResponse.json({ 
      valid: true, 
      sessionId: payload.sessionId,
      expiresIn: twentyFourHours - (now - createdAt)
    })

  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json({ valid: false, reason: 'invalid_token' })
  }
}

