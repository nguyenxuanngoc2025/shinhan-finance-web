'use client'
import { useState, useEffect } from 'react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/cms/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        // Get redirect URL from query params or default to /admin
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get('redirect') || '/admin'
        window.location.replace(redirect)
      } else {
        setError(data.error || 'Email hoặc mật khẩu không đúng')
      }
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex;
          background: #071428;
          position: relative;
          overflow: hidden;
        }

        /* Left panel — branding */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          background: linear-gradient(145deg, #0056A6 0%, #0078D4 50%, #00A3E0 100%);
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          top: -150px; right: -150px;
        }
        .login-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          bottom: -80px; left: -80px;
        }

        .login-brand {
          position: relative; z-index: 1;
        }
        .login-brand img {
          height: 44px;
          width: auto;
          filter: brightness(0) invert(1);
        }
        .login-brand-name {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-top: 8px;
          letter-spacing: -0.3px;
        }

        .login-quote {
          position: relative; z-index: 1;
        }
        .login-quote blockquote {
          font-size: 22px;
          font-weight: 400;
          color: rgba(255,255,255,0.92);
          line-height: 1.6;
          margin-bottom: 16px;
          letter-spacing: -0.2px;
        }
        .login-quote cite {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          font-style: normal;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .login-quote cite::before {
          content: '';
          display: inline-block;
          width: 20px; height: 1px;
          background: rgba(255,255,255,0.4);
        }

        /* Right panel — form */
        .login-right {
          width: 480px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 56px;
          background: #071428;
          position: relative;
        }
        /* Subtle top accent line */
        .login-right::before {
          content: '';
          position: absolute;
          top: 0; left: 56px; right: 56px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,120,212,0.4), transparent);
        }
        /* Ambient glow from left */
        .login-right::after {
          content: '';
          position: absolute;
          left: -120px; top: 50%;
          transform: translateY(-50%);
          width: 240px; height: 400px;
          background: radial-gradient(ellipse, rgba(0,120,212,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-header { margin-bottom: 40px; }
        .login-header h1 {
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .login-header p {
          font-size: 14px;
          color: rgba(150, 185, 220, 0.7);
          line-height: 1.5;
        }

        .login-form { display: flex; flex-direction: column; gap: 20px; }

        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: rgba(150,190,230,0.8);
          letter-spacing: 0.2px;
        }
        .form-group input {
          background: rgba(0, 60, 120, 0.15);
          border: 1px solid rgba(0, 100, 180, 0.2);
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 15px;
          color: #e8f0fe;
          width: 100%;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .form-group input::placeholder { color: rgba(150,180,220,0.4); }
        .form-group input:focus {
          border-color: rgba(0,163,224,0.6);
          box-shadow: 0 0 0 3px rgba(0,120,212,0.12);
          background: rgba(0, 80, 150, 0.2);
        }

        .login-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 13px;
          color: #f87171;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          background: #0078D4;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          letter-spacing: -0.1px;
          margin-top: 4px;
          position: relative;
          overflow: hidden;
        }
        .login-btn:hover:not(:disabled) {
          background: #006cc0;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,120,212,0.35);
        }
        .login-btn:active { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-btn-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid rgba(0,100,180,0.15);
          text-align: center;
          font-size: 12px;
          color: rgba(100,150,200,0.5);
        }
        .login-footer span {
          background: linear-gradient(135deg, #60a5fa, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
        }

        /* Divider dots decoration */
        .login-dots {
          display: flex;
          gap: 6px;
          margin-bottom: 32px;
        }
        .login-dots span {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #0078D4;
          opacity: 0.4;
        }
        .login-dots span:first-child { opacity: 1; }
        .login-dots span:nth-child(2) { opacity: 0.7; }

        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right {
            width: 100%;
            padding: 40px 28px;
          }
        }
      `}</style>

      <div className="login-root">
        {/* Left — Branding */}
        <div className="login-left">
          <div className="login-brand">
            <img src="/images/logo/SVFC_LOGO.png" alt="Shinhan Finance" />
            <p className="login-brand-name">Admin Center</p>
          </div>
          <div className="login-quote">
            <blockquote>
              &ldquo;Nền tảng quản trị thông minh giúp bạn kiểm soát toàn bộ nội dung website một cách dễ dàng.&rdquo;
            </blockquote>
            <cite>Shinhan Finance Vietnam</cite>
          </div>
        </div>

        {/* Right — Form */}
        <div className="login-right">
          <div className="login-header">
            <div className="login-dots">
              <span /><span /><span />
            </div>
            <h1>Đăng nhập</h1>
            <p>Chào mừng trở lại. Nhập thông tin để tiếp tục quản trị.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="admin@shinhan.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="login-error">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path stroke="#f87171" strokeWidth="2" strokeLinecap="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading && <span className="login-btn-spinner" />}
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập →'}
            </button>
          </form>

          <div className="login-footer">
            Powered by <span>NexOn</span>
          </div>
        </div>
      </div>
    </>
  )
}
