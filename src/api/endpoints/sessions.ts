import { api } from '../client'
import type {
  Session,
  CreateSessionRequest,
  UpdateSessionRequest,
  PaginatedResponse,
} from '@/types'

export interface SessionsQueryParams {
  limit?: number
  offset?: number
  status?: string
  session_type?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export const sessionsApi = {
  list(params?: SessionsQueryParams): Promise<PaginatedResponse<Session>> {
    return api.get('/sessions', params as Record<string, string | number | boolean | undefined>)
  },

  get(id: string): Promise<Session> {
    return api.get(`/sessions/${id}`)
  },

  create(data: CreateSessionRequest): Promise<Session> {
    return api.post('/sessions', data)
  },

  update(id: string, data: UpdateSessionRequest): Promise<Session> {
    return api.put(`/sessions/${id}`, data)
  },

  delete(id: string): Promise<void> {
    return api.delete(`/sessions/${id}`)
  },

  start(id: string): Promise<Session> {
    return api.post(`/sessions/${id}/start`)
  },

  pause(id: string): Promise<Session> {
    return api.post(`/sessions/${id}/pause`)
  },

  resume(id: string): Promise<Session> {
    return api.post(`/sessions/${id}/resume`)
  },

  complete(id: string): Promise<Session> {
    return api.post(`/sessions/${id}/complete`)
  },

  archive(id: string): Promise<Session> {
    return api.post(`/sessions/${id}/archive`)
  },
}
