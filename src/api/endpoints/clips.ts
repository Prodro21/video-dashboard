import { api } from '../client'
import type { Clip, ClipFilters, PaginatedResponse } from '@/types'

export interface ClipsQueryParams extends ClipFilters {
  limit?: number
  offset?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export const clipsApi = {
  list(params?: ClipsQueryParams): Promise<PaginatedResponse<Clip>> {
    return api.get('/clips', params as Record<string, string | number | boolean | undefined>)
  },

  get(id: string): Promise<Clip> {
    return api.get(`/clips/${id}`)
  },

  delete(id: string): Promise<void> {
    return api.delete(`/clips/${id}`)
  },

  favorite(id: string): Promise<Clip> {
    return api.post(`/clips/${id}/favorite`)
  },

  unfavorite(id: string): Promise<Clip> {
    return api.delete(`/clips/${id}/favorite`)
  },

  // URL builders for media assets
  getStreamUrl(id: string): string {
    return `/api/v1/clips/${id}/stream`
  },

  getThumbnailUrl(id: string): string {
    return `/api/v1/clips/${id}/thumbnail`
  },

  getDownloadUrl(id: string): string {
    return `/api/v1/clips/${id}/download`
  },
}
