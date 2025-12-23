import type { SessionStatus, ChannelStatus, ClipStatus } from '@/types'

type Status = SessionStatus | ChannelStatus | ClipStatus

interface StatusBadgeProps {
  status: Status
  size?: 'sm' | 'md'
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  // Session statuses
  scheduled: {
    label: 'Scheduled',
    className: 'bg-gray-800 text-gray-400 border-gray-700',
  },
  active: {
    label: 'Active',
    className: 'bg-green-900/50 text-green-400 border-green-700',
  },
  paused: {
    label: 'Paused',
    className: 'bg-orange-900/50 text-orange-400 border-orange-700',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-900/50 text-blue-400 border-blue-700',
  },
  archived: {
    label: 'Archived',
    className: 'bg-gray-800 text-gray-500 border-gray-700',
  },
  // Channel statuses
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-800 text-gray-400 border-gray-700',
  },
  error: {
    label: 'Error',
    className: 'bg-red-900/50 text-red-400 border-red-700',
  },
  // Clip statuses
  pending: {
    label: 'Pending',
    className: 'bg-gray-800 text-gray-400 border-gray-700',
  },
  ready: {
    label: 'Ready',
    className: 'bg-green-900/50 text-green-400 border-green-700',
  },
  processing: {
    label: 'Processing',
    className: 'bg-yellow-900/50 text-yellow-400 border-yellow-700',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-900/50 text-red-400 border-red-700',
  },
  deleted: {
    label: 'Deleted',
    className: 'bg-gray-800 text-gray-500 border-gray-700',
  },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-gray-800 text-gray-400 border-gray-700',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.className} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  )
}
