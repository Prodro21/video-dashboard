import type { SessionType, SessionStatus, ChannelStatus } from '@/types'

export const SESSION_TYPES: { value: SessionType; label: string }[] = [
  { value: 'game', label: 'Game' },
  { value: 'practice', label: 'Practice' },
  { value: 'scrimmage', label: 'Scrimmage' },
  { value: 'training', label: 'Training' },
  { value: 'other', label: 'Other' },
]

export const SESSION_STATUSES: { value: SessionStatus; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

export const CHANNEL_STATUSES: { value: ChannelStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'error', label: 'Error' },
]

export const PLAY_TYPES = [
  'Run',
  'Pass',
  'Punt',
  'Kickoff',
  'Field Goal',
  'Extra Point',
  'Two Point',
  'Penalty',
  'Timeout',
  'Other',
]

export const FORMATIONS = [
  'I Formation',
  'Shotgun',
  'Pistol',
  'Single Back',
  'Pro Set',
  'Spread',
  'Wildcat',
  'Goal Line',
  '4-3',
  '3-4',
  'Nickel',
  'Dime',
  'Prevent',
]

export const CATEGORIES = [
  'Offense',
  'Defense',
  'Special Teams',
  'Highlight',
  'Mistake',
  'Teaching Moment',
]

export const RESULTS = [
  'Touchdown',
  'First Down',
  'Gain',
  'No Gain',
  'Loss',
  'Incomplete',
  'Interception',
  'Fumble',
  'Sack',
  'Safety',
  'Field Goal Made',
  'Field Goal Missed',
]

export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
