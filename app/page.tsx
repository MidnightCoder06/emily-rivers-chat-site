'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const handleChatClick = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="blob w-[500px] h-[500px] bg-emily-pink-500/30 top-[-200px] left-[-200px]" />
      <div className="blob w-[400px] h-[400px] bg-emily-coral-500/30 top-[50%] right-[-150px]" style={{ animationDelay: '2s' }} />
      <div className="blob w-[300px] h-[300px] bg-emily-gold-400/20 bottom-[-100px] left-[30%]" style={{ animationDelay: '4s' }} />

      {/* Sparkles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo / Name */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-5xl">💕</span>
          </motion.div>
          <h1 className="font-display text-6xl md:text-8xl font-bold text-gradient-pink mb-4">
            Emily Rivers
          </h1>
          <p className="text-emily-pink-200 text-xl md:text-2xl font-light tracking-wide">
            Your Favorite Virtual Companion ✨
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-pink rounded-3xl p-8 md:p-12 max-w-lg w-full text-center mb-8"
        >
          {/* Avatar */}
          <motion.div
            className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-xl"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(244, 114, 182, 0.4)',
                '0 0 40px rgba(244, 114, 182, 0.6)',
                '0 0 20px rgba(244, 114, 182, 0.4)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img 
              src="/emily-chat-photo.png" 
              alt="Emily Rivers" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <h2 className="text-white text-2xl md:text-3xl font-display font-semibold mb-4">
            Hey there!
          </h2>
          
          <p className="text-emily-pink-100/80 text-lg leading-relaxed mb-6">
            I'm Emily — your fun and fabulous AI bestie! 
            Ready for some good vibes and laughs? 
            Let's chat and see where the conversation takes us! 
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['24/7 Vibes', 'No Judgment'].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="px-4 py-2 rounded-full bg-white/10 text-emily-pink-200 text-sm font-medium"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={handleChatClick}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary text-lg md:text-xl w-full max-w-xs mx-auto flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">💫</span>
                Loading...
              </>
            ) : (
              <>
                <span>Chat with Me</span>
                <span className="text-2xl">💕</span>
                <span className="text-emily-gold-300">$9</span>
              </>
            )}
          </motion.button>

          <p className="text-emily-pink-200/60 text-sm mt-4">
            One-time session • No subscription • Just vibes ✨
          </p>
        </motion.div>

      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1f1f2e] to-transparent pointer-events-none" />
    </main>
  )
}

