import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const siteUrl = 'https://tuvanvienshinhan.com'
  
  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('title,slug,excerpt,cover_image,published_at,created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  const feedItems = (posts || []).map((post) => {
    const url = `${siteUrl}/tin-tuc/${post.slug}`
    const pubDate = new Date(post.published_at || post.created_at || new Date()).toUTCString()
    
    return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${post.excerpt || ''}]]></description>
        ${post.cover_image ? `<enclosure url="${post.cover_image.startsWith('/') ? siteUrl + post.cover_image : post.cover_image}" type="image/jpeg" />` : ''}
      </item>
    `
  }).join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Tin tức - Shinhan Bank</title>
        <link>${siteUrl}</link>
        <description>Cập nhật tin tức, khuyến mãi và khoản vay từ Shinhan Finance - Shinhan Bank</description>
        <language>vi-vn</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${siteUrl}/feed" rel="self" type="application/rss+xml"/>
        ${feedItems}
      </channel>
    </rss>`

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
