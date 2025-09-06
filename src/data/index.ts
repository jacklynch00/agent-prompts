import { Stack, Agent } from '@/lib/stack-types'

// Import all stack configurations
import nextjsT3 from './stacks/nextjs-t3.json'
import mernStack from './stacks/mern-stack.json'
import pythonFastAPI from './stacks/python-fastapi.json'

// Type assertion for imported JSON
const stacks: Stack[] = [
  nextjsT3 as Stack,
  mernStack as Stack,
  pythonFastAPI as Stack
]

export class StackService {
  
  // Get all stacks
  static getAllStacks(): Stack[] {
    return stacks.map(stack => ({
      ...stack,
      metadata: {
        ...stack.metadata,
        downloadCount: stack.metadata.downloadCount || 0,
        rating: stack.metadata.rating || 0
      }
    }))
  }

  // Get stack by ID
  static getStackById(id: string): Stack | null {
    return stacks.find(stack => stack.id === id) || null
  }

  // Get stacks by category
  static getStacksByCategory(category: string): Stack[] {
    return stacks.filter(stack => stack.category === category)
  }

  // Get stacks by difficulty
  static getStacksByDifficulty(difficulty: string): Stack[] {
    return stacks.filter(stack => stack.difficulty === difficulty)
  }

  // Search stacks by name, description, or technologies
  static searchStacks(query: string): Stack[] {
    const lowercaseQuery = query.toLowerCase()
    
    return stacks.filter(stack => 
      stack.name.toLowerCase().includes(lowercaseQuery) ||
      stack.description.toLowerCase().includes(lowercaseQuery) ||
      stack.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery)) ||
      stack.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  // Get all agents across all stacks
  static getAllAgents(): Agent[] {
    return stacks.flatMap(stack => 
      stack.agents.map(agent => ({
        ...agent,
        stackId: stack.id,
        stackName: stack.name
      } as Agent & { stackId: string; stackName: string }))
    )
  }

  // Get free agents only
  static getFreeAgents(): Agent[] {
    return this.getAllAgents().filter(agent => !agent.isPremium)
  }

  // Get premium agents only
  static getPremiumAgents(): Agent[] {
    return this.getAllAgents().filter(agent => agent.isPremium)
  }

  // Get agent by ID
  static getAgentById(agentId: string): (Agent & { stackId: string; stackName: string }) | null {
    const allAgents = this.getAllAgents() as (Agent & { stackId: string; stackName: string })[]
    return allAgents.find(agent => agent.id === agentId) || null
  }

  // Get agents by platform
  static getAgentsByPlatform(platform: string): Agent[] {
    return this.getAllAgents().filter(agent =>
      agent.platforms.some(p => p.type === platform)
    )
  }

  // Get popular stacks (sorted by popularity)
  static getPopularStacks(limit?: number): Stack[] {
    const sorted = [...stacks].sort((a, b) => b.popularity - a.popularity)
    return limit ? sorted.slice(0, limit) : sorted
  }

  // Get recently updated stacks
  static getRecentStacks(limit?: number): Stack[] {
    const sorted = [...stacks].sort((a, b) => 
      new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime()
    )
    return limit ? sorted.slice(0, limit) : sorted
  }

  // Get stack statistics
  static getStackStats() {
    return {
      totalStacks: stacks.length,
      totalAgents: this.getAllAgents().length,
      freeAgents: this.getFreeAgents().length,
      premiumAgents: this.getPremiumAgents().length,
      categories: [...new Set(stacks.map(stack => stack.category))],
      technologies: [...new Set(stacks.flatMap(stack => stack.technologies))],
      platforms: [...new Set(this.getAllAgents().flatMap(agent => 
        agent.platforms.map(platform => platform.type)
      ))]
    }
  }
}

export { stacks }
export default StackService