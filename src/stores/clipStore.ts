import { create } from 'zustand'
import type { Clip, ClipFilters, PaginatedResponse } from '@/types'
import { clipsApi, ClipsQueryParams } from '@/api/endpoints/clips'

interface ClipState {
  clips: Clip[]
  selectedClip: Clip | null
  total: number
  loading: boolean
  error: string | null

  // Filters and query params
  filters: ClipFilters
  params: ClipsQueryParams

  // Actions
  fetchClips: (params?: ClipsQueryParams) => Promise<void>
  fetchClip: (id: string) => Promise<Clip | null>
  toggleFavorite: (id: string) => Promise<void>
  deleteClip: (id: string) => Promise<void>
  setFilters: (filters: Partial<ClipFilters>) => void
  clearFilters: () => void
  setParams: (params: Partial<ClipsQueryParams>) => void
  clearError: () => void
}

const DEFAULT_PARAMS: ClipsQueryParams = {
  limit: 20,
  offset: 0,
  sort_by: 'created_at',
  sort_order: 'desc',
}

const DEFAULT_FILTERS: ClipFilters = {}

export const useClipStore = create<ClipState>((set, get) => ({
  clips: [],
  selectedClip: null,
  total: 0,
  loading: false,
  error: null,
  filters: DEFAULT_FILTERS,
  params: DEFAULT_PARAMS,

  fetchClips: async (params) => {
    const queryParams = { ...get().params, ...get().filters, ...params }
    set({ loading: true, error: null, params: { ...get().params, ...params } })

    try {
      const response: PaginatedResponse<Clip> = await clipsApi.list(queryParams)
      set({
        clips: response.data,
        total: response.total,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch clips',
        loading: false,
      })
    }
  },

  fetchClip: async (id) => {
    set({ loading: true, error: null })

    try {
      const clip = await clipsApi.get(id)
      set({ selectedClip: clip, loading: false })
      return clip
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch clip',
        loading: false,
      })
      return null
    }
  },

  toggleFavorite: async (id) => {
    const clip = get().clips.find((c) => c.id === id)
    if (!clip) return

    try {
      const updated = clip.is_favorite
        ? await clipsApi.unfavorite(id)
        : await clipsApi.favorite(id)

      set((state) => ({
        clips: state.clips.map((c) => (c.id === id ? updated : c)),
        selectedClip: state.selectedClip?.id === id ? updated : state.selectedClip,
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update favorite' })
    }
  },

  deleteClip: async (id) => {
    set({ loading: true, error: null })

    try {
      await clipsApi.delete(id)
      set((state) => ({
        clips: state.clips.filter((c) => c.id !== id),
        total: state.total - 1,
        selectedClip: state.selectedClip?.id === id ? null : state.selectedClip,
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete clip',
        loading: false,
      })
      throw error
    }
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () => set({ filters: DEFAULT_FILTERS }),

  setParams: (params) =>
    set((state) => ({
      params: { ...state.params, ...params },
    })),

  clearError: () => set({ error: null }),
}))
