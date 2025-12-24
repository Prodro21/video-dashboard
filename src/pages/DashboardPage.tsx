import { useEffect } from 'react'
import { Header } from '@/components/layout'
import { StatsCard, ActiveSessions, RecentClips, SystemHealth } from '@/components/dashboard'
import { useSessionStore, useClipStore, useChannelStore, useTagStore } from '@/stores'

export function DashboardPage() {
  const { sessions, total: totalSessions, loading: sessionsLoading, fetchSessions } = useSessionStore()
  const { clips, total: totalClips, loading: clipsLoading, fetchClips } = useClipStore()
  const { channels, loading: channelsLoading, fetchChannels } = useChannelStore()
  const { fetchTags } = useTagStore()

  useEffect(() => {
    fetchSessions({ limit: 10 })
    fetchClips({ limit: 8 })
    fetchChannels()
    fetchTags({ limit: 1 }) // Just to get the total count
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeSessions = sessions.filter((s) => s.status === 'active').length
  const activeChannels = channels.filter((c) => c.status === 'active').length

  return (
    <>
      <Header title="Dashboard" subtitle="System overview and statistics" />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Sessions"
            value={totalSessions}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="blue"
          />

          <StatsCard
            title="Active Sessions"
            value={activeSessions}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="green"
          />

          <StatsCard
            title="Total Clips"
            value={totalClips}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
            color="orange"
          />

          <StatsCard
            title="Active Channels"
            value={`${activeChannels}/${channels.length}`}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            color="purple"
          />
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveSessions sessions={sessions} loading={sessionsLoading} />
          <SystemHealth channels={channels} loading={channelsLoading} />
        </div>

        {/* Recent Clips - Full Width */}
        <RecentClips clips={clips} loading={clipsLoading} />
      </div>
    </>
  )
}
