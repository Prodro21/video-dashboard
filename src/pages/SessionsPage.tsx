import { useEffect, useState } from 'react'
import { Header } from '@/components/layout'
import { Card, Button, Pagination, Select } from '@/components/common'
import { SessionList, SessionForm } from '@/components/sessions'
import { useSessionStore, useUIStore } from '@/stores'
import { SESSION_STATUSES, SESSION_TYPES } from '@/utils'

export function SessionsPage() {
  const {
    sessions,
    total,
    loading,
    params,
    fetchSessions,
    createSession,
    deleteSession,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    setParams,
  } = useSessionStore()

  const { addToast } = useUIStore()
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchSessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async (data: unknown) => {
    setFormLoading(true)
    try {
      await createSession(data as Parameters<typeof createSession>[0])
      addToast({ type: 'success', message: 'Session created successfully' })
    } finally {
      setFormLoading(false)
    }
  }

  const handleStart = async (id: string) => {
    try {
      await startSession(id)
      addToast({ type: 'success', message: 'Session started' })
    } catch {
      addToast({ type: 'error', message: 'Failed to start session' })
    }
  }

  const handlePause = async (id: string) => {
    try {
      await pauseSession(id)
      addToast({ type: 'success', message: 'Session paused' })
    } catch {
      addToast({ type: 'error', message: 'Failed to pause session' })
    }
  }

  const handleResume = async (id: string) => {
    try {
      await resumeSession(id)
      addToast({ type: 'success', message: 'Session resumed' })
    } catch {
      addToast({ type: 'error', message: 'Failed to resume session' })
    }
  }

  const handleComplete = async (id: string) => {
    try {
      await completeSession(id)
      addToast({ type: 'success', message: 'Session completed' })
    } catch {
      addToast({ type: 'error', message: 'Failed to complete session' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return

    try {
      await deleteSession(id)
      addToast({ type: 'success', message: 'Session deleted' })
    } catch {
      addToast({ type: 'error', message: 'Failed to delete session' })
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setParams({ [key]: value || undefined, offset: 0 })
    fetchSessions({ [key]: value || undefined, offset: 0 })
  }

  const handlePageChange = (offset: number) => {
    setParams({ offset })
    fetchSessions({ offset })
  }

  return (
    <>
      <Header
        title="Sessions"
        subtitle="Manage recording sessions"
        actions={
          <Button onClick={() => setShowForm(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Session
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select
            value={params.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={[{ value: '', label: 'All Statuses' }, ...SESSION_STATUSES]}
            className="w-40"
          />

          <Select
            value={params.session_type || ''}
            onChange={(e) => handleFilterChange('session_type', e.target.value)}
            options={[{ value: '', label: 'All Types' }, ...SESSION_TYPES]}
            className="w-40"
          />
        </div>

        {/* Table */}
        <Card padding="none">
          <SessionList
            sessions={sessions}
            loading={loading}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />

          <Pagination
            total={total}
            limit={params.limit || 20}
            offset={params.offset || 0}
            onPageChange={handlePageChange}
          />
        </Card>
      </div>

      <SessionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        loading={formLoading}
      />
    </>
  )
}
