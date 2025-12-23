export interface Tag {
  id: string
  clip_id: string
  session_id: string
  quarter?: number
  down?: number
  distance?: number
  yard_line?: number
  play_type?: string
  formation?: string
  result?: string
  yards_gained?: number
  category?: string
  labels?: string[]
  players?: string[]
  notes?: string
  coach_notes?: string
  is_important: boolean
  is_reviewed: boolean
  tagged_by?: string
  tagged_at?: string
  created_at: string
  updated_at: string
}

export interface CreateTagRequest {
  clip_id: string
  session_id: string
  quarter?: number
  down?: number
  distance?: number
  yard_line?: number
  play_type?: string
  formation?: string
  result?: string
  yards_gained?: number
  category?: string
  labels?: string[]
  players?: string[]
  notes?: string
}

export interface UpdateTagRequest {
  quarter?: number
  down?: number
  distance?: number
  yard_line?: number
  play_type?: string
  formation?: string
  result?: string
  yards_gained?: number
  category?: string
  labels?: string[]
  players?: string[]
  notes?: string
  coach_notes?: string
  is_important?: boolean
  is_reviewed?: boolean
}
