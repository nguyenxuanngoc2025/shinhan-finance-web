import { redirect } from 'next/navigation'

// Trang Footer CMS da duoc hop nhat vao General Settings
// Social links, footer logo deu quan ly tai /admin/appearance/general
export default function AppearanceFooterPage() {
  redirect('/admin/appearance/general')
}
