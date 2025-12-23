import { create } from 'zustand'
import type { Channel, CreateChannelRequest, UpdateChannelRequest, PaginatedResponse } from '@/types'
import { channelsApi, ChannelsQueryParams } from '@/api/endpoints/channels'

interface ChannelState {
  channels: Channel[]
  total: number
  loading: boolean
  error: string | null

  // Query params
  params: ChannelsQueryParams

  // Actions
  fetchChannels: (params?: ChannelsQueryParams) => Promise<void>
  fetchChannel: (id: string) => Promise<Channel | null>
  createChannel: (data: CreateChannelRequest) => Promise<Channel>
  updateChannel: (id: string, data: UpdateChannelRequest) => Promise<Channel>
  deleteChannel: (id: string) => Promise<void>
  activateChannel: (id: string) => Promise<Channel>
  deactivateChannel: (id: string) => Promise<Channel>
  setParams: (params: Partial<ChannelsQueryParams>) => void
  clearError: () => void
}

const DEFAULT_PARAMS: ChannelsQueryParams = {
  limit: 50,
  offset: 0,
}

export const useChannelStore = create<ChannelState>((set, get) => ({
  channels: [],
  total: 0,
  loading: false,
  error: null,
  params: DEFAULT_PARAMS,

  fetchChannels: async (params) => {
    const queryParams = { ...get().params, ...params }
    set({ loading: true, error: null, params: queryParams })

    try {
      const response: PaginatedResponse<Channel> = await channelsApi.list(queryParams)
      set({
        channels: response.data,
        total: response.total,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch channels',
        loading: false,
      })
    }
  },

  fetchChannel: async (id) => {
    set({ loading: true, error: null })

    try {
      const channel = await channelsApi.get(id)
      set({ loading: false })
      return channel
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch channel',
        loading: false,
      })
      return null
    }
  },

  createChannel: async (data) => {
    set({ loading: true, error: null })

    try {
      const channel = await channelsApi.create(data)
      set((state) => ({
        channels: [...state.channels, channel],
        total: state.total + 1,
        loading: false,
      }))
      return channel
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create channel',
        loading: false,
      })
      throw error
    }
  },

  updateChannel: async (id, data) => {
    set({ loading: true, error: null })

    try {
      const channel = await channelsApi.update(id, data)
      set((state) => ({
        channels: state.channels.map((c) => (c.id === id ? channel : c)),
        loading: false,
      }))
      return channel
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update channel',
        loading: false,
      })
      throw error
    }
  },

  deleteChannel: async (id) => {
    set({ loading: true, error: null })

    try {
      await channelsApi.delete(id)
      set((state) => ({
        channels: state.channels.filter((c) => c.id !== id),
        total: state.total - 1,
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete channel',
        loading: false,
      })
      throw error
    }
  },

  activateChannel: async (id) => {
    try {
      const channel = await channelsApi.activate(id)
      set((state) => ({
        channels: state.channels.map((c) => (c.id === id ? channel : c)),
      }))
      return channel
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to activate channel' })
      throw error
    }
  },

  deactivateChannel: async (id) => {
    try {
      const channel = await channelsApi.deactivate(id)
      set((state) => ({
        channels: state.channels.map((c) => (c.id === id ? channel : c)),
      }))
      return channel
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to deactivate channel' })
      throw error
    }
  },

  setParams: (params) =>
    set((state) => ({
      params: { ...state.params, ...params },
    })),

  clearError: () => set({ error: null }),
}))
