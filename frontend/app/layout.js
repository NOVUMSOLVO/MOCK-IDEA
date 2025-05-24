import './globals.css'
import { Providers } from '@/components/providers/Providers'

export const metadata = {
  title: 'MOCK IDEA - Professional Logo Mockup Generator',
  description: 'Create stunning logo mockups in seconds with MOCK IDEA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
