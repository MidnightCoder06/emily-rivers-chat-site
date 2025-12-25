import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { SignJWT } from 'jose'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

const getSecretKey = () => {
  const secret = process.env.SESSION_SECRET || 'default-secret-key-change-me-in-production'
  return new TextEncoder().encode(secret)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.redirect(new URL('/?error=missing_session', request.url))
    }

    // Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(new URL('/?error=payment_not_complete', request.url))
    }

    // Create a JWT session token
    const token = await new SignJWT({
      sessionId: sessionId,
      paid: true,
      createdAt: Date.now(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h') // Session expires in 24 hours
      .sign(getSecretKey())

    // Redirect to chat page with session cookie
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = NextResponse.redirect(new URL('/chat', baseUrl))
    
    // Set the session cookie
    response.cookies.set('emily_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Checkout success error:', error)
    return NextResponse.redirect(new URL('/?error=verification_failed', request.url))
  }
}

