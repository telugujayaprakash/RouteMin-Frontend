import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import {
  ArrowRight,
  Factory,
  Warehouse,
  CheckCircle,
  Package,
  TrendUp,
  X,
  Sparkle,
  MapTrifold,
  GitBranch
} from '@phosphor-icons/react'

import LoadingComponent from '../Components/LoadingComponent'
import FactorySelection from '../Components/Optimization/FactorySelection'
import WarehouseSelection from '../Components/Optimization/WarehouseSelection'
import CostMatrixTable from '../Components/Optimization/CostMatrixTable'
import AlgorithmSelection from '../Components/Optimization/AlgorithmSelection'
import OptimisationImg from '../Assets/OptimisationImg.png'
import { runOptimization } from '../Redux/Optimisation/OptimisationSlice'
import { fetchwarehouse } from '../Redux/Warehouse/WarehouseSlice'
import { fetchfactory } from '../Redux/Factory/FactorySlice'

function NewOptimization () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  /* ============================================================
     FLOW STATE
  ============================================================ */

  // true = show initial setup screen
  // false = show actual optimization workflow
  const [showSetup, setShowSetup] = useState(true)

  const [step, setStep] = useState(1)

  /*
   * Keep draft name separate from actual runName.
   *
   * runName is only committed when user clicks
   * "Start Optimization".
   */
  const [draftRunName, setDraftRunName] = useState('')

  const [runName, setRunName] = useState('')

  const [selectedFactories, setSelectedFactories] = useState([])

  const [selectedWarehouses, setSelectedWarehouses] = useState([])

  const [routes, setRoutes] = useState([])

  /* ============================================================
     REDUX
  ============================================================ */

  const factories = useSelector(state => state.Factory?.factories || [])

  const warehouses = useSelector(state => state.Warehouse?.warehouses || [])

  const isLoading = useSelector(state => state.Optimization?.isLoading || false)

  const planType = useSelector(state => state.Auth?.user?.planType)

  const isFree = String(planType || '').toUpperCase() === 'FREE'

  /* ============================================================
     FETCH DATA
  ============================================================ */

  useEffect(() => {
    dispatch(fetchfactory())
    dispatch(fetchwarehouse())
  }, [dispatch])

  /* ============================================================
     STEPS
  ============================================================ */

  const steps = [
    {
      number: 1,
      title: 'Factories',
      description: 'Supply nodes'
    },
    {
      number: 2,
      title: 'Warehouses',
      description: 'Demand nodes'
    },
    {
      number: 3,
      title: 'Cost Matrix',
      description: 'Routes'
    },
    {
      number: 4,
      title: 'Algorithm',
      description: 'Optimize'
    }
  ]

  /* ============================================================
     TOTAL SUPPLY
  ============================================================ */

  const totalSupply = useMemo(() => {
    return selectedFactories.reduce((total, factory) => {
      return total + Number(factory?.supply || 0)
    }, 0)
  }, [selectedFactories])

  /* ============================================================
     TOTAL DEMAND
  ============================================================ */

  const totalDemand = useMemo(() => {
    return selectedWarehouses.reduce((total, warehouse) => {
      return total + Number(warehouse?.demand || 0)
    }, 0)
  }, [selectedWarehouses])

  /* ============================================================
     HELPERS
  ============================================================ */

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const getFactoryName = factory => {
    return (
      factory?.factoryName ||
      factory?.name ||
      factory?.factoryCode ||
      `Factory ${factory?.id || ''}`
    )
  }

  const getWarehouseName = warehouse => {
    return (
      warehouse?.warehouseName ||
      warehouse?.name ||
      warehouse?.warehouseCode ||
      `Warehouse ${warehouse?.id || ''}`
    )
  }

  /* ============================================================
     START OPTIMIZATION
  ============================================================ */

  const handleStartOptimization = () => {
    const cleanName = draftRunName.trim()

    if (!cleanName) {
      return
    }

    setRunName(cleanName)

    setShowSetup(false)

    setStep(1)

    scrollToTop()
  }

  /* ============================================================
     CANCEL INITIAL SCREEN
  ============================================================ */

  const handleCloseSetup = () => {
    navigate('/overview')
  }

  /* ============================================================
     STEP 1 → FACTORIES
  ============================================================ */

  const handleFactoriesNext = factoriesList => {
    if (!runName.trim()) {
      return
    }

    if (!factoriesList || factoriesList.length === 0) {
      alert('Please select at least one factory.')
      return
    }

    const invalidFactory = factoriesList.find(factory => {
      const supply = Number(factory?.supply || 0)

      const maximumSupply = Number(
        factory?.maximumSupplyCapacity ??
          factory?.maximum_supply_capacity ??
          factory?.maximum_supply ??
          Infinity
      )

      return !Number.isFinite(supply) || supply <= 0 || supply > maximumSupply
    })

    if (invalidFactory) {
      alert(
        `Invalid supply for ${getFactoryName(
          invalidFactory
        )}. Supply must be greater than 0 and cannot exceed the factory capacity.`
      )

      return
    }

    setSelectedFactories(factoriesList)

    setStep(2)

    scrollToTop()
  }

  /* ============================================================
     STEP 2 → WAREHOUSES
  ============================================================ */

  const handleWarehousesNext = warehousesList => {
    if (!warehousesList || warehousesList.length === 0) {
      alert('Please select at least one warehouse.')
      return
    }

    const invalidWarehouse = warehousesList.find(warehouse => {
      const demand = Number(warehouse?.demand || 0)

      const maximumDemand = Number(
        warehouse?.maximumDemand ??
          warehouse?.maximum_Demand ??
          warehouse?.maximum_demand ??
          Infinity
      )

      return !Number.isFinite(demand) || demand <= 0 || demand > maximumDemand
    })

    if (invalidWarehouse) {
      alert(
        `Invalid demand for ${getWarehouseName(
          invalidWarehouse
        )}. Demand must be greater than 0 and cannot exceed the warehouse capacity.`
      )

      return
    }

    setSelectedWarehouses(warehousesList)

    setStep(3)

    scrollToTop()
  }

  /* ============================================================
     STEP 3 → MATRIX
  ============================================================ */

  const handleMatrixNext = routesList => {
    const activeRoutes = (routesList && routesList.length > 0) ? routesList : routes

    if (!activeRoutes || activeRoutes.length === 0) {
      const fallbackRoutes = selectedFactories.flatMap(f =>
        selectedWarehouses.map(w => ({
          factoryId: f.id,
          warehouseId: w.id,
          costPerUnit: 0,
          restricted: false
        }))
      )
      setRoutes(fallbackRoutes)
    } else {
      setRoutes(activeRoutes)
    }

    setStep(4)
    scrollToTop()
  }

  /* ============================================================
     BACK
  ============================================================ */

  const handleBack = () => {
    setStep(previousStep => Math.max(previousStep - 1, 1))

    scrollToTop()
  }

  /* ============================================================
     RUN OPTIMIZATION
  ============================================================ */

  const handleRunOptimization = async algorithm => {
    if (!algorithm) {
      alert('Please select an optimization algorithm.')
      return
    }

    const payload = {
      runName: runName.trim(),

      algorithm,

      factories: selectedFactories.map(factory => ({
        factoryId: factory.id,
        supply: Number(factory.supply)
      })),

      warehouses: selectedWarehouses.map(warehouse => ({
        warehouseId: warehouse.id,
        demand: Number(warehouse.demand)
      })),

      routes
    }

    try {
      const response = await dispatch(runOptimization(payload)).unwrap()

      if (response?.optimizationRunId) {
        navigate(`/result/${response.optimizationRunId}`)
      }
    } catch (error) {
      console.error('Optimization failed:', error)
    }
  }

  /* ============================================================
     BOTTOM BAR
  ============================================================ */

  const renderBottomBar = () => {
    if (showSetup || step === 4) {
      return null
    }

    /* STEP 1 */

    if (step === 1) {
      const canContinue =
        selectedFactories.length > 0 &&
        selectedFactories.every(factory => {
          const valStr = factory.supply
          const valNum = Number(valStr)
          const maxCap = Number(
            factory.maximumSupplyCapacity || factory.maximumSupply || Infinity
          )
          return (
            valStr !== '' &&
            valStr !== null &&
            valStr !== undefined &&
            !isNaN(valNum) &&
            valNum > 0 &&
            valNum <= maxCap
          )
        })

      return (
        <BottomBar>
          <div className='flex min-w-0 items-center gap-3'>
            <SummaryStat
              icon={Factory}
              label='Factories'
              value={selectedFactories.length}
            />

            <SummaryDivider />

            <SummaryStat
              icon={Package}
              label='Total Supply'
              value={totalSupply.toLocaleString()}
            />
          </div>

          <BottomBarAction
            disabled={!canContinue}
            onClick={() => handleFactoriesNext(selectedFactories)}
          >
            Continue to Warehouses
          </BottomBarAction>
        </BottomBar>
      )
    }

    /* STEP 2 */

    if (step === 2) {
      const canContinue =
        selectedWarehouses.length > 0 &&
        selectedWarehouses.every(warehouse => {
          const valStr = warehouse.demand
          const valNum = Number(valStr)
          const maxCap = Number(
            warehouse.maximumStorageCapacity || warehouse.maximumDemand || Infinity
          )
          return (
            valStr !== '' &&
            valStr !== null &&
            valStr !== undefined &&
            !isNaN(valNum) &&
            valNum > 0 &&
            valNum <= maxCap
          )
        })

      return (
        <BottomBar>
          <div className='flex min-w-0 items-center gap-3'>
            <SummaryStat
              icon={Factory}
              label='Factories'
              value={selectedFactories.length}
            />

            <SummaryDivider />

            <SummaryStat
              icon={Package}
              label='Supply'
              value={totalSupply.toLocaleString()}
            />

            <SummaryDivider />

            <SummaryStat
              icon={Warehouse}
              label='Warehouses'
              value={selectedWarehouses.length}
            />

            <SummaryDivider />

            <SummaryStat
              icon={TrendUp}
              label='Demand'
              value={totalDemand.toLocaleString()}
            />
          </div>

          <BottomBarAction
            disabled={!canContinue}
            onClick={() => handleWarehousesNext(selectedWarehouses)}
          >
            Continue to Cost Matrix
          </BottomBarAction>
        </BottomBar>
      )
    }

    /* STEP 3 */

    const canContinue = selectedFactories.length > 0 && selectedWarehouses.length > 0

    return (
      <BottomBar>
        <div className='flex min-w-0 items-center gap-3'>
          <SummaryStat
            icon={Factory}
            label='Factories'
            value={selectedFactories.length}
          />

          <SummaryDivider />

          <SummaryStat
            icon={Package}
            label='Supply'
            value={totalSupply.toLocaleString()}
          />

          <SummaryDivider />

          <SummaryStat
            icon={Warehouse}
            label='Warehouses'
            value={selectedWarehouses.length}
          />

          <SummaryDivider />

          <SummaryStat
            icon={TrendUp}
            label='Demand'
            value={totalDemand.toLocaleString()}
          />
        </div>

        <BottomBarAction
          disabled={!canContinue}
          onClick={() => handleMatrixNext(routes)}
        >
          Continue to Algorithm
        </BottomBarAction>
      </BottomBar>
    )
  }

  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading) {
    return (
      <div className='flex min-h-[80vh] items-center justify-center bg-slate-50'>
        <LoadingComponent />
      </div>
    )
  }

  /* ============================================================
     INITIAL SETUP SCREEN
  ============================================================ */

  if (showSetup) {
    return (
      <OptimizationIntro
        value={draftRunName}
        onChange={setDraftRunName}
        onStart={handleStartOptimization}
        onClose={handleCloseSetup}
      />
    )
  }

  /* ============================================================
     MAIN OPTIMIZATION UI
  ============================================================ */

  return (
    <div
      // style={{ backgroundImage: `url(${Backgroundimg})` }}
      className='
        min-h-screen
        bg-linear-to-r
        from-violet-100
        via-pink-100
        to-green-100
        font-sans
        antialiased
        text-slate-900
        pb-28
      '
    >
      {/* PAGE HEADER */}

      <header
        className='
          border-b
          border-slate-200/80
          bg-white
          px-5
          py-5
          sm:px-8
          lg:px-10
        '
      >
        <div className='mx-auto max-w-[1600px]'>
          <p
            className='
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-blue-600
            '
          >
            RouteMin Optimization
          </p>

          <div className='mt-1 flex flex-wrap items-center gap-3'>
            <h1
              className='
                text-xl
                font-bold
                tracking-tight
                text-slate-900
                sm:text-2xl
              '
            >
              {runName}
            </h1>

            <span
              className='
                rounded-full
                bg-blue-50
                px-2.5
                py-1
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                text-blue-600
              '
            >
              New Run
            </span>
          </div>

          <p
            className='
              mt-1
              max-w-2xl
              text-xs
              font-medium
              leading-relaxed
              text-slate-500
            '
          >
            Configure your supply nodes, demand nodes, transportation routes,
            and optimization method.
          </p>
        </div>
      </header>

      {/* MAIN */}

      <main className='p-4 sm:p-6 lg:p-8'>
        <div
          className='
            mx-auto
            max-w-7xl
            space-y-5
          '
        >
          {/* STEPPER */}

          <section
            className='
              rounded-2xl
              border
              border-slate-200/80
              bg-white
              p-4
              shadow-sm
              sm:p-6
            '
          >
            <div className='flex items-center justify-between'>
              {steps.map((item, index) => {
                const active = step === item.number

                const completed = step > item.number

                return (
                  <React.Fragment key={item.title}>
                    <div
                      className='
                        flex
                        min-w-0
                        flex-col
                        items-center
                      '
                    >
                      <motion.div
                        animate={{
                          scale: active ? 1.04 : 1
                        }}
                        transition={{
                          duration: 0.25
                        }}
                        className={`
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          text-xs
                          font-bold
                          transition-all
                          duration-300

                          ${
                            active
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                              : completed
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-slate-100 text-slate-400'
                          }
                        `}
                      >
                        {completed ? (
                          <CheckCircle size={17} weight='fill' />
                        ) : (
                          item.number
                        )}
                      </motion.div>

                      <p
                        className={`
                          mt-2
                          text-[10px]
                          font-semibold
                          sm:text-xs

                          ${
                            active || completed
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }
                        `}
                      >
                        {item.title}
                      </p>
                    </div>

                    {index !== steps.length - 1 && (
                      <div
                        className='
                          mx-2
                          h-1
                          flex-1
                          overflow-hidden
                          rounded-full
                          bg-slate-100
                          sm:mx-4
                        '
                      >
                        <motion.div
                          animate={{
                            width: step > item.number ? '100%' : '0%'
                          }}
                          transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          className='
                            h-full
                            rounded-full
                            bg-blue-600
                          '
                        />
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </section>

          {/* CURRENT STEP */}

          <AnimatePresence mode='wait'>
            <motion.section
              key={step}
              initial={{
                opacity: 0,
                y: 12
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -8
              }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
              className='
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                p-5
                shadow-sm
                sm:p-7
                lg:p-8
              '
            >
              {step === 1 && (
                <FactorySelection
                  factories={factories}
                  selectedFactories={selectedFactories}
                  onSelectionChange={setSelectedFactories}
                  onNext={handleFactoriesNext}
                />
              )}

              {step === 2 && (
                <WarehouseSelection
                  warehouses={warehouses}
                  selectedWarehouses={selectedWarehouses}
                  selectedFactories={selectedFactories}
                  totalSupply={totalSupply}
                  onSelectionChange={setSelectedWarehouses}
                  onBack={handleBack}
                  onNext={handleWarehousesNext}
                />
              )}

              {step === 3 && (
                <CostMatrixTable
                  factories={selectedFactories}
                  warehouses={selectedWarehouses}
                  onChange={setRoutes}
                  onBack={handleBack}
                  onNext={handleMatrixNext}
                />
              )}

              {step === 4 && (
                <AlgorithmSelection
                  runName={runName}
                  factories={selectedFactories}
                  warehouses={selectedWarehouses}
                  matrix={routes}
                  isFree={isFree}
                  onBack={handleBack}
                  onRun={handleRunOptimization}
                />
              )}
            </motion.section>
          </AnimatePresence>
        </div>
      </main>

      {renderBottomBar()}
    </div>
  )
}

/* ================================================================
   INITIAL OPTIMIZATION SCREEN
================================================================ */

function OptimizationIntro ({ value, onChange, onStart }) {
  const canStart = value.trim().length > 0

  return (
    <div
      className='
        relative
        min-h-screen
        overflow-hidden
        bg-slate-50
      '
    >
      {/* BACKGROUND DECORATION */}

      <div
        className='
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-blue-100/50
          blur-3xl
        '
      />

      <div
        className='
          pointer-events-none
          absolute
          -bottom-32
          -right-32
          h-96
          w-96
          rounded-full
          bg-cyan-100/40
          blur-3xl
        '
      />
      {/* CENTER */}

      <div
        className='
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-10
        '
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
            scale: 0.97
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1]
          }}
          className='
            w-full
            max-w-xl
          '
        >
          {/* CARD */}

          <div
            className='
            overflow-hidden
            rounded-[28px]
            border
          border-slate-200
          bg-white
            shadow-[0_30px_80px_-30px_rgba(15,23,42,0.28)]'
          >
            {/* TOP VISUAL */}
            <div
              style={{ backgroundImage: `url(${OptimisationImg})` }}
              className=' relative overflow-hidden bg-white bg-cover bg-center bg-no-repeat h-[230px]'
            ></div>

            {/* CONTENT */}

            <div
              className='
                p-6
                sm:p-8
              '
            >
              <div>
                <label
                  className='
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-700
                  '
                >
                  Optimization Run Name
                  <span className='ml-1 text-rose-500'>*</span>
                </label>

                <input
                  autoFocus
                  type='text'
                  value={value}
                  onChange={event => onChange(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' && canStart) {
                      onStart()
                    }
                  }}
                  maxLength={100}
                  placeholder='e.g. Q3 Regional Distribution'
                  className='
                    mt-2
                    h-12
                    w-full
                    rounded-xl

                    border
                    border-slate-200

                    bg-slate-50

                    px-4

                    text-sm
                    font-medium
                    text-slate-900

                    outline-none

                    transition-all
                    duration-200

                    placeholder:text-slate-400

                    focus:border-blue-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-500/10
                  '
                />

                <div
                  className='
                    mt-2
                    flex
                    items-center
                    justify-between
                  '
                >
                  <span
                    className='
                      text-[10px]
                      text-slate-400
                    '
                  >
                    Give this run a recognizable name.
                  </span>

                  <span
                    className='
                      text-[10px]
                      tabular-nums
                      text-slate-400
                    '
                  >
                    {value.length}/100
                  </span>
                </div>
              </div>

              {/* FLOW */}

              <div
                className='
                  mt-7
                  grid
                  grid-cols-2
                  gap-3
                  sm:grid-cols-4
                '
              >
                <IntroStep icon={Factory} number='01' title='Factories' />

                <IntroStep icon={Warehouse} number='02' title='Warehouses' />

                <IntroStep icon={MapTrifold} number='03' title='Routes' />

                <IntroStep icon={Sparkle} number='04' title='Algorithm' />
              </div>

              {/* ACTION */}

              <button
                type='button'
                disabled={!canStart}
                onClick={onStart}
                className='
                  group
                  mt-7

                  flex
                  h-12
                  w-full

                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-blue-600

                  px-5

                  text-sm
                  font-bold
                  text-white

                  shadow-[0_8px_24px_rgba(37,99,235,0.22)]

                  transition-all
                  duration-300

                  hover:bg-blue-500
                  hover:shadow-[0_12px_30px_rgba(37,99,235,0.28)]

                  active:scale-[0.98]

                  disabled:cursor-not-allowed
                  disabled:bg-slate-200
                  disabled:text-slate-400
                  disabled:shadow-none
                '
              >
                <span>Start Optimization</span>

                <ArrowRight
                  size={17}
                  weight='bold'
                  className='
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  '
                />
              </button>

              <p
                className='
                  mt-3
                  text-center
                  text-[10px]
                  text-slate-400
                '
              >
                You can review and change your selections before running the
                optimization.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ================================================================
   INTRO STEP
================================================================ */

function IntroStep ({ icon: Icon, number, title }) {
  return (
    <div
      className='
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        p-3

        transition-all
        duration-200

        hover:border-blue-200
        hover:bg-blue-50/50
      '
    >
      <div
        className='
          flex
          items-center
          justify-between
        '
      >
        <div
          className='
            flex
            h-8
            w-8
            items-center
            justify-center

            rounded-lg

            bg-white

            text-blue-600

            shadow-sm
          '
        >
          <Icon size={16} weight='duotone' />
        </div>

        <span
          className='
            text-[9px]
            font-bold
            tracking-wider
            text-slate-400
          '
        >
          {number}
        </span>
      </div>

      <p
        className='
          mt-3
          text-[11px]
          font-bold
          text-slate-700
        '
      >
        {title}
      </p>
    </div>
  )
}

/* ================================================================
   BOTTOM BAR
================================================================ */

function BottomBar ({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
        scale: 0.98
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1]
      }}
      className='
        fixed
        bottom-3
        left-2
        right-2
        z-[100]

        sm:bottom-5
        sm:left-4
        sm:right-4

        lg:left-[calc(50%+174px)]
        lg:right-auto

        lg:w-[min(1200px,calc(100vw-348px-32px))]

        lg:-translate-x-1/2

        xl:w-[min(1240px,calc(100vw-348px-48px))]
      '
    >
      <div
        className='
          flex
          min-h-[66px]

          items-center
          gap-3

          overflow-hidden

          rounded-2xl

          border
          border-slate-700/80

          bg-gray-300
          px-3
          py-2.5

          shadow-[0_20px_60px_-18px_rgba(15,23,42,0.55)]

          sm:px-4
          sm:py-3
          lg:px-5
        '
      >
        <div
          className='
            flex
            min-w-0
            flex-1

            items-center
            gap-3

            overflow-x-auto
          '
        >
          {children}
        </div>
      </div>
    </motion.div>
  )
}

/* ================================================================
   SUMMARY STAT
================================================================ */

function SummaryStat ({ icon: Icon, label, value }) {
  return (
    <div
      className='
        flex
        min-w-max
        shrink-0
        items-center
        gap-2.5
        sm:gap-3
      '
    >
      <div
        className='
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center

          rounded-xl

          bg-blue-500/10

          text-blue-400

          ring-1
          ring-inset
          ring-blue-400/10
        '
      >
        <Icon size={17} weight='duotone' />
      </div>

      <div className='min-w-0'>
        <p
          className='
            truncate
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-black
          '
        >
          {label}
        </p>

        <p
          className='
            mt-0.5
            text-sm
            font-bold
            tabular-nums
            text-black
            sm:text-base
          '
        >
          {value}
        </p>
      </div>
    </div>
  )
}

/* ================================================================
   DIVIDER
================================================================ */

function SummaryDivider () {
  return (
    <div
      className='
        hidden
        h-8
        w-px
        shrink-0
        bg-slate-700
        sm:block
      '
    />
  )
}

/* ================================================================
   ACTION
================================================================ */

function BottomBarAction ({ children, disabled, onClick }) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className='
        group
        ml-auto
        inline-flex
        shrink-0
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-blue-600
        px-4
        py-2.5
        text-[10px]
        font-bold
        text-white
        shadow-[0_6px_20px_rgba(37,99,235,0.25)]
        transition-all
        duration-300
        hover:bg-blue-500
        hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)]
        active:scale-[0.97]
        disabled:cursor-not-allowed
        disabled:bg-gray-950
        disabled:text-white
        disabled:shadow-none
        sm:px-5
        sm:py-3
        sm:text-xs
      '
    >
      <span className='hidden sm:inline'>{children}</span>

      <span className='sm:hidden'>Continue</span>

      <ArrowRight
        size={14}
        weight='bold'
        className='
          transition-transform
          duration-300
          group-hover:translate-x-1
        '
      />
    </button>
  )
}

export default NewOptimization
