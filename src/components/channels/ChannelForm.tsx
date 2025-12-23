import { useState, useEffect } from 'react'
import type { Channel, CreateChannelRequest, UpdateChannelRequest } from '@/types'
import { Modal, Button, Input } from '@/components/common'

interface ChannelFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateChannelRequest | UpdateChannelRequest) => Promise<void>
  channel?: Channel
  loading?: boolean
}

export function ChannelForm({ isOpen, onClose, onSubmit, channel, loading }: ChannelFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    input_type: '',
    input_url: '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (channel) {
      setFormData({
        id: channel.id,
        name: channel.name,
        description: channel.description || '',
        input_type: channel.input_type || '',
        input_url: channel.input_url || '',
      })
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        input_type: '',
        input_url: '',
      })
    }
    setError(null)
  }, [channel, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (!channel && !formData.id.trim()) {
      setError('ID is required')
      return
    }

    try {
      if (channel) {
        const { name, description, input_type, input_url } = formData
        await onSubmit({ name, description, input_type, input_url })
      } else {
        await onSubmit(formData)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save channel')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={channel ? 'Edit Channel' : 'Add Channel'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {channel ? 'Update' : 'Create'}
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

        {!channel && (
          <Input
            label="Channel ID"
            value={formData.id}
            onChange={(e) => setFormData((f) => ({ ...f, id: e.target.value }))}
            placeholder="e.g., cam-1"
            helperText="Unique identifier for the channel"
            required
          />
        )}

        <Input
          label="Channel Name"
          value={formData.name}
          onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g., Main Camera"
          required
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
          placeholder="Optional description"
        />

        <Input
          label="Input Type"
          value={formData.input_type}
          onChange={(e) => setFormData((f) => ({ ...f, input_type: e.target.value }))}
          placeholder="e.g., srt, rtsp, hls"
        />

        <Input
          label="Input URL"
          value={formData.input_url}
          onChange={(e) => setFormData((f) => ({ ...f, input_url: e.target.value }))}
          placeholder="e.g., srt://0.0.0.0:9000"
        />
      </form>
    </Modal>
  )
}
