import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  MagnifyingGlassIcon,
  ListChecksIcon,
  CalendarBlankIcon,
  ClockCounterClockwiseIcon,
  WarningCircleIcon,
  ArrowClockwiseIcon
} from '@phosphor-icons/react'

import StatCard from '../Components/StatCard'
import AuditLogsTable from '../Components/AuditLogsTable'
import { fetchAuditLogs } from '../Redux/AuditLogs/AuditSlice'

function AuditLogs () {
  const dispatch = useDispatch()

  const [search, setSearch] = useState('')

  const { logs, isLoading, error } = useSelector(state => state.AuditLogs)

  useEffect(() => {
    dispatch(fetchAuditLogs())
  }, [dispatch])

  console.log(logs)
  const auditLogs = useMemo(() => {
    const data = Array.isArray(logs) ? logs : logs?.data || []

    return [...data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  }, [logs])

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return auditLogs

    return auditLogs.filter(
      log =>
        log.entityName?.toLowerCase().includes(query) ||
        log.actionType?.toLowerCase().includes(query) ||
        log.remarks?.toLowerCase().includes(query)
    )
  }, [auditLogs, search])

  const today = new Date().toDateString()

  const todayLogs = auditLogs.filter(
    log => new Date(log.createdAt).toDateString() === today
  ).length

  const thisMonthLogs = auditLogs.filter(log => {
    const date = new Date(log.createdAt)
    const now = new Date()

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  }).length

  const stats = [
    {
      title: 'Total Logs',
      value: auditLogs.length,
      icon: ListChecksIcon
    },
    {
      title: "Today's Logs",
      value: todayLogs,
      icon: CalendarBlankIcon
    },
    {
      title: 'This Month',
      value: thisMonthLogs,
      icon: ClockCounterClockwiseIcon
    }
  ]

  if (error) {
    return (
      <div className='flex min-h-[80vh] items-center justify-center px-6'>
        <div className='w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm'>
          {/* Icon */}

          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50'>
            <WarningCircleIcon
              size={36}
              weight='fill'
              className='text-red-500'
            />
          </div>

          {/* Title */}

          <h2 className='mt-6 text-2xl font-semibold text-gray-900'>
            Something went wrong
          </h2>

          {/* Description */}

          <p className='mt-2 text-sm leading-6 text-gray-500'>
            We couldn't load the requested information. Please try again or
            refresh the page.
          </p>

          {/* Error Message */}

          <div className='mt-6 rounded-xl border border-red-100 bg-red-50 p-4'>
            <p className='wrap-break-word text-sm text-red-600'>{error}</p>
          </div>

          {/* Action */}

          <button
            onClick={() => window.location.reload()}
            className='mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800'
          >
            <ArrowClockwiseIcon size={18} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50/60 font-sans antialiased text-slate-900'>
      {/* ================= HEADER ================= */}

      <header className='border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-5 sm:px-8 lg:px-10'>
        <div className='mx-auto max-w-[1600px]'>
          <h1 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
            Audit & System Logs
          </h1>

          <p className='mt-0.5 text-xs font-medium text-slate-500'>
            Monitor system operations, entity updates, and optimization activity
            across the RouteMin platform.
          </p>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className='p-6 lg:p-8'>
        <div className='mx-auto max-w-[1600px] space-y-6'>
          {/* Stats */}

          <div className='grid gap-5 md:grid-cols-3'>
            {stats.map(stat => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </div>

          {/* Logs Card */}

          <section className='overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs'>
            {/* Toolbar */}

            <div className='flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between'>
              <div>
                <h2 className='text-base font-bold text-slate-900'>
                  Activity Logs
                </h2>

                <p className='mt-0.5 text-xs font-medium text-slate-500'>
                  {filteredLogs.length} system event log
                  {filteredLogs.length !== 1 ? 's' : ''} recorded
                </p>
              </div>

              <div className='relative w-full md:w-96'>
                <MagnifyingGlassIcon
                  size={18}
                  className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                />

                <input
                  type='text'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder='Search entity, action or remarks...'
                  className='h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs font-medium text-slate-900 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400'
                />
              </div>
            </div>

            {/* Table */}

            <AuditLogsTable logs={filteredLogs} loading={isLoading} />
          </section>
        </div>
      </main>
    </div>
  )
}

export default AuditLogs
