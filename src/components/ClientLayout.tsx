'use client'
import Header from './Header'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'
import { SiteSettingsProvider } from './SiteSettingsContext'

interface ClientLayoutProps {
  children: React.ReactNode
  showFloating?: boolean
}

export default function ClientLayout({ children, showFloating = true }: ClientLayoutProps) {
  return (
    <SiteSettingsProvider>
      <Header />
      {children}
      <Footer />
      {showFloating && <FloatingButtons />}
    </SiteSettingsProvider>
  )
}
