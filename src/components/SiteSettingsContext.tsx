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
  instagram_url: string
  youtube_url: string
  linkedin_url: string
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
  facebook_url: 'https://www.facebook.com/Nhanvientuvanshinhankbank',
  instagram_url: '',
  youtube_url: '',
  linkedin_url: '',
  address: '',
}

// Cache version: bump this to force-clear stale localStorage cache
const CACHE_VERSION = 'v8'
const CACHE_KEY = `site_settings_${CACHE_VERSION}`

const SiteSettingsContext = createContext<SiteSettings>(DEFAULTS)

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

function mergeSettings(base: SiteSettings, override: Partial<SiteSettings>): SiteSettings {
  const merged = { ...base }
  for (const key of Object.keys(base) as (keyof SiteSettings)[]) {
    const val = override[key]
    if (val !== undefined && val !== null && val !== '') {
      (merged as Record<string, string>)[key] = val as string
    }
  }
  return merged
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
          return mergeSettings(DEFAULTS, JSON.parse(cached) as Partial<SiteSettings>)
        }
      } catch { /* ignore */ }
    }
    return DEFAULTS
  })

  useEffect(() => {
    // Fetch with 5s timeout to prevent UI blocking on cold start
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    fetch('/api/cms/settings?key=general', { signal: controller.signal })
      .then(r => r.json())
      .then(res => {
        if (res.data && typeof res.data === 'object') {
          const merged = mergeSettings(DEFAULTS, res.data as Partial<SiteSettings>)
          setSettings(merged)
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(merged)) } catch { /* ignore */ }
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeoutId))
  }, [])

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
