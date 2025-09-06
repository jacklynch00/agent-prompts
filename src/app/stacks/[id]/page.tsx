import { notFound } from 'next/navigation'
import { StackService } from '@/data'
import { StackDetailView } from '@/components/stacks/stack-detail-view'
import type { Metadata } from 'next'

interface StackPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: StackPageProps): Promise<Metadata> {
  const { id } = await params
  const stack = StackService.getStackById(id)
  
  if (!stack) {
    return {
      title: 'Stack Not Found',
      description: 'The requested tech stack could not be found.'
    }
  }

  return {
    title: `${stack.name} - AI Agents & Development Tools`,
    description: `${stack.description} - Get access to ${stack.agents.length} specialized AI agents for ${stack.name} development.`,
    keywords: [stack.name, ...stack.technologies, ...stack.tags, 'AI agents', 'development tools'].join(', '),
    openGraph: {
      title: `${stack.name} - AI Agents & Development Tools`,
      description: `${stack.description} - Get access to ${stack.agents.length} specialized AI agents for ${stack.name} development.`,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${stack.name} - AI Agents & Development Tools`,
      description: `${stack.description} - Get access to ${stack.agents.length} specialized AI agents for ${stack.name} development.`
    }
  }
}

export default async function StackPage({ params }: StackPageProps) {
  const { id } = await params
  const stack = StackService.getStackById(id)

  if (!stack) {
    notFound()
  }

  return <StackDetailView stack={stack} />
}