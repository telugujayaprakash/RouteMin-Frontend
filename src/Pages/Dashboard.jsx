import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowClockwise, Coins } from '@phosphor-icons/react'
import DashboardStatCard from '../Components/Dashboard/DashboardStatCard'
import { fetchDashboard } from '../Redux/Dashboard/DashboardSlice'
import LoadingComponent from '../Components/LoadingComponent'
import ErrorCard from '../Components/ErrorCard'
import LatestOptimizationCard from '../Components/Dashboard/LatestOptimizationCard'
import AlgorithmUsageChart from '../Components/Dashboard/AlgorithmUsageChart'
import SubscriptionUsage from '../Components/Dashboard/SubscriptionUsage'
import RecentActivityCard from '../Components/Dashboard/RecentActivityCard'

function Dashboard() {
  const dispatch = useDispatch()
  const {
    Data: overview,
    isLoading,
    error
  } = useSelector(state => state.Dashboard)

  useEffect(() => {
    dispatch(fetchDashboard())
    console.log(overview)
  }, [dispatch])

  if (error) {
    return (
      <ErrorCard
        error={error?.message || error}
        onRetry={() => dispatch(fetchDashboard())}
      />
    )
  }

  const summary = overview?.summary || {}
  const mostUsedAlgorithm =
    overview?.algorithmUsage?.reduce((prev, current) =>
      current.count > prev.count ? current : prev
    )


  const formatCurrency = value =>
    `₹ ${Number(value || 0).toLocaleString('en-IN')}`

  const primaryStats = [
    {
      title: 'Factories',
      value: summary.factoryCount ?? 0,
      icon: 'emojione:factory',
      color: 'blue'
    },
    {
      title: 'Warehouses',
      value: summary.warehouseCount ?? 0,
      icon: 'streamline-sharp-color:warehouse-1',
      color: 'green'
    },
    {
      title: 'Optimization Runs',
      value: summary.optimizationCount ?? 0,
      icon: 'mdi:source-branch',
      color: 'purple'
    },
    {
      title: 'Optimal Cost',
      value: formatCurrency(summary.totalOptimalCost),
      icon: 'mdi:currency-inr',
      color: 'rose'
    },
    {
      title: 'Frequent Algorithm',
      value: mostUsedAlgorithm?.algorithm || '-',
      icon: 'mdi:sort-descending',
      color: 'orange'
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50/80 to-white p-6 space-y-6'>
      {/* ================= HEADER ================= */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-extrabold text-slate-900 tracking-tight'>
            Dashboard
          </h1>
          <p className='text-xs sm:text-sm text-slate-500 mt-0.5 font-medium'>
            Logistics optimization insights & network allocation
          </p>
        </div>

        <button
          onClick={() => dispatch(fetchDashboard())}
          className='flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer'
        >
          <ArrowClockwise size={16} weight='bold' className='text-blue-600' />
          Refresh Data
        </button>
      </div>

      {isLoading ? (
        <div className='flex min-h-[420px] items-center justify-center'>
          <LoadingComponent />
        </div>
      ) : (
        <>
          {/* ================= SECTION 1: USAGE & SUBSCRIPTION BANNER ================= */}
          <section className='space-y-2.5'>
            <div className='flex items-center justify-between px-1'>
              <h2 className='text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5'>
                <Coins size={15} weight='duotone' className='text-blue-600' />
                Subscription Plan & Optimization Usage
              </h2>
            </div>

            <SubscriptionUsage subscription={overview?.subscription} />
          </section>

          {/* ================= SECTION 2: KPI STRIP ================= */}
          <section className='space-y-2.5'>
            <div className='px-1'>
              <h2 className='text-xs font-extrabold uppercase tracking-wider text-slate-500'>
                Network Overview Metrics
              </h2>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
              {primaryStats.map((stat, i) => (
                <DashboardStatCard key={i} {...stat} />
              ))}
            </div>
          </section>

          {/* ================= SECTION 3: MAIN GRID ================= */}
          <section className='grid grid-cols-12 gap-6'>
            {/* LEFT SIDE: LATEST OPTIMIZATION & RECENT ACTIVITY */}
            <div className='col-span-12 xl:col-span-8 space-y-6'>
              {/* Latest Optimization Result */}
              <div className='rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm'>
                <LatestOptimizationCard
                  optimization={overview?.latestOptimization}
                />
              </div>

              {/* Recent Activity Timeline */}
              <RecentActivityCard logs={overview?.recentAuditLogs} />
            </div>

            {/* RIGHT SIDE: ALGORITHM USAGE CHART */}
            <div className='col-span-12 xl:col-span-4 flex flex-col gap-6'>
              {/* Algorithm Usage Chart */}
              <AlgorithmUsageChart data={overview?.algorithmUsage} />
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default Dashboard
