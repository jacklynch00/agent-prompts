'use client';

import * as React from 'react';
import {
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnFiltersState,
	type PaginationState,
	type SortingState,
	type VisibilityState,
} from '@tanstack/react-table';

import { useRouter } from 'next/navigation';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useUserPurchases } from '@/hooks/queries/use-user-purchases';

import { getStackColumns } from './stack-columns';
import { type DataTableFilterableColumn, type DataTableSearchableColumn } from '@/components/data-table/types';
import type { Stack } from '@/types/stack';

interface StacksDataTableProps {
	data: Stack[];
	categories: string[];
}

const FREE_STACK_IDS = ['nextjs-t3', 'mern-stack', 'python-fastapi'];

export function StacksDataTable({ data, categories }: StacksDataTableProps) {
	const router = useRouter();
	const { data: purchases } = useUserPurchases();
	const hasFullAccess = purchases?.hasFullAccess || false;

	// Handle row click navigation
	const handleRowClick = React.useCallback(
		(stack: Stack) => {
			const isFree = FREE_STACK_IDS.includes(stack.id);
			const canAccess = isFree || hasFullAccess;

			if (canAccess) {
				router.push(`/dashboard/stack/${stack.id}`);
			}
		},
		[router, hasFullAccess]
	);

	// Memoize columns to prevent recreation on every render
	const columns = React.useMemo(() => getStackColumns(hasFullAccess), [hasFullAccess]);

	// Table state
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	// Define searchable and filterable columns (memoized)
	const searchableColumns = React.useMemo<DataTableSearchableColumn<Stack>[]>(
		() => [
			{
				id: 'name',
				title: 'stacks',
			},
		],
		[]
	);

	const filterableColumns = React.useMemo<DataTableFilterableColumn<Stack>[]>(
		() => [
			{
				id: 'category',
				title: 'Category',
				options: categories.map((category) => ({
					label: category.charAt(0).toUpperCase() + category.slice(1),
					value: category,
				})),
			},
		],
		[categories]
	);

	// Create table instance
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			columnFilters,
			pagination,
		},
		enableRowSelection: false,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<div className='space-y-4'>
			<DataTableToolbar table={table} filterableColumns={filterableColumns} searchableColumns={searchableColumns} />
			<DataTable table={table} onRowClick={handleRowClick} />
		</div>
	);
}
