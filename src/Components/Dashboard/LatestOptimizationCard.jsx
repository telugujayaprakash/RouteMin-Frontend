import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarBlankIcon,
  CheckCircleIcon,
  CircuitryIcon,
  CurrencyInrIcon,
  TrendUpIcon,
  SparkleIcon,
  ArrowRightIcon,
  EyeIcon
} from '@phosphor-icons/react'

function LatestOptimizationCard({ optimization }) {
  const navigate = useNavigate()

  const formatCurrency = value =>
    `₹ ${Number(value || 0).toLocaleString('en-IN')}`

  const formatDate = date => {
    if (!date) return '—'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return '—'
    }

    return parsedDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!optimization) {
    return (
      <section className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
        <div className='border-b border-slate-100 px-6 py-5 sm:px-7'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
              <CircuitryIcon size={21} weight='duotone' />
            </div>

            <div>
              <h2 className='text-base font-bold text-slate-900'>
                Latest Optimization
              </h2>

              <p className='mt-0.5 text-xs text-slate-500'>
                Your most recent transportation optimization run
              </p>
            </div>
          </div>
        </div>

        <div className='relative flex min-h-[300px] items-center justify-center overflow-hidden px-6 py-12'>
          <CircuitryIcon
            size={180}
            weight='duotone'
            className='absolute -right-8 -top-8 text-blue-100'
          />

          <div className='relative z-10 max-w-sm text-center'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-200'>
              <SparkleIcon size={30} weight='duotone' />
            </div>

            <h3 className='mt-5 text-base font-bold text-slate-900'>
              No optimization yet
            </h3>

            <p className='mt-2 text-sm leading-6 text-slate-500'>
              Run your first transportation optimization to see performance,
              savings, and allocation results here.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // =========================================================
  // STATUS
  // =========================================================

  const statusConfig = {
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircleIcon
    },

    RUNNING: {
      label: 'Running',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: CircuitryIcon
    },

    FAILED: {
      label: 'Failed',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: CircuitryIcon
    }
  }

  const status = statusConfig[optimization.status] || statusConfig.RUNNING

  const StatusIcon = status.icon

  // =========================================================
  // VIEW RESULT
  // =========================================================

  const handleViewResult = () => {
    navigate(`/result/${optimization.runId}`)
  }

  return (
    <section className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md'>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className='flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
            <CircuitryIcon size={21} weight='duotone' />
          </div>

          <div>
            <h2 className='text-base font-bold text-slate-900'>
              Latest Optimization
            </h2>

            <p className='mt-0.5 text-xs text-slate-500'>
              Most recent transportation planning result
            </p>
          </div>
        </div>

        {/* Status */}

        <div
          className={`
            inline-flex w-fit items-center gap-1.5
            rounded-full border px-3 py-1.5
            text-xs font-bold
            ${status.bg}
            ${status.text}
            ${status.border}
          `}
        >
          <StatusIcon
            size={14}
            weight='fill'
            className={optimization.status === 'RUNNING' ? 'animate-spin' : ''}
          />

          {status.label}
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className='p-6 sm:p-7'>
        {/* ===================================================
      RUN INFORMATION
  =================================================== */}

        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <p className='text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400'>
              Optimization Run
            </p>

            <h3 className='mt-2 text-2xl font-bold tracking-tight text-slate-900'>
              {optimization.runName || 'Untitled Optimization'}
            </h3>
          </div>

          {/* View Result */}

          <button
            type='button'
            onClick={handleViewResult}
            className='group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-xs font-bold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-600 hover:text-white active:scale-[0.97] cursor-pointer'
          >
            <EyeIcon size={17} weight='duotone' />
            View Result
            <ArrowRightIcon
              size={15}
              className='transition-transform group-hover:translate-x-0.5'
            />
          </button>
        </div>

        {/* ===================================================
      RUN DETAILS
  =================================================== */}

        <div className='mb-5 grid gap-3 sm:grid-cols-2'>
          {/* Algorithm */}

          <div className='flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/60 px-4 py-3'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600'>
              <CircuitryIcon size={18} weight='duotone' />
            </div>

            <div className='min-w-0'>
              <p className='text-[10px] font-bold uppercase tracking-wider text-purple-500'>
                Algorithm
              </p>

              <p className='mt-0.5 truncate text-sm font-bold text-slate-800'>
                {optimization.algorithm || 'N/A'}
              </p>
            </div>
          </div>

          {/* Created */}

          <div className='flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600'>
              <CalendarBlankIcon size={18} weight='duotone' />
            </div>

            <div className='min-w-0'>
              <p className='text-[10px] font-bold uppercase tracking-wider text-amber-600'>
                Created
              </p>

              <p className='mt-0.5 truncate text-sm font-bold text-slate-800'>
                {formatDate(optimization.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
      COST METRICS
  =================================================== */}

        <div className='grid gap-4 sm:grid-cols-2'>
          {/* Optimal Cost */}

          <div className='relative overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/70 p-5'>
            <CurrencyInrIcon
              size={82}
              weight='duotone'
              className='absolute -bottom-5 -right-5 text-blue-200'
            />

            <div className='relative z-10'>
              <div className='flex items-center gap-2'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600'>
                  <CurrencyInrIcon size={17} weight='duotone' />
                </div>

                <span className='text-xs font-semibold text-blue-700'>
                  Optimal Cost
                </span>
              </div>

              <p className='mt-4 text-2xl font-bold tracking-tight text-slate-900'>
                {formatCurrency(optimization.optimizedCost)}
              </p>

              <p className='mt-1 text-[11px] font-medium text-slate-500'>
                Final transportation cost
              </p>
            </div>
          </div>

          {/* Savings */}

          <div className='relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5'>
            <TrendUpIcon
              size={82}
              weight='duotone'
              className='absolute -bottom-5 -right-5 text-emerald-200'
            />

            <div className='relative z-10'>
              <div className='flex items-center gap-2'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600'>
                  <TrendUpIcon size={17} weight='duotone' />
                </div>

                <span className='text-xs font-semibold text-emerald-700'>
                  Total Savings
                </span>
              </div>

              <p className='mt-4 text-2xl font-bold tracking-tight text-slate-900'>
                {formatCurrency(optimization.totalSavings)}
              </p>

              <p className='mt-1 text-[11px] font-medium text-slate-500'>
                Savings from optimization
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LatestOptimizationCard
