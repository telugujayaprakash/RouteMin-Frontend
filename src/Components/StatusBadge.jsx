import React from 'react'

export default function StatusBadge ({ status }) {
  const active = status === 'ACTIVE'

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-2.5 py-0.5
        text-xs font-semibold tracking-wide
        ring-1 ring-inset
        ${
          active
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
            : 'bg-rose-50 text-rose-700 ring-rose-600/20'
        }
      `}
    >
      <span
        className={`
          h-1.5 w-1.5 rounded-full
          ${active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}
        `}
      />

      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

