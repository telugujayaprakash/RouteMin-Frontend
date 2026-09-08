import React from 'react'
import {
  Coins,
  Lightning,
  CalendarBlank,
  Crown,
  ArrowUpRight
} from '@phosphor-icons/react'

function SubscriptionUsage({ subscription }) {
  if (!subscription) {
    return (
      <div className='rounded-2xl border border-slate-200/80 bg-white p-4 text-xs font-medium text-slate-500'>
        Subscription usage information unavailable.
      </div>
    )
  }

  const {
    planName,
    monthlyCredits = 0,
    monthlyRemaining = 0,
    monthlyUsed = 0,
    topUpCredits = 0,
    topUpRemaining = 0,
    topUpUsed = 0,
    totalRemainingCredits = 0,
    totalUsedCredits = 0,
    currentPeriodEnd
  } = subscription

  const totalCredits = monthlyCredits + topUpCredits

  const usagePercent =
    totalCredits > 0
      ? Math.min(100, Math.round((totalUsedCredits / totalCredits) * 100))
      : 0

  const formatDate = date => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className='relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all'>
      {/* Top Accent Gradient Bar */}
      <div className='absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500' />

      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>

        {/* LEFT: Plan Badge & Main Meter */}
        <div className='flex items-center gap-4 min-w-[260px]'>
          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm'>
            <Crown size={22} weight='fill' className='text-amber-400' />
          </div>

          <div>
            <div className='flex items-center gap-2'>
              <span className='inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 border border-blue-200/60'>
                <span className='h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' />
                {planName || 'FREE PLAN'}
              </span>

              <span className='text-[11px] font-semibold text-slate-400'>
                • Active Cycle
              </span>
            </div>

            <div className='mt-1 flex items-baseline gap-2'>
              <span className='text-2xl font-black text-slate-900 tracking-tight'>
                {totalRemainingCredits}
              </span>
              <span className='text-xs font-semibold text-slate-500'>
                / {totalCredits} Credits Available
              </span>
            </div>
          </div>
        </div>

        {/* CENTER: High Precision Progress Bar */}
        <div className='flex-1 max-w-md'>
          <div className='flex items-center justify-between text-xs font-semibold mb-1.5'>
            <span className='text-slate-600 flex items-center gap-1.5'>
              <Coins size={14} className='text-blue-600' />
              Optimization Credit Consumption
            </span>
            <span className='text-slate-900 font-bold'>
              {usagePercent}% Used ({totalUsedCredits} Used)
            </span>
          </div>

          <div className='h-2.5 w-full rounded-full bg-slate-100 p-0.5 border border-slate-200/60 overflow-hidden'>
            <div
              className='h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500'
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {/* RIGHT: Breakdown Badges & Date */}
        <div className='flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100'>
          {/* Monthly Pill */}
          <div className='flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-1.5 text-xs'>
            <Lightning size={14} weight='fill' className='text-blue-600 shrink-0' />
            <div>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none'>Monthly</span>
              <span className='font-bold text-slate-800 text-[11px]'>{monthlyRemaining} Left ({monthlyUsed}/{monthlyCredits})</span>
            </div>
          </div>

          {/* Top-up Pill */}
          <div className='flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-1.5 text-xs'>
            <ArrowUpRight size={14} weight='bold' className='text-emerald-600 shrink-0' />
            <div>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none'>Top-Up</span>
              <span className='font-bold text-slate-800 text-[11px]'>{topUpRemaining} Left ({topUpUsed}/{topUpCredits})</span>
            </div>
          </div>

          {/* Renewal Date */}
          <div className='flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-1.5 text-xs'>
            <CalendarBlank size={14} weight='duotone' className='text-slate-500 shrink-0' />
            <div>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none'>Renews</span>
              <span className='font-bold text-slate-700 text-[11px]'>{formatDate(currentPeriodEnd)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SubscriptionUsage
