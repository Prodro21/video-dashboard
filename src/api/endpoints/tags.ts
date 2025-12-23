import { api } from '../client'
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  PaginatedResponse,
} from '@/types'

export interface TagsQueryParams {
  limit?: number
  offset?: number
  session_id?: string
  clip_id?: string
  is_important?: boolean
  is_reviewed?: boolean
  play_type?: string
  category?: string
}

export const tagsApi = {
  list(params?: TagsQueryParams): Promise<PaginatedResponse<Tag>> {
    return api.get('/tags', params as Record<string, string | number | boolean | undefined>)
  },

  get(id: string): Promise<Tag> {
    return api.get(`/tags/${id}`)
  },

  create(data: CreateTagRequest): Promise<Tag> {
    return api.post('/tags', data)
  },

  update(id: string, data: UpdateTagRequest): Promise<Tag> {
    return api.put(`/tags/${id}`, data)
  },

  delete(id: string): Promise<void> {
    return api.delete(`/tags/${id}`)
  },

  markReviewed(id: string): Promise<Tag> {
    return api.post(`/tags/${id}/reviewed`)
  },

  markImportant(id: string, important: boolean): Promise<Tag> {
    return api.patch(`/tags/${id}`, { is_important: important })
  },
}
