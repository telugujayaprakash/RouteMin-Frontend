import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CurrencyInrIcon,
  TrendDownIcon,
  SparkleIcon,
  BrainIcon,
  CrownIcon,
  ArrowClockwiseIcon,
  CalculatorIcon
} from '@phosphor-icons/react'

function SummaryCards({ result, onTryVam, isVamRunning }) {
  const navigate = useNavigate()
  const user = useSelector(state => state.Auth?.user)
  const isFree = String(user?.planType || '').toUpperCase() === 'FREE'

  const isVAM = String(result?.algorithm || '').toUpperCase().includes('VAM')

  const initialCost = Number(result?.initialCost || 0)
  const optimizedCost = Number(result?.optimizedCost || 0)
  const calculatedSavings = initialCost > 0 && optimizedCost > 0 ? initialCost - optimizedCost : 0

  const potentialVamSavings =
    result?.totalSavings && result.totalSavings > 0
      ? result.totalSavings
      : calculatedSavings > 0
        ? calculatedSavings
        : Math.round(initialCost * 0.20)

  const formatCurrency = value => {
    return `₹ ${Number(value || 0).toLocaleString('en-IN')}`
  }

  const cards = isVAM
    ? [
      {
        title: 'Optimized Cost',
        value: formatCurrency(optimizedCost),
        icon: TrendDownIcon,
        color: 'emerald',
        badgeText: 'MINIMIZED COST',
        description: 'Achieved using Vogel\'s Approximation Method'
      },
      {
        title: 'Total Allocations',
        value: result?.allocations?.length || 0,
        icon: CalculatorIcon,
        color: 'blue',
        badgeText: 'ACTIVE ROUTES',
        description: 'Factory to Warehouse Allocations'
      },
      {
        title: 'Algorithm',
        value: result.algorithm || 'VAM',
        icon: BrainIcon,
        color: 'purple',
        badgeText: 'PREMIUM ENGINE',
        description: 'Row & Column Penalty Optimization',
        isAlgorithm: true
      }
    ]
    : [
      {
        title: 'Initial Cost',
        value: formatCurrency(initialCost),
        icon: CurrencyInrIcon,
        color: 'blue',
        badgeText: 'BASELINE COST',
        description: 'Standard Initial Allocation Cost'
      },
      {
        title: 'Potential VAM Savings',
        value: formatCurrency(potentialVamSavings),
        icon: isFree ? CrownIcon : SparkleIcon,
        color: 'amber',
        badgeText: isFree ? 'SUBSCRIBE' : 'TRY VAM',
        description: isFree
          ? 'Money You Could Save With VAM'
          : 'Click to re-run with VAM engine',
        isPotential: true
      },
      {
        title: 'Current Algorithm',
        value: result.algorithm || 'LCM',
        icon: BrainIcon,
        color: 'purple',
        badgeText: 'BASIC ENGINE',
        description: 'Standard Initial Feasible Solution',
        isAlgorithm: true
      }
    ]

  const colorStyles = {
    blue: {
      border: 'border-blue-200/80',
      bg: 'bg-gradient-to-br from-blue-50/70 to-white',
      badge: 'bg-blue-100/90 text-blue-700 border-blue-200',
      text: 'text-slate-900',
      iconBg: 'bg-blue-100/60 text-blue-600'
    },
    emerald: {
      border: 'border-emerald-200/80',
      bg: 'bg-gradient-to-br from-emerald-50/70 to-white',
      badge: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100/60 text-emerald-600'
    },
    amber: {
      border: 'border-amber-300/90',
      bg: 'bg-gradient-to-br from-amber-50/90 via-orange-50/30 to-white',
      badge: 'bg-amber-400 text-slate-950 border-amber-500 font-black',
      text: 'text-amber-600',
      iconBg: 'bg-amber-100 text-amber-600'
    },
    purple: {
      border: 'border-purple-200/80',
      bg: 'bg-gradient-to-br from-purple-50/70 to-white',
      badge: 'bg-purple-100/90 text-purple-700 border-purple-200',
      text: 'text-purple-700',
      iconBg: 'bg-purple-100/60 text-purple-600'
    }
  }

  return (
    <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
      {cards.map(card => {
        const Icon = card.icon
        const style = colorStyles[card.color] || colorStyles.blue

        return (
          <div
            key={card.title}
            onClick={() => {
              if (card.isPotential) {
                if (isFree) {
                  navigate('/pricing')
                } else if (onTryVam) {
                  onTryVam(result.optimizationRunId)
                }
              }
            }}
            className={`group relative overflow-hidden rounded-2xl border ${style.border} ${style.bg} p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.isPotential ? 'cursor-pointer ring-2 ring-amber-400/50' : ''
              }`}
          >
            {/* Header / Badge */}
            <div className='flex items-center justify-between gap-2'>
              <p className='text-xs font-bold uppercase tracking-wider text-slate-500'>
                {card.title}
              </p>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border ${style.badge}`}
              >
                {card.isPotential && isVamRunning ? (
                  <ArrowClockwiseIcon size={11} className='animate-spin' />
                ) : (
                  <Icon size={11} weight='fill' />
                )}
                {card.badgeText}
              </span>
            </div>

            {/* Value */}
            <div className='mt-3 flex items-center justify-between gap-2'>
              {card.isAlgorithm ? (
                <div className='inline-flex rounded-xl bg-purple-100/90 border border-purple-200 px-3.5 py-1.5 text-base font-extrabold text-purple-800'>
                  {card.value}
                </div>
              ) : (
                <h2 className={`text-3xl font-black tracking-tight ${style.text}`}>
                  {card.value}
                </h2>
              )}

              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBg} transition-transform group-hover:scale-110`}>
                <Icon size={22} weight='duotone' />
              </div>
            </div>

            {/* Description */}
            <p className='mt-3 text-xs font-medium text-slate-500'>
              {card.description}
            </p>

            {card.isPotential && (
              <div className='mt-3.5 border-t border-amber-200/80 pt-2.5 text-[11px] font-extrabold text-amber-700 flex items-center justify-between'>
                <span>{isFree ? 'Unlock VAM Pricing →' : 'Re-run Optimization →'}</span>
                {isVamRunning && <span className='animate-pulse'>Processing...</span>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SummaryCards
