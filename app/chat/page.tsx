'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [sessionValid, setSessionValid] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('/api/verify-session')
        const data = await response.json()
        
        if (data.valid) {
          setSessionValid(true)
          // Add welcome message
          setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: "Hey you! 💕 So glad you're here! I'm Emily, and I've been waiting to chat with someone as amazing as you. What's on your mind today? 😘",
            timestamp: new Date()
          }])
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Session verification failed:', error)
        router.push('/')
      } finally {
        setIsVerifying(false)
      }
    }

    verifySession()
  }, [router])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    if (sessionValid && !isLoading) {
      inputRef.current?.focus()
    }
  }, [sessionValid, isLoading])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops! Something went wrong on my end, babe! 😅 Can you try saying that again?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-5xl"
        >
          💕
        </motion.div>
      </div>
    )
  }

  if (!sessionValid) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-dark sticky top-0 z-50 px-4 py-3"
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/emily-chat-photo.png" alt="Emily Rivers" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-white font-display font-semibold">Emily Rivers</h1>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-emily-pink-200/60 text-xs">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-emily-pink-200/60 hover:text-emily-pink-200 transition-colors text-sm"
          >
            End Chat
          </button>
        </div>
      </motion.header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img src="/emily-chat-photo.png" alt="Emily Rivers" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 ${
                      message.role === 'user'
                        ? 'chat-bubble-user text-white'
                        : 'chat-bubble-emily text-emily-pink-50'
                    }`}
                  >
                    <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/40' : 'text-emily-pink-200/40'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-end gap-2"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img src="/emily-chat-photo.png" alt="Emily Rivers" className="w-full h-full object-cover" />
                </div>
                <div className="chat-bubble-emily">
                  <div className="typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-dark sticky bottom-0 px-4 py-4"
      >
        <form onSubmit={sendMessage} className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-emily-pink-400 focus:ring-2 focus:ring-emily-pink-400/20 transition-all disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-emily-pink-500 to-emily-coral-500 flex items-center justify-center text-white shadow-lg shadow-emily-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </div>
          <p className="text-center text-emily-pink-200/40 text-xs mt-2">
            Messages are not saved after this session 🔒
          </p>
        </form>
      </motion.div>
    </div>
  )
}

