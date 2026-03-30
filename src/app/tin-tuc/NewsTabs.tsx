'use client'

import Link from 'next/link'
import type { NewsCategory } from './news-data'

type CategoryItem = {
  id: NewsCategory | 'tat-ca'
  label: string
}

export default function NewsTabs({ activeTab, categories }: { activeTab: string; categories: CategoryItem[] }) {
  return (
    <nav className="news-tabs">
      <div className="container">
        <div className="news-tabs-list">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={cat.id === 'tat-ca' ? '/tin-tuc' : `/tin-tuc?tab=${cat.id}`}
              className={`news-tab${activeTab === cat.id ? ' active' : ''}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
