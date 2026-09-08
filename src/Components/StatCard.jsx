import React from 'react'
import { Icon } from '@iconify/react'

const colorMap = {
  blue: {
    bg: 'bg-blue-50/70',
    border: 'border-blue-100',
    icon: 'text-blue-500/25'
  },
  purple: {
    bg: 'bg-purple-50/70',
    border: 'border-purple-100',
    icon: 'text-purple-500/25'
  },
  green: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-100',
    icon: 'text-emerald-500/35'
  },
  red: {
    bg: 'bg-red-50/70',
    border: 'border-red-100',
    icon: 'text-red-500/35'
  }
}

function StatCard ({ title, value, subtitle, icon, color = 'blue' }) {
  const styles = colorMap[color]

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl border p-5
        ${styles.bg} ${styles.border}
        shadow-sm hover:shadow-md hover:-translate-y-1
        transition-all duration-300
      `}
    >
      {/* BACKGROUND ICON */}
      <Icon
        icon={icon}
        className={`
          absolute right-4 top-1/2 -translate-y-1/2
          text-[90px] ${styles.icon}
        `}
      />

      {/* CONTENT */}
      <div className='relative z-10 flex flex-col'>
        <p className='text-xs font-medium text-slate-500'>{title}</p>

        <h3 className='mt-2 text-2xl font-semibold text-slate-900'>{value}</h3>

        {subtitle && <p className='text-xs text-slate-400 mt-1'>{subtitle}</p>}
      </div>
    </div>
  )
}

export default StatCard
