'use client'

import { SiteSettingsProvider } from './SiteSettingsContext'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SiteSettingsProvider>
      {children}
    </SiteSettingsProvider>
  )
}
