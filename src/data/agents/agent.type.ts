export type PlatformType = 'cursor' | 'claude_projects' | 'claude_code' | 'generic';
export type FormatType = 'cursorrules' | 'custom_instructions' | 'cli_config' | 'markdown';
export type CategoryType = 'development' | 'testing' | 'deployment' | 'architecture' | 'styling' | 'database' | 'authentication';

interface Technology {
	name: string;
	version: string;
	isCore: boolean;
}

interface PlatformValidation {
	fileExtension?: string;
	placement?: 'project-root' | 'config-folder' | 'any';
}

interface Platform {
	type: PlatformType;
	format: FormatType;
	filename?: string;
	content: string; // Markdown content
	setupInstructions: string[];
	validation?: PlatformValidation;
	characterLimit?: number;
}

interface AgentMetadata {
	author: string;
	created: string; // ISO date string
	useCases: string[];
	projectTypes: string[];
	estimatedSetupTime: string;
}

export interface Agent {
	id: string;
	name: string;
	description: string;
	version: string;
	lastUpdated: string; // ISO date string
	category: CategoryType;
	tags: string[];
	relatedAgents: string[]; // Array of agent IDs
	isPremium: boolean;

	role: string;
	technologies: Technology[];
	platforms: Platform[];
	metadata: AgentMetadata;
}

// For collections/stacks
export interface Stack {
	id: string;
	name: string;
	description: string;
	category: CategoryType;
	popularity: number; // 1-10 ranking
	agents: string[]; // Array of agent IDs
	tags: string[];
	isPremium: boolean;
	metadata: {
		createdAt: string;
		updatedAt: string;
		author: string;
		version: string;
	};
}
