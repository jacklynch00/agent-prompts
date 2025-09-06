'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useStacks } from '@/hooks/use-stacks'
import { StackCard } from '@/components/stacks/stack-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'
import { AnalyticsService } from '@/lib/analytics'

export function SearchView() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Track search analytics
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2) {
      const sessionId = AnalyticsService.generateSessionId()
      AnalyticsService.trackSearch(debouncedQuery, undefined, sessionId)
        .catch(error => console.error('Failed to track search:', error))
    }
  }, [debouncedQuery])

  const { data: stacksResponse, isLoading, error } = useStacks({
    search: debouncedQuery || undefined
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Update URL with search query
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Search Results
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {debouncedQuery 
                ? `Search results for "${debouncedQuery}"`
                : 'Enter a search term to find tech stacks and agents'
              }
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch}>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search tech stacks or agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-32 py-3 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                autoFocus
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Results */}
        {!debouncedQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start your search
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Search for tech stacks, technologies, or AI agents to get started.
            </p>
          </div>
        )}

        {isLoading && debouncedQuery && (
          <div>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Searching...
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {error && debouncedQuery && (
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4">
              Failed to search. Please try again.
            </div>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}

        {stacksResponse && debouncedQuery && (
          <>
            {/* Results count */}
            <div className="mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stacksResponse.count === 0 
                  ? `No results found for "${debouncedQuery}"`
                  : `${stacksResponse.count} result${stacksResponse.count === 1 ? '' : 's'} found for "${debouncedQuery}"`
                }
              </div>
            </div>

            {/* Search results */}
            {stacksResponse.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stacksResponse.data.map((stack) => (
                  <StackCard key={stack.id} stack={stack} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try searching with different keywords or check out our available stacks.
                </p>
                <Button asChild>
                  <Link href="/stacks">
                    Browse All Stacks
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}