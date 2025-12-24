import { create } from 'zustand'
import type { Agent, UpdateAgentRequest, PaginatedResponse } from '@/types'
import { agentsApi, AgentsQueryParams } from '@/api/endpoints/agents'

interface AgentState {
  agents: Agent[]
  total: number
  loading: boolean
  error: string | null

  // Query params
  params: AgentsQueryParams

  // Actions
  fetchAgents: (params?: AgentsQueryParams) => Promise<void>
  fetchAgent: (id: string) => Promise<Agent | null>
  updateAgent: (id: string, data: UpdateAgentRequest) => Promise<Agent>
  deleteAgent: (id: string) => Promise<void>
  assignChannel: (id: string, channelId: string) => Promise<Agent>
  startRecording: (id: string, sessionId: string) => Promise<Agent>
  stopRecording: (id: string) => Promise<Agent>
  setParams: (params: Partial<AgentsQueryParams>) => void
  clearError: () => void
}

const DEFAULT_PARAMS: AgentsQueryParams = {
  limit: 50,
  offset: 0,
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  total: 0,
  loading: false,
  error: null,
  params: DEFAULT_PARAMS,

  fetchAgents: async (params) => {
    const queryParams = { ...get().params, ...params }
    set({ loading: true, error: null, params: queryParams })

    try {
      const response: PaginatedResponse<Agent> = await agentsApi.list(queryParams)
      set({
        agents: response.data,
        total: response.total,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch agents',
        loading: false,
      })
    }
  },

  fetchAgent: async (id) => {
    set({ loading: true, error: null })

    try {
      const agent = await agentsApi.get(id)
      set({ loading: false })
      return agent
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch agent',
        loading: false,
      })
      return null
    }
  },

  updateAgent: async (id, data) => {
    set({ loading: true, error: null })

    try {
      const agent = await agentsApi.update(id, data)
      set((state) => ({
        agents: state.agents.map((a) => (a.id === id ? agent : a)),
        loading: false,
      }))
      return agent
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update agent',
        loading: false,
      })
      throw error
    }
  },

  deleteAgent: async (id) => {
    set({ loading: true, error: null })

    try {
      await agentsApi.delete(id)
      set((state) => ({
        agents: state.agents.filter((a) => a.id !== id),
        total: state.total - 1,
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete agent',
        loading: false,
      })
      throw error
    }
  },

  assignChannel: async (id, channelId) => {
    try {
      const agent = await agentsApi.assignChannel(id, channelId)
      set((state) => ({
        agents: state.agents.map((a) => (a.id === id ? agent : a)),
      }))
      return agent
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to assign channel' })
      throw error
    }
  },

  startRecording: async (id, sessionId) => {
    try {
      const agent = await agentsApi.startRecording(id, sessionId)
      set((state) => ({
        agents: state.agents.map((a) => (a.id === id ? agent : a)),
      }))
      return agent
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to start recording' })
      throw error
    }
  },

  stopRecording: async (id) => {
    try {
      const agent = await agentsApi.stopRecording(id)
      set((state) => ({
        agents: state.agents.map((a) => (a.id === id ? agent : a)),
      }))
      return agent
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to stop recording' })
      throw error
    }
  },

  setParams: (params) =>
    set((state) => ({
      params: { ...state.params, ...params },
    })),

  clearError: () => set({ error: null }),
}))
