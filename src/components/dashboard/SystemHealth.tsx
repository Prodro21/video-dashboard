import { useNavigate } from 'react-router-dom'
import type { Channel } from '@/types'
import { Card, CardHeader, Button } from '@/components/common'
import { formatRelativeTime } from '@/utils'

interface SystemHealthProps {
  channels: Channel[]
  loading?: boolean
}

export function SystemHealth({ channels, loading }: SystemHealthProps) {
  const navigate = useNavigate()

  const activeCount = channels.filter((c) => c.status === 'active').length
  const errorCount = channels.filter((c) => c.status === 'error').length

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 border-b border-dark-700">
        <CardHeader
          title="System Health"
          subtitle={`${activeCount} active, ${errorCount} errors`}
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/channels')}>
              Manage
            </Button>
          }
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : channels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p>No channels configured</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className={`p-3 rounded-lg border transition-colors ${
                channel.status === 'active'
                  ? 'bg-green-900/20 border-green-700/50'
                  : channel.status === 'error'
                  ? 'bg-red-900/20 border-red-700/50'
                  : 'bg-dark-700 border-dark-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    channel.status === 'active'
                      ? 'bg-green-500'
                      : channel.status === 'error'
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-gray-500'
                  }`}
                />
                <span className="text-sm font-medium text-white truncate">{channel.name}</span>
              </div>
              <p className="text-xs text-gray-500">
                {channel.status === 'active' && channel.last_seen_at
                  ? `Active ${formatRelativeTime(channel.last_seen_at)}`
                  : channel.status === 'error'
                  ? channel.error_message || 'Error'
                  : 'Inactive'}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
