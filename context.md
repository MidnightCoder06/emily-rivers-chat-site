# Emily Rivers Chat - Project Context

## Overview
This is a pay-per-session AI chat website for the "Emily Rivers" virtual influencer persona. Users pay $5 via Stripe to access a chat session with Emily, powered by Grok AI.

## Architecture

### Frontend
- **Landing Page** (`app/page.tsx`): Beautiful animated landing with glass morphism, featuring Emily's persona and a CTA to start chatting
- **Chat Page** (`app/chat/page.tsx`): Real-time chat interface with typing indicators, message animations, and session management

### Backend API Routes
- **`/api/create-checkout`**: Creates a Stripe Checkout session for $5 payment
- **`/api/checkout-success`**: Handles successful payment, creates JWT session token
- **`/api/verify-session`**: Validates user's session token before allowing chat access
- **`/api/chat`**: Handles chat messages, includes content moderation and Grok AI integration

### Security
- JWT-based session tokens (24-hour expiry)
- OpenAI Moderation API for content filtering
- No conversation history stored server-side
- Secure, httpOnly cookies for session management

## Emily Rivers Persona

Emily Rivers is portrayed as:
- Fun, flirty, and charismatic virtual companion
- Confident and sassy with witty comebacks
- Warm and supportive, making everyone feel special
- Instagram influencer aesthetic
- PG-13 flirty but redirects explicit content with humor

## Key Files

```
app/
├── page.tsx              # Landing page
├── chat/
│   └── page.tsx          # Chat interface
├── api/
│   ├── chat/route.ts     # AI chat endpoint
│   ├── create-checkout/route.ts
│   ├── checkout-success/route.ts
│   └── verify-session/route.ts
├── layout.tsx            # Root layout
└── globals.css           # Global styles

tailwind.config.ts        # Custom theme (emily-pink, emily-coral, emily-gold)
```

## Environment Variables Required

- `XAI_API_KEY`: Grok AI API key
- `OPENAI_API_KEY`: For moderation
- `STRIPE_SECRET_KEY`: Stripe payment processing
- `SESSION_SECRET`: JWT signing key
- `NEXT_PUBLIC_BASE_URL`: Production URL

## Design System

### Colors
- Emily Pink: #f472b6 (primary)
- Emily Coral: #fb7185 (accent)
- Emily Gold: #fbbf24 (highlight)
- Dark Background: #1f1f2e

### Typography
- Display: Playfair Display (headings)
- Body: Quicksand (text)

### Effects
- Glass morphism cards
- Animated gradient blobs
- Floating sparkle particles
- Typing indicator animation
- Smooth message transitions

