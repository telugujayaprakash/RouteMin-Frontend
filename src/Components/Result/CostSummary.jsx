import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  SparkleIcon,
  CrownIcon,
  ArrowRightIcon,
  ArrowClockwiseIcon,
  ShieldCheckIcon,
  TrendDownIcon,
  LightningIcon
} from '@phosphor-icons/react'

function CostSummary ({ result, onTryVam, isVamRunning }) {
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

  const formatCurrency = value => Number(value || 0).toLocaleString('en-IN')

  if (isVAM) {
    return (
      <div className='overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-md'>
        <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 shadow-inner'>
              <ShieldCheckIcon size={28} weight='fill' />
            </div>

            <div>
              <div className='flex items-center gap-2'>
                <span className='inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 border border-emerald-500/30'>
                  Optimal Solution
                </span>
                <span className='text-xs font-bold text-slate-400'>
                  Vogel's Approximation Method (VAM)
                </span>
              </div>

              <h3 className='mt-2 text-lg font-extrabold text-white sm:text-xl'>
                Optimized Freight Cost: ₹ {formatCurrency(optimizedCost)}
              </h3>

              <p className='mt-1 text-xs font-medium leading-relaxed text-slate-300 max-w-2xl'>
                This shipment has been calculated using VAM penalty optimization, guaranteeing the lowest initial feasible transportation expense across all manufacturing plants and distribution warehouses.
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-900/40 border border-emerald-500/30 px-4 py-2.5 rounded-xl shrink-0 self-start md:self-center'>
            <TrendDownIcon size={16} weight='bold' />
            <span>Fully Optimized</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-slate-900/5 p-6 sm:p-8 shadow-xs border-l-4 border-l-amber-500'>
      <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex items-start gap-4'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 text-white shadow-md'>
            {isFree ? <CrownIcon size={26} weight='fill' /> : <SparkleIcon size={26} weight='fill' />}
          </div>

          <div>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900 border border-amber-300'>
                <LightningIcon size={12} weight='fill' className='text-amber-600' />
                Current Engine: {result.algorithm}
              </span>

              <span className='text-xs font-extrabold text-amber-800'>
                Potential Freight Reduction
              </span>
            </div>

            <h3 className='mt-2 text-lg font-black text-slate-900 sm:text-xl'>
              {isFree
                ? `Save up to ₹ ${formatCurrency(potentialVamSavings)} on this shipment run with VAM!`
                : `Re-run with VAM to potentially save ₹ ${formatCurrency(potentialVamSavings)}!`}
            </h3>

            <p className='mt-1 text-xs font-medium leading-relaxed text-slate-600 max-w-2xl'>
              {isFree
                ? `You executed ${result.algorithm} costing ₹ ${formatCurrency(initialCost)}. Upgrading to Premium unlocks Vogel's Approximation Method (VAM), which calculates row and column penalty costs to minimize logistics expense.`
                : `You selected ${result.algorithm} costing ₹ ${formatCurrency(initialCost)}. As a Premium user, click 'Try VAM' to automatically re-evaluate this exact matrix using Vogel's Approximation Method.`}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {isFree ? (
          <button
            type='button'
            onClick={() => navigate('/pricing')}
            className='inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-900 via-amber-950 to-slate-950 border border-amber-400/90 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-amber-300 shadow-md hover:scale-105 hover:border-amber-300 transition-all cursor-pointer'
          >
            <CrownIcon size={18} weight='fill' />
            <span>Subscribe to Premium</span>
            <ArrowRightIcon size={14} weight='bold' />
          </button>
        ) : (
          <button
            type='button'
            disabled={isVamRunning}
            onClick={() => onTryVam && onTryVam(result.optimizationRunId)}
            className='inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 border border-purple-400/50 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-md hover:scale-105 hover:bg-purple-800 transition-all cursor-pointer disabled:opacity-50'
          >
            {isVamRunning ? (
              <>
                <ArrowClockwiseIcon size={18} className='animate-spin' />
                <span>Running VAM...</span>
              </>
            ) : (
              <>
                <SparkleIcon size={18} weight='fill' className='text-amber-400' />
                <span>Try VAM (Instant Re-Run)</span>
                <ArrowRightIcon size={14} weight='bold' />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default CostSummary
