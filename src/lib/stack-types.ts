// Simple types for JSON stack/agent data structure
// These are separate from Prisma types since stacks/agents are stored as JSON files

export interface Stack {
  id: string
  name: string
  description: string
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'ai'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  popularity: number
  technologies: string[]
  agents: Agent[]
  tags: string[]
  metadata: {
    createdAt: string
    updatedAt: string
    author: string
    version: string
    downloadCount?: number
    rating?: number
  }
}

export interface Agent {
  id: string
  name: string
  description: string
  role: string
  platforms: PlatformConfig[]
  category: 'setup' | 'development' | 'testing' | 'deployment' | 'debugging' | 'optimization'
  isPremium: boolean
}

export interface PlatformConfig {
  type: 'cursor' | 'claude_projects' | 'claude_code' | 'generic'
  format: 'cursorrules' | 'custom_instructions' | 'cli_config' | 'markdown'
  content: string
  setupInstructions: string[]
}