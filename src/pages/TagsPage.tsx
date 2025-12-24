import { useEffect } from 'react'
import { Header } from '@/components/layout'
import { Card, Pagination, Select } from '@/components/common'
import { TagList } from '@/components/tags'
import { useTagStore, useUIStore } from '@/stores'
import { PLAY_TYPES } from '@/utils'

export function TagsPage() {
  const {
    tags,
    total,
    loading,
    params,
    fetchTags,
    deleteTag,
    markReviewed,
    toggleImportant,
    setParams,
  } = useTagStore()

  const { addToast } = useUIStore()

  useEffect(() => {
    fetchTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMarkReviewed = async (id: string) => {
    try {
      await markReviewed(id)
      addToast({ type: 'success', message: 'Tag marked as reviewed' })
    } catch {
      addToast({ type: 'error', message: 'Failed to mark tag as reviewed' })
    }
  }

  const handleToggleImportant = async (id: string) => {
    try {
      await toggleImportant(id)
      addToast({ type: 'success', message: 'Tag importance updated' })
    } catch {
      addToast({ type: 'error', message: 'Failed to update tag' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return

    try {
      await deleteTag(id)
      addToast({ type: 'success', message: 'Tag deleted' })
    } catch {
      addToast({ type: 'error', message: 'Failed to delete tag' })
    }
  }

  const handleFilterChange = (key: string, value: string | boolean) => {
    const newValue = value === '' ? undefined : value
    setParams({ [key]: newValue, offset: 0 })
    fetchTags({ [key]: newValue, offset: 0 })
  }

  const handlePageChange = (offset: number) => {
    setParams({ offset })
    fetchTags({ offset })
  }

  const playTypeOptions = [
    { value: '', label: 'All Play Types' },
    ...PLAY_TYPES.map((pt) => ({ value: pt, label: pt })),
  ]

  return (
    <>
      <Header title="Tags" subtitle={`${total} tag${total !== 1 ? 's' : ''}`} />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <Select
            value={params.play_type || ''}
            onChange={(e) => handleFilterChange('play_type', e.target.value)}
            options={playTypeOptions}
            className="w-40"
          />

          <Select
            value={params.is_reviewed === undefined ? '' : params.is_reviewed ? 'true' : 'false'}
            onChange={(e) => {
              const val = e.target.value
              handleFilterChange('is_reviewed', val === '' ? '' : val === 'true')
            }}
            options={[
              { value: '', label: 'All Review States' },
              { value: 'false', label: 'Pending Review' },
              { value: 'true', label: 'Reviewed' },
            ]}
            className="w-44"
          />

          <Select
            value={params.is_important === undefined ? '' : params.is_important ? 'true' : 'false'}
            onChange={(e) => {
              const val = e.target.value
              handleFilterChange('is_important', val === '' ? '' : val === 'true')
            }}
            options={[
              { value: '', label: 'All Importance' },
              { value: 'true', label: 'Important Only' },
              { value: 'false', label: 'Not Important' },
            ]}
            className="w-40"
          />
        </div>

        {/* Table */}
        <Card padding="none">
          <TagList
            tags={tags}
            loading={loading}
            onMarkReviewed={handleMarkReviewed}
            onToggleImportant={handleToggleImportant}
            onDelete={handleDelete}
          />

          <Pagination
            total={total}
            limit={params.limit || 50}
            offset={params.offset || 0}
            onPageChange={handlePageChange}
          />
        </Card>
      </div>
    </>
  )
}
