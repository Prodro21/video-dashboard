import { useNavigate } from 'react-router-dom'
import type { Clip } from '@/types'
import { Card, CardHeader, Button } from '@/components/common'
import { formatDuration, formatRelativeTime } from '@/utils'
import { clipsApi } from '@/api'

interface RecentClipsProps {
  clips: Clip[]
  loading?: boolean
}

export function RecentClips({ clips, loading }: RecentClipsProps) {
  const navigate = useNavigate()

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 border-b border-dark-700">
        <CardHeader
          title="Recent Clips"
          subtitle={`${clips.length} clip${clips.length !== 1 ? 's' : ''} created recently`}
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/clips')}>
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
      ) : clips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p>No clips yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
          {clips.slice(0, 8).map((clip) => (
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
                {/* Duration badge */}
                {clip.duration_seconds > 0 && (
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                    {formatDuration(clip.duration_seconds)}
                  </div>
                )}
                {/* Favorite badge */}
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
                <p className="text-xs text-gray-500">{formatRelativeTime(clip.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
