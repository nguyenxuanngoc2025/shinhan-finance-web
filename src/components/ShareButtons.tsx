'use client'

import { useEffect, useState } from 'react'

export default function ShareButtons({ title, text }: { title: string, text: string }) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const handleShare = (network: string) => {
    if (!url) return
    
    let shareUrl = ''
    switch (network) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`
        break
      case 'zalo':
        shareUrl = `https://zalo.me/share?url=${encodeURIComponent(url)}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Đã sao chép liên kết!')
        return
    }

    if (shareUrl) {
      // 500x500 popup
      window.open(shareUrl, 'share-window', 'width=500,height=500')
    }
  }

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '30px 0' }}>
      <span style={{ fontWeight: 600, fontSize: '15px' }}>Chia sẻ:</span>
      <button
        onClick={() => handleShare('facebook')}
        style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1877f2', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Chia sẻ lên Facebook"
      >
        <i className="fab fa-facebook-f"></i>
      </button>
      <button
        onClick={() => handleShare('zalo')}
        style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0068ff', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Chia sẻ lên Zalo"
      >
        <strong style={{ fontSize: '11px', lineHeight: 1 }}>Zalo</strong>
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#007bb5', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Chia sẻ lên LinkedIn"
      >
        <i className="fab fa-linkedin-in"></i>
      </button>
      <button
        onClick={() => handleShare('copy')}
        style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e5e7eb', color: '#374151', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Copy Link"
      >
        <i className="far fa-copy"></i>
      </button>
    </div>
  )
}
