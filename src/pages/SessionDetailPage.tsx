import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout'
import { Card, CardHeader, Button, StatusBadge } from '@/components/common'
import { SessionForm } from '@/components/sessions'
import { useSessionStore, useClipStore, useUIStore } from '@/stores'
import { formatDateTime, formatDuration, snakeToTitle } from '@/utils'
import { clipsApi } from '@/api'

export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    selectedSession: session,
    loading: sessionLoading,
    fetchSession,
    updateSession,
    deleteSession,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
  } = useSessionStore()

  const { clips, loading: clipsLoading, fetchClips } = useClipStore()
  const { addToast } = useUIStore()

  const [showEditForm, setShowEditForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchSession(id)
      fetchClips({ session_id: id, limit: 50 })
    }
  }, [id, fetchSession, fetchClips])

  if (sessionLoading && !session) {
    return (
      <>
        <Header title="Loading..." />
        <div className="flex items-center justify-center p-12">
          <svg className="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </>
    )
  }

  if (!session) {
    return (
      <>
        <Header title="Session Not Found" />
        <div className="p-6">
          <p className="text-gray-400">The requested session could not be found.</p>
          <Button onClick={() => navigate('/sessions')} className="mt-4">
            Back to Sessions
          </Button>
        </div>
      </>
    )
  }

  const handleUpdate = async (data: unknown) => {
    setFormLoading(true)
    try {
      await updateSession(session.id, data as Parameters<typeof updateSession>[1])
      addToast({ type: 'success', message: 'Session updated' })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this session? This will also delete all clips.')) return

    try {
      await deleteSession(session.id)
      addToast({ type: 'success', message: 'Session deleted' })
      navigate('/sessions')
    } catch {
      addToast({ type: 'error', message: 'Failed to delete session' })
    }
  }

  const handleAction = async (action: 'start' | 'pause' | 'resume' | 'complete') => {
    try {
      switch (action) {
        case 'start':
          await startSession(session.id)
          break
        case 'pause':
          await pauseSession(session.id)
          break
        case 'resume':
          await resumeSession(session.id)
          break
        case 'complete':
          await completeSession(session.id)
          break
      }
      addToast({ type: 'success', message: `Session ${action}ed` })
    } catch {
      addToast({ type: 'error', message: `Failed to ${action} session` })
    }
  }

  return (
    <>
      <Header
        title={session.name}
        subtitle={snakeToTitle(session.session_type)}
        actions={
          <div className="flex items-center gap-2">
            {session.status === 'scheduled' && (
              <Button onClick={() => handleAction('start')}>Start Session</Button>
            )}
            {session.status === 'active' && (
              <>
                <Button variant="secondary" onClick={() => handleAction('pause')}>
                  Pause
                </Button>
                <Button onClick={() => handleAction('complete')}>Complete</Button>
              </>
            )}
            {session.status === 'paused' && (
              <>
                <Button variant="secondary" onClick={() => handleAction('resume')}>
                  Resume
                </Button>
                <Button onClick={() => handleAction('complete')}>Complete</Button>
              </>
            )}
            <Button variant="secondary" onClick={() => setShowEditForm(true)}>
              Edit
            </Button>
            {session.status !== 'active' && session.status !== 'paused' && (
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Session Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-gray-400">Status</p>
            <StatusBadge status={session.status} />
          </Card>

          <Card>
            <p className="text-sm text-gray-400">Clips</p>
            <p className="text-xl font-semibold text-white">{session.clip_count}</p>
          </Card>

          <Card>
            <p className="text-sm text-gray-400">Duration</p>
            <p className="text-xl font-semibold text-white">
              {formatDuration(session.total_duration_seconds)}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-400">Created</p>
            <p className="text-sm text-white">{formatDateTime(session.created_at)}</p>
          </Card>
        </div>

        {/* Additional Info */}
        {(session.opponent || session.location || session.notes) && (
          <Card>
            <CardHeader title="Session Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {session.opponent && (
                <div>
                  <p className="text-sm text-gray-400">Opponent</p>
                  <p className="text-white">{session.opponent}</p>
                </div>
              )}
              {session.location && (
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">{session.location}</p>
                </div>
              )}
              {session.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400">Notes</p>
                  <p className="text-white whitespace-pre-wrap">{session.notes}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Clips Grid */}
        <Card padding="none">
          <div className="p-4 border-b border-dark-700">
            <CardHeader title="Session Clips" subtitle={`${clips.length} clips`} />
          </div>

          {clipsLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : clips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p>No clips in this session</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  onClick={() => navigate(`/clips/${clip.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-dark-700">
                    {clip.thumbnail_path ? (
                      <img
                        src={clipsApi.getThumbnailUrl(clip.id)}
                        alt={clip.title || clip.id}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {clip.duration_seconds > 0 && (
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                        {formatDuration(clip.duration_seconds)}
                      </div>
                    )}
                    {clip.is_favorite && (
                      <div className="absolute top-1 right-1 text-yellow-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <p className="text-sm text-gray-300 truncate">{clip.title || clip.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <SessionForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleUpdate}
        session={session}
        loading={formLoading}
      />
    </>
  )
}
