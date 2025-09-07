import { Suspense } from 'react'
import { SearchView } from '@/components/search/search-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search - Agent Prompts',
  description: 'Search for tech stacks and AI development agents.',
  robots: 'noindex, nofollow' // Search pages typically shouldn't be indexed
}

function SearchFallback() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchView />
    </Suspense>
  )
}