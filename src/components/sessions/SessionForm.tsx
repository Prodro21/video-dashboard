import { useState, useEffect } from 'react'
import type { Session, CreateSessionRequest, UpdateSessionRequest, SessionType } from '@/types'
import { Modal, Button, Input, Select } from '@/components/common'
import { SESSION_TYPES } from '@/utils'

interface SessionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateSessionRequest | UpdateSessionRequest) => Promise<void>
  session?: Session
  loading?: boolean
}

export function SessionForm({ isOpen, onClose, onSubmit, session, loading }: SessionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    session_type: 'practice' as SessionType,
    scheduled_start: '',
    opponent: '',
    location: '',
    notes: '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      setFormData({
        name: session.name,
        session_type: session.session_type,
        scheduled_start: session.scheduled_start || '',
        opponent: session.opponent || '',
        location: session.location || '',
        notes: session.notes || '',
      })
    } else {
      setFormData({
        name: '',
        session_type: 'practice',
        scheduled_start: '',
        opponent: '',
        location: '',
        notes: '',
      })
    }
    setError(null)
  }, [session, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save session')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={session ? 'Edit Session' : 'Create Session'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {session ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Session Name"
          value={formData.name}
          onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g., Game vs Eagles"
          required
        />

        <Select
          label="Session Type"
          value={formData.session_type}
          onChange={(e) =>
            setFormData((f) => ({ ...f, session_type: e.target.value as SessionType }))
          }
          options={SESSION_TYPES}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Opponent"
            value={formData.opponent}
            onChange={(e) => setFormData((f) => ({ ...f, opponent: e.target.value }))}
            placeholder="e.g., Eagles"
          />

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
            placeholder="e.g., Home Field"
          />
        </div>

        <Input
          type="datetime-local"
          label="Scheduled Start"
          value={formData.scheduled_start}
          onChange={(e) => setFormData((f) => ({ ...f, scheduled_start: e.target.value }))}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Additional notes..."
          />
        </div>
      </form>
    </Modal>
  )
}
