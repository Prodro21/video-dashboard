import { useNavigate } from 'react-router-dom'
import type { Session } from '@/types'
import { Table, StatusBadge, Button } from '@/components/common'
import { formatDateTime, formatDuration, snakeToTitle } from '@/utils'

interface SessionListProps {
  sessions: Session[]
  loading?: boolean
  onStart?: (id: string) => void
  onPause?: (id: string) => void
  onResume?: (id: string) => void
  onComplete?: (id: string) => void
  onDelete?: (id: string) => void
}

export function SessionList({
  sessions,
  loading,
  onStart,
  onPause,
  onResume,
  onComplete,
  onDelete,
}: SessionListProps) {
  const navigate = useNavigate()

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (session: Session) => (
        <div>
          <p className="font-medium text-white">{session.name}</p>
          <p className="text-xs text-gray-500">{snakeToTitle(session.session_type)}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (session: Session) => <StatusBadge status={session.status} />,
    },
    {
      key: 'clips',
      header: 'Clips',
      render: (session: Session) => (
        <span className="text-gray-300">{session.clip_count}</span>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (session: Session) => (
        <span className="text-gray-300">
          {formatDuration(session.total_duration_seconds)}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (session: Session) => (
        <span className="text-gray-400 text-sm">
          {formatDateTime(session.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-48',
      render: (session: Session) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {session.status === 'scheduled' && onStart && (
            <Button variant="ghost" size="sm" onClick={() => onStart(session.id)}>
              Start
            </Button>
          )}
          {session.status === 'active' && onPause && (
            <Button variant="ghost" size="sm" onClick={() => onPause(session.id)}>
              Pause
            </Button>
          )}
          {session.status === 'paused' && onResume && (
            <Button variant="ghost" size="sm" onClick={() => onResume(session.id)}>
              Resume
            </Button>
          )}
          {(session.status === 'active' || session.status === 'paused') && onComplete && (
            <Button variant="ghost" size="sm" onClick={() => onComplete(session.id)}>
              Complete
            </Button>
          )}
          {session.status !== 'active' && session.status !== 'paused' && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300"
              onClick={() => onDelete(session.id)}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <Table
      data={sessions}
      columns={columns}
      keyExtractor={(s) => s.id}
      onRowClick={(s) => navigate(`/sessions/${s.id}`)}
      loading={loading}
      emptyMessage="No sessions found"
    />
  )
}
