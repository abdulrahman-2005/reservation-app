'use client'

export default function StatusPill({ status, onClick, className = '' }) {
  const statusConfig = {
    pending: {
      label: 'قيد الانتظار',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      dotColor: 'bg-amber-500',
    },
    confirmed: {
      label: 'مؤكد',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      dotColor: 'bg-blue-500',
    },
    arrived: {
      label: 'وصل',
      bgColor: 'bg-cyan-100',
      textColor: 'text-cyan-700',
      dotColor: 'bg-cyan-500',
    },
    in_session: {
      label: 'في الجلسة',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      dotColor: 'bg-purple-500',
    },
    completed: {
      label: 'مكتمل',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      dotColor: 'bg-emerald-500',
    },
    canceled: {
      label: 'ملغي',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      dotColor: 'bg-red-500',
    },
  }
  
  const config = statusConfig[status] || statusConfig.pending
  
  const Component = onClick ? 'button' : 'div'
  
  return (
    <Component
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        config.bgColor
      } ${config.textColor} ${onClick ? 'hover:opacity-80 cursor-pointer' : ''} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      {config.label}
      {onClick && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </Component>
  )
}
