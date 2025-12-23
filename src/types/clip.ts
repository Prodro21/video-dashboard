export type ClipStatus = 'pending' | 'processing' | 'ready' | 'failed' | 'deleted'

export interface Clip {
  id: string
  session_id: string
  channel_id: string
  title?: string
  start_time: string
  end_time: string
  duration_seconds: number
  file_path?: string
  file_size_bytes?: number
  thumbnail_path?: string
  format: string
  codec: string
  resolution?: string
  status: ClipStatus
  error_message?: string
  view_count: number
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface ClipFilters {
  session_id?: string
  channel_id?: string
  status?: ClipStatus
  favorite?: boolean
  search?: string
}

export interface CreateClipRequest {
  session_id: string
  channel_id: string
  title?: string
  start_time: string
  end_time: string
}

export interface UpdateClipRequest {
  title?: string
}
