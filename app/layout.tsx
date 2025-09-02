import './globals.css'
import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toast'

export const metadata = {
  title: 'Stage-Gate Management',
  description: 'Stage-Gate management for projects with Entra ID and SharePoint'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
