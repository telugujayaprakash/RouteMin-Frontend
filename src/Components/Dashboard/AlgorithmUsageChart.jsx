import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts'
import { BrainIcon, ChartPie } from '@phosphor-icons/react'

const ALGORITHM_COLORS = {
  VAM: '#2563EB',   // Royal Blue
  LCM: '#10B981',   // Emerald Green
  NWCR: '#8B5CF6',  // Purple
  MODI: '#F59E0B',  // Amber
  DEFAULT: '#06B6D4' // Cyan
}

const COLOR_PALETTE = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899']

function AlgorithmUsageChart({ data = [] }) {
  const chartData = data.map((item, idx) => {
    const key = String(item.algorithm || '').toUpperCase()
    const color = ALGORITHM_COLORS[key] || COLOR_PALETTE[idx % COLOR_PALETTE.length]
    return {
      name: item.algorithm || 'Unknown',
      algorithm: item.algorithm || 'Unknown',
      count: Number(item.count || 0),
      color
    }
  })

  const totalRuns = chartData.reduce((sum, item) => sum + item.count, 0)

  const mostUsed = chartData.reduce(
    (max, item) => (item.count > max.count ? item : max),
    { algorithm: 'N/A', count: 0 }
  )

  // CUSTOM TOOLTIP
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const { name, value, payload: itemData } = payload[0]
    const percent = totalRuns > 0 ? ((value / totalRuns) * 100).toFixed(1) : '0'

    return (
      <div className='rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md text-xs'>
        <div className='flex items-center gap-2 mb-1'>
          <span
            className='h-2.5 w-2.5 rounded-full'
            style={{ backgroundColor: itemData.color }}
          />
          <p className='font-extrabold text-slate-900'>{name}</p>
        </div>
        <div className='text-slate-600 font-semibold flex items-center justify-between gap-3'>
          <span>Usage:</span>
          <span className='font-bold text-slate-900'>{value} Runs ({percent}%)</span>
        </div>
      </div>
    )
  }

  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm'>
      {/* HEADER */}
      <div className='relative px-6 pt-6 pb-2'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-base font-extrabold text-slate-900 tracking-tight'>
              Algorithm Distribution
            </h2>
            <p className='text-xs text-slate-500 mt-0.5 font-medium'>
              Share of optimization methods executed
            </p>
          </div>

          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100'>
            <ChartPie size={20} weight='duotone' />
          </div>
        </div>
      </div>

      {/* 📊 PIE CHART SECTION */}
      <div className='relative h-[220px] w-full flex items-center justify-center px-4 my-1'>
        {chartData.length > 0 && totalRuns > 0 ? (
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={chartData}
                cx='50%'
                cy='50%'
                innerRadius={54}
                outerRadius={78}
                paddingAngle={4}
                dataKey='count'
                stroke='#ffffff'
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                    className='transition-all duration-300 hover:opacity-80 cursor-pointer outline-none'
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className='text-center text-slate-400 text-xs font-medium'>
            No algorithm usage data recorded yet
          </div>
        )}

        {/* Center Donut Ring Stat Overlay */}
        {totalRuns > 0 && (
          <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
            <span className='text-2xl font-black text-slate-900 tracking-tight leading-none'>
              {totalRuns}
            </span>
            <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1'>
              Total Runs
            </span>
          </div>
        )}
      </div>

      {/* 🔽 CLEAN LEGEND & PERCENTAGE BREAKDOWN */}
      <div className='relative px-6 pb-6 pt-2 border-t border-slate-100 space-y-2.5'>
        {chartData.map(item => {
          const pct = totalRuns > 0 ? Math.round((item.count / totalRuns) * 100) : 0
          return (
            <div
              key={item.algorithm}
              className='rounded-xl bg-slate-50/80 border border-slate-100 p-2.5 transition-all hover:bg-slate-100/70'
            >
              <div className='flex items-center justify-between text-xs font-semibold'>
                <div className='flex items-center gap-2 min-w-0'>
                  <span
                    className='h-3 w-3 rounded-full shrink-0 shadow-2xs'
                    style={{ backgroundColor: item.color }}
                  />
                  <span className='text-slate-900 font-bold truncate'>
                    {item.algorithm}
                  </span>
                </div>

                <div className='flex items-center gap-1.5 shrink-0 text-slate-600 font-semibold'>
                  <span className='font-bold text-slate-900'>{item.count} runs</span>
                  <span className='text-slate-400 text-[11px]'>({pct}%)</span>
                </div>
              </div>

              {/* Micro Progress Bar */}
              <div className='mt-2 h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden'>
                <div
                  className='h-full rounded-full transition-all duration-500'
                  style={{
                    width: `${pct}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AlgorithmUsageChart
