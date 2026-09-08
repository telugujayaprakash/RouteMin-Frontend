import React, { useEffect, useMemo, useState } from 'react'
import {
  FilePdfIcon,
  CurrencyInrIcon,
  ChartLineUpIcon,
  DatabaseIcon,
  ArrowClockwise,
  FunnelIcon,
  MagnifyingGlassIcon,
  CaretDownIcon,
  CalendarBlankIcon,
  EyeIcon,
  DownloadSimpleIcon,
  TrashIcon,
  XIcon
} from '@phosphor-icons/react'

import { useDispatch, useSelector } from 'react-redux'
import {
  fetchreports,
  deletereports,
  downloadreportsbyId
} from '../Redux/Reports/ReportSlice'
import ErrorCard from '../Components/ErrorCard'
import LoadingComponent from '../Components/LoadingComponent'
import StatCard from '../Components/StatCard'
import api from '../api/config'

function Reports() {
  const dispatch = useDispatch()

  const { reports, isLoading, error } = useSelector(state => state.Reports)

  // =========================================================
  // FILTER STATES
  // =========================================================

  const [search, setSearch] = useState('')
  const [algorithm, setAlgorithm] = useState('ALL')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // =========================================================
  // FETCH REPORTS
  // =========================================================

  useEffect(() => {
    dispatch(fetchreports())
  }, [dispatch])

  // =========================================================
  // HELPERS
  // =========================================================

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

  const formatDateInput = date => {
    if (!date) return null

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) {
      return null
    }

    return parsed
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search, algorithm, fromDate, toDate])

  // =========================================================
  // NORMALIZED REPORT DATA
  // =========================================================

  const reportList = useMemo(() => {
    if (!Array.isArray(reports)) {
      return []
    }

    return reports
  }, [reports])

  // =========================================================
  // FILTER REPORTS
  // =========================================================

  const filteredReports = useMemo(() => {
    const query = search.toLowerCase().trim()

    const startDate = fromDate ? new Date(`${fromDate}T00:00:00`) : null

    const endDate = toDate ? new Date(`${toDate}T23:59:59.999`) : null

    return reportList.filter(report => {
      // ---------------------------------------------
      // SEARCH
      // ---------------------------------------------

      const matchesSearch =
        !query ||
        String(report.runName || '')
          .toLowerCase()
          .includes(query) ||
        String(report.algorithm || '')
          .toLowerCase()
          .includes(query) ||
        String(report.generatedBy || '')
          .toLowerCase()
          .includes(query) ||
        String(report.fileName || '')
          .toLowerCase()
          .includes(query) ||
        String(report.optimizationRunId || '')
          .toLowerCase()
          .includes(query)

      // ---------------------------------------------
      // ALGORITHM
      // ---------------------------------------------

      const reportAlgorithm = String(report.algorithm || '').toUpperCase()

      const matchesAlgorithm =
        algorithm === 'ALL' || reportAlgorithm === algorithm

      // ---------------------------------------------
      // DATE
      // ---------------------------------------------

      const reportDate = formatDateInput(report.createdAt || report.generatedAt)

      const matchesFromDate =
        !startDate || (reportDate && reportDate >= startDate)

      const matchesToDate = !endDate || (reportDate && reportDate <= endDate)

      return (
        matchesSearch && matchesAlgorithm && matchesFromDate && matchesToDate
      )
    }).sort((a, b) => {
      const dateA = new Date(a.createdAt || a.generatedAt || 0).getTime()
      const dateB = new Date(b.createdAt || b.generatedAt || 0).getTime()
      return dateB - dateA
    })
  }, [reportList, search, algorithm, fromDate, toDate])

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalReports = reportList.length

  const totalCost = reportList.reduce(
    (sum, report) => sum + Number(report.totalCost || 0),
    0
  )

  const algorithmUsage = useMemo(() => {
    const usage = {}

    reportList.forEach(report => {
      const value = String(report.algorithm || 'Unknown').toUpperCase()

      usage[value] = (usage[value] || 0) + 1
    })

    return usage
  }, [reportList])

  const mostUsedAlgorithm =
    Object.entries(algorithmUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  const latestReport = useMemo(() => {
    if (!reportList.length) return null

    return [...reportList].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.generatedAt || 0).getTime()

      const dateB = new Date(b.createdAt || b.generatedAt || 0).getTime()

      return dateB - dateA
    })[0]
  }, [reportList])

  // =========================================================
  // ACTIVE FILTER CHECK
  // =========================================================

  const hasFilters = search || algorithm !== 'ALL' || fromDate || toDate

  const clearFilters = () => {
    setSearch('')
    setAlgorithm('ALL')
    setFromDate('')
    setToDate('')
  }

  // =========================================================
  // VIEW REPORT
  // =========================================================

  const handleView = async report => {
    try {
      const response = await api.get(
        `/api/v1/reports/download/run/${report.optimizationRunId}`,
        {
          responseType: 'blob'
        }
      )

      const file = new Blob([response.data], {
        type: 'application/pdf'
      })

      const fileURL = window.URL.createObjectURL(file)

      window.open(fileURL, '_blank')

      setTimeout(() => {
        window.URL.revokeObjectURL(fileURL)
      }, 1000)
    } catch (error) {
      console.error('Unable to open report:', error)
    }
  }
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE)

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE

    const endIndex = startIndex + ITEMS_PER_PAGE

    return filteredReports.slice(startIndex, endIndex)
  }, [filteredReports, currentPage])

  // DOWNLOAD REPORT
  const handleDownload = report => {
    dispatch(
      downloadreportsbyId({
        optimizationRunId: report.optimizationRunId,
        runName: report.runName
      })
    )
  }
  // =========================================================
  // DELETE REPORT
  // =========================================================

  const handleDelete = async optimizationRunId => {
    try {
      await dispatch(deletereports(optimizationRunId)).unwrap()

      dispatch(fetchreports())
    } catch (error) {
      console.error('Delete report failed:', error)
    }
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <ErrorCard
        error={error?.message || error}
        onRetry={() => dispatch(fetchreports())}
      />
    )
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className='min-h-screen bg-slate-50/70 font-sans text-slate-900 antialiased'>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className='border-b border-slate-200/80 bg-white px-5 py-5 sm:px-8 lg:px-10'>
        <div className='mx-auto max-w-[1600px]'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <div className='flex items-center gap-3'>
                <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-600/10'>
                  <FilePdfIcon size={23} weight='duotone' />
                </div>

                <div>
                  <h1 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
                    Optimization Reports
                  </h1>

                  <p className='mt-0.5 text-xs font-medium text-slate-500'>
                    View, download, and manage transportation optimization
                    reports.
                  </p>
                </div>
              </div>
            </div>

            <button
              type='button'
              onClick={() => dispatch(fetchreports())}
              className='inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95'
            >
              <ArrowClockwise size={16} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className='p-5 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-[1600px] space-y-6'>
          {isLoading ? (
            <div className='flex min-h-[420px] items-center justify-center'>
              <LoadingComponent />
            </div>
          ) : (
            <>
              {/* =================================================
                  STAT CARDS
              ================================================= */}

              <section className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
                <StatCard
                  title='Total Reports'
                  value={totalReports}
                  subtitle='Generated reports'
                  icon={FilePdfIcon}
                  bg='bg-rose-50'
                  text='text-rose-600'
                />

                <StatCard
                  title='Total Report Cost'
                  value={formatCurrency(totalCost)}
                  subtitle='Across all reports'
                  icon={CurrencyInrIcon}
                  bg='bg-blue-50'
                  text='text-blue-600'
                />

                <StatCard
                  title='Most Used Algorithm'
                  value={mostUsedAlgorithm}
                  subtitle={
                    mostUsedAlgorithm !== 'N/A'
                      ? `${algorithmUsage[mostUsedAlgorithm]} reports`
                      : 'No data'
                  }
                  icon={ChartLineUpIcon}
                  bg='bg-purple-50'
                  text='text-purple-600'
                />

                <StatCard
                  title='Latest Report'
                  value={latestReport?.algorithm || 'N/A'}
                  subtitle={
                    latestReport
                      ? formatDate(
                        latestReport.createdAt || latestReport.generatedAt
                      )
                      : 'No reports'
                  }
                  icon={DatabaseIcon}
                  bg='bg-emerald-50'
                  text='text-emerald-600'
                />
              </section>

              {/* =================================================
                  FILTER PANEL
              ================================================= */}

              <section className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
                {/* Filter Header */}

                <div className='border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6'>
                  <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
                        <FunnelIcon size={18} weight='duotone' />
                      </div>

                      <div>
                        <h2 className='text-sm font-bold text-slate-900'>
                          Report Filters
                        </h2>

                        <p className='text-[11px] font-medium text-slate-500'>
                          Find reports by name, algorithm, or date.
                        </p>
                      </div>
                    </div>

                    {hasFilters && (
                      <button
                        type='button'
                        onClick={clearFilters}
                        className='inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:self-auto'
                      >
                        <XIcon size={14} />
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Filters */}

                <div className='grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4'>
                  {/* Search */}

                  <div className='sm:col-span-2 lg:col-span-1'>
                    <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500'>
                      Search Reports
                    </label>

                    <div className='relative'>
                      <MagnifyingGlassIcon
                        size={17}
                        className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                      />

                      <input
                        type='text'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder='Run name, ID, user...'
                        className='h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                      />
                    </div>
                  </div>

                  {/* Algorithm */}

                  <div>
                    <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500'>
                      Algorithm
                    </label>

                    <div className='relative'>
                      <ChartLineUpIcon
                        size={17}
                        className='absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500'
                      />

                      <select
                        value={algorithm}
                        onChange={e => setAlgorithm(e.target.value)}
                        className='h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-9 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10'
                      >
                        <option value='ALL'>All Algorithms</option>

                        <option value='LCM'>LCM</option>

                        <option value='NWCR'>NWCR</option>

                        <option value='VAM'>VAM</option>
                      </select>

                      <CaretDownIcon
                        size={15}
                        className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
                      />
                    </div>
                  </div>

                  {/* From Date */}

                  <div>
                    <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500'>
                      From Date
                    </label>

                    <div className='relative'>
                      <CalendarBlankIcon
                        size={17}
                        className='absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500'
                      />

                      <input
                        type='date'
                        value={fromDate}
                        onChange={e => setFromDate(e.target.value)}
                        className='h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-xs font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                      />
                    </div>
                  </div>

                  {/* To Date */}

                  <div>
                    <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500'>
                      To Date
                    </label>

                    <div className='relative'>
                      <CalendarBlankIcon
                        size={17}
                        className='absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500'
                      />

                      <input
                        type='date'
                        value={toDate}
                        min={fromDate || undefined}
                        onChange={e => setToDate(e.target.value)}
                        className='h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-xs font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10'
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  REPORT TABLE
              ================================================= */}

              <section className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
                {/* Table Header */}

                <div className='flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-base font-bold text-slate-900'>
                        Generated Reports
                      </h2>

                      <span className='rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600'>
                        {filteredReports.length}
                      </span>
                    </div>

                    <p className='mt-1 text-xs font-medium text-slate-500'>
                      {filteredReports.length === reportList.length
                        ? 'All generated reports'
                        : `${filteredReports.length} matching reports`}
                    </p>
                  </div>
                </div>

                {/* Table */}

                <div className='overflow-x-auto'>
                  <table className='w-full min-w-[900px] text-left'>
                    <thead className='border-b border-slate-100 bg-slate-50/70'>
                      <tr className='text-[10px] font-bold uppercase tracking-wider text-slate-500'>
                        <th className='px-6 py-4'>Report</th>

                        <th className='px-6 py-4'>Algorithm</th>

                        <th className='px-6 py-4'>Generated</th>

                        <th className='px-6 py-4 text-center'>Actions</th>
                      </tr>
                    </thead>

                    <tbody className='divide-y divide-slate-100'>
                      {paginatedReports.map((report, index) => {
                        const algorithmValue = String(
                          report.algorithm || ''
                        ).toUpperCase()

                        const algorithmStyles = {
                          LCM: 'bg-blue-50 text-blue-700 border-blue-100',
                          NWCR: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                          VAM: 'bg-purple-50 text-purple-700 border-purple-100'
                        }

                        return (
                          <tr
                            key={report.id || report.optimizationRunId || index}
                            className='group transition-colors hover:bg-slate-50/70'
                          >
                            {/* Report */}

                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-3'>
                                <div className='relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-600/10'>
                                  <FilePdfIcon size={21} weight='duotone' />
                                </div>

                                <div className='min-w-0'>
                                  <p className='truncate text-sm font-bold text-slate-900'>
                                    {report.runName || 'Untitled Report'}
                                  </p>

                                  <p className='mt-0.5 font-mono text-[10px] font-medium text-slate-400'>
                                    Run ID #{report.optimizationRunId}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Algorithm */}

                            <td className='px-6 py-4'>
                              <span
                                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold ${algorithmStyles[algorithmValue] ||
                                  'border-slate-200 bg-slate-50 text-slate-600'
                                  }`}
                              >
                                {algorithmValue || 'N/A'}
                              </span>
                            </td>

                            {/* Date */}

                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-2'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600'>
                                  <CalendarBlankIcon
                                    size={16}
                                    weight='duotone'
                                  />
                                </div>

                                <div>
                                  <p className='whitespace-nowrap text-xs font-semibold text-slate-700'>
                                    {formatDate(
                                      report.createdAt || report.generatedAt
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Actions */}

                            <td className='px-6 py-4'>
                              <div className='flex items-center justify-center gap-1'>
                                <button
                                  type='button'
                                  onClick={() => handleView(report)}
                                  title='View Report'
                                  className='flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 active:scale-95'
                                >
                                  <EyeIcon size={18} />
                                </button>

                                <button
                                  type='button'
                                  onClick={() => handleDownload(report)}
                                  title='Download Report'
                                  className='flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600 active:scale-95'
                                >
                                  <DownloadSimpleIcon size={18} />
                                </button>

                                <button
                                  type='button'
                                  onClick={() =>
                                    handleDelete(report.optimizationRunId)
                                  }
                                  title='Delete Report'
                                  className='flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 active:scale-95'
                                >
                                  <TrashIcon size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}

                      {/* =================================================
                          EMPTY STATE
                      ================================================= */}

                      {filteredReports.length === 0 && (
                        <tr>
                          <td colSpan={5} className='px-6 py-20'>
                            <div className='flex flex-col items-center justify-center text-center'>
                              <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400'>
                                <FilePdfIcon size={32} weight='duotone' />
                              </div>

                              <h3 className='mt-4 text-sm font-bold text-slate-800'>
                                No reports found
                              </h3>

                              <p className='mt-1 max-w-sm text-xs leading-5 text-slate-400'>
                                No reports match your current search or filter
                                criteria.
                              </p>

                              {hasFilters && (
                                <button
                                  type='button'
                                  onClick={clearFilters}
                                  className='mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 active:scale-95'
                                >
                                  <XIcon size={14} />
                                  Clear Filters
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Reports
