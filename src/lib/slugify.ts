/**
 * Vietnamese-aware slug generator for SEO-friendly URLs.
 * Handles all Vietnamese diacritics, special chars, and edge cases.
 */
export function slugify(text: string): string {
  if (!text) return ''

  return text
    // Replace đ/Đ BEFORE any case conversion (đ doesn't decompose via NFD)
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    // NFD decompose: tách dấu ra khỏi ký tự gốc (ế → e + combining marks)
    .normalize('NFD')
    // Remove all combining diacritical marks (dấu)
    .replace(/[\u0300-\u036f]/g, '')
    // Replace any non-alphanumeric character(s) with a single hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
}

/**
 * Sanitize a manually-entered slug value.
 * Allows only lowercase alphanumeric and hyphens, strips invalid chars in real-time.
 */
export function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}
