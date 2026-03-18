-- =============================================
-- NexOn CMS Platform — Database Setup
-- Schema: nexon_core + site_shinhan
-- =============================================

-- 1. Tạo schemas
CREATE SCHEMA IF NOT EXISTS nexon_core;
CREATE SCHEMA IF NOT EXISTS site_shinhan;

-- 2. nexon_core tables
CREATE TABLE IF NOT EXISTS nexon_core.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  schema_name TEXT UNIQUE NOT NULL,
  domain TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nexon_core.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES nexon_core.projects(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['read'],
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. site_shinhan tables

-- Pages (trang tĩnh)
CREATE TABLE IF NOT EXISTS site_shinhan.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image TEXT,
  seo_score INT DEFAULT 0,
  seo_suggestions JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Posts (bài viết / tin tức)
CREATE TABLE IF NOT EXISTS site_shinhan.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content JSONB DEFAULT '[]'::jsonb,
  cover_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  seo_score INT DEFAULT 0,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products (sản phẩm vay)
CREATE TABLE IF NOT EXISTS site_shinhan.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content JSONB DEFAULT '{}'::jsonb,
  icon TEXT,
  interest_rate TEXT,
  loan_limit TEXT,
  loan_term TEXT,
  order_index INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leads (đơn đăng ký)
CREATE TABLE IF NOT EXISTS site_shinhan.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL DEFAULT 'loan',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  id_number TEXT,
  income TEXT,
  product_id UUID,
  loan_amount TEXT,
  card_type TEXT,
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  device TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sliders (banner carousel)
CREATE TABLE IF NOT EXISTS site_shinhan.sliders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image TEXT,
  cta_text TEXT,
  cta_link TEXT,
  order_index INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partners (đối tác)
CREATE TABLE IF NOT EXISTS site_shinhan.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  url TEXT,
  order_index INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Awards (giải thưởng)
CREATE TABLE IF NOT EXISTS site_shinhan.awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image TEXT,
  year INT,
  order_index INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials (đánh giá khách hàng)
CREATE TABLE IF NOT EXISTS site_shinhan.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar TEXT,
  content TEXT,
  rating INT DEFAULT 5,
  company TEXT,
  visible BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Media (thư viện hình ảnh)
CREATE TABLE IF NOT EXISTS site_shinhan.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  size INT,
  mime_type TEXT,
  width INT,
  height INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Calculators (công cụ tính toán)
CREATE TABLE IF NOT EXISTS site_shinhan.calculators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  params JSONB DEFAULT '{}'::jsonb,
  formula_type TEXT DEFAULT 'simple_interest',
  visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings (cài đặt)
CREATE TABLE IF NOT EXISTS site_shinhan.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB DEFAULT '{}'::jsonb,
  grp TEXT DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Homepage Blocks (bố cục trang chủ)
CREATE TABLE IF NOT EXISTS site_shinhan.homepage_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_type TEXT NOT NULL,
  template TEXT DEFAULT 'default',
  content JSONB DEFAULT '{}'::jsonb,
  layout JSONB DEFAULT '{}'::jsonb,
  order_index INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Seed data

-- Đăng ký project Shinhan
INSERT INTO nexon_core.projects (name, slug, schema_name, domain)
VALUES ('Shinhan Finance', 'shinhan', 'site_shinhan', 'shinhanfinance.com.vn')
ON CONFLICT (slug) DO NOTHING;

-- Seed calculators
INSERT INTO site_shinhan.calculators (slug, name, params, formula_type) VALUES
('interest_rate', 'Tính lãi suất', '{"min_rate": 1.49, "max_rate": 4.99, "rate_step": 0.5, "default_rate": 2.49}', 'simple_interest'),
('loan_payment', 'Tính khoản vay', '{"min_amount": 10000000, "max_amount": 500000000, "amount_step": 5000000, "terms": [6, 12, 18, 24, 36], "coefficient": 1.05}', 'flat_rate'),
('fees', 'Phí & Lệ phí', '{"prepayment_fee_pct": 3, "insurance_pct": 0.5, "appraisal_fee": 500000, "late_fee_pct": 0.1}', 'flat_rate')
ON CONFLICT (slug) DO NOTHING;

-- Seed site settings
INSERT INTO site_shinhan.site_settings (key, value, grp) VALUES
('site_name', '"Shinhan Finance"', 'general'),
('site_description', '"Công ty tài chính TNHH MTV Shinhan Việt Nam"', 'general'),
('logo', '"/images/logo/SVFC_LOGO.png"', 'general'),
('favicon', '"/favicon.ico"', 'general'),
('contact_phone', '"1900 636 080"', 'general'),
('contact_email', '"hotro@shinhanfinance.com.vn"', 'general'),
('primary_color', '"#0078D4"', 'colors'),
('secondary_color', '"#0056A6"', 'colors'),
('font_family', '"Inter"', 'colors'),
('ga_id', '""', 'seo'),
('gsc_verification', '""', 'seo'),
('facebook_pixel', '""', 'seo'),
('default_seo_title', '"Shinhan Finance | Công ty tài chính đến từ Hàn Quốc"', 'seo'),
('default_seo_description', '"Vay tiêu dùng, vay tiền mặt, mở thẻ tín dụng nhanh chóng tại Shinhan Finance Việt Nam"', 'seo')
ON CONFLICT (key) DO NOTHING;

-- Seed homepage blocks
INSERT INTO site_shinhan.homepage_blocks (block_type, template, content, order_index, visible) VALUES
('hero_slider', 'fullwidth', '{"title": "Banner Slider"}', 1, true),
('product_grid', '3-columns', '{"title": "Sản phẩm nổi bật"}', 2, true),
('value_props', '4-columns', '{"title": "Tại sao chọn Shinhan?"}', 3, true),
('testimonials', 'carousel', '{"title": "Khách hàng nói gì?"}', 4, true),
('news_grid', '3-columns', '{"title": "Tin tức mới nhất"}', 5, true),
('partners', 'logo-row', '{"title": "Đối tác chiến lược"}', 6, true),
('awards', 'grid', '{"title": "Giải thưởng"}', 7, true)
ON CONFLICT DO NOTHING;
