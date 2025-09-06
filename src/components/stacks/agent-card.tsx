'use client'

import { Agent } from '@/lib/stack-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Crown, FileText } from 'lucide-react'
import { useState } from 'react'
import { useHasPremiumAccess } from '@/hooks/use-user-purchases'
import { AnalyticsService } from '@/lib/analytics'

interface AgentCardProps {
  agent: Agent
  stackName?: string
}

export function AgentCard({ agent, stackName }: AgentCardProps) {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null)
  const { hasPremiumAccess } = useHasPremiumAccess()

  const copyToClipboard = async (content: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedPlatform(platform)
      setTimeout(() => setCopiedPlatform(null), 2000)

      // Track the copy action
      const sessionId = AnalyticsService.generateSessionId()
      AnalyticsService.trackPromptCopy(agent.id, platform, undefined, sessionId)
        .catch(error => console.error('Failed to track prompt copy:', error))
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const canAccessPremium = !agent.isPremium || hasPremiumAccess

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'setup':
        return 'bg-green-500/10 text-green-500'
      case 'development':
        return 'bg-blue-500/10 text-blue-500'
      case 'testing':
        return 'bg-purple-500/10 text-purple-500'
      case 'deployment':
        return 'bg-orange-500/10 text-orange-500'
      case 'debugging':
        return 'bg-red-500/10 text-red-500'
      case 'optimization':
        return 'bg-yellow-500/10 text-yellow-500'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'cursor':
        return '⚡'
      case 'claude_projects':
        return '🤖'
      case 'claude_code':
        return '💻'
      case 'generic':
        return '📝'
      default:
        return '📄'
    }
  }

  const getPlatformLabel = (type: string) => {
    switch (type) {
      case 'cursor':
        return 'Cursor IDE'
      case 'claude_projects':
        return 'Claude Projects'
      case 'claude_code':
        return 'Claude Code'
      case 'generic':
        return 'Generic'
      default:
        return type
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{agent.name}</CardTitle>
              {agent.isPremium && (
                <Crown className="h-4 w-4 text-primary fill-primary/20" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getCategoryColor(agent.category)}>
                {agent.category}
              </Badge>
              {agent.isPremium && (
                <Badge variant="outline" className="text-primary border-primary">
                  Premium
                </Badge>
              )}
            </div>
            {stackName && (
              <div className="text-xs text-muted-foreground">
                Part of {stackName} stack
              </div>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {agent.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Role */}
        <div>
          <h4 className="text-sm font-medium mb-1">Role</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {agent.role}
          </p>
        </div>

        {/* Platforms */}
        <div>
          <h4 className="text-sm font-medium mb-2">Available Platforms</h4>
          <div className="space-y-2">
            {agent.platforms.map((platform) => (
              <div
                key={platform.type}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {getPlatformIcon(platform.type)}
                  </span>
                  <span className="text-sm font-medium">
                    {getPlatformLabel(platform.type)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(platform.content, platform.type)}
                    disabled={!canAccessPremium}
                  >
                    {copiedPlatform === platform.type ? (
                      <span className="text-xs">Copied!</span>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Setup instructions preview */}
        {agent.platforms.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Setup Instructions</h4>
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <FileText className="h-3 w-3" />
                <span>Example for {getPlatformLabel(agent.platforms[0].type)}:</span>
              </div>
              <ul className="space-y-0.5 ml-4 list-disc">
                {agent.platforms[0].setupInstructions.slice(0, 2).map((instruction, index) => (
                  <li key={index} className="line-clamp-1">
                    {instruction}
                  </li>
                ))}
                {agent.platforms[0].setupInstructions.length > 2 && (
                  <li className="text-muted-foreground/60">
                    +{agent.platforms[0].setupInstructions.length - 2} more steps...
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Premium notice */}
        {agent.isPremium && !hasPremiumAccess && (
          <div className="text-xs text-center text-muted-foreground bg-muted border rounded p-2">
            <Crown className="h-3 w-3 inline mr-1" />
            Premium agent - Purchase required to access prompts
          </div>
        )}

        {/* Premium access confirmed */}
        {agent.isPremium && hasPremiumAccess && (
          <div className="text-xs text-center text-primary bg-primary/10 border border-primary/20 rounded p-2">
            <Crown className="h-3 w-3 inline mr-1 text-primary" />
            Premium access active - Full agent access
          </div>
        )}
      </CardContent>
    </Card>
  )
}