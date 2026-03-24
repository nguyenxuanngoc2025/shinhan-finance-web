'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type SiteSettings = {
  logo: string
  footer_logo: string
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
  logo: '/images/logo/logo-header.svg',
  footer_logo: '/images/logo/logo-footer.svg',
  favicon: '',
  site_name: 'Shinhan Bank',
  site_description: 'Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam',
  contact_phone: '0969 930 328',
  contact_email: 'cskh@shinhanfinance.com.vn',
  zalo_number: '0969930328',
  facebook_url: '',
  address: '',
}

// Cache version: bump this to force-clear stale localStorage cache
const CACHE_VERSION = 'v5'
const CACHE_KEY = `site_settings_${CACHE_VERSION}`

const SiteSettingsContext = createContext<SiteSettings>(DEFAULTS)

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    // Try versioned localStorage cache first to avoid logo flash
    if (typeof window !== 'undefined') {
      // Clear old cache versions
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith('site_settings_') && k !== CACHE_KEY) {
          localStorage.removeItem(k)
        }
      }
      // Also clear old unversioned key
      localStorage.removeItem('site_settings')

      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached) as Partial<SiteSettings>
          const merged = { ...DEFAULTS }
          for (const key of Object.keys(DEFAULTS) as (keyof SiteSettings)[]) {
            const val = parsed[key]
            if (val !== undefined && val !== null && val !== '') {
              (merged as Record<string, string>)[key] = val as string
            }
          }
          return merged
        }
      } catch { /* ignore */ }
    }
    return DEFAULTS
  })

  useEffect(() => {
    fetch('/api/cms/settings?key=general')
      .then(r => r.json())
      .then(res => {
        if (res.data && typeof res.data === 'object') {
          // Only override non-empty values — keep DEFAULTS if API returns empty string
          const apiData = res.data as Partial<SiteSettings>
          const merged: SiteSettings = { ...DEFAULTS }
          for (const key of Object.keys(DEFAULTS) as (keyof SiteSettings)[]) {
            const val = apiData[key]
            if (val !== undefined && val !== null && val !== '') {
              (merged as Record<string, string>)[key] = val as string
            }
          }
          setSettings(merged)
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(merged)) } catch { /* ignore */ }
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
