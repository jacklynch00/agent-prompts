import { Agent } from './agent.type';

// Import all agent configurations
import { nextjsExpertAgent } from './nextjs';
import { prismaExpertAgent } from './prisma';
import { drizzleExpertAgent } from './drizzle';
import { mongodbExpertAgent } from './mongodb';
import { tanstackQueryExpertAgent } from './tanstack-query';
import { viteExpertAgent } from './vite';
import { laravelExpertAgent } from './laravel';
import { clerkExpertAgent } from './clerk';
import { supabaseExpertAgent } from './supabase';
import { betterAuthExpertAgent } from './better-auth';
import { frontendFileStructureExpertAgent } from './frontend-file-structure';
import { typescriptExpertAgent } from './typescript';
import { pythonExpertAgent } from './python';
import { securityBestPracticesExpertAgent } from './security';

// Collect all agents
const agents: Agent[] = [
  nextjsExpertAgent,
  prismaExpertAgent,
  drizzleExpertAgent,
  mongodbExpertAgent,
  tanstackQueryExpertAgent,
  viteExpertAgent,
  laravelExpertAgent,
  clerkExpertAgent,
  supabaseExpertAgent,
  betterAuthExpertAgent,
  frontendFileStructureExpertAgent,
  typescriptExpertAgent,
  pythonExpertAgent,
  securityBestPracticesExpertAgent
];

export class AgentService {
  
  // Get all agents
  static getAllAgents(): Agent[] {
    return agents.map(agent => ({
      ...agent,
      // Ensure consistent data structure
      tags: agent.tags || [],
      relatedAgents: agent.relatedAgents || []
    }));
  }

  // Get agent by ID
  static getAgentById(id: string): Agent | null {
    return agents.find(agent => agent.id === id) || null;
  }

  // Get agents by category
  static getAgentsByCategory(category: string): Agent[] {
    return agents.filter(agent => agent.category === category);
  }


  // Search agents by name, description, or tags
  static searchAgents(query: string): Agent[] {
    const lowercaseQuery = query.toLowerCase();
    
    return agents.filter(agent => 
      agent.name.toLowerCase().includes(lowercaseQuery) ||
      agent.description.toLowerCase().includes(lowercaseQuery) ||
      agent.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      agent.technologies.some(tech => tech.name.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get free agents only
  static getFreeAgents(): Agent[] {
    return agents.filter(agent => !agent.isPremium);
  }

  // Get premium agents only
  static getPremiumAgents(): Agent[] {
    return agents.filter(agent => agent.isPremium);
  }

  // Get agents by platform
  static getAgentsByPlatform(platform: string): Agent[] {
    return agents.filter(agent =>
      agent.platforms.some(p => p.type === platform)
    );
  }

  // Get popular agents (sorted by related agents count as a proxy for popularity)
  static getPopularAgents(limit?: number): Agent[] {
    const sorted = [...agents].sort((a, b) => b.relatedAgents.length - a.relatedAgents.length);
    return limit ? sorted.slice(0, limit) : sorted;
  }

  // Get recently updated agents
  static getRecentAgents(limit?: number): Agent[] {
    const sorted = [...agents].sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  // Get agent statistics
  static getAgentStats() {
    return {
      totalAgents: agents.length,
      freeAgents: this.getFreeAgents().length,
      premiumAgents: this.getPremiumAgents().length,
      categories: [...new Set(agents.map(agent => agent.category))],
      technologies: [...new Set(agents.flatMap(agent => 
        agent.technologies.map(tech => tech.name)
      ))],
      platforms: [...new Set(agents.flatMap(agent => 
        agent.platforms.map(platform => platform.type)
      ))]
    };
  }
}

export { agents };
export default AgentService;