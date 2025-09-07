// Stack-related types (not Prisma - these come from config files/API)
export interface Stack {
  id: string
  name: string
  description: string
  category: string
  technologies: string[]
  agents: Agent[]
  featured?: boolean
}

export interface Agent {
  id: string
  name: string
  description: string
  platforms: Platform[]
  role?: string
  instructions?: string
}

export interface Platform {
  type: string
  format?: string
  content?: string
  setupInstructions?: string[]
}