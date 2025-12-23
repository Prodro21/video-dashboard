interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
  }
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'orange' | 'purple'
}

const colorClasses = {
  blue: 'bg-blue-600/20 text-blue-400',
  green: 'bg-green-600/20 text-green-400',
  orange: 'bg-orange-600/20 text-orange-400',
  purple: 'bg-purple-600/20 text-purple-400',
}

export function StatsCard({ title, value, change, icon, color = 'blue' }: StatsCardProps) {
  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
          {change && (
            <p className={`mt-1 text-sm ${change.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change.value >= 0 ? '+' : ''}{change.value}% {change.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
