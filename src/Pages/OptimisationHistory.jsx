import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, ArrowsClockwiseIcon, CurrencyInrIcon } from '@phosphor-icons/react'
import ErrorCard from '../Components/ErrorCard'
import StatCard from '../Components/StatCard'
import OptimizationHistoryTable from '../Components/OptimizationHistoryTable'
import LoadingComponent from '../Components/LoadingComponent'
import { fetchOptimizationHistory } from '../Redux/Optimisation/OptimisationSlice'

function OptimizationHistory() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')

  const { history, isLoading, error } = useSelector(state => state.Optimization)

  useEffect(() => {
    dispatch(fetchOptimizationHistory())
  }, [dispatch])

  const historyList = useMemo(() => {
    if (Array.isArray(history)) return history
    return history?.History || history?.data || []
  }, [history])

  const filteredOptimizations = useMemo(() => {
    if (!historyList.length) return []

    const query = search.toLowerCase().trim()

    if (!query) return historyList

    return historyList.filter(
      item =>
        item.runName?.toLowerCase().includes(query) ||
        item.algorithm?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query)
    )
  }, [historyList, search])

  const totalRuns = historyList.length

  const totalCost = historyList.reduce(
    (sum, item) => sum + Number(item.optimizedCost || item.initialCost || 0),
    0
  )

  const stats = [
    {
      title: 'Optimization Runs',
      value: totalRuns,
      icon: ArrowsClockwiseIcon
    },
    {
      title: 'Total Transportation Cost',
      value: `₹ ${totalCost.toLocaleString('en-IN')}`,
      icon: CurrencyInrIcon
    }
  ]

  if (error) {
    return (
      <ErrorCard
        error={error?.message || error}
        onRetry={() => dispatch(fetchOptimizationHistory())}
      />
    )
  }

  const handleView = item => {
    navigate(`/result/${item.optimizationRunId}`)
  }

  return (
    <div className='min-h-screen bg-slate-50/60 font-sans antialiased text-slate-900'>
      {/* ================= HEADER ================= */}

      <header className='border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-5 sm:px-8 lg:px-10'>
        <div className='mx-auto max-w-[1600px]'>
          <h1 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
            Optimization History
          </h1>

          <p className='mt-0.5 text-xs font-medium text-slate-500'>
            Review previous optimization runs, compare transportation costs, and
            revisit generated allocation results.
          </p>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className='p-6 lg:p-8'>
        <div className='mx-auto max-w-[1600px] space-y-6'>
          {/* ================= STATS ================= */}

          <section className='grid gap-6 md:grid-cols-2'>
            {stats.map(stat => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </section>

          {/* ================= SEARCH ================= */}

          <section className='rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <h2 className='text-base font-bold text-slate-900'>
                  Optimization Runs
                </h2>

                <p className='mt-0.5 text-xs font-medium text-slate-500'>
                  {filteredOptimizations.length} Optimization
                  {filteredOptimizations.length !== 1 ? 's' : ''} recorded in
                  system
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
                  placeholder='Search by run name, algorithm or status...'
                  className='h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs font-medium text-slate-900 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400'
                />
              </div>
            </div>
          </section>

          {/* ================= TABLE ================= */}

          <section className='overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs'>
            {isLoading ? (
              <div className='py-24 text-center'>
                <LoadingComponent />
              </div>
            ) : (
              <OptimizationHistoryTable
                optimizations={filteredOptimizations}
                onView={handleView}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default OptimizationHistory
