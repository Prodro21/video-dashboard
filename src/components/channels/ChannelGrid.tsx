import type { Channel } from '@/types'
import { Button } from '@/components/common'
import { formatRelativeTime } from '@/utils'

interface ChannelGridProps {
  channels: Channel[]
  loading?: boolean
  onActivate?: (id: string) => void
  onDeactivate?: (id: string) => void
  onEdit?: (channel: Channel) => void
  onDelete?: (id: string) => void
}

export function ChannelGrid({
  channels,
  loading,
  onActivate,
  onDeactivate,
  onEdit,
  onDelete,
}: ChannelGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p>No channels configured</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`p-4 rounded-xl border transition-colors ${
            channel.status === 'active'
              ? 'bg-green-900/20 border-green-700/50'
              : channel.status === 'error'
              ? 'bg-red-900/20 border-red-700/50'
              : 'bg-dark-800 border-dark-700'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  channel.status === 'active'
                    ? 'bg-green-500'
                    : channel.status === 'error'
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-gray-500'
                }`}
              />
              <h3 className="font-medium text-white">{channel.name}</h3>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-1 mb-4">
            {channel.description && (
              <p className="text-sm text-gray-400 truncate">{channel.description}</p>
            )}
            <p className="text-xs text-gray-500">
              {channel.input_type && <span>{channel.input_type}</span>}
              {channel.resolution && <span> &bull; {channel.resolution}</span>}
              {channel.framerate && <span> &bull; {channel.framerate}fps</span>}
            </p>
            <p className="text-xs text-gray-500">
              {channel.status === 'active' && channel.last_seen_at
                ? `Last seen ${formatRelativeTime(channel.last_seen_at)}`
                : channel.status === 'error' && channel.error_message
                ? channel.error_message
                : channel.status === 'inactive'
                ? 'Inactive'
                : ''}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {channel.status === 'inactive' && onActivate && (
              <Button size="sm" onClick={() => onActivate(channel.id)}>
                Activate
              </Button>
            )}
            {channel.status === 'active' && onDeactivate && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDeactivate(channel.id)}
              >
                Deactivate
              </Button>
            )}
            {channel.status === 'error' && onActivate && (
              <Button size="sm" onClick={() => onActivate(channel.id)}>
                Retry
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(channel)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
            )}
            {channel.status !== 'active' && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
                onClick={() => onDelete(channel.id)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
