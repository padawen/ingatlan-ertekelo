import type { Metadata } from 'next'
import React, { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ingatlanértékelő',
  description: 'Ingatlanigény felmérő és adminisztrációs felület',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="hu">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-raleway">{children}</body>
    </html>
  )
} 