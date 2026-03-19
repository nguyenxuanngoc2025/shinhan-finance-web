# Implementation Plan v3 — Auto SEO System

## Đã xác nhận
- ✅ Trang `/blog` cho bài AI
- ✅ Tên tác giả: "Ban biên tập [Tên công ty]"
- ✅ CTA cuối bài → Đăng ký vay
- ✅ Module 1: Copy nguyên bản + kỹ thuật canonical/schema lách Google
- ✅ Module 4: Auto Fanpage
- ✅ **Trung tâm Tự động hóa** trong CMS admin

## File tải cho KH

📄 [Auto_SEO_Plan_KhachHang.md](file:///e:/ANTIGRAVITY/SHINHAN_WEB/Auto_SEO_Plan_KhachHang.md)

## Tính năng mới: Trung tâm Tự động hóa

Trang `/admin/settings/automation` sẽ hiển thị:
- 4 module với trạng thái 🟢🟡🔴⚠️
- Khách hàng tự điền Facebook Page ID + Token
- Nút "Kiểm tra kết nối" → phản hồi ngay
- Tổng kết: bao nhiêu module hoạt động, bao nhiêu cần thiết lập

## 10 bước triển khai (8-9 ngày)

| # | Việc | Thời gian |
|---|---|---|
| 1 | DB schema: thêm cột `source`, `priority`, `auto_generated` + bảng `seo_keyword_plan` + bảng `automation_config` | 0.5 ngày |
| 2 | Frontend: trang `/blog` + sửa trang chủ chỉ hiện bài Shinhan | 1 ngày |
| 3 | n8n Workflow 1: Scrape Shinhan (canonical + schema + value layer) | 1 ngày |
| 4 | n8n Workflow 2: AI Finance News daily | 1 ngày |
| 5 | n8n Workflow 3: SEO Keyword Planner weekly | 0.5 ngày |
| 6 | n8n Workflow 4: Auto Fanpage post | 0.5 ngày |
| 7 | CMS: Trung tâm Tự động hóa (admin page) | 1 ngày |
| 8 | Seed 120 keywords ban đầu | 0.5 ngày |
| 9 | Test toàn bộ | 2 ngày |
| 10 | Go live | 1 giờ |
