import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TruckIcon,
  FactoryIcon,
  WarehouseIcon,
  PackageIcon,
  CurrencyInrIcon,
  FunnelSimpleIcon,
  DotsThreeVerticalIcon,
  XIcon,
  CaretDownIcon,
  ChartLineUpIcon,
  CheckCircleIcon
} from '@phosphor-icons/react'

function RouteVisualization({ allocations = [] }) {
  const routes = Array.isArray(allocations) ? allocations : []

  const [selectedRoute, setSelectedRoute] = useState(null)
  const [view, setView] = useState('flow')
  const [showAllFactories, setShowAllFactories] = useState(false)
  const [showAllWarehouses, setShowAllWarehouses] = useState(false)

  /* ============================================================
     FORMATTERS
  ============================================================ */

  const formatNumber = value => Number(value ?? 0).toLocaleString('en-IN')

  const formatCurrency = value =>
    `₹ ${Number(value ?? 0).toLocaleString('en-IN')}`

  /* ============================================================
     FACTORIES
  ============================================================ */

  const factories = useMemo(() => {
    const map = new Map()

    routes.forEach(route => {
      const id =
        route.factoryId ?? route.factoryName ?? `factory-${Math.random()}`

      if (!map.has(id)) {
        map.set(id, {
          id,
          name: route.factoryName || 'Unknown Factory',
          quantity: 0,
          routes: []
        })
      }

      const factory = map.get(id)

      factory.quantity += Number(route.allocatedQuantity ?? 0)

      factory.routes.push(route)
    })

    return Array.from(map.values())
  }, [routes])

  /* ============================================================
     WAREHOUSES
  ============================================================ */

  const warehouses = useMemo(() => {
    const map = new Map()

    routes.forEach(route => {
      const id =
        route.warehouseId ?? route.warehouseName ?? `warehouse-${Math.random()}`

      if (!map.has(id)) {
        map.set(id, {
          id,
          name: route.warehouseName || 'Unknown Warehouse',
          quantity: 0,
          routes: [],
          cost: 0
        })
      }

      const warehouse = map.get(id)

      warehouse.quantity += Number(route.allocatedQuantity ?? 0)

      warehouse.cost += Number(route.allocationCost ?? 0)

      warehouse.routes.push(route)
    })

    return Array.from(map.values())
  }, [routes])

  /* ============================================================
     TOTALS
  ============================================================ */

  const totalQuantity = routes.reduce(
    (sum, route) => sum + Number(route.allocatedQuantity ?? 0),
    0
  )

  const totalCost = routes.reduce(
    (sum, route) => sum + Number(route.allocationCost ?? 0),
    0
  )

  /* ============================================================
     VISIBLE NODES
  ============================================================ */

  const visibleFactories = showAllFactories ? factories : factories.slice(0, 6)

  const visibleWarehouses = showAllWarehouses
    ? warehouses
    : warehouses.slice(0, 6)

  /* ============================================================
     SELECT ROUTE
  ============================================================ */

  const handleRouteClick = route => {
    setSelectedRoute(prev => (prev === route ? null : route))
  }

  /* ============================================================
     EMPTY
  ============================================================ */

  if (!routes.length) {
    return (
      <div className='rounded-3xl border border-slate-200 bg-white'>
        <div className='flex min-h-[420px] flex-col items-center justify-center px-6 text-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
            <TruckIcon size={30} weight='duotone' />
          </div>

          <h2 className='mt-5 text-xl font-bold text-slate-900'>
            No transportation routes
          </h2>

          <p className='mt-2 max-w-md text-sm leading-6 text-slate-500'>
            No allocation routes were generated for this optimization.
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]'>
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className='border-b border-slate-200 bg-white px-5 py-5 sm:px-7 lg:px-8'>
        <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
          {/* TITLE */}

          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
              <TruckIcon size={26} weight='duotone' />
            </div>

            <div>
              <h2 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
                Route Visualization
              </h2>

              <p className='mt-1 text-sm text-slate-500'>
                Optimized transportation network
              </p>
            </div>
          </div>

          {/* METRICS + VIEW */}

          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
              <Metric label='Factories' value={factories.length} />

              <Metric label='Warehouses' value={warehouses.length} />

              <Metric label='Routes' value={routes.length} />

              <Metric
                label='Allocated'
                value={`${formatNumber(totalQuantity)} units`}
                primary
              />
            </div>

            {/* VIEW SWITCH */}

            <div className='flex h-10 rounded-xl border border-slate-200 bg-slate-50 p-1'>
              <button
                type='button'
                onClick={() => setView('flow')}
                className={`rounded-lg px-4 text-xs font-semibold transition-all ${view === 'flow'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                Flow Map
              </button>

              <button
                type='button'
                onClick={() => setView('matrix')}
                className={`rounded-lg px-4 text-xs font-semibold transition-all ${view === 'matrix'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                Matrix View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MATRIX PLACEHOLDER
      ======================================================== */}

      {view === 'matrix' ? (
        <AllocationMatrix
          factories={factories}
          warehouses={warehouses}
          routes={routes}
          formatNumber={formatNumber}
          formatCurrency={formatCurrency}
        />
      ) : (
        <>
          {/* ====================================================
              FLOW MAP
          ==================================================== */}

          <div className='relative bg-[#f8fafc]'>
            <DesktopFlowMap
              factories={visibleFactories}
              warehouses={visibleWarehouses}
              allFactories={factories}
              allWarehouses={warehouses}
              routes={routes}
              selectedRoute={selectedRoute}
              onRouteClick={handleRouteClick}
              formatNumber={formatNumber}
              formatCurrency={formatCurrency}
            />

            {/* ==================================================
                INSPECTOR
            ================================================== */}

            <AnimatePresence>
              {selectedRoute && (
                <RouteInspector
                  route={selectedRoute}
                  onClose={() => setSelectedRoute(null)}
                  formatNumber={formatNumber}
                  formatCurrency={formatCurrency}
                />
              )}
            </AnimatePresence>
          </div>

          {/* ====================================================
              MORE FACTORIES / WAREHOUSES
          ==================================================== */}

          {(factories.length > 6 || warehouses.length > 6) && (
            <div className='flex flex-col border-t border-slate-200 bg-white sm:flex-row'>
              {factories.length > 6 && (
                <button
                  type='button'
                  onClick={() => setShowAllFactories(!showAllFactories)}
                  className='flex flex-1 items-center justify-center gap-2 border-b border-slate-200 px-5 py-3.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:border-b-0 sm:border-r'
                >
                  {showAllFactories
                    ? 'Show fewer factories'
                    : `View all ${factories.length} factories`}

                  <CaretDownIcon
                    size={14}
                    className={
                      showAllFactories ? 'rotate-180 transition' : 'transition'
                    }
                  />
                </button>
              )}

              {warehouses.length > 6 && (
                <button
                  type='button'
                  onClick={() => setShowAllWarehouses(!showAllWarehouses)}
                  className='flex flex-1 items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50'
                >
                  {showAllWarehouses
                    ? 'Show fewer warehouses'
                    : `View all ${warehouses.length} warehouses`}

                  <CaretDownIcon
                    size={14}
                    className={
                      showAllWarehouses ? 'rotate-180 transition' : 'transition'
                    }
                  />
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <div className='border-t border-slate-200 bg-white px-5 py-5 sm:px-7 lg:px-8'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          {/* STATUS */}

          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600'>
              <ChartLineUpIcon size={22} weight='duotone' />
            </div>

            <div>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-bold text-slate-900'>
                  Live optimized flow
                </p>

                <span className='rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600'>
                  Active
                </span>
              </div>

              <p className='mt-1 text-xs text-slate-500 sm:text-sm'>
                Each animated route represents an actual transportation
                allocation.
              </p>
            </div>
          </div>

          {/* TOTALS */}

          <div className='flex items-center gap-6 sm:gap-8'>
            <div>
              <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                Total Quantity
              </p>

              <p className='mt-1 text-lg font-bold text-slate-900'>
                {formatNumber(totalQuantity)}{' '}
                <span className='text-xs font-medium text-slate-400'>
                  units
                </span>
              </p>
            </div>

            <div className='h-10 w-px bg-slate-200' />

            <div>
              <p className='text-[10px] font-bold uppercase tracking-wider text-emerald-600'>
                Transportation Cost
              </p>

              <p className='mt-1 text-lg font-bold text-emerald-600'>
                {formatCurrency(totalCost)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================================================================
   DESKTOP FLOW MAP
================================================================ */

function DesktopFlowMap({
  factories,
  warehouses,
  allFactories,
  allWarehouses,
  routes,
  selectedRoute,
  onRouteClick,
  formatNumber,
  formatCurrency
}) {
  const rowCount = Math.max(factories.length, warehouses.length)

  const ROW_HEIGHT = 108
  const TOP_PADDING = 125
  const BOTTOM_PADDING = 75

  const height = Math.max(
    560,
    TOP_PADDING + rowCount * ROW_HEIGHT + BOTTOM_PADDING
  )

  const VIEWBOX_WIDTH = 1400

  const LEFT_ANCHOR = 275
  const RIGHT_ANCHOR = 1125

  const getY = (index, total) => {
    if (total <= 1) {
      return height / 2
    }

    const available = height - TOP_PADDING - BOTTOM_PADDING

    return TOP_PADDING + (index * available) / (total - 1)
  }

  const getFactoryIndex = route => {
    const index = factories.findIndex(
      factory => factory.id === (route.factoryId ?? route.factoryName)
    )

    return index
  }

  const getWarehouseIndex = route => {
    const index = warehouses.findIndex(
      warehouse => warehouse.id === (route.warehouseId ?? route.warehouseName)
    )

    return index
  }

  const getPath = route => {
    const factoryIndex = getFactoryIndex(route)

    const warehouseIndex = getWarehouseIndex(route)

    if (factoryIndex === -1 || warehouseIndex === -1) {
      return null
    }

    const startY = getY(factoryIndex, factories.length)

    const endY = getY(warehouseIndex, warehouses.length)

    const distance = RIGHT_ANCHOR - LEFT_ANCHOR

    const curve = distance * 0.42

    return `
      M ${LEFT_ANCHOR} ${startY}
      C ${LEFT_ANCHOR + curve} ${startY},
        ${RIGHT_ANCHOR - curve} ${endY},
        ${RIGHT_ANCHOR} ${endY}
    `
  }

  const visibleRoute = route => {
    const factoryExists = getFactoryIndex(route) !== -1

    const warehouseExists = getWarehouseIndex(route) !== -1

    return factoryExists && warehouseExists
  }

  return (
    <div className='hidden lg:block'>
      <div className='relative max-h-[850px] overflow-y-auto overflow-x-hidden'>
        <div
          className='relative min-h-[520px] min-w-[1100px]'
          style={{
            height
          }}
        >
          {/* ==================================================
              COLUMN TITLES
          ================================================== */}

          <div className='absolute left-8 top-5 z-20 flex items-center gap-2'>
            <FactoryIcon size={18} weight='duotone' className='text-blue-600' />

            <div>
              <p className='text-xs font-bold uppercase tracking-[0.12em] text-blue-600'>
                Supply Nodes
              </p>

              <p className='mt-0.5 text-[11px] text-slate-400'>
                {allFactories.length}{' '}
                {allFactories.length === 1 ? 'factory' : 'factories'}
              </p>
            </div>
          </div>

          <div className='absolute right-8 top-5 z-20 flex items-center gap-2'>
            <div className='text-right'>
              <p className='text-xs font-bold uppercase tracking-[0.12em] text-emerald-600'>
                Demand Nodes
              </p>

              <p className='mt-0.5 text-[11px] text-slate-400'>
                {allWarehouses.length}{' '}
                {allWarehouses.length === 1 ? 'warehouse' : 'warehouses'}
              </p>
            </div>

            <WarehouseIcon
              size={18}
              weight='duotone'
              className='text-emerald-600'
            />
          </div>

          {/* ==================================================
              CENTER DIVIDER
          ================================================== */}

          <div className='pointer-events-none absolute bottom-0 left-1/2 top-0 border-l border-dashed border-slate-200/80' />

          {/* ==================================================
              ROUTE SVG
          ================================================== */}

          <svg
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${height}`}
            preserveAspectRatio='none'
            className='pointer-events-none absolute inset-0 h-full w-full'
          >
            <defs>
              <linearGradient
                id='route-blue-green'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
              >
                <stop offset='0%' stopColor='#60a5fa' />

                <stop offset='100%' stopColor='#10b981' />
              </linearGradient>

              <filter
                id='route-glow'
                x='-50%'
                y='-50%'
                width='200%'
                height='200%'
              >
                <feGaussianBlur stdDeviation='5' />
              </filter>
            </defs>

            {routes.map((route, index) => {
              if (!visibleRoute(route)) {
                return null
              }

              const path = getPath(route)

              if (!path) {
                return null
              }

              const isSelected = selectedRoute === route

              const hasSelection = selectedRoute !== null

              const isDimmed = hasSelection && !isSelected

              return (
                <RoutePath
                  key={`${route.factoryId}-${route.warehouseId}-${index}`}
                  path={path}
                  index={index}
                  selected={isSelected}
                  dimmed={isDimmed}
                  onClick={() => onRouteClick(route)}
                />
              )
            })}
          </svg>

          {/* ==================================================
              FACTORY NODES
          ================================================== */}

          {factories.map((factory, index) => (
            <FlowFactoryNode
              key={factory.id}
              factory={factory}
              top={getY(index, factories.length)}
              formatNumber={formatNumber}
            />
          ))}

          {/* ==================================================
              WAREHOUSE NODES
          ================================================== */}

          {warehouses.map((warehouse, index) => (
            <FlowWarehouseNode
              key={warehouse.id}
              warehouse={warehouse}
              top={getY(index, warehouses.length)}
              formatNumber={formatNumber}
            />
          ))}

          {/* ==================================================
              LEGEND
          ================================================== */}

          <div className='absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-5 rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur'>
            <LegendItem type='blue' label='Active Route' />

            <LegendItem type='gray' label='Other Routes' />

            <LegendItem type='green' label='Selected Route' />

            <div className='hidden h-4 w-px bg-slate-200 xl:block' />

            <span className='hidden text-[11px] text-slate-400 xl:block'>
              Click a route for details
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   ROUTE PATH
================================================================ */

function RoutePath({ path, index, selected, dimmed, onClick }) {
  const duration = 2.8 + (index % 4) * 0.35

  const delay = (index % 5) * 0.25

  return (
    <g
      onClick={onClick}
      className='pointer-events-auto cursor-pointer'
      opacity={dimmed ? 0.13 : 1}
    >
      {/* ======================================================
          OUTER TRACK
      ====================================================== */}

      <path
        d={path}
        fill='none'
        stroke={selected ? '#10b981' : '#dbeafe'}
        strokeWidth={selected ? 8 : 7}
        strokeLinecap='round'
        opacity={selected ? 0.22 : 0.75}
      />

      {/* ======================================================
          MAIN LINE
      ====================================================== */}

      <path
        d={path}
        fill='none'
        stroke={selected ? '#10b981' : 'url(#route-blue-green)'}
        strokeWidth={selected ? 4 : 2.5}
        strokeLinecap='round'
        opacity={selected ? 1 : 0.65}
      />

      {/* ======================================================
          MOVING GLOW
      ====================================================== */}

      <circle
        r={selected ? 15 : 12}
        fill={selected ? '#10b981' : '#3b82f6'}
        opacity='0.12'
      >
        <animateMotion
          path={path}
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount='indefinite'
        />
      </circle>

      {/* ======================================================
          MOVING DOT
      ====================================================== */}

      <circle r={selected ? 6 : 5} fill={selected ? '#059669' : '#2563eb'}>
        <animateMotion
          path={path}
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount='indefinite'
        />
      </circle>
    </g>
  )
}

/* ================================================================
   FACTORY NODE
================================================================ */

function FlowFactoryNode({ factory, top, formatNumber }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      transition={{
        duration: 0.4
      }}
      className='absolute left-6 z-20 w-[245px] -translate-y-1/2'
      style={{
        top
      }}
    >
      <div className='group rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_5px_20px_rgba(15,23,42,0.04)] transition-all hover:border-blue-200 hover:shadow-md'>
        <div className='flex items-center gap-3'>
          <div className='relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
            <FactoryIcon size={23} weight='duotone' />

            <span className='absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500' />
          </div>

          <div className='min-w-0'>
            <p className='truncate text-sm font-bold text-slate-900'>
              {factory.name}
            </p>

            <div className='mt-1.5 flex items-center gap-2'>
              <span className='text-xs font-semibold text-slate-600'>
                {formatNumber(factory.quantity)} units
              </span>

              <span className='text-slate-300'>•</span>

              <span className='text-[11px] text-slate-400'>
                {factory.routes.length}{' '}
                {factory.routes.length === 1 ? 'route' : 'routes'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* NODE CONNECTION */}

      <div className='absolute -right-[7px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-[3px] border-white bg-blue-500 shadow-sm' />
    </motion.div>
  )
}

/* ================================================================
   WAREHOUSE NODE
================================================================ */

function FlowWarehouseNode({ warehouse, top, formatNumber }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      transition={{
        duration: 0.4
      }}
      className='absolute right-6 z-20 w-[245px] -translate-y-1/2'
      style={{
        top
      }}
    >
      <div className='group rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-[0_5px_20px_rgba(15,23,42,0.04)] transition-all hover:border-emerald-200 hover:shadow-md'>
        <div className='flex items-center gap-3'>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-bold text-slate-900'>
              {warehouse.name}
            </p>

            <div className='mt-1.5 flex items-center gap-2'>
              <span className='text-xs font-semibold text-slate-600'>
                {formatNumber(warehouse.quantity)} units
              </span>

              <span className='text-slate-300'>•</span>

              <span className='text-[11px] text-emerald-600'>
                {warehouse.routes.length}{' '}
                {warehouse.routes.length === 1 ? 'allocation' : 'allocations'}
              </span>
            </div>
          </div>

          <div className='relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
            <WarehouseIcon size={23} weight='duotone' />

            <span className='absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500' />
          </div>
        </div>
      </div>

      {/* NODE CONNECTION */}

      <div className='absolute -left-[7px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-[3px] border-white bg-emerald-500 shadow-sm' />
    </motion.div>
  )
}

/* ================================================================
   ROUTE INSPECTOR
================================================================ */

function RouteInspector({ route, onClose, formatNumber, formatCurrency }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
        scale: 0.97
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }}
      exit={{
        opacity: 0,
        y: 15,
        scale: 0.97
      }}
      transition={{
        duration: 0.2
      }}
      className='absolute left-1/2 top-1/2 z-40 w-[min(430px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2'
    >
      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]'>
        {/* HEADER */}

        <div className='border-b border-slate-100 px-5 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                <ChartLineUpIcon size={17} weight='duotone' />
              </div>

              <p className='text-xs font-bold uppercase tracking-wider text-emerald-600'>
                Route Allocation
              </p>
            </div>

            <button
              type='button'
              onClick={onClose}
              className='flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700'
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>

        {/* ROUTE */}

        <div className='px-5 py-4'>
          <div className='flex items-center gap-3'>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold text-slate-800'>
                {route.factoryName || 'Unknown Factory'}
              </p>

              <p className='mt-0.5 text-[10px] font-medium uppercase tracking-wider text-blue-500'>
                Supply
              </p>
            </div>

            <div className='flex shrink-0 items-center gap-1'>
              <span className='h-px w-5 bg-slate-300' />

              <TruckIcon size={18} weight='duotone' className='text-blue-600' />

              <span className='h-px w-5 bg-slate-300' />
            </div>

            <div className='min-w-0 flex-1 text-right'>
              <p className='truncate text-sm font-semibold text-slate-800'>
                {route.warehouseName || 'Unknown Warehouse'}
              </p>

              <p className='mt-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-500'>
                Demand
              </p>
            </div>
          </div>
        </div>

        {/* DATA */}

        <div className='border-t border-slate-100'>
          <DetailRow
            label='Allocated Quantity'
            value={`${formatNumber(route.allocatedQuantity)} units`}
          />

          <DetailRow
            label='Rate / Unit'
            value={formatCurrency(route.costPerUnit)}
          />

          <DetailRow
            label='Transportation Cost'
            value={formatCurrency(route.allocationCost)}
            highlight
          />
        </div>

        {/* STATUS */}

        <div className='border-t border-slate-100 bg-slate-50/70 px-5 py-3.5'>
          <div className='flex items-center gap-2'>
            <CheckCircleIcon
              size={16}
              weight='fill'
              className='text-emerald-500'
            />

            <span className='text-xs font-semibold text-slate-600'>
              Active Route
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ================================================================
   DETAIL ROW
================================================================ */

function DetailRow({ label, value, highlight = false }) {
  return (
    <div className='flex items-center justify-between gap-4 px-5 py-3.5'>
      <span className='text-xs text-slate-500'>{label}</span>

      <span
        className={`text-sm font-bold ${highlight ? 'text-emerald-600' : 'text-slate-800'
          }`}
      >
        {value}
      </span>
    </div>
  )
}

/* ================================================================
   METRIC
================================================================ */

function Metric({ label, value, primary = false }) {
  return (
    <div
      className={`min-w-[90px] rounded-xl border px-3.5 py-2.5 ${primary ? 'border-blue-100 bg-blue-50/70' : 'border-slate-200 bg-white'
        }`}
    >
      <p className='text-[9px] font-bold uppercase tracking-wider text-slate-400'>
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-bold ${primary ? 'text-blue-600' : 'text-slate-900'
          }`}
      >
        {value}
      </p>
    </div>
  )
}

/* ================================================================
   LEGEND
================================================================ */

function LegendItem({ type, label }) {
  const styles = {
    blue: 'bg-blue-500',
    gray: 'bg-slate-300',
    green: 'bg-emerald-500'
  }

  return (
    <div className='flex items-center gap-2'>
      <span className={`h-0.5 w-5 rounded-full ${styles[type]}`} />

      <span className='text-[10px] font-medium text-slate-500'>{label}</span>
    </div>
  )
}

/* ================================================================
   MATRIX VIEW
================================================================ */

function AllocationMatrix({
  factories,
  warehouses,
  routes,
  formatNumber,
  formatCurrency
}) {
  const getAllocation = (factory, warehouse) =>
    routes.find(
      route =>
        (route.factoryId ?? route.factoryName) === factory.id &&
        (route.warehouseId ?? route.warehouseName) === warehouse.id
    )

  return (
    <div className='overflow-x-auto bg-slate-50 p-4 sm:p-6'>
      <div className='min-w-[850px] overflow-hidden rounded-2xl border border-slate-200 bg-white'>
        <div className='border-b border-slate-200 px-5 py-4'>
          <h3 className='text-sm font-bold text-slate-900'>
            Allocation Matrix
          </h3>

          <p className='mt-1 text-xs text-slate-500'>
            Transportation allocation between supply and demand nodes.
          </p>
        </div>

        <table className='w-full border-collapse text-left'>
          <thead>
            <tr className='bg-slate-50'>
              <th className='sticky left-0 z-10 border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-blue-600'>
                Factories
              </th>

              {warehouses.map(warehouse => (
                <th
                  key={warehouse.id}
                  className='border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-600'
                >
                  {warehouse.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {factories.map(factory => (
              <tr key={factory.id} className='transition hover:bg-slate-50'>
                <td className='sticky left-0 z-10 border-r border-b border-slate-200 bg-white px-4 py-4'>
                  <p className='text-sm font-bold text-slate-900'>
                    {factory.name}
                  </p>

                  <p className='mt-1 text-[11px] text-slate-400'>
                    {formatNumber(factory.quantity)} units
                  </p>
                </td>

                {warehouses.map(warehouse => {
                  const allocation = getAllocation(factory, warehouse)

                  return (
                    <td
                      key={warehouse.id}
                      className='border-b border-slate-200 px-4 py-4'
                    >
                      {allocation ? (
                        <div className='rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2.5'>
                          <p className='text-sm font-bold text-blue-700'>
                            {formatNumber(allocation.allocatedQuantity)} units
                          </p>

                          <p className='mt-1 text-[11px] text-slate-500'>
                            {formatCurrency(allocation.costPerUnit)} / unit
                          </p>

                          <p className='mt-1 text-xs font-semibold text-emerald-600'>
                            {formatCurrency(allocation.allocationCost)}
                          </p>
                        </div>
                      ) : (
                        <span className='text-xs text-slate-300'>—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ================================================================
   MOBILE VIEW
================================================================ */

function MobileFlowList({ routes, formatNumber, formatCurrency }) {
  return (
    <div className='divide-y divide-slate-200 bg-slate-50 lg:hidden'>
      {routes.map((route, index) => (
        <motion.div
          key={`${route.factoryId}-${route.warehouseId}-${index}`}
          initial={{
            opacity: 0,
            y: 12
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: index * 0.03
          }}
          className='bg-white p-4'
        >
          <div className='flex items-center gap-3'>
            <div className='flex min-w-0 flex-1 items-center gap-2.5'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
                <FactoryIcon size={20} weight='duotone' />
              </div>

              <div className='min-w-0'>
                <p className='truncate text-sm font-bold text-slate-900'>
                  {route.factoryName}
                </p>

                <p className='text-[10px] font-bold uppercase tracking-wider text-blue-500'>
                  Supply
                </p>
              </div>
            </div>

            <div className='flex shrink-0 items-center gap-1 text-blue-500'>
              <span className='h-px w-4 bg-blue-200' />

              <TruckIcon size={16} weight='duotone' />

              <span className='h-px w-4 bg-emerald-200' />
            </div>

            <div className='flex min-w-0 flex-1 items-center justify-end gap-2.5 text-right'>
              <div className='min-w-0'>
                <p className='truncate text-sm font-bold text-slate-900'>
                  {route.warehouseName}
                </p>

                <p className='text-[10px] font-bold uppercase tracking-wider text-emerald-500'>
                  Demand
                </p>
              </div>

              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
                <WarehouseIcon size={20} weight='duotone' />
              </div>
            </div>
          </div>

          <div className='mt-4 grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200'>
            <MobileStat
              label='Quantity'
              value={`${formatNumber(route.allocatedQuantity)} units`}
            />

            <MobileStat
              label='Rate / Unit'
              value={formatCurrency(route.costPerUnit)}
              border
            />

            <MobileStat
              label='Total Cost'
              value={formatCurrency(route.allocationCost)}
              green
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function MobileStat({ label, value, border = false, green = false }) {
  return (
    <div
      className={`px-3 py-3 ${border ? 'border-l border-slate-200' : ''} ${green ? 'bg-emerald-50/70' : 'bg-white'
        }`}
    >
      <p className='text-[9px] font-bold uppercase tracking-wider text-slate-400'>
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-bold ${green ? 'text-emerald-600' : 'text-slate-800'
          }`}
      >
        {value}
      </p>
    </div>
  )
}

export default RouteVisualization
