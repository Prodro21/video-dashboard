import { useNavigate } from 'react-router-dom'
import type { Tag } from '@/types'
import { Table, Button } from '@/components/common'
import { formatDateTime, snakeToTitle } from '@/utils'

interface TagListProps {
  tags: Tag[]
  loading?: boolean
  onMarkReviewed?: (id: string) => void
  onToggleImportant?: (id: string) => void
  onDelete?: (id: string) => void
}

export function TagList({
  tags,
  loading,
  onMarkReviewed,
  onToggleImportant,
  onDelete,
}: TagListProps) {
  const navigate = useNavigate()

  const columns = [
    {
      key: 'clip',
      header: 'Clip',
      render: (tag: Tag) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/clips/${tag.clip_id}`)
          }}
          className="text-blue-400 hover:text-blue-300"
        >
          View Clip
        </button>
      ),
    },
    {
      key: 'play_type',
      header: 'Play Type',
      render: (tag: Tag) => (
        <span className="text-gray-200">
          {tag.play_type ? snakeToTitle(tag.play_type) : '-'}
        </span>
      ),
    },
    {
      key: 'formation',
      header: 'Formation',
      render: (tag: Tag) => (
        <span className="text-gray-300">{tag.formation || '-'}</span>
      ),
    },
    {
      key: 'result',
      header: 'Result',
      render: (tag: Tag) => (
        <span className="text-gray-300">{tag.result || '-'}</span>
      ),
    },
    {
      key: 'down_distance',
      header: 'Down & Distance',
      render: (tag: Tag) => (
        <span className="text-gray-300">
          {tag.down && tag.distance ? `${tag.down} & ${tag.distance}` : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tag: Tag) => (
        <div className="flex items-center gap-2">
          {tag.is_important && (
            <span className="px-2 py-0.5 text-xs bg-yellow-900/50 text-yellow-400 border border-yellow-700 rounded-full">
              Important
            </span>
          )}
          {tag.is_reviewed ? (
            <span className="px-2 py-0.5 text-xs bg-green-900/50 text-green-400 border border-green-700 rounded-full">
              Reviewed
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 border border-gray-700 rounded-full">
              Pending
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (tag: Tag) => (
        <span className="text-gray-400 text-sm">
          {formatDateTime(tag.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-32',
      render: (tag: Tag) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {onToggleImportant && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleImportant(tag.id)}
              className={tag.is_important ? 'text-yellow-400' : ''}
              title={tag.is_important ? 'Unmark important' : 'Mark important'}
            >
              <svg
                className="w-4 h-4"
                fill={tag.is_important ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </Button>
          )}
          {!tag.is_reviewed && onMarkReviewed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkReviewed(tag.id)}
              title="Mark as reviewed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300"
              onClick={() => onDelete(tag.id)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <Table
      data={tags}
      columns={columns}
      keyExtractor={(t) => t.id}
      loading={loading}
      emptyMessage="No tags found"
    />
  )
}
