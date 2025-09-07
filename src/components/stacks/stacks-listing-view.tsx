'use client'

import { useState } from 'react'
import { useStacks } from '@/hooks/use-stacks'
import { StackCard } from './stack-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, Filter, Grid, List } from 'lucide-react'
import Link from 'next/link'

export function StacksListingView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data: stacksResponse, isLoading, error } = useStacks({
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
    difficulty: selectedDifficulty || undefined
  })

  const categories = ['fullstack', 'frontend', 'backend', 'mobile', 'ai']
  const difficulties = ['beginner', 'intermediate', 'advanced']

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedDifficulty(null)
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedDifficulty

  return (
    <div className="min-h-screen bg-background pt-24">
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
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Tech Stacks
              </h1>
              <p className="text-muted-foreground">
                Discover AI agents for your favorite development stacks
              </p>
            </div>
            
            {/* View toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <form onSubmit={handleSearch}>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search stacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category filter */}
            <div>
              <div className="text-sm font-medium text-foreground mb-2">
                Category
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'secondary'}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedCategory(
                      selectedCategory === category ? null : category
                    )}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Difficulty filter */}
            <div>
              <div className="text-sm font-medium text-foreground mb-2">
                Difficulty
              </div>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? 'default' : 'secondary'}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedDifficulty(
                      selectedDifficulty === difficulty ? null : difficulty
                    )}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Active filters and clear */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {searchQuery && (
                <Badge variant="outline" className="text-xs">
                  Search: &ldquo;{searchQuery}&rdquo;
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="outline" className="text-xs capitalize">
                  Category: {selectedCategory}
                </Badge>
              )}
              {selectedDifficulty && (
                <Badge variant="outline" className="text-xs capitalize">
                  Difficulty: {selectedDifficulty}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-auto py-1 px-2"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-destructive mb-4">
              Failed to load stacks. Please try again later.
            </div>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}

        {stacksResponse && (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                {stacksResponse.count === 0 
                  ? 'No stacks found'
                  : `${stacksResponse.count} stack${stacksResponse.count === 1 ? '' : 's'} found`
                }
              </div>
            </div>

            {/* Stacks grid/list */}
            {stacksResponse.data.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {stacksResponse.data.map((stack) => (
                  <StackCard 
                    key={stack.id} 
                    stack={stack} 
                    showFullDescription={viewMode === 'list'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No stacks found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters 
                    ? 'Try adjusting your search criteria or filters.'
                    : 'We\'re working on adding more tech stacks. Check back soon!'
                  }
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}