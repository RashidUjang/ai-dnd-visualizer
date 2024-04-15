import './globals.css'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import type { Metadata } from 'next'
import { Forum, Inter } from 'next/font/google'

import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const anton = Forum({
  subsets: ['latin'],
  variable: '--font-anton',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'SeerStone',
  description: 'D&D Visualizer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`bg-stone-900 ${inter.variable} ${anton.variable}`}>
        <Header />
        <Theme>{children}</Theme>
      </body>
    </html>
  )
}
