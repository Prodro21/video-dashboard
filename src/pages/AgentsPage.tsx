import { useEffect } from 'react'
import { Header } from '@/components/layout'
import { Card, CardHeader, Button } from '@/components/common'
import { useAgentStore, useUIStore } from '@/stores'
import type { Agent, AgentStatus } from '@/types'

function AgentStatusBadge({ status }: { status: AgentStatus }) {
  const config: Record<AgentStatus, { label: string; className: string }> = {
    online: {
      label: 'Online',
      className: 'bg-green-900/50 text-green-400 border-green-700',
    },
    recording: {
      label: 'Recording',
      className: 'bg-orange-900/50 text-orange-400 border-orange-700',
    },
    error: {
      label: 'Error',
      className: 'bg-red-900/50 text-red-400 border-red-700',
    },
    offline: {
      label: 'Offline',
      className: 'bg-gray-800 text-gray-400 border-gray-700',
    },
  }

  const { label, className } = config[status] || config.offline

  return (
    <span className={`inline-flex items-center rounded-full border font-medium px-2 py-0.5 text-xs ${className}`}>
      {label}
    </span>
  )
}

function formatLastSeen(lastSeenAt: string): string {
  const date = new Date(lastSeenAt)
  const now = new Date()
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffSec < 10) return 'just now'
  if (diffSec < 60) return `${diffSec}s ago`
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  return date.toLocaleDateString()
}

function AgentCard({
  agent,
  onDelete,
  onStopRecording,
}: {
  agent: Agent
  onDelete: (id: string) => void
  onStopRecording: (id: string) => void
}) {
  const capabilities = agent.capabilities || {}

  return (
    <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-dark-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-white">{agent.name}</h3>
          <p className="text-sm text-gray-400">{agent.id}</p>
        </div>
        <AgentStatusBadge status={agent.status} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>URL:</span>
          <span className="text-gray-300 font-mono text-xs">{agent.url}</span>
        </div>
        {agent.channel_id && (
          <div className="flex justify-between text-gray-400">
            <span>Channel:</span>
            <span className="text-gray-300">{agent.channel_id}</span>
          </div>
        )}
        {agent.session_id && (
          <div className="flex justify-between text-gray-400">
            <span>Session:</span>
            <span className="text-gray-300 font-mono text-xs">{agent.session_id.slice(0, 8)}...</span>
          </div>
        )}
        {agent.hostname && (
          <div className="flex justify-between text-gray-400">
            <span>Host:</span>
            <span className="text-gray-300">{agent.hostname}</span>
          </div>
        )}
        {agent.version && (
          <div className="flex justify-between text-gray-400">
            <span>Version:</span>
            <span className="text-gray-300">v{agent.version}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-400">
          <span>Last seen:</span>
          <span className="text-gray-300">{formatLastSeen(agent.last_seen_at)}</span>
        </div>
      </div>

      {/* Capabilities */}
      <div className="mt-3 flex flex-wrap gap-1">
        {capabilities.can_capture_srt && (
          <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded">SRT</span>
        )}
        {capabilities.can_capture_rtsp && (
          <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded">RTSP</span>
        )}
        {capabilities.can_capture_rtmp && (
          <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded">RTMP</span>
        )}
        {capabilities.can_capture_ndi && (
          <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded">NDI</span>
        )}
        {capabilities.can_capture_usb && (
          <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded">USB</span>
        )}
      </div>

      {agent.error_message && (
        <div className="mt-3 p-2 bg-red-900/20 border border-red-900/30 rounded text-red-400 text-sm">
          {agent.error_message}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {agent.status === 'recording' && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onStopRecording(agent.id)}
          >
            Stop Recording
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(agent.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}

export function AgentsPage() {
  const {
    agents,
    loading,
    fetchAgents,
    deleteAgent,
    stopRecording,
  } = useAgentStore()

  const { addToast } = useUIStore()

  useEffect(() => {
    fetchAgents()
    // Refresh agents every 10 seconds
    const interval = setInterval(() => {
      fetchAgents()
    }, 10000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this agent?')) return

    try {
      await deleteAgent(id)
      addToast({ type: 'success', message: 'Agent removed' })
    } catch {
      addToast({ type: 'error', message: 'Failed to remove agent' })
    }
  }

  const handleStopRecording = async (id: string) => {
    try {
      await stopRecording(id)
      addToast({ type: 'success', message: 'Recording stopped' })
    } catch {
      addToast({ type: 'error', message: 'Failed to stop recording' })
    }
  }

  const onlineCount = agents.filter((a) => a.status === 'online').length
  const recordingCount = agents.filter((a) => a.status === 'recording').length
  const errorCount = agents.filter((a) => a.status === 'error').length

  return (
    <>
      <Header
        title="Capture Agents"
        subtitle={`${onlineCount} online, ${recordingCount} recording${errorCount > 0 ? `, ${errorCount} errors` : ''}`}
        actions={
          <Button variant="secondary" onClick={() => fetchAgents()}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </Button>
        }
      />

      <div className="p-6">
        <Card padding="none">
          <div className="p-4 border-b border-dark-700">
            <CardHeader
              title="Registered Capture Agents"
              subtitle={`${agents.length} agent${agents.length !== 1 ? 's' : ''} registered`}
            />
          </div>

          <div className="p-4">
            {loading && agents.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400">Loading agents...</p>
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-12 h-12 text-gray-600 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-400 mb-2">No capture agents registered</p>
                <p className="text-gray-500 text-sm">
                  Start a capture agent with platform integration enabled to see it here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onDelete={handleDelete}
                    onStopRecording={handleStopRecording}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  )
}
