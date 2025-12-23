export type SessionType = 'game' | 'practice' | 'scrimmage' | 'training' | 'other'
export type SessionStatus = 'scheduled' | 'active' | 'paused' | 'completed' | 'archived'

export interface Session {
  id: string
  name: string
  session_type: SessionType
  status: SessionStatus
  scheduled_start?: string
  actual_start?: string
  actual_end?: string
  opponent?: string
  location?: string
  season?: number
  week?: number
  notes?: string
  clip_count: number
  tag_count: number
  total_duration_seconds: number
  created_at: string
  updated_at: string
}

export interface CreateSessionRequest {
  name: string
  session_type: SessionType
  scheduled_start?: string
  opponent?: string
  location?: string
  season?: number
  week?: number
  notes?: string
}

export interface UpdateSessionRequest {
  name?: string
  session_type?: SessionType
  scheduled_start?: string
  opponent?: string
  location?: string
  season?: number
  week?: number
  notes?: string
}
