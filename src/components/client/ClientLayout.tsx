'use client'

import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface ClientLayoutProps {
  children: ReactNode
  className?: string
}

export default function ClientLayout({ children, className = '' }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className={`pt-16 lg:pt-20 ${className}`}>
        {children}
      </main>
      
      <Footer />
    </div>
  )
}
