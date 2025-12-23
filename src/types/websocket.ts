import type { Clip } from './clip'
import type { Session } from './session'

export type WSEventType =
  | 'clip_created'
  | 'clip_ready'
  | 'clip_failed'
  | 'clip_segment_ready'
  | 'session_start'
  | 'session_end'

export interface WSMessage<T = unknown> {
  type: WSEventType
  payload: T
}

export interface ClipReadyPayload {
  clip: Clip
}

export interface ClipFailedPayload {
  clip_id?: string
  play_id?: string
  channel_id: string
  error: string
}

export interface ClipSegmentReadyPayload {
  play_id: string
  channel_id: string
  segment_url: string
  sequence: number
  timestamp: number
  is_final: boolean
}

export interface SessionEventPayload {
  session: Session
}
