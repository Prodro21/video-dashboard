import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Header } from '@/components/layout'
import { Card, Pagination } from '@/components/common'
import { ClipGrid, ClipFilters } from '@/components/clips'
import { useClipStore, useUIStore } from '@/stores'
import type { ClipFilters as ClipFiltersType } from '@/types'

export function ClipsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    clips,
    total,
    loading,
    filters,
    params,
    fetchClips,
    toggleFavorite,
    setFilters,
    clearFilters,
    setParams,
  } = useClipStore()

  const { addToast } = useUIStore()

  // Sync URL params to filters on mount
  useEffect(() => {
    const urlFilters: ClipFiltersType = {}
    const sessionId = searchParams.get('session_id')
    const status = searchParams.get('status')
    const favorite = searchParams.get('favorite')
    const search = searchParams.get('search')

    if (sessionId) urlFilters.session_id = sessionId
    if (status) urlFilters.status = status as ClipFiltersType['status']
    if (favorite === 'true') urlFilters.favorite = true
    if (search) urlFilters.search = search

    setFilters(urlFilters)
    fetchClips()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (newFilters: Partial<ClipFiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    setParams({ offset: 0 })

    // Update URL params
    const params = new URLSearchParams()
    if (updatedFilters.session_id) params.set('session_id', updatedFilters.session_id)
    if (updatedFilters.status) params.set('status', updatedFilters.status)
    if (updatedFilters.favorite) params.set('favorite', 'true')
    if (updatedFilters.search) params.set('search', updatedFilters.search)
    setSearchParams(params, { replace: true })

    fetchClips({ ...updatedFilters, offset: 0 })
  }

  const handleClearFilters = () => {
    clearFilters()
    setParams({ offset: 0 })
    setSearchParams({}, { replace: true })
    fetchClips({ offset: 0 })
  }

  const handleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id)
    } catch {
      addToast({ type: 'error', message: 'Failed to update favorite' })
    }
  }

  const handlePageChange = (offset: number) => {
    setParams({ offset })
    fetchClips({ offset })
  }

  return (
    <>
      <Header title="Clips" subtitle={`${total} clip${total !== 1 ? 's' : ''}`} />

      <div className="p-6">
        <Card padding="none">
          <ClipFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          <ClipGrid
            clips={clips}
            loading={loading}
            onFavorite={handleFavorite}
          />

          <Pagination
            total={total}
            limit={params.limit || 20}
            offset={params.offset || 0}
            onPageChange={handlePageChange}
          />
        </Card>
      </div>
    </>
  )
}
