import { useNavigate } from 'react-router-dom'
import type { Session } from '@/types'
import { Card, CardHeader, StatusBadge, Button } from '@/components/common'
import { formatRelativeTime, snakeToTitle } from '@/utils'

interface ActiveSessionsProps {
  sessions: Session[]
  loading?: boolean
}

export function ActiveSessions({ sessions, loading }: ActiveSessionsProps) {
  const navigate = useNavigate()

  const activeSessions = sessions.filter(
    (s) => s.status === 'active' || s.status === 'paused'
  )

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 border-b border-dark-700">
        <CardHeader
          title="Active Sessions"
          subtitle={`${activeSessions.length} session${activeSessions.length !== 1 ? 's' : ''} in progress`}
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/sessions')}>
              View All
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
      ) : activeSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No active sessions</p>
        </div>
      ) : (
        <div className="divide-y divide-dark-700">
          {activeSessions.slice(0, 5).map((session) => (
            <div
              key={session.id}
              onClick={() => navigate(`/sessions/${session.id}`)}
              className="flex items-center justify-between px-4 py-3 hover:bg-dark-750 cursor-pointer transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{session.name}</p>
                  <StatusBadge status={session.status} size="sm" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {snakeToTitle(session.session_type)} &bull; {session.clip_count} clips
                </p>
              </div>
              <div className="text-xs text-gray-500">
                {session.actual_start ? formatRelativeTime(session.actual_start) : 'Not started'}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
