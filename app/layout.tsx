import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Don\'t Get Ripped Off. Check Any Car for $4.99',
  description: 'Check if a car is overpriced in 30 seconds. Get instant market value analysis for any vehicle - just $4.99.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          defer
          data-website-id="dfid_04UESePjjCa1LZW0Y9xPD"
          data-domain="caroverpay.com"
          src="https://datafa.st/js/script.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  )
}

