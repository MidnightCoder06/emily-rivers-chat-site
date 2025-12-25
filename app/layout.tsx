import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Emily Rivers | Chat With Me ✨',
  description: 'Have a fun, flirty conversation with Emily Rivers. Your favorite virtual companion is just a click away! 💕',
  keywords: ['Emily Rivers', 'AI chat', 'virtual companion', 'chat'],
  openGraph: {
    title: 'Emily Rivers | Chat With Me ✨',
    description: 'Have a fun, flirty conversation with Emily Rivers. Your favorite virtual companion is just a click away! 💕',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

