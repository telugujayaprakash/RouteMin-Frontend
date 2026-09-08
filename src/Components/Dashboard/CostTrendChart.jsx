import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  ChartLineUp,
  TrendDown,
  TrendUp,
  CurrencyInrIcon
} from '@phosphor-icons/react'

function CostTrendChart({ data = [] }) {
  // =========================================================
  // DATA
  // =========================================================

  const chronologicalData = [...data].reverse()

  const chartData = chronologicalData.map((item, index) => ({
    run: `Run ${index + 1}`,
    baseline: Number(item.baselineCost || 0),
    optimized: Number(item.optimizedCost || 0),
    savings: Number(item.baselineCost || 0) - Number(item.optimizedCost || 0)
  }))

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalBaseline = chartData.reduce((sum, item) => sum + item.baseline, 0)

  const totalOptimized = chartData.reduce(
    (sum, item) => sum + item.optimized,
    0
  )

  const totalSavings = totalBaseline - totalOptimized

  const savingsPercent =
    totalBaseline > 0
      ? ((totalSavings / totalBaseline) * 100).toFixed(1)
      : '0.0'

  const formatCurrency = value =>
    `₹${Number(value || 0).toLocaleString('en-IN')}`

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!chartData.length) {
    return (
      <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
            <ChartLineUp size={21} weight='duotone' />
          </div>

          <div>
            <h2 className='text-base font-bold text-slate-900'>
              Cost Optimization
            </h2>

            <p className='mt-0.5 text-xs text-slate-500'>
              Baseline versus optimized transportation costs
            </p>
          </div>
        </div>

        <div className='flex h-[280px] items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400'>
              <ChartLineUp size={28} weight='duotone' />
            </div>

            <p className='mt-4 text-sm font-semibold text-slate-700'>
              No cost data available
            </p>

            <p className='mt-1 text-xs text-slate-400'>
              Run an optimization to see cost trends.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // =========================================================
  // TOOLTIP
  // =========================================================

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
      return null
    }

    const baseline = Number(
      payload.find(item => item.dataKey === 'baseline')?.value || 0
    )

    const optimized = Number(
      payload.find(item => item.dataKey === 'optimized')?.value || 0
    )

    const savings = baseline - optimized

    return (
      <div className='min-w-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl'>
        {/* Tooltip Header */}

        <div className='border-b border-slate-100 bg-slate-50 px-4 py-3'>
          <p className='text-xs font-bold text-slate-900'>{label}</p>

          <p className='mt-0.5 text-[10px] text-slate-400'>
            Transportation cost analysis
          </p>
        </div>

        {/* Values */}

        <div className='space-y-3 p-4'>
          {/* Baseline */}

          <div className='flex items-center justify-between gap-6'>
            <div className='flex items-center gap-2'>
              <span className='h-2.5 w-2.5 rounded-full bg-slate-400' />

              <span className='text-xs text-slate-500'>Baseline</span>
            </div>

            <span className='text-xs font-bold text-slate-800'>
              {formatCurrency(baseline)}
            </span>
          </div>

          {/* Optimized */}

          <div className='flex items-center justify-between gap-6'>
            <div className='flex items-center gap-2'>
              <span className='h-2.5 w-2.5 rounded-full bg-blue-600' />

              <span className='text-xs text-slate-500'>Optimized</span>
            </div>

            <span className='text-xs font-bold text-blue-600'>
              {formatCurrency(optimized)}
            </span>
          </div>

          {/* Savings */}

          <div className='flex items-center justify-between gap-6 border-t border-slate-100 pt-3'>
            <div className='flex items-center gap-2'>
              <TrendDown size={14} weight='bold' className='text-emerald-600' />

              <span className='text-xs font-semibold text-emerald-700'>
                Saved
              </span>
            </div>

            <span className='text-xs font-bold text-emerald-600'>
              {formatCurrency(savings)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <section className='w-full overflow-hidden'>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className='mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
        {/* Title */}

        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-600/10'>
            <ChartLineUp size={21} weight='duotone' />
          </div>

          <div>
            <h2 className='text-base font-bold text-slate-900'>
              Cost Optimization
            </h2>

            <p className='mt-0.5 text-xs text-slate-500'>
              Baseline versus optimized cost across runs
            </p>
          </div>
        </div>

        {/* Summary */}

        <div className='flex items-center gap-3'>
          {/* Total Saved */}

          <div className='hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 sm:block'>
            <div className='flex items-center gap-2'>
              <CurrencyInrIcon size={16} className='text-slate-400' />

              <span className='text-[10px] font-semibold uppercase tracking-wide text-slate-400'>
                Total Saved
              </span>
            </div>

            <p className='mt-1 text-sm font-bold text-slate-800'>
              {formatCurrency(totalSavings)}
            </p>
          </div>

          {/* Savings Percentage */}

          <div className='rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5'>
            <div className='flex items-center gap-1.5'>
              <TrendDown size={14} weight='bold' className='text-emerald-600' />

              <span className='text-[10px] font-bold uppercase tracking-wide text-emerald-600'>
                Savings
              </span>
            </div>

            <p className='mt-1 text-sm font-bold text-emerald-700'>
              {savingsPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CHART
      ===================================================== */}

      <div className='h-[280px] w-full overflow-hidden sm:h-[300px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 5,
              bottom: 0
            }}
          >
            {/* =================================================
                GRADIENTS
            ================================================= */}

            <defs>
              <linearGradient
                id='optimizedAreaGradient'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop offset='0%' stopColor='#2563EB' stopOpacity={0.14} />

                <stop offset='100%' stopColor='#2563EB' stopOpacity={0} />
              </linearGradient>

              <linearGradient
                id='baselineAreaGradient'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop offset='0%' stopColor='#94A3B8' stopOpacity={0.06} />

                <stop offset='100%' stopColor='#94A3B8' stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* =================================================
                GRID
            ================================================= */}

            <CartesianGrid
              strokeDasharray='3 5'
              vertical={false}
              stroke='#E2E8F0'
            />

            {/* =================================================
                X AXIS
            ================================================= */}

            <XAxis
              dataKey='run'
              tick={{
                fontSize: 11,
                fill: '#64748B'
              }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            {/* =================================================
                Y AXIS
            ================================================= */}

            <YAxis
              tickFormatter={value => {
                if (value >= 1000000) {
                  return `₹${(value / 1000000).toFixed(1)}M`
                }

                if (value >= 1000) {
                  return `₹${(value / 1000).toFixed(0)}k`
                }

                return `₹${value}`
              }}
              tick={{
                fontSize: 10,
                fill: '#64748B'
              }}
              tickLine={false}
              axisLine={false}
              width={55}
            />

            {/* =================================================
                TOOLTIP
            ================================================= */}

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#CBD5E1',
                strokeDasharray: '4 4'
              }}
            />

            {/* =================================================
                BASELINE
            ================================================= */}

            <Area
              type='monotone'
              dataKey='baseline'
              name='Baseline Cost'
              stroke='#94A3B8'
              strokeWidth={2}
              strokeDasharray='5 5'
              fill='url(#baselineAreaGradient)'
              fillOpacity={1}
              dot={{
                r: 3,
                fill: '#94A3B8',
                stroke: '#FFFFFF',
                strokeWidth: 2
              }}
              activeDot={{
                r: 5,
                fill: '#94A3B8',
                stroke: '#FFFFFF',
                strokeWidth: 2
              }}
            />

            {/* =================================================
                OPTIMIZED
            ================================================= */}

            <Area
              type='monotone'
              dataKey='optimized'
              name='Optimized Cost'
              stroke='#2563EB'
              strokeWidth={3}
              fill='url(#optimizedAreaGradient)'
              fillOpacity={1}
              dot={{
                r: 4,
                fill: '#2563EB',
                stroke: '#FFFFFF',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: '#2563EB',
                stroke: '#FFFFFF',
                strokeWidth: 3
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* =====================================================
          LEGEND
      ===================================================== */}

      <div className='mt-4 flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 pt-4'>
        <div className='flex items-center gap-2'>
          <span className='h-0.5 w-7 border-t-2 border-dashed border-slate-400' />

          <span className='text-xs font-medium text-slate-500'>
            Baseline Cost
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='h-0.5 w-7 bg-blue-600' />

          <span className='text-xs font-medium text-slate-600'>
            Optimized Cost
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='h-2.5 w-2.5 rounded-full bg-emerald-500' />

          <span className='text-xs font-medium text-slate-500'>
            Cost Reduction
          </span>
        </div>
      </div>
    </section>
  )
}

export default CostTrendChart
