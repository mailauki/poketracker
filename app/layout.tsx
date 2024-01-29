import { GeistSans } from "geist/font/sans"
import "./globals.css"
import React from "react"
import Nav from "@/app/components/Nav"
import type { Metadata } from "next"
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ]
}

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
		template: '%s | PokéTracker',
		default: 'PokéTracker'
	},
  description: 'Pokédex tracker using PokeApi and NextJs',
	icons: {
		icon: [
      { url: '/icon.png' },
      { url: '/icon.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon-x2.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-x3.png', sizes: '512x512', type: 'image/png' }
    ],
		apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-dark.png', media: '(prefers-color-scheme: dark)' }
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      }
    ]
	}
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground min-h-screen min-w-screen flex flex-col">
        <Nav />
        <main className="w-full flex flex-col flex-auto items-center mt-4 mb-16">
          {children}
        </main>
      </body>
    </html>
  )
}
