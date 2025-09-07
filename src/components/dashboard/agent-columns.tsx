"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Lock, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Agent } from "@/types/agent"

const FREE_AGENT_IDS = ['nextjs-expert', 'typescript-expert', 'frontend-file-structure-expert']

export function getAgentColumns(hasFullAccess: boolean): ColumnDef<Agent>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Agent Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const agent = row.original
        const isFree = FREE_AGENT_IDS.includes(agent.id)
        const canAccess = isFree || hasFullAccess
        
        return (
          <div className="flex items-center space-x-2">
            {!canAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
            <div className="flex flex-col">
              <div className="font-medium">{agent.name}</div>
              {agent.isPremium && (
                <Badge variant="secondary" className="w-fit text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        )
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description
        return (
          <div className="max-w-[300px]">
            <p className="truncate text-sm text-muted-foreground" title={description}>
              {description}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.category}
        </Badge>
      ),
    },
  ]
}