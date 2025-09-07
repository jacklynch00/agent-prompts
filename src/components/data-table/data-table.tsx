'use client';

import * as React from 'react';
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData> {
	table: TanstackTable<TData>;
	onRowClick?: (data: TData) => void;
}

export function DataTable<TData>({ table, onRowClick }: DataTableProps<TData>) {
	return (
		<div className='w-full space-y-2.5 overflow-auto'>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											style={{
												width: header.getSize() !== 150 ? header.getSize() : undefined,
											}}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50', row.getIsSelected() && 'bg-muted/50')}
									onClick={() => onRowClick?.(row.original)}>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											onClick={(e) => {
												// Prevent row click for checkbox column
												if (cell.column.id === 'select') {
													e.stopPropagation();
												}
											}}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={table.getAllColumns().length} className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex flex-col gap-2.5'>
				<DataTablePagination table={table} />
			</div>
		</div>
	);
}
