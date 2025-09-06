'use client'

import { Stack } from '@/lib/stack-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Users, Download, Calendar } from 'lucide-react'
import Link from 'next/link'

interface StackCardProps {
  stack: Stack
  showFullDescription?: boolean
}

export function StackCard({ stack, showFullDescription = false }: StackCardProps) {
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

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold">{stack.name}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getDifficultyColor(stack.difficulty)}>
                {stack.difficulty}
              </Badge>
              <Badge className={getCategoryColor(stack.category)}>
                {stack.category}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span>{stack.metadata.rating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
        <CardDescription className={showFullDescription ? '' : 'line-clamp-2'}>
          {stack.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Technologies */}
        <div>
          <h4 className="text-sm font-medium mb-2">Technologies</h4>
          <div className="flex flex-wrap gap-1">
            {stack.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {stack.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{stack.technologies.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Agents count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{stack.agents.length} agents</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{stack.metadata.downloadCount || 0}</span>
          </div>
        </div>

        {/* Last updated */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            Updated {new Date(stack.metadata.updatedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <Button asChild className="w-full">
            <Link href={`/stacks/${stack.id}`}>
              View Stack & Agents
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}