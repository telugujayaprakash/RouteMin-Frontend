import React, { useEffect, useState } from 'react'
import {
  CheckCircleIcon,
  PencilSimpleIcon,
  TrashIcon,
  ClockIcon,
  CaretLeftIcon,
  CaretRightIcon,
  PlusIcon,
  FileArrowDownIcon,
  UserIcon,
  CreditCardIcon
} from '@phosphor-icons/react'
import LoadingComponent from '../Components/LoadingComponent'

function AuditLogsTable({ logs = [], loading, itemsPerPage = 8 }) {
  const [currentPage, setCurrentPage] = useState(1)

  const getAction = log => {
    const action = (typeof log === 'string' ? log : log?.actionType || '').toUpperCase()
    const entity = (log?.entityName || '').toLowerCase()
    const remarks = (log?.remarks || '').toLowerCase()

    if (
      action === 'CREATED' ||
      action === 'CREATE' ||
      remarks.includes('added') ||
      remarks.includes('created')
    ) {
      if (entity.includes('warehouse') || remarks.includes('warehouse')) {
        return {
          label: action || 'Created',
          icon: PlusIcon,
          badge: 'bg-blue-50 text-blue-700 border-blue-200'
        }
      }
      return {
        label: action || 'Created',
        icon: CheckCircleIcon,
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }
    }

    if (action === 'COMPLETED' || remarks.includes('completed') || remarks.includes('optimiz')) {
      return {
        label: action || 'Completed',
        icon: CheckCircleIcon,
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }
    }

    if (action === 'DOWNLOADED' || action === 'DOWNLOAD' || remarks.includes('download')) {
      return {
        label: action || 'Downloaded',
        icon: FileArrowDownIcon,
        badge: 'bg-cyan-50 text-cyan-700 border-cyan-200'
      }
    }

    if (
      action === 'UPDATED' ||
      action === 'UPDATE' ||
      remarks.includes('update') ||
      entity.includes('profile')
    ) {
      return {
        label: action || 'Updated',
        icon: UserIcon,
        badge: 'bg-purple-50 text-purple-700 border-purple-200'
      }
    }

    if (action === 'PAYMENT' || remarks.includes('payment') || remarks.includes('subscription')) {
      return {
        label: action || 'Payment',
        icon: CreditCardIcon,
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }
    }

    if (action === 'DELETED' || action === 'DELETE' || remarks.includes('delete')) {
      return {
        label: action || 'Deleted',
        icon: TrashIcon,
        badge: 'bg-rose-50 text-rose-700 border-rose-200'
      }
    }

    return {
      label: action || 'Activity',
      icon: ClockIcon,
      badge: 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const formatDate = date => {
    if (!date) return '—'

    const value = new Date(date)

    if (Number.isNaN(value.getTime())) return '—'

    return value.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /* =========================================================
      PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(logs.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage

  const currentLogs = logs.slice(startIndex, startIndex + itemsPerPage)

  const startItem = logs.length === 0 ? 0 : startIndex + 1

  const endItem = Math.min(startIndex + itemsPerPage, logs.length)

  /* Reset page when logs change */

  useEffect(() => {
    setCurrentPage(1)
  }, [logs.length])

  const goToPage = page => {
    if (page < 1 || page > totalPages) return

    setCurrentPage(page)
  }

  /* =========================================================
      LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <LoadingComponent />
      </div>
    )
  }

  /* =========================================================
      EMPTY
  ========================================================= */

  if (!logs.length) {
    return (
      <div className='flex min-h-[350px] items-center justify-center text-center'>
        <div>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400'>
            <ClockIcon size={22} weight='duotone' />
          </div>

          <h3 className='mt-4 text-base font-bold text-slate-900'>
            No audit logs found
          </h3>

          <p className='mt-1 text-sm text-slate-500'>
            System activity will appear here when changes are made.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className='overflow-x-auto px-3 pb-2 pt-2 sm:px-5'>
        <table
          className='
            w-full
            min-w-[760px]
            border-separate
            border-spacing-y-2
            text-left
          '
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <thead>
            <tr className='text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400'>
              <th className='px-5 py-2'>Date & Time</th>

              <th className='px-5 py-2 text-center'>Action</th>

              <th className='px-5 py-2'>Entity</th>

              <th className='px-5 py-2'>Remarks</th>
            </tr>
          </thead>

          {/* =================================================
              BODY
          ================================================= */}

          <tbody>
            {currentLogs.map((log, index) => {
              const action = getAction(log)

              const ActionIcon = action.icon

              return (
                <tr
                  key={log.id}
                  className='
                    group
                    bg-white
                    opacity-0
                    animate-[auditRowIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]
                    transition-all
                    duration-300
                    hover:-translate-y-[1px]
                  '
                  style={{
                    animationDelay: `${index * 70}ms`
                  }}
                >
                  {/* =========================================
                      DATE
                  ========================================= */}

                  <td
                    className='
                      rounded-l-2xl
                      border-y
                      border-l
                      border-slate-200/80
                      px-5
                      py-4
                      transition-colors
                      duration-300
                      group-hover:border-blue-200
                      group-hover:bg-blue-50/30
                    '
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className='
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-slate-50
                          text-slate-500
                          transition-all
                          duration-300
                          group-hover:bg-blue-50
                          group-hover:text-blue-600
                        '
                      >
                        <ClockIcon size={17} weight='duotone' />
                      </div>

                      <div>
                        <p className='whitespace-nowrap text-sm font-semibold text-slate-700'>
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* =========================================
                      ACTION
                  ========================================= */}

                  <td
                    className='
                      border-y
                      border-slate-200/80
                      px-5
                      py-4
                      text-center
                      transition-colors
                      duration-300
                      group-hover:border-blue-200
                      group-hover:bg-blue-50/30
                    '
                  >
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        transition-all
                        duration-300
                        ${action.badge}
                      `}
                    >
                      <ActionIcon size={15} weight='fill' />

                      {action.label}
                    </span>
                  </td>

                  {/* =========================================
                      ENTITY
                  ========================================= */}

                  <td
                    className='
                      border-y
                      border-slate-200/80
                      px-5
                      py-4
                      transition-colors
                      duration-300
                      group-hover:border-blue-200
                      group-hover:bg-blue-50/30
                    '
                  >
                    <div>
                      <p className='text-sm font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600'>
                        {log.entityName || 'Unknown Entity'}
                      </p>

                      <p className='mt-1 font-mono text-xs text-slate-400'>
                        Entity ID #{log.entityId}
                      </p>
                    </div>
                  </td>

                  {/* =========================================
                      REMARKS
                  ========================================= */}

                  <td
                    className='
                      rounded-r-2xl
                      border-y
                      border-r
                      border-slate-200/80
                      px-5
                      py-4
                      transition-colors
                      duration-300
                      group-hover:border-blue-200
                      group-hover:bg-blue-50/30
                    '
                  >
                    <p className='max-w-[420px] text-sm leading-relaxed text-slate-600'>
                      {log.remarks || 'No remarks available.'}
                    </p>
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
        <div
          className='
            flex
            flex-col
            gap-3
            border-t
            border-slate-100
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          '
        >
          {/* Results */}

          <p className='text-xs text-slate-500'>
            Showing{' '}
            <span className='font-semibold text-slate-700'>{startItem}</span>
            {' – '}
            <span className='font-semibold text-slate-700'>{endItem}</span>
            {' of '}
            <span className='font-semibold text-slate-700'>
              {logs.length}
            </span>{' '}
            logs
          </p>

          {/* Controls */}

          <div className='flex items-center gap-1.5'>
            {/* Previous */}

            <button
              type='button'
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                bg-white
                text-slate-500
                transition-all
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-600
                disabled:cursor-not-allowed
                disabled:opacity-40
              '
            >
              <CaretLeftIcon size={14} weight='bold' />
            </button>

            {/* Page Numbers */}

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
                  {/* Ellipsis */}

                  {index > 0 && pages[index - 1] !== page - 1 && (
                    <span className='flex h-8 w-8 items-center justify-center text-xs text-slate-400'>
                      ...
                    </span>
                  )}

                  {/* Page */}

                  <button
                    type='button'
                    onClick={() => goToPage(page)}
                    className={`
                      flex
                      h-8
                      min-w-8
                      items-center
                      justify-center
                      rounded-lg
                      px-2
                      text-[11px]
                      font-bold
                      transition-all
                      ${currentPage === page
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
                      }
                    `}
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
              className='
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                bg-white
                text-slate-500
                transition-all
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-600
                disabled:cursor-not-allowed
                disabled:opacity-40
              '
            >
              <CaretRightIcon size={14} weight='bold' />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          ROW ANIMATION
      ===================================================== */}

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

export default AuditLogsTable
