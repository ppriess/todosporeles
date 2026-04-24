import type { Metadata, Viewport } from 'next'
import { Manrope, Public_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Todos Por Eles | Denúncias e Diretório de ONGs de SC',
  description: 'Todos Por Eles é uma ONG que conecta cidadãos, ONGs e autoridades para fortalecer a proteção animal em Santa Catarina. Faça denúncias com triagem responsável e encontre organizações de proteção em todo o estado.',
  keywords: ['Todos Por Eles', 'proteção animal', 'maus-tratos', 'denúncia', 'ONGs', 'Santa Catarina', 'animais'],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#004293',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${publicSans.variable} ${manrope.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
