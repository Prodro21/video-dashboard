import { api } from '../client'
import type {
  Agent,
  UpdateAgentRequest,
  PaginatedResponse,
} from '@/types'

export interface AgentsQueryParams {
  limit?: number
  offset?: number
  status?: string
}

interface AgentsApiResponse {
  agents: Agent[] | null
  total: number
}

export const agentsApi = {
  async list(params?: AgentsQueryParams): Promise<PaginatedResponse<Agent>> {
    const response = await api.get<AgentsApiResponse>('/agents', params as Record<string, string | number | boolean | undefined>)
    return {
      data: response.agents || [],
      total: response.total,
      limit: params?.limit || 50,
      offset: params?.offset || 0,
    }
  },

  get(id: string): Promise<Agent> {
    return api.get(`/agents/${id}`)
  },

  update(id: string, data: UpdateAgentRequest): Promise<Agent> {
    return api.patch(`/agents/${id}`, data)
  },

  delete(id: string): Promise<void> {
    return api.delete(`/agents/${id}`)
  },

  assignChannel(id: string, channelId: string): Promise<Agent> {
    return api.post(`/agents/${id}/assign`, { channel_id: channelId })
  },

  startRecording(id: string, sessionId: string): Promise<Agent> {
    return api.post(`/agents/${id}/start`, { session_id: sessionId })
  },

  stopRecording(id: string): Promise<Agent> {
    return api.post(`/agents/${id}/stop`)
  },
}
