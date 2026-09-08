import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import {
  WarehouseIcon,
  TruckIcon,
  FactoryIcon,
  CurrencyInrIcon,
  PathIcon,
  ChartLineUpIcon,
  FileTextIcon
} from '@phosphor-icons/react'
import Truckimg from './Assets/TruckImg.avif'

const services = [
  {
    id: 1,
    title: 'Manage Factories',
    description:
      'Configure factories, supply capacities, locations, and operational information that form the source side of your transportation network.',
    icon: FactoryIcon,
    color: 'blue'
  },
  {
    id: 2,
    title: 'Manage Warehouses',
    description:
      'Define warehouse demand requirements and destination information to create a complete supply and demand network.',
    icon: WarehouseIcon,
    color: 'emerald'
  },
  {
    id: 3,
    title: 'Transportation Costs',
    description:
      'Build and maintain the transportation cost matrix between factories and warehouses, including route costs and restrictions.',
    icon: CurrencyInrIcon,
    color: 'orange'
  },
  {
    id: 4,
    title: 'Run Optimization',
    description:
      'Select an optimization algorithm and generate a feasible transportation plan that minimizes overall transportation cost.',
    icon: PathIcon,
    color: 'violet'
  },
  {
    id: 5,
    title: 'Analyze Results',
    description:
      'Review factory-to-warehouse allocations, optimized transportation cost, savings, and route-level shipment quantities.',
    icon: ChartLineUpIcon,
    color: 'cyan'
  },
  {
    id: 6,
    title: 'Generate Reports',
    description:
      'Generate transportation plans, cost analysis, optimization summaries, and historical reports in PDF or Excel format.',
    icon: FileTextIcon,
    color: 'rose'
  }
]

const colorStyles = {
  blue: {
    icon: 'text-blue-500',
    iconBg: 'bg-blue-950/60',
    border: 'border-blue-500/30',
    line: 'bg-blue-500'
  },
  cyan: {
    icon: 'text-cyan-400',
    iconBg: 'bg-cyan-950/60',
    border: 'border-cyan-500/30',
    line: 'bg-cyan-400'
  },
  violet: {
    icon: 'text-violet-400',
    iconBg: 'bg-violet-950/60',
    border: 'border-violet-500/30',
    line: 'bg-violet-400'
  },
  emerald: {
    icon: 'text-emerald-400',
    iconBg: 'bg-emerald-950/60',
    border: 'border-emerald-500/30',
    line: 'bg-emerald-400'
  },
  orange: {
    icon: 'text-amber-400',
    iconBg: 'bg-amber-950/60',
    border: 'border-amber-500/30',
    line: 'bg-amber-400'
  },
  rose: {
    icon: 'text-rose-400',
    iconBg: 'bg-rose-950/60',
    border: 'border-rose-500/30',
    line: 'bg-rose-400'
  }
}

function FeatureJourney() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const truckRef = useRef(null)
  const servicesRef = useRef(null)

  const [dimensions, setDimensions] = useState({
    trackWidth: 0,
    truckWidth: 0,
    servicesWidth: 0,
    viewportWidth: 0
  })

  /*
   * MEASURE ELEMENTS
   */
  useEffect(() => {
    const updateDimensions = () => {
      const trackWidth = trackRef.current?.clientWidth || 0
      const truckWidth = truckRef.current?.offsetWidth || 0
      const servicesWidth = servicesRef.current?.scrollWidth || 0
      const viewportWidth = servicesRef.current?.parentElement?.clientWidth || 0

      setDimensions({
        trackWidth,
        truckWidth,
        servicesWidth,
        viewportWidth
      })
    }

    updateDimensions()

    const resizeObserver = new ResizeObserver(updateDimensions)

    if (trackRef.current) resizeObserver.observe(trackRef.current)
    if (truckRef.current) resizeObserver.observe(truckRef.current)
    if (servicesRef.current) resizeObserver.observe(servicesRef.current)

    window.addEventListener('resize', updateDimensions)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  /*
   * SCROLL PROGRESS
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  })

  /*
   * TRUCK DISTANCE & POSITION
   */
  const truckTravelDistance = Math.max(
    dimensions.trackWidth - dimensions.truckWidth,
    0
  )

  const truckXRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [0, truckTravelDistance]
  )

  const truckX = useSpring(truckXRaw, {
    stiffness: 90,
    damping: 24,
    mass: 0.8
  })

  const truckScaleRaw = useTransform(
    scrollYProgress,
    [0, 0.08, 0.5, 0.92, 1],
    [0.92, 1, 1, 1, 0.92]
  )

  const truckScale = useSpring(truckScaleRaw, {
    stiffness: 100,
    damping: 25,
    mass: 0.7
  })

  const truckOpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.03, 0.97, 1],
    [1, 1, 1, 0.95]
  )

  const truckOpacity = useSpring(truckOpacityRaw, {
    stiffness: 120,
    damping: 30
  })

  /*
   * FEATURE MOVEMENT
   */
  const featureTravelDistance = Math.max(
    dimensions.servicesWidth - dimensions.viewportWidth,
    0
  )

  const featureXRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -featureTravelDistance]
  )

  const featureX = useSpring(featureXRaw, {
    stiffness: 75,
    damping: 25,
    mass: 1
  })

  /*
   * PROGRESS BAR
   */
  const progressWidthRaw = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const progressWidth = useSpring(progressWidthRaw, {
    stiffness: 100,
    damping: 30
  })

  return (
    <section
      ref={sectionRef}
      className='relative h-[500vh] sm:h-[600vh] bg-white'
      id='features'
    >
      {/* STICKY SCREEN */}
      <div className='sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-white'>

        {/* HEADER */}
        <div className='relative z-30 shrink-0 px-5 pt-6 sm:px-10 lg:px-14 lg:pt-8'>
          <div className='mx-auto flex max-w-[1600px] items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <span className='h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse' />
              <span className='text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500'>
                RouteMin Transportation Network
              </span>
            </div>

            <div className='hidden items-center gap-2 sm:flex'>
              <span className='text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400'>
                Scroll to explore journey
              </span>
              <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600' />
            </div>
          </div>
        </div>

        {/* BACKGROUND WORD */}
        <div className='
    pointer-events-none
    absolute
    left-1/2
    z-0
    w-full
    -translate-x-1/2
    -translate-y-1/2
    select-none
    overflow-hidden

    top-[42%]

    sm:top-[36%]

    lg:top-[28%]
  '
        >
          <p
            className='
      whitespace-nowrap
      text-center
      font-black
      leading-none
      tracking-[-0.09em]
      text-slate-100/90

      text-[18vw]
      sm:text-[15vw]
      lg:text-[11vw]
    '
          >
            ROUTEMIN
          </p>
        </div>

        {/* TRUCK TRACK AREA */}
        <div
          ref={trackRef}
          className='relative z-10 mt-auto h-[28vh] sm:h-[32vh] min-h-[190px] sm:min-h-[210px] w-full shrink-0 border-b border-slate-200/90'
        >
          {/* Ground */}
          <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900' />

          {/* Road shadow */}
          <div className='absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-100/90 to-transparent' />

          {/* TRUCK VISUAL */}
          <motion.div
            ref={truckRef}
            style={{
              x: truckX,
              scale: truckScale,
              opacity: truckOpacity
            }}
            className='absolute bottom-[1px] left-0 z-20 w-[240px] sm:w-[360px] md:w-[460px] lg:w-[560px] xl:w-[620px] will-change-transform'
          >
            <img
              src={Truckimg}
              alt='RouteMin logistics truck'
              draggable='false'
              className='block w-full select-none object-contain drop-shadow-md'
            />
          </motion.div>

          {/* ORIGIN PIN */}
          <div className='absolute bottom-4 left-4 z-10 hidden items-center gap-2.5 sm:left-10 sm:flex bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200/80'>
              <FactoryIcon size={16} weight='duotone' />
            </div>
            <div>
              <p className='text-[9px] font-bold uppercase tracking-wider text-slate-400'>Origin</p>
              <p className='text-xs font-bold text-slate-900'>Factories</p>
            </div>
          </div>

          {/* DESTINATION PIN */}
          <div className='absolute bottom-4 right-4 z-10 hidden items-center gap-2.5 sm:right-10 sm:flex bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs'>
            <div>
              <p className='text-right text-[9px] font-bold uppercase tracking-wider text-slate-400'>Destination</p>
              <p className='text-right text-xs font-bold text-slate-900'>Warehouses</p>
            </div>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/80'>
              <WarehouseIcon size={16} weight='duotone' />
            </div>
          </div>
        </div>

        {/* FEATURE CARDS HORIZONTAL SLIDER */}
        <div className='relative z-20 flex h-[44vh] min-h-[310px] shrink-0 flex-col bg-slate-900 text-white'>
          {/* Progress Bar */}
          <div className='relative h-[2px] w-full bg-slate-800'>
            <motion.div
              style={{ width: progressWidth }}
              className='h-full bg-blue-500 will-change-[width]'
            />
          </div>

          {/* Header */}
          <div className='flex shrink-0 items-center justify-between px-6 py-4 sm:px-10 lg:px-14 border-b border-slate-800/60'>
            <h2 className='text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300'>
              Features Overview
            </h2>
            <span className='text-[10px] font-mono font-semibold text-slate-500'>
              Swipe or scroll down to navigate
            </span>
          </div>

          {/* Cards Container */}
          <div className='min-h-0 flex-1 overflow-hidden p-4 sm:p-6 lg:p-8'>
            <motion.div
              ref={servicesRef}
              style={{ x: featureX }}
              className='flex h-full w-max items-center gap-5 sm:gap-6 lg:gap-8 will-change-transform'
            >
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  )
}

function ServiceCard({ service }) {
  const Icon = service.icon
  const colors = colorStyles[service.color]

  return (
    <article
      className='group relative flex h-full w-[80vw] sm:w-[45vw] md:w-[32vw] lg:w-[24vw] shrink-0 flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/90 p-6 sm:p-7 transition-all duration-300 hover:border-slate-700 hover:shadow-xl'
    >
      <div className='flex items-center justify-between'>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${colors.border} ${colors.iconBg} ${colors.icon} shadow-2xs transition-transform duration-300 group-hover:scale-105`}>
          <Icon size={24} weight='duotone' />
        </div>
        <span className='font-mono text-xs font-bold text-slate-600 transition-colors group-hover:text-slate-400'>
          {String(service.id).padStart(2, '0')}
        </span>
      </div>

      <div className='my-auto py-2'>
        <h3 className='text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors'>
          {service.title}
        </h3>

        <p className='mt-2.5 text-xs text-slate-400 leading-relaxed font-normal group-hover:text-slate-300 transition-colors'>
          {service.description}
        </p>
      </div>

      <div className={`h-[2px] w-8 ${colors.line} transition-all duration-300 group-hover:w-16 rounded-full`} />
    </article>
  )
}

export default FeatureJourney
