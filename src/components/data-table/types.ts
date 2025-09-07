import { type Table } from "@tanstack/react-table"

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export interface DataTableProps<TData> {
  /**
   * The table instance returned from useReactTable hook with pagination, sorting, filtering, etc.
   * @type Table<TData>
   */
  table: Table<TData>

  /**
   * The floating bar to show at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   */
  floatingBar?: React.ReactNode | null

  /**
   * The pagination component to render below the table.
   * @default DataTablePagination
   * @type React.ComponentType<{ table: Table<TData> }>
   */
  pagination?: React.ComponentType<{ table: Table<TData> }>
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns?: DataTableFilterableColumn<TData>[]
  searchableColumns?: DataTableSearchableColumn<TData>[]
  newRowLink?: string
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
}