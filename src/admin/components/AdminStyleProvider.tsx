'use client'
import React, { useEffect } from 'react'

const customCSS = `
/* ===== LOGIN PAGE ===== */
[class*="login__"] {
  min-height: 100vh !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: linear-gradient(135deg, #0056A6 0%, #0078D4 40%, #00A3E0 100%) !important;
  position: relative;
  overflow: hidden;
}

[class*="login__"]::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  top: -200px;
  right: -150px;
  pointer-events: none;
}

[class*="login__"]::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  bottom: -100px;
  left: -100px;
  pointer-events: none;
}

/* Login form card */
[class*="login__"] [class*="template-default"],
[class*="login__"] form {
  position: relative;
  z-index: 1;
}

[class*="login__"] [class*="template-default"] {
  background: rgba(255, 255, 255, 0.97) !important;
  backdrop-filter: blur(20px) !important;
  border-radius: 20px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
  padding: 48px 40px !important;
  max-width: 440px !important;
  width: 100% !important;
  margin: 24px !important;
  animation: adminSlideUp 0.5s ease-out;
}

@keyframes adminSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Form inputs */
[class*="login__"] input {
  border-radius: 10px !important;
  padding: 12px 16px !important;
  border: 1.5px solid #E5E7EB !important;
  font-size: 15px !important;
  transition: all 0.2s ease !important;
  background: #FAFBFC !important;
}

[class*="login__"] input:focus {
  border-color: #0078D4 !important;
  box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.12) !important;
  background: #fff !important;
}

/* Login button */
[class*="login__"] button[type="submit"],
[class*="login__"] [class*="btn"] {
  background: linear-gradient(135deg, #0078D4, #0056A6) !important;
  border: none !important;
  border-radius: 10px !important;
  padding: 13px 24px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  color: #fff !important;
}

[class*="login__"] button[type="submit"]:hover {
  background: linear-gradient(135deg, #0056A6, #003B73) !important;
  box-shadow: 0 4px 15px rgba(0, 120, 212, 0.4) !important;
  transform: translateY(-1px) !important;
}

/* Login heading */
[class*="login__"] h1 {
  font-size: 22px !important;
  font-weight: 700 !important;
  color: #1A1A2E !important;
  text-align: center !important;
}

[class*="login__"] a {
  color: #0078D4 !important;
  font-size: 13px !important;
}
`

export default function AdminStyleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const id = 'shinhan-admin-css'
    if (!document.getElementById(id)) {
      const style = document.createElement('style')
      style.id = id
      style.textContent = customCSS
      document.head.appendChild(style)
    }
    return () => {
      const el = document.getElementById(id)
      if (el) el.remove()
    }
  }, [])

  return <>{children}</>
}
