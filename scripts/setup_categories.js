const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://studio.ngocnguyenxuan.com';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzIxMjUyMDAsImV4cCI6MTkyOTg5MTYwMH0.EswkDe7Zm8fNHw2pc08qoDYz5ahrk8koVHydLDQQSYU';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'site_shinhan' },
});

async function main() {
  const categories = [
    { slug: 'khuyen-mai', label: 'Khuyến mại' },
    { slug: 'su-kien', label: 'Sự kiện' },
    { slug: 'thong-bao', label: 'Thông báo' },
    { slug: 'blog', label: 'Blog' },
    { slug: 'tin-tuc', label: 'Tin tức' }
  ];

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .upsert(
      { key: 'post_categories', value: categories, grp: 'cms' },
      { onConflict: 'key' }
    );

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Categories initialized globally in site_settings successfully.');
  }
}

main();
