import React from 'react'
import { Icon } from '@iconify/react'

const colorMap = {
  blue: {
    bg: 'bg-blue-50/70',
    border: 'border-blue-100',
    icon: 'text-blue-500/25'
  },
  green: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-100',
    icon: 'text-emerald-500/30'
  },
  purple: {
    bg: 'bg-purple-50/70',
    border: 'border-purple-100',
    icon: 'text-purple-500/25'
  },
  orange: {
    bg: 'bg-orange-50/70',
    border: 'border-orange-100',
    icon: 'text-orange-500/25'
  },
  rose: {
    bg: 'bg-rose-50/70',
    border: 'border-rose-100',
    icon: 'text-rose-500/30'
  }
}

function DashboardStatCard({ title, value, icon, color = 'blue' }) {
  const styles = colorMap[color]

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl border p-5
        ${styles.bg} ${styles.border}
        shadow-sm hover:shadow-md transition-all
      `}
    >
      {/* BACKGROUND ICON */}
      <Icon
        icon={icon}
        className={`
          absolute right-4 top-1/2 -translate-y-1/2
          text-[95px] ${styles.icon}
        `}
      />

      {/* CONTENT */}
      <div className='relative z-10'>
        <p className='text-xs font-medium text-slate-600'>
          {title}
        </p>

        <p className='text-xl font-semibold text-slate-900 mt-2'>
          {value}
        </p>
      </div>
    </div>
  )
}

export default DashboardStatCard