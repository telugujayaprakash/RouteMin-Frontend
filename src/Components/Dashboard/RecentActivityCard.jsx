import React from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  Plus,
  User,
  CreditCard,
  FileArrowDown,
  Trash,
  Clock,
  ArrowRight
} from '@phosphor-icons/react'

function RecentActivityCard({ logs = [] }) {
  const displayLogs = logs.slice(0, 5)

  return (
    <div className='rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm flex flex-col justify-between min-h-[320px]'>
      {/* HEADER */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-2'>
          <h3 className='text-base font-bold text-slate-900 tracking-tight'>
            Recent Activity
          </h3>
        </div>

        <Link
          to='/auditlogs'
          className='group flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer'
        >
          View All
          <ArrowRight
            size={14}
            weight='bold'
            className='transition-transform duration-200 group-hover:translate-x-1'
          />
        </Link>
      </div>

      {/* TIMELINE CONTENT */}
      {displayLogs.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 text-center text-slate-400'>
          <Clock size={36} weight='duotone' className='mb-2 text-slate-300' />
          <p className='text-xs font-semibold'>No recent activity recorded yet.</p>
        </div>
      ) : (
        <div className='relative flex flex-col space-y-4'>
          {displayLogs.map((log, index) => {
            const config = getLogConfig(log)
            const IconComponent = config.icon
            const isLast = index === displayLogs.length - 1

            return (
              <div key={log.id || index} className='relative flex items-start gap-3.5 group'>
                {/* CONNECTING TIMELINE LINE */}
                {!isLast && (
                  <span
                    className={`absolute left-[17px] top-[34px] bottom-[-16px] w-[2px] ${config.lineColor} opacity-70 z-0`}
                  />
                )}

                {/* ICON BADGE */}
                <div
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${config.bgColor} shadow-2xs transition-transform duration-200 group-hover:scale-105`}
                >
                  <IconComponent size={18} weight='fill' />
                </div>

                {/* CONTENT & TIMESTAMP */}
                <div className='flex flex-1 items-start justify-between min-w-0 pt-0.5'>
                  {/* Title & Subtitle */}
                  <div className='min-w-0 pr-3'>
                    <p className='text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors'>
                      {getLogTitle(log)}
                    </p>
                    <p className='text-[11px] font-medium text-slate-500 truncate mt-0.5'>
                      {getLogSubtitle(log)}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span className='shrink-0 text-[11px] font-semibold text-slate-500 whitespace-nowrap pt-0.5'>
                    {formatActivityDate(log.createdAt)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* =========================================================
   HELPERS
========================================================= */

function getLogConfig(log) {
  const action = (log.actionType || '').toUpperCase()
  const entity = (log.entityName || '').toLowerCase()
  const remarks = (log.remarks || '').toLowerCase()

  if (
    action === 'CREATED' ||
    action === 'CREATE' ||
    remarks.includes('added') ||
    remarks.includes('created')
  ) {
    if (entity.includes('warehouse') || remarks.includes('warehouse')) {
      return {
        icon: Plus,
        bgColor: 'bg-blue-50/90 text-blue-600 border-blue-200/80',
        lineColor: 'bg-blue-400'
      }
    }
    return {
      icon: CheckCircle,
      bgColor: 'bg-emerald-50/90 text-emerald-600 border-emerald-200/80',
      lineColor: 'bg-emerald-400'
    }
  }

  if (action === 'COMPLETED' || remarks.includes('completed') || remarks.includes('optimiz')) {
    return {
      icon: CheckCircle,
      bgColor: 'bg-emerald-50/90 text-emerald-600 border-emerald-200/80',
      lineColor: 'bg-emerald-400'
    }
  }

  if (action === 'DOWNLOADED' || action === 'DOWNLOAD' || remarks.includes('download')) {
    return {
      icon: FileArrowDown,
      bgColor: 'bg-cyan-50/90 text-cyan-600 border-cyan-200/80',
      lineColor: 'bg-cyan-400'
    }
  }

  if (
    action === 'UPDATED' ||
    action === 'UPDATE' ||
    remarks.includes('update') ||
    entity.includes('profile')
  ) {
    return {
      icon: User,
      bgColor: 'bg-purple-50/90 text-purple-600 border-purple-200/80',
      lineColor: 'bg-purple-400'
    }
  }

  if (action === 'PAYMENT' || remarks.includes('payment') || remarks.includes('subscription')) {
    return {
      icon: CreditCard,
      bgColor: 'bg-emerald-50/90 text-emerald-600 border-emerald-200/80',
      lineColor: 'bg-emerald-400'
    }
  }

  if (action === 'DELETED' || action === 'DELETE' || remarks.includes('delete')) {
    return {
      icon: Trash,
      bgColor: 'bg-rose-50/90 text-rose-600 border-rose-200/80',
      lineColor: 'bg-rose-400'
    }
  }

  return {
    icon: Clock,
    bgColor: 'bg-slate-100 text-slate-600 border-slate-200',
    lineColor: 'bg-slate-300'
  }
}

function getLogTitle(log) {
  if (log.remarks) {
    return log.remarks.charAt(0).toUpperCase() + log.remarks.slice(1)
  }
  const action = (log.actionType || 'ACTIVITY').toLowerCase()
  const entity = (log.entityName || '').toLowerCase()
  return `${entity} ${action}`.trim().toUpperCase()
}

function getLogSubtitle(log) {
  if (log.remarks && log.entityName) {
    return log.entityName
  }
  return log.remarks || log.entityName || 'System Activity'
}

function formatActivityDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''

  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  const time = date
    .toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    .toLowerCase()

  return `${day} ${month}, ${time}`
}

export default RecentActivityCard
