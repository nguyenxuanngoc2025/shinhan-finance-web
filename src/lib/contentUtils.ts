/**
 * Content utilities for Shinhan Web CMS
 * Handles content format normalization and sanitization
 */

/**
 * Sanitize HTML content:
 * - Strip full HTML document wrappers (<!DOCTYPE>, <html>, <head>, <body>)
 * - Only keep the actual body content
 */
export function sanitizeHtmlContent(html: string): string {
  if (!html) return ''

  let result = html.trim()

  // Detect full HTML document and extract body content
  if (result.includes('<!DOCTYPE') || result.includes('<html') || result.match(/<html\s/i)) {
    // Try to extract <body> content first
    const bodyMatch = result.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch && bodyMatch[1]) {
      result = bodyMatch[1].trim()
    } else {
      // No explicit <body> tag — strip head section
      result = result
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<html[^>]*>/gi, '')
        .replace(/<\/html>/gi, '')
        .replace(/<head>[\s\S]*?<\/head>/gi, '')
        .replace(/<body[^>]*>/gi, '')
        .replace(/<\/body>/gi, '')
        .trim()
    }
  }

  return result
}

/**
 * Normalize content from any storage format to HTML string
 * Handles: raw HTML string, {html, type} object, old array format, JSONB string
 */
export function normalizeContentToHtml(content: any): string {
  if (!content) return ''

  // Already a plain string
  if (typeof content === 'string') {
    return sanitizeHtmlContent(content)
  }

  // Object format: {html: "...", type: "html"}
  if (typeof content === 'object' && !Array.isArray(content)) {
    const html = content.html || content.text || content.body || ''
    return sanitizeHtmlContent(html)
  }

  // Old array format
  if (Array.isArray(content)) {
    const combined = content.map((c: any) => c.text || c.html || '').join('\n')
    return sanitizeHtmlContent(combined)
  }

  return ''
}

/**
 * Wrap content HTML string into the standard storage format
 * Always returns {html: "...", type: "html"}
 */
export function wrapContentForStorage(htmlString: string): { html: string; type: string } {
  return {
    html: sanitizeHtmlContent(htmlString),
    type: 'html',
  }
}

/**
 * Extract the first image src attribute from an HTML string
 * Used as a fallback for cover_image
 */
export function extractFirstImage(html: string): string | null {
  if (!html) return null
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return imgMatch ? imgMatch[1] : null
}
