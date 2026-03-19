'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type SiteSettings = {
  logo: string
  favicon: string
  site_name: string
  site_description: string
  contact_phone: string
  contact_email: string
  zalo_number: string
  facebook_url: string
  address: string
}

const DEFAULTS: SiteSettings = {
  logo: '/images/logo/SVFC_LOGO.png',
  favicon: '',
  site_name: 'Shinhan Finance',
  site_description: 'Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam',
  contact_phone: '0969 930 328',
  contact_email: 'cskh@shinhanfinance.com.vn',
  zalo_number: '0969930328',
  facebook_url: '',
  address: '',
}

const SiteSettingsContext = createContext<SiteSettings>(DEFAULTS)

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    // Try localStorage cache first to avoid logo flash
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('site_settings')
        if (cached) return { ...DEFAULTS, ...JSON.parse(cached) }
      } catch { /* ignore */ }
    }
    return DEFAULTS
  })

  useEffect(() => {
    fetch('/api/cms/settings?key=general')
      .then(r => r.json())
      .then(res => {
        if (res.data && typeof res.data === 'object') {
          setSettings(prev => ({ ...prev, ...res.data }))
          try { localStorage.setItem('site_settings', JSON.stringify(res.data)) } catch { /* ignore */ }
        }
      })
      .catch(() => {})
  }, [])

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
