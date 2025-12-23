import type { ClipFilters as ClipFiltersType } from '@/types'
import { Input, Select, Button } from '@/components/common'

interface ClipFiltersProps {
  filters: ClipFiltersType
  onFilterChange: (filters: Partial<ClipFiltersType>) => void
  onClear: () => void
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'ready', label: 'Ready' },
  { value: 'processing', label: 'Processing' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
]

export function ClipFilters({ filters, onFilterChange, onClear }: ClipFiltersProps) {
  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '')

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-dark-800 border-b border-dark-700">
      <Input
        placeholder="Search clips..."
        value={filters.search || ''}
        onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
        className="w-64"
      />

      <Select
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ status: e.target.value as ClipFiltersType['status'] || undefined })}
        options={statusOptions}
        className="w-40"
      />

      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.favorite === true}
          onChange={(e) => onFilterChange({ favorite: e.target.checked ? true : undefined })}
          className="w-4 h-4 rounded bg-dark-700 border-dark-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
        />
        Favorites only
      </label>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
