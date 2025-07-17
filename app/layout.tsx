import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BookStore & Bakery - Books and Fresh Pastries",
  description:
    "Discover our curated collection of hardcopy books and freshly baked pastries. Perfect for book lovers and food enthusiasts.",
  keywords: "books, pastries, bakery, bookstore, hardcopy books, fresh pastries",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
