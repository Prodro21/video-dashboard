export type ChannelStatus = 'active' | 'inactive' | 'error'

export interface Channel {
  id: string
  name: string
  description?: string
  input_type?: string
  input_url?: string
  resolution?: string
  framerate?: number
  bitrate?: number
  status: ChannelStatus
  last_seen_at?: string
  error_message?: string
  created_at: string
  updated_at: string
}

export interface CreateChannelRequest {
  id: string
  name: string
  description?: string
  input_type?: string
  input_url?: string
}

export interface UpdateChannelRequest {
  name?: string
  description?: string
  input_type?: string
  input_url?: string
}
