import { create } from 'zustand'
import type { Tag, CreateTagRequest, UpdateTagRequest, PaginatedResponse } from '@/types'
import { tagsApi, TagsQueryParams } from '@/api/endpoints/tags'

interface TagState {
  tags: Tag[]
  total: number
  loading: boolean
  error: string | null

  // Query params
  params: TagsQueryParams

  // Actions
  fetchTags: (params?: TagsQueryParams) => Promise<void>
  fetchTag: (id: string) => Promise<Tag | null>
  createTag: (data: CreateTagRequest) => Promise<Tag>
  updateTag: (id: string, data: UpdateTagRequest) => Promise<Tag>
  deleteTag: (id: string) => Promise<void>
  markReviewed: (id: string) => Promise<Tag>
  toggleImportant: (id: string) => Promise<Tag>
  setParams: (params: Partial<TagsQueryParams>) => void
  clearError: () => void
}

const DEFAULT_PARAMS: TagsQueryParams = {
  limit: 50,
  offset: 0,
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  total: 0,
  loading: false,
  error: null,
  params: DEFAULT_PARAMS,

  fetchTags: async (params) => {
    const queryParams = { ...get().params, ...params }
    set({ loading: true, error: null, params: queryParams })

    try {
      const response: PaginatedResponse<Tag> = await tagsApi.list(queryParams)
      set({
        tags: response.data,
        total: response.total,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch tags',
        loading: false,
      })
    }
  },

  fetchTag: async (id) => {
    set({ loading: true, error: null })

    try {
      const tag = await tagsApi.get(id)
      set({ loading: false })
      return tag
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch tag',
        loading: false,
      })
      return null
    }
  },

  createTag: async (data) => {
    set({ loading: true, error: null })

    try {
      const tag = await tagsApi.create(data)
      set((state) => ({
        tags: [tag, ...state.tags],
        total: state.total + 1,
        loading: false,
      }))
      return tag
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create tag',
        loading: false,
      })
      throw error
    }
  },

  updateTag: async (id, data) => {
    set({ loading: true, error: null })

    try {
      const tag = await tagsApi.update(id, data)
      set((state) => ({
        tags: state.tags.map((t) => (t.id === id ? tag : t)),
        loading: false,
      }))
      return tag
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update tag',
        loading: false,
      })
      throw error
    }
  },

  deleteTag: async (id) => {
    set({ loading: true, error: null })

    try {
      await tagsApi.delete(id)
      set((state) => ({
        tags: state.tags.filter((t) => t.id !== id),
        total: state.total - 1,
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete tag',
        loading: false,
      })
      throw error
    }
  },

  markReviewed: async (id) => {
    try {
      const tag = await tagsApi.markReviewed(id)
      set((state) => ({
        tags: state.tags.map((t) => (t.id === id ? tag : t)),
      }))
      return tag
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to mark tag as reviewed' })
      throw error
    }
  },

  toggleImportant: async (id) => {
    const tag = get().tags.find((t) => t.id === id)
    if (!tag) throw new Error('Tag not found')

    try {
      const updated = await tagsApi.markImportant(id, !tag.is_important)
      set((state) => ({
        tags: state.tags.map((t) => (t.id === id ? updated : t)),
      }))
      return updated
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to toggle importance' })
      throw error
    }
  },

  setParams: (params) =>
    set((state) => ({
      params: { ...state.params, ...params },
    })),

  clearError: () => set({ error: null }),
}))
