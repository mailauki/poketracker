import { GeistSans } from "geist/font/sans"
import "./globals.css"
import React from "react"
import Nav from "@/components/Nav"
import { Metadata } from "next"

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
      { url: '/pokeball-light.png', },
      { url: '/pokeball-dark.png', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: '/favicon.ico',
		apple: [
      { url: '/pokeball-light.png', },
      { url: '/pokeball-dark.png', media: '(prefers-color-scheme: dark)' },
    ],
    other: {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    }
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
