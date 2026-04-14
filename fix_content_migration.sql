-- =====================================================
-- SHINHAN WEB: Content Format Migration
-- Author: Antigravity Agent | Date: 2026-04-14
-- =====================================================

-- BUG #2: Convert 50 raw JSONB string content rows to {html, type} object
-- Before: content = "raw html string"  (jsonb type: string)
-- After:  content = {"html": "...", "type": "html"}  (jsonb type: object)
UPDATE site_shinhan.posts
SET
  content = jsonb_build_object(
    'html', content #>> '{}',
    'type', 'html'
  ),
  updated_at = NOW()
WHERE jsonb_typeof(content) = 'string';

DO $$ BEGIN
  RAISE NOTICE 'BUG #2 Fixed: % rows converted from string to {html,type} object',
    (SELECT COUNT(*) FROM site_shinhan.posts WHERE content->>'type' = 'html' AND jsonb_typeof(content) = 'object');
END $$;

-- BUG #1: Strip full HTML document wrappers from content
-- Posts where content.html starts with <!DOCTYPE or <html
-- Strategy: extract <body> content only
UPDATE site_shinhan.posts
SET
  content = jsonb_build_object(
    'html', CASE
      -- Has explicit <body> tag: extract its content
      WHEN content->>'html' ~* '<body[^>]*>([\s\S]*?)</body>' THEN
        regexp_replace(content->>'html', '[\s\S]*?<body[^>]*>([\s\S]*?)</body>[\s\S]*', '\1', 'i')
      -- No explicit <body> but has full doc tags: strip head + html wrapping
      ELSE
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(content->>'html', '<!DOCTYPE[^>]*>', '', 'gi'),
              '<html[^>]*>', '', 'gi'),
            '</html>', '', 'gi'),
          '<head>[\s\S]*?</head>', '', 'gi'),
        '</?body[^>]*>', '', 'gi')
    END,
    'type', 'html'
  ),
  updated_at = NOW()
WHERE
  jsonb_typeof(content) = 'object'
  AND (
    content->>'html' ILIKE '%<!DOCTYPE%'
    OR content->>'html' ILIKE '%<html%'
  );

DO $$ BEGIN
  RAISE NOTICE 'BUG #1 Fixed: Full HTML document wrappers stripped from content';
END $$;

-- BUG #3: Deduplicate posts - keep newest per (title, source), remove older ones
-- First, identify duplicates
WITH ranked AS (
  SELECT id, title, source, created_at,
    ROW_NUMBER() OVER (PARTITION BY title, source ORDER BY created_at DESC) as rn
  FROM site_shinhan.posts
  WHERE status IN ('scheduled', 'draft')
),
duplicates AS (
  SELECT id FROM ranked WHERE rn > 1
)
DELETE FROM site_shinhan.posts
WHERE id IN (SELECT id FROM duplicates);

DO $$ BEGIN
  RAISE NOTICE 'BUG #3 Fixed: Duplicate posts removed';
END $$;

-- VERIFY all fixes
SELECT
  COUNT(*) as total_posts,
  COUNT(*) FILTER (WHERE jsonb_typeof(content) = 'string') as still_string_format,
  COUNT(*) FILTER (WHERE content->>'html' ILIKE '%<!DOCTYPE%') as still_has_doctype,
  COUNT(*) FILTER (WHERE content->>'html' ILIKE '%<html%') as still_has_html_tag
FROM site_shinhan.posts;
