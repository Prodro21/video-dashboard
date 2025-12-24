import { api } from '../client'
import type {
  Channel,
  CreateChannelRequest,
  UpdateChannelRequest,
  PaginatedResponse,
} from '@/types'

export interface ChannelsQueryParams {
  limit?: number
  offset?: number
  status?: string
}

interface ChannelsApiResponse {
  channels: Channel[] | null
  total: number
}

export const channelsApi = {
  async list(params?: ChannelsQueryParams): Promise<PaginatedResponse<Channel>> {
    const response = await api.get<ChannelsApiResponse>('/channels', params as Record<string, string | number | boolean | undefined>)
    return {
      data: response.channels || [],
      total: response.total,
      limit: params?.limit || 50,
      offset: params?.offset || 0,
    }
  },

  get(id: string): Promise<Channel> {
    return api.get(`/channels/${id}`)
  },

  create(data: CreateChannelRequest): Promise<Channel> {
    return api.post('/channels', data)
  },

  update(id: string, data: UpdateChannelRequest): Promise<Channel> {
    return api.put(`/channels/${id}`, data)
  },

  delete(id: string): Promise<void> {
    return api.delete(`/channels/${id}`)
  },

  activate(id: string): Promise<Channel> {
    return api.post(`/channels/${id}/activate`)
  },

  deactivate(id: string): Promise<Channel> {
    return api.post(`/channels/${id}/deactivate`)
  },

  heartbeat(id: string): Promise<void> {
    return api.post(`/channels/${id}/heartbeat`)
  },
}
