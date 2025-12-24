import { useEffect, useState } from 'react'
import { Header } from '@/components/layout'
import { Card, CardHeader, Button } from '@/components/common'
import { ChannelGrid, ChannelForm } from '@/components/channels'
import { useChannelStore, useUIStore } from '@/stores'
import type { Channel } from '@/types'

export function ChannelsPage() {
  const {
    channels,
    loading,
    fetchChannels,
    createChannel,
    updateChannel,
    deleteChannel,
    activateChannel,
    deactivateChannel,
  } = useChannelStore()

  const { addToast } = useUIStore()

  const [showForm, setShowForm] = useState(false)
  const [editingChannel, setEditingChannel] = useState<Channel | undefined>()
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchChannels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async (data: unknown) => {
    setFormLoading(true)
    try {
      await createChannel(data as Parameters<typeof createChannel>[0])
      addToast({ type: 'success', message: 'Channel created successfully' })
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (data: unknown) => {
    if (!editingChannel) return

    setFormLoading(true)
    try {
      await updateChannel(editingChannel.id, data as Parameters<typeof updateChannel>[1])
      addToast({ type: 'success', message: 'Channel updated' })
    } finally {
      setFormLoading(false)
    }
  }

  const handleActivate = async (id: string) => {
    try {
      await activateChannel(id)
      addToast({ type: 'success', message: 'Channel activated' })
    } catch {
      addToast({ type: 'error', message: 'Failed to activate channel' })
    }
  }

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateChannel(id)
      addToast({ type: 'success', message: 'Channel deactivated' })
    } catch {
      addToast({ type: 'error', message: 'Failed to deactivate channel' })
    }
  }

  const handleEdit = (channel: Channel) => {
    setEditingChannel(channel)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this channel?')) return

    try {
      await deleteChannel(id)
      addToast({ type: 'success', message: 'Channel deleted' })
    } catch {
      addToast({ type: 'error', message: 'Failed to delete channel' })
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingChannel(undefined)
  }

  const activeCount = channels.filter((c) => c.status === 'active').length
  const errorCount = channels.filter((c) => c.status === 'error').length

  return (
    <>
      <Header
        title="Channels"
        subtitle={`${activeCount} active${errorCount > 0 ? `, ${errorCount} errors` : ''}`}
        actions={
          <Button onClick={() => setShowForm(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Channel
          </Button>
        }
      />

      <div className="p-6">
        <Card padding="none">
          <div className="p-4 border-b border-dark-700">
            <CardHeader
              title="Video Input Channels"
              subtitle={`${channels.length} channel${channels.length !== 1 ? 's' : ''} configured`}
            />
          </div>

          <ChannelGrid
            channels={channels}
            loading={loading}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>
      </div>

      <ChannelForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSubmit={editingChannel ? handleUpdate : handleCreate}
        channel={editingChannel}
        loading={formLoading}
      />
    </>
  )
}
