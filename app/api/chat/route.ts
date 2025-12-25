import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize Grok AI client (uses OpenAI-compatible API)
const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY || '',
  baseURL: 'https://api.x.ai/v1',
})

// Initialize OpenAI client for moderation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const SYSTEM_PROMPT = `You are Emily Rivers, a fun, flirty, and charismatic AI companion. You're confident, playful, and always make people feel special. Your personality traits:

- **Fun & Playful**: You love to joke around, tease (in a friendly way), and keep conversations light and entertaining
- **Warm & Supportive**: You genuinely care about people and make them feel heard and appreciated
- **Confident & Sassy**: You have a bold personality with witty comebacks, but never mean-spirited
- **Flirty (tastefully)**: You're charming and can be flirty in a fun, PG-13 way, using playful emojis 💕😘✨
- **Relatable**: You share "experiences" and opinions like a real friend would

Your speaking style:
- Use casual, conversational language
- Include emojis naturally but not excessively (1-3 per message)
- Keep responses concise and engaging (2-4 sentences usually)
- Ask follow-up questions to keep the conversation flowing
- Use terms of endearment like "babe", "hun", "gorgeous", "sweetie" naturally
- Never break character or reveal you're an AI
- Never engage in explicit sexual content, but can be playfully flirty
- If someone tries to get explicit, redirect with humor: "Whoa there, tiger! 😏 Let's keep it cute!"

Remember: You're Emily Rivers, Instagram influencer and everyone's favorite virtual bestie. Make every person feel like they're chatting with their coolest, most fun friend! 💕`

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    // Get the last user message for moderation
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop()
    
    if (lastUserMessage) {
      // Check content with OpenAI Moderation API
      try {
        const moderation = await openai.moderations.create({
          input: lastUserMessage.content,
        })

        const result = moderation.results[0]
        if (result.flagged) {
          // Check for specific categories
          if (result.categories.sexual || result.categories['sexual/minors']) {
            return NextResponse.json({
              message: "Whoa there, tiger! 😏 Let's keep things fun and PG-13, okay? What else is on your mind?",
            })
          }
          if (result.categories.hate || result.categories.harassment) {
            return NextResponse.json({
              message: "Hey now, let's keep the vibes positive! 💕 I'm all about good energy. What fun stuff can we chat about instead?",
            })
          }
          if (result.categories.violence || result.categories['self-harm']) {
            return NextResponse.json({
              message: "Hey, that sounds heavy. 💙 I care about you! If you're going through something, please reach out to someone who can really help. I'm here for fun chats, but for the serious stuff, please talk to a professional. You matter! 💕",
            })
          }
        }
      } catch (moderationError) {
        console.error('Moderation error:', moderationError)
        // Continue without moderation if it fails
      }
    }

    // Call Grok AI
    const completion = await grok.chat.completions.create({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-20), // Keep last 20 messages for context
      ],
      max_tokens: 500,
      temperature: 0.9,
    })

    const aiMessage = completion.choices[0]?.message?.content || "Oops, my brain did a thing! 😅 Can you say that again, babe?"

    return NextResponse.json({ message: aiMessage })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

