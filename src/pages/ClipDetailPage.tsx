import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Hls from 'hls.js'
import { Header } from '@/components/layout'
import { Card, CardHeader, Button, StatusBadge } from '@/components/common'
import { useClipStore, useUIStore } from '@/stores'
import { formatDuration, formatDateTime, formatFileSize } from '@/utils'
import { clipsApi } from '@/api'

export function ClipDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    selectedClip: clip,
    loading,
    fetchClip,
    toggleFavorite,
    deleteClip,
  } = useClipStore()

  const { addToast } = useUIStore()

  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null)

  useEffect(() => {
    if (id) {
      fetchClip(id)
    }
  }, [id, fetchClip])

  useEffect(() => {
    if (!clip || !videoRef || clip.status !== 'ready') return

    const streamUrl = clipsApi.getStreamUrl(clip.id)

    if (Hls.isSupported()) {
      const hls = new Hls()
      setHlsInstance(hls)
      hls.loadSource(streamUrl)
      hls.attachMedia(videoRef)
    } else if (videoRef.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.src = streamUrl
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy()
      }
    }
  }, [clip, videoRef]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !clip) {
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

  if (!clip) {
    return (
      <>
        <Header title="Clip Not Found" />
        <div className="p-6">
          <p className="text-gray-400">The requested clip could not be found.</p>
          <Button onClick={() => navigate('/clips')} className="mt-4">
            Back to Clips
          </Button>
        </div>
      </>
    )
  }

  const handleFavorite = async () => {
    try {
      await toggleFavorite(clip.id)
      addToast({
        type: 'success',
        message: clip.is_favorite ? 'Removed from favorites' : 'Added to favorites',
      })
    } catch {
      addToast({ type: 'error', message: 'Failed to update favorite' })
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this clip?')) return

    try {
      await deleteClip(clip.id)
      addToast({ type: 'success', message: 'Clip deleted' })
      navigate('/clips')
    } catch {
      addToast({ type: 'error', message: 'Failed to delete clip' })
    }
  }

  return (
    <>
      <Header
        title={clip.title || 'Untitled Clip'}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleFavorite}
              className={clip.is_favorite ? 'text-yellow-400' : ''}
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
              {clip.is_favorite ? 'Favorited' : 'Favorite'}
            </Button>

            <a
              href={clipsApi.getDownloadUrl(clip.id)}
              download
              className="btn btn-secondary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>

            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Video Player */}
        <Card padding="none" className="overflow-hidden">
          <div className="aspect-video bg-black">
            {clip.status === 'ready' ? (
              <video
                ref={setVideoRef}
                className="w-full h-full"
                controls
                playsInline
                poster={clip.thumbnail_path ? clipsApi.getThumbnailUrl(clip.id) : undefined}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <StatusBadge status={clip.status} />
                {clip.status === 'processing' && (
                  <p className="mt-2 text-sm">Video is being processed...</p>
                )}
                {clip.status === 'failed' && clip.error_message && (
                  <p className="mt-2 text-sm text-red-400">{clip.error_message}</p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Clip Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Clip Information" />
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-400">Status</dt>
                <dd><StatusBadge status={clip.status} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Duration</dt>
                <dd className="text-white">{formatDuration(clip.duration_seconds)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Resolution</dt>
                <dd className="text-white">{clip.resolution || 'Unknown'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Format</dt>
                <dd className="text-white">{clip.format} / {clip.codec}</dd>
              </div>
              {clip.file_size_bytes && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">File Size</dt>
                  <dd className="text-white">{formatFileSize(clip.file_size_bytes)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-400">Views</dt>
                <dd className="text-white">{clip.view_count}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader title="Metadata" />
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-400">Session</dt>
                <dd>
                  <Link
                    to={`/sessions/${clip.session_id}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    View Session
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Channel</dt>
                <dd className="text-white">{clip.channel_id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Start Time</dt>
                <dd className="text-white">{formatDateTime(clip.start_time)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">End Time</dt>
                <dd className="text-white">{formatDateTime(clip.end_time)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Created</dt>
                <dd className="text-white">{formatDateTime(clip.created_at)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </>
  )
}
