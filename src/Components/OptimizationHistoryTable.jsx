import React, { useMemo, useState, useEffect } from 'react'
import {
  CheckCircleIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CircuitryIcon,
  CurrencyInrIcon,
  PathIcon,
  ClockIcon
} from '@phosphor-icons/react'

function OptimizationHistoryTable ({
  optimizations = [],
  onView,
  itemsPerPage = 8
}) {
  const [currentPage, setCurrentPage] = useState(1)

  /* Reset page when optimizations list changes */
  useEffect(() => {
    setCurrentPage(1)
  }, [optimizations.length])

  const formatCurrency = value =>
    `₹ ${Number(value || 0).toLocaleString('en-IN')}`

  const formatDate = value => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatus = status => {
    switch (status) {
      case 'COMPLETED':
        return {
          label: 'Completed',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
          icon: CheckCircleIcon
        }

      case 'RUNNING':
        return {
          label: 'Running',
          bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
          dot: 'bg-blue-500',
          icon: SpinnerGapIcon
        }

      default:
        return {
          label: status || 'Failed',
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
          icon: WarningCircleIcon
        }
    }
  }

  const getAlgorithmColor = algo => {
    const key = String(algo || '').toUpperCase()
    switch (key) {
      case 'VAM':
        return 'bg-blue-50 text-blue-700 border-blue-200/80'
      case 'LCM':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
      case 'NWCR':
        return 'bg-purple-50 text-purple-700 border-purple-200/80'
      case 'MODI':
        return 'bg-amber-50 text-amber-700 border-amber-200/80'
      default:
        return 'bg-cyan-50 text-cyan-700 border-cyan-200/80'
    }
  }

  /* =========================================================
      PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(optimizations.length / itemsPerPage)

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return optimizations.slice(start, start + itemsPerPage)
  }, [optimizations, currentPage, itemsPerPage])

  const startItem =
    optimizations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1

  const endItem = Math.min(currentPage * itemsPerPage, optimizations.length)

  const goToPage = page => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  /* =========================================================
      EMPTY STATE
  ========================================================= */

  if (!optimizations.length) {
    return (
      <div className='flex min-h-[360px] items-center justify-center px-6'>
        <div className='text-center'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400'>
            <CircuitryIcon size={24} weight='duotone' />
          </div>

          <h3 className='mt-4 text-base font-bold text-slate-900'>
            No optimization runs recorded
          </h3>

          <p className='mt-1 max-w-sm text-xs leading-relaxed text-slate-500 font-normal'>
            Your completed transportation optimization runs will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='overflow-hidden'>
      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className='overflow-x-auto px-3 pb-2 pt-2 sm:px-5'>
        <table className='w-full border-separate border-spacing-y-2 text-left'>
          {/* =================================================
              HEADER
          ================================================= */}

          <thead>
            <tr className='text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400'>
              <th className='px-5 py-2'>
                <div className='flex items-center gap-1.5'>
                  <PathIcon size={14} weight='bold' className='text-slate-400' />
                  Optimization Run
                </div>
              </th>

              <th className='px-5 py-2'>
                <div className='flex items-center gap-1.5'>
                  <CircuitryIcon size={14} weight='bold' className='text-slate-400' />
                  Algorithm
                </div>
              </th>

              <th className='px-5 py-2'>
                <div className='flex items-center gap-1.5'>
                  <CurrencyInrIcon size={14} weight='bold' className='text-slate-400' />
                  Total Cost
                </div>
              </th>

              <th className='px-5 py-2'>
                <div className='flex items-center gap-1.5'>
                  <CheckCircleIcon size={14} weight='bold' className='text-slate-400' />
                  Status
                </div>
              </th>

              <th className='px-3 py-2 text-right' />
            </tr>
          </thead>

          {/* =================================================
              BODY WITH AUDIT LOG ANIMATION (auditRowIn)
          ================================================= */}

          <tbody>
            {currentItems.map((item, index) => {
              const status = getStatus(item.status)
              const StatusIcon = status.icon
              const displayCost = item.optimizedCost || item.initialCost || 0
              const algoStyle = getAlgorithmColor(item.algorithm)

              return (
                <tr
                  key={item.optimizationRunId || index}
                  onClick={() => onView(item)}
                  style={{ animationDelay: `${index * 70}ms` }}
                  className='
                    group
                    cursor-pointer
                    bg-white
                    opacity-0
                    animate-[auditRowIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]
                    transition-all
                    duration-300
                    hover:-translate-y-[1px]
                  '
                >
                  {/* RUN NAME */}
                  <td className='rounded-l-2xl border-y border-l border-slate-200/80 px-5 py-4 transition-colors duration-300 group-hover:border-blue-200 group-hover:bg-blue-50/30'>
                    <div className='flex items-center gap-3'>
                      <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-[11px] font-semibold text-slate-500'>
                        {String(
                          (currentPage - 1) * itemsPerPage + index + 1
                        ).padStart(2, '0')}
                      </span>

                      <div className='min-w-0'>
                        <p className='truncate text-sm font-semibold text-slate-900'>
                          {item.runName || 'Untitled Run'}
                        </p>

                        <p className='mt-0.5 text-[11px] font-normal text-slate-400 flex items-center gap-1.5 whitespace-nowrap'>
                          <ClockIcon size={12} className='text-slate-400' />
                          RUN-{item.optimizationRunId} ·{' '}
                          {formatDate(item.generatedAt || item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ALGORITHM */}
                  <td className='border-y border-slate-200/80 px-5 py-4 transition-colors duration-300 group-hover:border-blue-200 group-hover:bg-blue-50/30'>
                    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-semibold ${algoStyle}`}>
                      <CircuitryIcon size={13} weight='duotone' />
                      {item.algorithm || '—'}
                    </span>
                  </td>

                  {/* TOTAL COST */}
                  <td className='border-y border-slate-200/80 px-5 py-4 transition-colors duration-300 group-hover:border-blue-200 group-hover:bg-blue-50/30'>
                    <p className='text-sm font-bold text-slate-900 whitespace-nowrap'>
                      {formatCurrency(displayCost)}
                    </p>
                  </td>

                  {/* STATUS */}
                  <td className='border-y border-slate-200/80 px-5 py-4 transition-colors duration-300 group-hover:border-blue-200 group-hover:bg-blue-50/30'>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${status.bg}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                      {item.status === 'RUNNING' && (
                        <StatusIcon size={12} className='animate-spin' />
                      )}
                    </span>
                  </td>

                  {/* ARROW ACTION */}
                  <td className='rounded-r-2xl border-y border-r border-slate-200/80 px-4 py-4 text-right transition-colors duration-300 group-hover:border-blue-200 group-hover:bg-blue-50/30'>
                    <div className='flex justify-end text-slate-300 group-hover:text-slate-600 transition-colors'>
                      <ArrowRightIcon
                        size={16}
                        weight='bold'
                        className='transition-transform group-hover:translate-x-0.5'
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {totalPages > 1 && (
        <div className='flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-xs text-slate-500 font-normal'>
            Showing{' '}
            <span className='font-semibold text-slate-700'>
              {startItem}
            </span>
            {' – '}
            <span className='font-semibold text-slate-700'>
              {endItem}
            </span>
            {' of '}
            <span className='font-semibold text-slate-700'>
              {optimizations.length}
            </span>{' '}
            runs
          </p>

          <div className='flex items-center gap-1.5'>
            {/* Previous */}
            <button
              type='button'
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer'
            >
              <CaretLeftIcon size={14} weight='bold' />
            </button>

            {/* Pages */}
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(page => {
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                )
              })
              .map((page, index, pages) => (
                <React.Fragment key={page}>
                  {index > 0 && pages[index - 1] !== page - 1 && (
                    <span className='flex h-8 w-8 items-center justify-center text-xs text-slate-400 font-normal'>
                      ...
                    </span>
                  )}

                  <button
                    type='button'
                    onClick={() => goToPage(page)}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            {/* Next */}
            <button
              type='button'
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer'
            >
              <CaretRightIcon size={14} weight='bold' />
            </button>
          </div>
        </div>
      )}

      {/* AUDIT LOG ROW KEYFRAME ANIMATION */}
      <style>
        {`
          @keyframes auditRowIn {
            0% {
              opacity: 0;
              transform: translateY(-18px);
            }

            60% {
              opacity: 1;
              transform: translateY(3px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}

export default OptimizationHistoryTable
