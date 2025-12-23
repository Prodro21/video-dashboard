import { create } from 'zustand'
import type { Session, CreateSessionRequest, UpdateSessionRequest, PaginatedResponse } from '@/types'
import { sessionsApi, SessionsQueryParams } from '@/api/endpoints/sessions'

interface SessionState {
  sessions: Session[]
  selectedSession: Session | null
  total: number
  loading: boolean
  error: string | null

  // Query params
  params: SessionsQueryParams

  // Actions
  fetchSessions: (params?: SessionsQueryParams) => Promise<void>
  fetchSession: (id: string) => Promise<Session | null>
  createSession: (data: CreateSessionRequest) => Promise<Session>
  updateSession: (id: string, data: UpdateSessionRequest) => Promise<Session>
  deleteSession: (id: string) => Promise<void>
  startSession: (id: string) => Promise<Session>
  pauseSession: (id: string) => Promise<Session>
  resumeSession: (id: string) => Promise<Session>
  completeSession: (id: string) => Promise<Session>
  setParams: (params: Partial<SessionsQueryParams>) => void
  clearError: () => void
}

const DEFAULT_PARAMS: SessionsQueryParams = {
  limit: 20,
  offset: 0,
  sort_by: 'created_at',
  sort_order: 'desc',
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  selectedSession: null,
  total: 0,
  loading: false,
  error: null,
  params: DEFAULT_PARAMS,

  fetchSessions: async (params) => {
    const queryParams = { ...get().params, ...params }
    set({ loading: true, error: null, params: queryParams })

    try {
      const response: PaginatedResponse<Session> = await sessionsApi.list(queryParams)
      set({
        sessions: response.data,
        total: response.total,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch sessions',
        loading: false,
      })
    }
  },

  fetchSession: async (id) => {
    set({ loading: true, error: null })

    try {
      const session = await sessionsApi.get(id)
      set({ selectedSession: session, loading: false })
      return session
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch session',
        loading: false,
      })
      return null
    }
  },

  createSession: async (data) => {
    set({ loading: true, error: null })

    try {
      const session = await sessionsApi.create(data)
      set((state) => ({
        sessions: [session, ...state.sessions],
        total: state.total + 1,
        loading: false,
      }))
      return session
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create session',
        loading: false,
      })
      throw error
    }
  },

  updateSession: async (id, data) => {
    set({ loading: true, error: null })

    try {
      const session = await sessionsApi.update(id, data)
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? session : s)),
        selectedSession: state.selectedSession?.id === id ? session : state.selectedSession,
        loading: false,
      }))
      return session
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update session',
        loading: false,
      })
      throw error
    }
  },

  deleteSession: async (id) => {
    set({ loading: true, error: null })

    try {
      await sessionsApi.delete(id)
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
        total: state.total - 1,
        selectedSession: state.selectedSession?.id === id ? null : state.selectedSession,
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete session',
        loading: false,
      })
      throw error
    }
  },

  startSession: async (id) => {
    try {
      const session = await sessionsApi.start(id)
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? session : s)),
        selectedSession: state.selectedSession?.id === id ? session : state.selectedSession,
      }))
      return session
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to start session' })
      throw error
    }
  },

  pauseSession: async (id) => {
    try {
      const session = await sessionsApi.pause(id)
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? session : s)),
        selectedSession: state.selectedSession?.id === id ? session : state.selectedSession,
      }))
      return session
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to pause session' })
      throw error
    }
  },

  resumeSession: async (id) => {
    try {
      const session = await sessionsApi.resume(id)
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? session : s)),
        selectedSession: state.selectedSession?.id === id ? session : state.selectedSession,
      }))
      return session
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to resume session' })
      throw error
    }
  },

  completeSession: async (id) => {
    try {
      const session = await sessionsApi.complete(id)
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? session : s)),
        selectedSession: state.selectedSession?.id === id ? session : state.selectedSession,
      }))
      return session
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to complete session' })
      throw error
    }
  },

  setParams: (params) =>
    set((state) => ({
      params: { ...state.params, ...params },
    })),

  clearError: () => set({ error: null }),
}))
