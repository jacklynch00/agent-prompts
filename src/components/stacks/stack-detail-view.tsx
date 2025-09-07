'use client'

import { Stack } from '@/lib/stack-types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AgentCard } from './agent-card'
import { PurchaseButton } from '@/components/payments/purchase-button'
import { ArrowLeft, Star, Download, Calendar, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { AnalyticsService } from '@/lib/analytics'
import { useHasPremiumAccess } from '@/hooks/use-user-purchases'

interface StackDetailViewProps {
  stack: Stack
}

export function StackDetailView({ stack }: StackDetailViewProps) {
  const { hasPremiumAccess } = useHasPremiumAccess()

  // Track stack view when component mounts
  useEffect(() => {
    const sessionId = AnalyticsService.generateSessionId()
    AnalyticsService.trackStackView(stack.id, undefined, sessionId)
      .catch(error => console.error('Failed to track stack view:', error))
  }, [stack.id])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
      case 'advanced':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted/80'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fullstack':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
      case 'frontend':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'
      case 'backend':
        return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
      case 'mobile':
        return 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20'
      case 'ai':
        return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted/80'
    }
  }

  const freeAgents = stack.agents.filter(agent => !agent.isPremium)
  const premiumAgents = stack.agents.filter(agent => agent.isPremium)

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Stack header */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2">{stack.name}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <Badge className={getDifficultyColor(stack.difficulty)}>
                        {stack.difficulty}
                      </Badge>
                      <Badge className={getCategoryColor(stack.category)}>
                        {stack.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{stack.metadata.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </div>
                    <CardDescription className="text-lg leading-relaxed">
                      {stack.description}
                    </CardDescription>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="font-semibold mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {stack.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {stack.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {stack.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stack stats */}
                <div className="lg:w-80">
                  <Card className="bg-gray-50 dark:bg-gray-800">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Agents</span>
                          </div>
                          <span className="font-semibold">{stack.agents.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Downloads</span>
                          </div>
                          <span className="font-semibold">{stack.metadata.downloadCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Updated</span>
                          </div>
                          <span className="font-semibold text-sm">
                            {new Date(stack.metadata.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="border-t pt-4">
                          <div className="text-xs text-muted-foreground mb-1">Version</div>
                          <div className="font-semibold">{stack.metadata.version}</div>
                          <div className="text-xs text-muted-foreground mt-2">
                            By {stack.metadata.author}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Free Agents Section */}
        {freeAgents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">Free Agents</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {freeAgents.length} agents
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {freeAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} stackName={stack.name} />
              ))}
            </div>
          </div>
        )}

        {/* Premium Agents Section */}
        {premiumAgents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">Premium Agents</h2>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {premiumAgents.length} agents
              </Badge>
              <Badge variant="outline" className="text-xs">
                $19 one-time purchase
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {premiumAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} stackName={stack.name} />
              ))}
            </div>
            
            {/* Premium CTA */}
            {!hasPremiumAccess && (
              <div className="mt-8 text-center">
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">Unlock Premium Agents</h3>
                    <p className="text-muted-foreground mb-4">
                      Get access to all premium agents across all tech stacks with advanced features and exclusive content.
                    </p>
                    <PurchaseButton size="lg" className="bg-yellow-600 hover:bg-yellow-700" />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* No agents message */}
        {stack.agents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No agents available yet</h3>
            <p className="text-muted-foreground">
              We&apos;re working on adding AI agents for this stack. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}