import React from 'react'

export default function BeforeLogin() {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: 24,
      padding: '0 20px',
    }}>
      <p style={{
        fontSize: 14,
        color: '#6B7280',
        margin: '0 0 8px',
        lineHeight: 1.5,
      }}>
        Hệ thống quản trị nội dung
      </p>
      <div style={{
        width: 48,
        height: 2,
        background: 'linear-gradient(90deg, #0078D4, #00A3E0)',
        margin: '0 auto',
        borderRadius: 1,
      }} />
    </div>
  )
}
