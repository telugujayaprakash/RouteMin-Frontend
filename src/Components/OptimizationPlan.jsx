import React from 'react'
import {
  FactoryIcon,
  WarehouseIcon,
  PathIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
  ChartLineUpIcon,
  ArrowsLeftRightIcon,
  LightningIcon,
  InfoIcon
} from '@phosphor-icons/react'

function OptimizationPlan ({ onRunOptimization }) {
  const algorithms = [
    {
      name: 'North-West Corner Rule',
      shortName: 'NWCR',
      description:
        'Creates an initial feasible solution by allocating supply starting from the top-left corner of the transportation matrix.',
      icon: ArrowsLeftRightIcon,
      tag: 'Simple'
    },
    {
      name: 'Least Cost Method',
      shortName: 'LCM',
      description:
        'Prioritizes routes with the lowest transportation cost to create a more cost-efficient initial solution.',
      icon: ChartLineUpIcon,
      tag: 'Cost Focused'
    },
    {
      name: "Vogel's Approximation Method",
      shortName: 'VAM',
      description:
        'Uses row and column penalties to produce a strong initial solution that is often closer to the optimal result.',
      icon: LightningIcon,
      tag: 'Recommended'
    }
  ]
  function FlowItem ({ icon: Icon, title, description }) {
    return (
      <div className='flex min-w-35 items-center gap-3 rounded-xl border border-gray-200 px-4 py-3'>
        <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100'>
          <Icon size={19} className='text-gray-700' />
        </div>

        <div className='text-left'>
          <p className='text-sm font-medium text-gray-900'>{title}</p>

          <p className='text-xs text-gray-400'>{description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* ================= HEADER ================= */}

      <header className='border-b border-gray-200 bg-white px-5 py-5 sm:px-6 lg:px-8'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight text-gray-900'>
            New Optimization
          </h1>

          <p className='mt-1 text-sm text-gray-500'>
            Create an optimized transportation plan for your supply network.
          </p>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className='p-5 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-[1600px]'>
          {/* ================= INTRODUCTION ================= */}

          <section className='overflow-hidden rounded-2xl border border-gray-200 bg-white'>
            <div className='px-6 py-10 text-center sm:px-10 sm:py-12'>
              <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white'>
                <PathIcon size={25} />
              </div>

              <h2 className='mt-5 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl'>
                Optimize Your Transportation Network
              </h2>

              <p className='mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base'>
                RouteMin analyzes factory supply, warehouse demand and
                transportation costs to generate an efficient allocation plan
                using transportation optimization algorithms.
              </p>

              {/* FLOW */}

              <div className='mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row'>
                <FlowItem
                  icon={FactoryIcon}
                  title='Factories'
                  description='Supply'
                />

                <ArrowRightIcon
                  size={20}
                  className='rotate-90 text-gray-300 sm:rotate-0'
                />

                <FlowItem
                  icon={PathIcon}
                  title='Optimization'
                  description='Algorithm'
                />

                <ArrowRightIcon
                  size={20}
                  className='rotate-90 text-gray-300 sm:rotate-0'
                />

                <FlowItem
                  icon={WarehouseIcon}
                  title='Warehouses'
                  description='Demand'
                />
              </div>

              <button
                onClick={onRunOptimization}
                className='mt-9 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 text-sm font-medium text-white'
              >
                <PlayIcon size={18} weight='fill' />
                Run Optimization
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default OptimizationPlan
