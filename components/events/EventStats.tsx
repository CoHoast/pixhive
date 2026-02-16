import type { Event } from '@/lib/types/database'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  event: Event
}

export default function EventStats({ event }: Props) {
  const isExpired = event.expires_at && new Date(event.expires_at) < new Date()
  const expiresIn = event.expires_at 
    ? formatDistanceToNow(new Date(event.expires_at), { addSuffix: true })
    : null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Photos"
        value={event.photo_count}
        icon={
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        iconBg="bg-purple-100"
      />
      <StatCard
        label="Guests"
        value={event.guest_count}
        icon={
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
        iconBg="bg-blue-100"
      />
      <StatCard
        label="Status"
        value={event.status}
        icon={
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        iconBg="bg-green-100"
        valueClass="capitalize"
      />
      <StatCard
        label={isExpired ? 'Expired' : 'Expires'}
        value={expiresIn || 'Never'}
        icon={
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        iconBg="bg-amber-100"
        valueClass={isExpired ? 'text-red-600' : ''}
      />
    </div>
  )
}

function StatCard({ 
  label, 
  value, 
  icon, 
  iconBg,
  valueClass = ''
}: { 
  label: string
  value: string | number
  icon: React.ReactNode
  iconBg: string
  valueClass?: string
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`text-2xl font-bold text-gray-900 ${valueClass}`}>{value}</p>
        </div>
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
