import React from 'react'

export default function AfterLogin() {
  return (
    <div style={{
      textAlign: 'center',
      marginTop: 28,
      paddingTop: 20,
      borderTop: '1px solid #F0F0F0',
    }}>
      <p style={{
        fontSize: 11,
        color: '#9CA3AF',
        margin: 0,
        letterSpacing: 0.3,
      }}>
        Powered by{' '}
        <span style={{
          fontWeight: 600,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 0.5,
        }}>
          Antigravity
        </span>
      </p>
    </div>
  )
}
