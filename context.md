# Get Agent Prompts - Complete Project Context

## Product Overview

**Business Name**: Get Agent Prompts (getagentprompts.com)

**Core Problem**: Developers waste time repeatedly explaining their tech stack setup, patterns, and preferences to AI assistants (Claude, ChatGPT, Cursor) in every conversation. This "AI amnesia problem" leads to generic advice and frustrated developers.

**Solution**: A curated directory of expert-level AI agent prompts for popular tech stacks that developers can copy/paste into their development environment to give AI tools persistent context about their specific setup.

## Target Audience

**"Hands-On Builder" Developers**:

-   2+ years coding experience
-   Values code ownership and customization
-   Wants to move fast without sacrificing quality
-   Prefers understanding their stack vs. black-box solutions
-   Time-constrained but technically capable
-   Building side projects, MVPs, or client work

**Positioning**: "For developers who want AI acceleration, not AI replacement"

## Product Structure

### Free Tier

-   Individual agent prompts for popular technologies (5-6 high-quality agents)
-   Examples: Next.js App Router Agent, React Component Agent, Tailwind CSS Agent
-   No email required, immediate access
-   Demonstrates quality without giving away complete ecosystems

### Premium ($19 One-Time)

-   Complete access to all agent libraries (20+ focused agents)
-   Platform-specific formatting (Cursor, Claude Projects, Claude Code, Generic)
-   Regular updates and new agent additions
-   Lifetime access model

## Agent Philosophy

**Key Principle**: Each agent is laser-focused on ONE specific technology or pattern. Users mix and match exactly what they need.

**Example**: A Next.js + TypeScript + Prisma + Tailwind project uses:

-   Next.js App Router Agent (routing, Server/Client Components)
-   TypeScript Agent (type definitions, configurations)
-   Prisma Agent (database operations, schema design)
-   Tailwind Agent (utility classes, responsive design)

**Agent Scope**: Each agent only covers its specific domain and explicitly defers to other specialists for related but separate concerns.

## Technical Architecture

### Tech Stack

-   **Frontend**: Next.js 15 + TypeScript
-   **UI**: Shadcn/ui components + Tailwind CSS
-   **Auth**: Better-Auth with Polar plugin
-   **Database**: PostgreSQL + Prisma ORM
-   **Payments**: Polar (developer-focused payment platform)
-   **Deployment**: Vercel

### Data Storage

-   **Agent/Stack Data**: JSON files in repo (easy to version control)
-   **User Data**: PostgreSQL database via Prisma
-   **Content Format**: Markdown for agent prompts

### Database Schema (Prisma)

```prisma
// Better-Auth core tables (auto-generated)
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  emailVerified   Boolean   @default(false)
  name            String?
  image           String?
  polarCustomerId String?   @unique
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  purchases    Purchase[]
  userActivity UserActivity[]
  sessions     Session[]
  accounts     Account[]
}

// Custom business tables
model Purchase {
  id              String        @id @default(cuid())
  userId          String
  productType     ProductType   // FULL_ACCESS, INDIVIDUAL_STACK
  amount          Decimal       @db.Decimal(10, 2)
  polarCheckoutId String?
  status          PurchaseStatus @default(PENDING)
  purchasedAt     DateTime?
  createdAt       DateTime      @default(now())

  user User @relation(fields: [userId], references: [id])
}

model UserActivity {
  id        String         @id @default(cuid())
  userId    String?
  action    ActivityAction // VIEW_STACK, COPY_PROMPT, DOWNLOAD_FILE, SEARCH
  stackId   String?
  agentId   String?
  platform  String?        // cursor, claude_projects, etc.
  metadata  Json?
  createdAt DateTime       @default(now())

  user User? @relation(fields: [userId], references: [id])
}

model EmailSignup {
  id                     String   @id @default(cuid())
  email                  String   @unique
  source                 String   // landing_page, beta_signup, waitlist
  metadata               Json?
  subscribedToNewsletter Boolean  @default(true)
  createdAt              DateTime @default(now())
}
```

### Agent Data Model (TypeScript)

```typescript
interface Agent {
	id: string;
	name: string;
	description: string;
	version: string;
	lastUpdated: string;
	category: CategoryType;
	tags: string[];
	difficulty: DifficultyLevel;
	relatedAgents: string[];
	isPremium: boolean;

	role: string;
	technologies: Technology[];
	platforms: Platform[];
	metadata: AgentMetadata;
}

interface Platform {
	type: 'cursor' | 'claude_projects' | 'claude_code' | 'generic';
	format: 'cursorrules' | 'custom_instructions' | 'cli_config' | 'markdown';
	filename?: string;
	content: string; // Markdown content
	setupInstructions: string[];
	validation?: PlatformValidation;
	characterLimit?: number;
}
```

## Platform Integration Strategy

### Cursor

-   Format prompts as `.cursorrules` files
-   One-click download with correct filename
-   Include setup instructions with screenshots

### Claude Projects

-   Copy/paste optimized for Custom Instructions
-   Character limit considerations (8000 chars)
-   Step-by-step setup guide

### Claude Code CLI

-   Shell scripts for easy setup
-   CLI-focused configuration format

### Generic

-   Universal markdown format for any AI tool
-   Copy/paste ready

## Authentication & Payments (Polar)

### Better-Auth Configuration

```typescript
import { polar, checkout, portal, webhooks } from '@polar-sh/better-auth';

plugins: [
	polar({
		client: polarClient,
		createCustomerOnSignUp: true,
		use: [
			checkout({
				products: [{ productId: POLAR_PRODUCT_ID, slug: 'full-access' }],
				successUrl: '/dashboard?purchase=success',
				authenticatedUsersOnly: true,
			}),
			portal(),
			webhooks({
				secret: POLAR_WEBHOOK_SECRET,
				onOrderPaid: (payload) => {
					// Track conversion analytics
				},
			}),
		],
	}),
];
```

### Checkout Implementation

```typescript
// Simple purchase flow
await authClient.checkout({
	slug: 'full-access', // $19 one-time purchase
});
```

## Marketing Strategy

### Primary Distribution: Reddit

**Approach**: "Free week-long access to beta test my AI prompt library"

-   Offer 100 beta testers free access in exchange for feedback
-   Share individual agent prompts in relevant subreddits (r/nextjs, r/reactjs, etc.)
-   End posts with mention of complete collection

**Target Communities**:

-   r/nextjs, r/reactjs, r/webdev, r/programming
-   r/SideProject, r/entrepreneur, r/indiehackers
-   Stack-specific subreddits and Discord servers

### Content Strategy

-   Value-first: Share genuinely useful individual prompts for free
-   Build in public narrative on developer Twitter
-   "I got tired of explaining my stack to ChatGPT" personal angle

### Positioning Messages

**Headlines**:

-   "Stop explaining the same setup in every AI chat"
-   "Your AI has amnesia about your tech stack"
-   "Code with AI in minutes, not hours"

## Agent Creation Guidelines

### Focus Principle

Each agent must be extremely specific to ONE technology or pattern. Example:

**✅ Good**: "Next.js App Router Agent" covering only routing, file conventions, Server/Client Components
**❌ Too Broad**: "Next.js Full-Stack Agent" covering routing + React + TypeScript + styling

### Agent Prompt Structure

```markdown
# [Agent Name]

You are a [specific role]. Focus ONLY on [specific scope].

## Core Patterns

-   Technology-specific conventions
-   File structures and naming
-   Common configurations

## Best Practices

-   Do this
-   Avoid that
-   Prefer X over Y

## Common Mistakes

-   Anti-pattern 1: Why it's wrong
-   Anti-pattern 2: Better approach

## Integration Notes

-   How this works with other tools
-   When to defer to other specialists

Focus exclusively on [technology]. Defer [other areas] to other specialists.
```

### Agent Categories

**Frontend Framework & Architecture**:

-   Next.js App Router Expert, React Component Expert, Vue.js Expert
-   Svelte/SvelteKit Expert, Angular Expert, Astro Expert

**Frontend Styling & UI**:

-   Tailwind CSS Expert, Shadcn/ui Expert, CSS-in-JS Expert
-   SCSS/Sass Expert, Material-UI Expert

**State Management**:

-   Zustand Expert, Redux Toolkit Expert, TanStack Query Expert
-   SWR Expert, Jotai Expert

**Backend & API**:

-   FastAPI Expert, Express.js Expert, tRPC Expert
-   NestJS Expert, GraphQL Expert, REST API Expert

**Database & ORM**:

-   Prisma Expert, Drizzle ORM Expert, MongoDB Expert
-   SQLAlchemy Expert, Raw SQL Expert

**Authentication & Security**:

-   NextAuth.js Expert, Auth0 Expert, JWT Expert
-   OAuth Expert, Security Best Practices Expert

**DevOps & Deployment**:

-   Docker Expert, Vercel Expert, AWS Expert
-   CI/CD Expert, Environment Configuration Expert

**Testing & Quality**:

-   Jest Expert, Cypress Expert, Playwright Expert
-   ESLint Expert, React Testing Library Expert

**Build Tools & Development**:

-   Vite Expert, TypeScript Expert, Webpack Expert
-   Package Management Expert

**File Structure & Architecture**:

-   Frontend File Structure Expert, Backend File Structure Expert
-   Monorepo Expert, Clean Architecture Expert

## Current Progress

### Completed Agents

1. **Next.js App Router Expert** - Focused on routing patterns, file conventions, Server/Client Components

### Next Steps

1. Continue creating focused agents from the comprehensive list
2. Build MVP website with authentication and payment integration
3. Implement platform-specific formatting for each agent
4. Launch beta testing program via Reddit
5. Convert beta users to paid customers

## Success Metrics

**Early Validation**:

-   1,000+ email signups in first month
-   50+ active beta testers providing feedback
-   20%+ conversion from beta to paid users

**Revenue Goals**:

-   Month 1: $1,000 revenue (50 purchases)
-   Month 3: $5,000 revenue (170+ purchases)
-   Month 6: $10,000 revenue (350+ purchases)

**Product-Market Fit Signals**:

-   Organic word-of-mouth sharing
-   User requests for specific agents/stacks
-   30%+ weekly return usage
-   Positive developer community reception
