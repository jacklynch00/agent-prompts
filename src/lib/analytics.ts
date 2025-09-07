import { db } from './db'
import { ActivityAction } from '@prisma/client'

export class AnalyticsService {
  
  // Track user activity
  static async trackActivity({
    userId,
    sessionId,
    action,
    stackId,
    agentId,
    platform,
    metadata
  }: {
    userId?: string
    sessionId?: string
    action: ActivityAction
    stackId?: string
    agentId?: string
    platform?: string
    metadata?: Record<string, string | number | boolean>
  }) {
    try {
      await db.userActivity.create({
        data: {
          userId,
          sessionId,
          action,
          stackId,
          agentId,
          platform,
          metadata
        }
      })
    } catch (error) {
      console.error('Failed to track activity:', error)
      // Don't throw error to avoid breaking user flow
    }
  }

  // Track stack view
  static async trackStackView(
    stackId: string, 
    userId?: string, 
    sessionId?: string
  ) {
    return this.trackActivity({
      userId,
      sessionId,
      action: 'VIEW_STACK',
      stackId
    })
  }

  // Track prompt copy
  static async trackPromptCopy(
    agentId: string,
    platform: string,
    userId?: string,
    sessionId?: string
  ) {
    return this.trackActivity({
      userId,
      sessionId,
      action: 'COPY_PROMPT',
      agentId,
      platform
    })
  }

  // Track file download
  static async trackFileDownload(
    stackId: string,
    agentId: string,
    platform: string,
    userId?: string,
    sessionId?: string
  ) {
    return this.trackActivity({
      userId,
      sessionId,
      action: 'DOWNLOAD_FILE',
      stackId,
      agentId,
      platform
    })
  }

  // Track search
  static async trackSearch(
    query: string,
    userId?: string,
    sessionId?: string
  ) {
    return this.trackActivity({
      userId,
      sessionId,
      action: 'SEARCH',
      metadata: { query }
    })
  }

  // Get user activity stats
  static async getUserActivityStats(userId: string) {
    const [
      totalActivities,
      stackViews,
      promptCopies,
      fileDownloads,
      searches
    ] = await Promise.all([
      db.userActivity.count({
        where: { userId }
      }),
      db.userActivity.count({
        where: { userId, action: 'VIEW_STACK' }
      }),
      db.userActivity.count({
        where: { userId, action: 'COPY_PROMPT' }
      }),
      db.userActivity.count({
        where: { userId, action: 'DOWNLOAD_FILE' }
      }),
      db.userActivity.count({
        where: { userId, action: 'SEARCH' }
      })
    ])

    return {
      totalActivities,
      stackViews,
      promptCopies,
      fileDownloads,
      searches
    }
  }

  // Get popular stacks based on views
  static async getPopularStacks(limit = 10) {
    const result = await db.userActivity.groupBy({
      by: ['stackId'],
      where: {
        action: 'VIEW_STACK',
        stackId: { not: null }
      },
      _count: {
        stackId: true
      },
      orderBy: {
        _count: {
          stackId: 'desc'
        }
      },
      take: limit
    })

    return result.map(item => ({
      stackId: item.stackId!,
      viewCount: item._count.stackId
    }))
  }

  // Get popular agents based on prompt copies
  static async getPopularAgents(limit = 10) {
    const result = await db.userActivity.groupBy({
      by: ['agentId'],
      where: {
        action: 'COPY_PROMPT',
        agentId: { not: null }
      },
      _count: {
        agentId: true
      },
      orderBy: {
        _count: {
          agentId: 'desc'
        }
      },
      take: limit
    })

    return result.map(item => ({
      agentId: item.agentId!,
      copyCount: item._count.agentId
    }))
  }

  // Generate anonymous session ID for tracking
  static generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}