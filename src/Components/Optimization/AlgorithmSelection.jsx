import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKey, Crown, CheckCircle, ArrowRight } from '@phosphor-icons/react'

const algorithms = [
  {
    id: 'VAM',
    title: "Vogel's Approximation Method",
    description:
      'Produces a high-quality initial transportation solution using row and column penalties to reduce cost deviation.',
    recommended: true,
    premium: true
  },
  {
    id: 'LCM',
    title: 'Least Cost Method',
    description:
      'Allocates transportation quantities by selecting the lowest-cost available routes first.',
    recommended: false,
    premium: false
  },
  {
    id: 'NWCR',
    title: 'North West Corner Rule',
    description:
      'Provides a simple and fast initial allocation by starting from the north-west corner of the matrix.',
    recommended: false,
    premium: false
  }
]

function AlgorithmSelection({
  runName,
  factories,
  warehouses,
  matrix,
  isFree,
  onBack,
  onRun
}) {
  const navigate = useNavigate()
  const freePlan = Boolean(isFree)

  const [algorithm, setAlgorithm] = useState(freePlan ? 'LCM' : 'VAM')

  const summary = useMemo(() => {
    const totalSupply = factories.reduce(
      (sum, item) => sum + Number(item.supply || 0),
      0
    )

    const totalDemand = warehouses.reduce(
      (sum, item) => sum + Number(item.demand || 0),
      0
    )

    return {
      factories: factories.length,
      warehouses: warehouses.length,
      routes: factories.length * warehouses.length,
      totalSupply,
      totalDemand
    }
  }, [factories, warehouses])

  const handleAlgorithmChange = item => {
    if (item.id === 'VAM' && freePlan) {
      navigate('/pricing')
      return
    }

    setAlgorithm(item.id)
  }

  const handleRun = () => {
    if (freePlan && algorithm === 'VAM') {
      navigate('/pricing')
      return
    }

    onRun(algorithm)
  }

  const handlePremium = () => {
    navigate('/pricing')
  }

  return (
    <div>
      {/* ========================================================
          STEP HEADER
      ======================================================== */}

      <p className='text-xs font-bold uppercase tracking-wider text-blue-600'>
        Step 4 of 4
      </p>

      <h2 className='mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
        Review & Run Optimization
      </h2>

      <p className='mt-1 max-w-2xl text-xs leading-5 text-slate-500'>
        Review your transportation configuration and choose the method used to
        generate the initial allocation.
      </p>

      {/* ========================================================
          RUN NAME
      ======================================================== */}

      <div className='mt-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs'>
        <div className='border-b border-slate-100 p-6'>
          <h3 className='text-xs font-bold uppercase tracking-wider text-slate-500'>
            Optimization Run Name
          </h3>

          <p className='mt-2 text-base font-semibold text-slate-900 break-words'>
            {runName || 'Untitled Optimization Plan'}
          </p>
        </div>

        {/* ======================================================
            ALGORITHM SELECTION
        ====================================================== */}

        <div className='p-6'>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <h3 className='text-xs font-bold uppercase tracking-wider text-slate-500'>
                Select Optimization Engine
              </h3>

              <p className='mt-1 text-xs text-slate-400'>
                Choose how RouteMin should generate the initial transportation
                solution.
              </p>
            </div>

            {freePlan && (
              <span className='mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:mt-0'>
                Free Plan
              </span>
            )}
          </div>

          {/* ====================================================
              ALGORITHM LIST
          ==================================================== */}

          <div className='mt-5 space-y-3.5'>
            {algorithms.map(item => {
              const isVAM = item.id === 'VAM'
              const isLocked = isVAM && freePlan
              const isSelected = algorithm === item.id

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isLocked) {
                      handleAlgorithmChange(item)
                    }
                  }}
                  className={`
                    relative overflow-hidden rounded-2xl border transition-all duration-300
                    ${
                      isVAM
                        ? 'border-amber-300/80 bg-gradient-to-br from-amber-50/60 via-purple-50/30 to-slate-900/5 shadow-xs hover:border-amber-400'
                        : isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/20 shadow-sm'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }
                    ${isLocked ? 'cursor-not-allowed opacity-95' : 'cursor-pointer'}
                  `}
                >
                  {/* 🎗️ CORNER PREMIUM RIBBON STICKER */}
                  {isVAM && (
                    <div className='absolute -right-8 top-3 z-10 w-32 rotate-45 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-1 text-center shadow-md pointer-events-none'>
                      <span className='text-[9px] font-black uppercase tracking-widest text-white drop-shadow-xs flex items-center justify-center gap-1'>
                        <Crown size={10} weight='fill' />
                        PREMIUM
                      </span>
                    </div>
                  )}

                  {/* ALGORITHM CONTENT */}
                  <div className='block p-5'>
                    <div className='flex items-start gap-4'>
                      {/* Radio */}
                      <input
                        type='radio'
                        name='optimization-algorithm'
                        checked={isSelected}
                        disabled={isLocked}
                        onChange={() => handleAlgorithmChange(item)}
                        className='mt-1 h-4 w-4 cursor-pointer text-blue-600 focus:ring-blue-500 disabled:opacity-40'
                      />

                      {/* Algorithm Details */}
                      <div className='min-w-0 flex-1 pr-10'>
                        <div className='flex flex-wrap items-center gap-2.5'>
                          <h4
                            className={`
                              text-sm
                              font-bold

                              ${isLocked ? 'text-slate-500' : 'text-slate-900'}
                            `}
                          >
                            {item.title}
                          </h4>

                          {/* Recommended */}

                          {item.recommended && (
                            <span
                              className='
                                inline-flex
                                items-center
                                gap-1

                                rounded-full

                                bg-emerald-50

                                px-3
                                py-0.5

                                text-[11px]
                                font-semibold

                                text-emerald-700

                                ring-1
                                ring-inset
                                ring-emerald-600/20
                              '
                            >
                              <CheckCircle size={12} weight='fill' />
                              Recommended
                            </span>
                          )}

                          {/* Locked label */}

                          {isLocked && (
                            <span
                              className='
                                inline-flex
                                items-center
                                gap-1

                                rounded-full

                                bg-slate-100

                                px-2.5
                                py-0.5

                                text-[10px]
                                font-bold

                                text-slate-500

                                border
                                border-slate-200
                              '
                            >
                              <LockKey size={11} weight='bold' />
                              Locked
                            </span>
                          )}
                        </div>

                        <p
                          className={`
                            mt-1
                            text-xs
                            font-normal
                            leading-5

                            ${isLocked ? 'text-slate-500 font-medium' : 'text-slate-500'}
                          `}
                        >
                          {item.description}
                        </p>

                        {/* GOLDEN SUBSCRIBE BUTTON (Matches User Spec) */}
                        {isLocked && (
                          <div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/80 pt-3.5'>
                            <p className='text-xs font-bold text-amber-900 flex items-center gap-1.5'>
                              <Crown size={15} weight='fill' className='text-amber-500' />
                              Unlock maximum cost reduction with VAM
                            </p>

                            <button
                              type='button'
                              onClick={e => {
                                e.stopPropagation()
                                handlePremium()
                              }}
                              className='rounded-xl bg-gradient-to-b from-amber-900 to-black border-2 border-amber-400/90 px-5 py-2 text-xs font-black uppercase tracking-widest text-amber-300 shadow-md hover:scale-105 hover:border-amber-300 transition-all cursor-pointer'
                            >
                              SUBSCRIBE
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          OPTIMIZATION SUMMARY
      ======================================================== */}

      <div className='mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs'>
        <h3 className='text-xs font-bold uppercase tracking-wider text-slate-500'>
          Optimization Summary
        </h3>

        <div className='mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5'>
          <SummaryItem title='Factories' value={summary.factories} />

          <SummaryItem title='Warehouses' value={summary.warehouses} />

          <SummaryItem title='Routes' value={summary.routes} />

          <SummaryItem
            title='Supply'
            value={summary.totalSupply.toLocaleString()}
          />

          <SummaryItem
            title='Demand'
            value={summary.totalDemand.toLocaleString()}
          />
        </div>
      </div>

      {/* ========================================================
          ACTIONS
      ======================================================== */}

      <div className='mt-8 flex items-center justify-between gap-4'>
        <button
          type='button'
          onClick={onBack}
          className='
            rounded-xl
            border
            border-slate-200
            bg-white
            px-6
            py-2.5
            text-xs
            font-semibold
            text-slate-700

            shadow-2xs

            transition-all
            duration-200

            hover:bg-slate-50
            hover:border-slate-300

            active:scale-95

            cursor-pointer
          '
        >
          Back
        </button>

        <button
          type='button'
          onClick={handleRun}
          disabled={freePlan && algorithm === 'VAM'}
          className='
            inline-flex
            items-center
            gap-2

            rounded-xl

            bg-blue-600

            px-6
            py-3
            sm:px-8

            text-xs
            font-semibold
            text-white

            shadow-sm
            shadow-blue-600/20

            transition-all
            duration-200

            hover:bg-blue-700
            hover:shadow-md

            active:scale-95

            disabled:cursor-not-allowed
            disabled:bg-slate-300
            disabled:text-slate-500
            disabled:shadow-none

            cursor-pointer
          '
        >
          {freePlan && algorithm === 'VAM' ? (
            <>
              <LockKey size={15} weight='bold' />
              Upgrade to Run VAM
            </>
          ) : (
            <>
              Run Optimization Engine
              <ArrowRight size={14} weight='bold' />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

/* ============================================================
   SUMMARY ITEM
============================================================ */

function SummaryItem({ title, value }) {
  return (
    <div
      className='
        rounded-xl
        border
        border-slate-100
        bg-slate-50/70
        p-4
      '
    >
      <p
        className='
          text-[10px]
          font-bold
          uppercase
          tracking-wider
          text-slate-400
        '
      >
        {title}
      </p>

      <p
        className='
          mt-1
          text-xl
          font-black
          text-slate-900
        '
      >
        {value}
      </p>
    </div>
  )
}

export default AlgorithmSelection
