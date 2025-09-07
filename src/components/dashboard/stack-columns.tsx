"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Lock, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Stack } from "@/types/stack"

const FREE_STACK_IDS = ['nextjs-t3', 'mern-stack', 'python-fastapi']

export function getStackColumns(hasFullAccess: boolean): ColumnDef<Stack>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Stack Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stack = row.original
        const isFree = FREE_STACK_IDS.includes(stack.id)
        const canAccess = isFree || hasFullAccess
        
        return (
          <div className="flex items-center space-x-2">
            {!canAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
            <div className="flex flex-col">
              <div className="font-medium">{stack.name}</div>
              {stack.featured && (
                <Badge variant="secondary" className="w-fit text-xs">
                  Featured
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
    {
      accessorKey: "technologies",
      header: "Technologies",
      cell: ({ row }) => {
        const technologies = row.original.technologies?.slice(0, 3) || []
        const remainingCount = (row.original.technologies?.length || 0) - 3
        
        return (
          <div className="flex flex-wrap gap-1">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remainingCount} more
              </Badge>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const technologies = row.original.technologies || []
        return value.some((filterValue: string) => 
          technologies.some((tech: string) => 
            tech.toLowerCase().includes(filterValue.toLowerCase())
          )
        )
      },
    },
    {
      accessorKey: "agents",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          <Users className="mr-2 h-4 w-4" />
          Agents
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const agentCount = row.original.agents?.length || 0
        return (
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{agentCount}</span>
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const countA = rowA.original.agents?.length || 0
        const countB = rowB.original.agents?.length || 0
        return countA - countB
      },
    },
  ]
}