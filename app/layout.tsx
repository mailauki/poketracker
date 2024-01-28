import { GeistSans } from "geist/font/sans"
import "./globals.css"
import React from "react"
import Nav from "@/components/Nav"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
		template: '%s | PokéTracker',
		default: 'PokéTracker'
	},
  description: 'Pokedex tracker using PokeApi and NextJs',
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
