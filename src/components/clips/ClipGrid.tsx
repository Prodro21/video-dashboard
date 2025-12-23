import { useNavigate } from 'react-router-dom'
import type { Clip } from '@/types'
import { StatusBadge } from '@/components/common'
import { formatDuration, formatRelativeTime } from '@/utils'
import { clipsApi } from '@/api'

interface ClipGridProps {
  clips: Clip[]
  loading?: boolean
  onFavorite?: (id: string) => void
}

export function ClipGrid({ clips, loading, onFavorite }: ClipGridProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p>No clips found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {clips.map((clip) => (
        <div key={clip.id} className="group">
          <div
            onClick={() => navigate(`/clips/${clip.id}`)}
            className="relative aspect-video rounded-lg overflow-hidden bg-dark-700 cursor-pointer"
          >
            {clip.thumbnail_path ? (
              <img
                src={clipsApi.getThumbnailUrl(clip.id)}
                alt={clip.title || clip.id}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Status overlay for non-ready clips */}
            {clip.status !== 'ready' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <StatusBadge status={clip.status} />
              </div>
            )}

            {/* Duration badge */}
            {clip.duration_seconds > 0 && clip.status === 'ready' && (
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                {formatDuration(clip.duration_seconds)}
              </div>
            )}

            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onFavorite?.(clip.id)
              }}
              className={`absolute top-1 right-1 p-1 rounded transition-colors ${
                clip.is_favorite
                  ? 'text-yellow-400'
                  : 'text-white/50 opacity-0 group-hover:opacity-100 hover:text-yellow-400'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={clip.is_favorite ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>

            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-200 truncate">{clip.title || clip.id}</p>
            <p className="text-xs text-gray-500">{formatRelativeTime(clip.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
