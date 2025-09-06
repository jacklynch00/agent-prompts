'use client'

import { useQuery } from '@tanstack/react-query'
import { Code, Users, Zap, Star } from 'lucide-react'

interface StatsResponse {
  success: boolean
  data: {
    totalStacks: number
    totalAgents: number
    freeAgents: number
    premiumAgents: number
    categories: string[]
    technologies: string[]
    platforms: string[]
  }
}

export function StatsSection() {
  const { data: statsResponse, isLoading } = useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      return response.json()
    }
  })

  const stats = statsResponse?.data

  const displayStats = [
    {
      icon: Code,
      label: 'Tech Stacks',
      value: stats?.totalStacks || 0,
      description: 'Popular development stacks'
    },
    {
      icon: Users,
      label: 'AI Agents',
      value: stats?.totalAgents || 0,
      description: 'Specialized coding assistants'
    },
    {
      icon: Zap,
      label: 'Free Agents',
      value: stats?.freeAgents || 0,
      description: 'No cost, instant access'
    },
    {
      icon: Star,
      label: 'Premium Agents',
      value: stats?.premiumAgents || 0,
      description: 'Advanced features available'
    }
  ]

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg mb-4">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Supporting {stats?.platforms.length || 0} platforms including Cursor, Claude Projects, and Claude Code
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {stats?.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}