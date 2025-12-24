export type AgentStatus = 'online' | 'recording' | 'error' | 'offline'

export interface AgentCapabilities {
  can_capture_srt: boolean
  can_capture_rtsp: boolean
  can_capture_rtmp: boolean
  can_capture_ndi: boolean
  can_capture_usb: boolean
  supported_codecs: string[]
  max_resolution: string
  max_bitrate: number
}

export interface Agent {
  id: string
  name: string
  url: string
  channel_id?: string
  session_id?: string
  status: AgentStatus
  capabilities: AgentCapabilities
  version?: string
  hostname?: string
  last_seen_at: string
  error_message?: string
  created_at: string
  updated_at: string
}

export interface RegisterAgentRequest {
  id: string
  name: string
  url: string
  channel_id?: string
  capabilities: AgentCapabilities
  version?: string
  hostname?: string
}

export interface AgentHeartbeatRequest {
  status: AgentStatus
  session_id?: string
  channel_id?: string
  error_message?: string
}

export interface UpdateAgentRequest {
  name?: string
  channel_id?: string
  session_id?: string
  status?: AgentStatus
  error_message?: string
}
