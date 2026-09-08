import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { CheckCircle, Compass, Brain, TrendDown } from '@phosphor-icons/react'

function AlgorithmsSection () {
  const targetRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 80%', 'end 25%']
  })

  /*
   * Smooth scroll progress.
   * This is intentionally soft so the cards don't feel
   * attached directly to the mouse wheel.
   */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 20,
    mass: 0.8
  })

  const nwcrX = useTransform(
    smoothProgress,
    [0.05, 0.18, 0.38],
    ['30%', '14%', '0%']
  )

  const lcmX = useTransform(
    smoothProgress,
    [0.05, 0.18, 0.38],
    ['-30%', '-14%', '0%']
  )

  /*
   * Slight rotation gives the cards a physical feeling
   * during the initial spread.
   */
  const nwcrRotate = useTransform(
    smoothProgress,
    [0.05, 0.22, 0.38],
    [-3, -1, 0]
  )

  const lcmRotate = useTransform(smoothProgress, [0.05, 0.22, 0.38], [3, 1, 0])

  /*
   * Start slightly smaller and settle naturally.
   */
  const nwcrScale = useTransform(
    smoothProgress,
    [0.05, 0.25, 0.38],
    [0.97, 0.99, 1]
  )

  const lcmScale = useTransform(
    smoothProgress,
    [0.05, 0.25, 0.38],
    [0.97, 0.99, 1]
  )

  /*
   * Side cards become visible progressively.
   */
  const sideOpacity = useTransform(
    smoothProgress,
    [0.05, 0.2, 0.38],
    [0.65, 0.9, 1]
  )

  /*
   * VAM remains the visual anchor.
   */
  const vamY = useTransform(smoothProgress, [0.05, 0.25, 0.45], [0, -5, -10])

  /*
   * Small scale change for VAM.
   */
  const vamScale = useTransform(
    smoothProgress,
    [0.05, 0.25, 0.45],
    [1, 1.01, 1.02]
  )

  return (
    <section
      id='algorithms'
      ref={targetRef}
      className='
        relative
        overflow-hidden
        border-b
        border-slate-200/80
        bg-slate-50/90
        bg-grid-pattern
        py-24
        lg:py-20
      '
    >
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true,
            margin: '-80px'
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1]
          }}
          className='
            mx-auto
            mb-16
            max-w-3xl
            text-center
          '
        >
          <h2
            className='
              text-3xl
              font-extrabold
              tracking-tight
              text-slate-900

              sm:text-4xl
              lg:text-5xl
              leading-tight
            '
          >
            Algorithms Built for Better Decisions
          </h2>

          <p
            className='
              mt-4
              text-base
              leading-relaxed
              text-slate-600
              font-normal

              sm:text-lg
            '
          >
            RouteMin provides proven transportation algorithms for generating
            strong initial solutions before optimization.
          </p>
        </motion.div>

        {/* ====================================================
            DESKTOP / TABLET CARD AREA
        ==================================================== */}

        <div
          className='
            relative
            grid
            gap-8
            lg:grid-cols-3
            items-stretch
            py-6
          '
        >
          {/* ==================================================
              NWCR
          ================================================== */}

          <motion.div
            style={{
              x: nwcrX,
              rotateZ: nwcrRotate,
              scale: nwcrScale,
              opacity: sideOpacity
            }}
            whileHover={{
              y: -7,
              scale: 1.02
            }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 22,
              mass: 0.7
            }}
            className='
              premium-gradient-border
              p-7
              backdrop-blur-md
              flex
              flex-col
              justify-between
              min-h-[390px]
              group
              cursor-pointer
              hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.15)]
            '
          >
            <div>
              <div
                className='
                  flex
                  items-center
                  justify-between
                  mb-5
                '
              >
                <div
                  className='
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-indigo-600
                    to-violet-600
                    text-white
                    shadow-lg
                    shadow-indigo-500/25
                    border
                    border-indigo-400/30
                    transition-all
                    duration-500
                    group-hover:scale-110
                    group-hover:shadow-indigo-500/40
                    group-hover:rotate-3
                  '
                >
                  <Compass size={26} weight='duotone' />
                </div>

                <span
                  className='
                    text-[10px]
                    font-extrabold
                    font-mono
                    text-indigo-700
                    uppercase
                    tracking-widest
                    bg-indigo-50/90
                    px-3
                    py-1
                    rounded-md
                    border
                    border-indigo-200/90
                    shadow-2xs
                  '
                >
                  METHOD 01
                </span>
              </div>

              <h3
                className='
                  text-xl
                  font-extrabold
                  text-slate-900
                  transition-all
                  duration-500
                  group-hover:text-blue-600
                  group-hover:translate-x-1
                '
              >
                NWCR
              </h3>

              <p
                className='
                  text-xs
                  font-bold
                  text-slate-500
                  mt-0.5
                '
              >
                North-West Corner Rule
              </p>

              <p
                className='
                  mt-4
                  text-xs
                  text-slate-600
                  leading-relaxed
                  font-medium
                '
              >
                Simple and fast initial allocation method. Begins allocation at
                the top-left cell of the cost matrix.
              </p>

              <ul
                className='
                  mt-6
                  space-y-3
                  text-xs
                  text-slate-700
                  font-medium
                '
              >
                <li className='flex items-center gap-2.5'>
                  <CheckCircle
                    size={17}
                    weight='fill'
                    className='text-blue-600 shrink-0'
                  />
                  <span>Fast execution speed</span>
                </li>

                <li className='flex items-center gap-2.5'>
                  <CheckCircle
                    size={17}
                    weight='fill'
                    className='text-blue-600 shrink-0'
                  />
                  <span>Simple allocation logic</span>
                </li>

                <li className='flex items-center gap-2.5'>
                  <CheckCircle
                    size={17}
                    weight='fill'
                    className='text-blue-600 shrink-0'
                  />
                  <span>Ignores unit cost during initial allocation</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* ==================================================
              VAM CENTER
          ================================================== */}

          <motion.div
            style={{
              y: vamY,
              scale: vamScale
            }}
            whileHover={{
              y: -10,
              scale: 1.025
            }}
            transition={{
              type: 'spring',
              stiffness: 170,
              damping: 20,
              mass: 0.7
            }}
            className='
              premium-gradient-border-highlight
              p-8
              backdrop-blur-xl
              relative
              z-20
              transform
              lg:-translate-y-3
              flex
              flex-col
              justify-between
              min-h-[430px]
              group
              cursor-pointer
            '
          >
            {/* Recommended */}

            <div
              className='
                absolute
                -top-3.5
                left-1/2
                -translate-x-1/2
                bg-gradient-to-r
                from-blue-600
                to-cyan-600
                text-white
                text-[10px]
                font-extrabold
                px-4
                py-1
                rounded-full
                uppercase
                tracking-wider
                shadow-md
                shadow-blue-500/35
                border-t
                border-white/40
                flex
                items-center
                gap-1.5
              '
            >
              Recommended
            </div>

            <div>
              <div
                className='
                  flex
                  items-center
                  justify-between
                  mb-5
                  mt-2
                '
              >
                <div
                  className='
                    flex
                    h-13
                    w-13
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-blue-600
                    via-indigo-600
                    to-cyan-500
                    text-white
                    shadow-xl
                    shadow-blue-500/40
                    border
                    border-white/30
                    transition-all
                    duration-500
                    group-hover:scale-110
                    group-hover:rotate-3
                    group-hover:shadow-blue-500/50
                  '
                >
                  <Brain size={28} weight='duotone' />
                </div>

                <span
                  className='
                    text-[10px]
                    font-extrabold
                    font-mono
                    text-blue-700
                    bg-gradient-to-r
                    from-blue-50
                    to-indigo-50
                    px-3
                    py-1
                    rounded-md
                    border
                    border-blue-200/90
                    shadow-2xs
                  '
                >
                  HERO ENGINE
                </span>
              </div>

              <h3
                className='
                  text-2xl
                  font-black
                  text-slate-900
                  transition-all
                  duration-500
                  group-hover:text-blue-600
                  group-hover:translate-x-1
                '
              >
                VAM
              </h3>

              <p
                className='
                  text-xs
                  font-bold
                  text-blue-600
                  mt-0.5
                '
              >
                Vogel's Approximation Method
              </p>

              <p
                className='
                  mt-4
                  text-xs
                  sm:text-sm
                  text-slate-600
                  leading-relaxed
                  font-medium
                '
              >
                Generates a high-quality initial solution using row and column
                penalties to minimize cost deviation.
              </p>

              <ul
                className='
                  mt-6
                  space-y-3
                  text-xs
                  text-slate-800
                  font-semibold
                '
              >
                <li className='flex items-center gap-2.5'>
                  <CheckCircle
                    size={18}
                    weight='fill'
                    className='text-blue-600 shrink-0'
                  />
                  <span>Penalty-based cost allocation</span>
                </li>

                <li className='flex items-center gap-2.5'>
                  <CheckCircle
                    size={18}
                    weight='fill'
                    className='text-blue-600 shrink-0'
                  />
                  <span>Cost-aware initial solution</span>
                </li>

                <li className='flex items-center gap-2.5'>
                  <CheckCircle
                    size={18}
                    weight='fill'
                    className='text-blue-600 shrink-0'
                  />
                  <span>High-quality starting solution</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* ==================================================
              LCM
          ================================================== */}

          <motion.div
            style={{
              x: lcmX,
              rotateZ: lcmRotate,
              scale: lcmScale,
              opacity: sideOpacity
            }}
            whileHover={{
              y: -7,
              scale: 1.02
            }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 22,
              mass: 0.7
            }}
            className='
              premium-gradient-border
              p-7
              backdrop-blur-md
              flex
              flex-col
              justify-between
              min-h-[390px]
              group
              cursor-pointer
              hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.15)]
            '
          >
            <div>
              <div
                className='
                  flex
                  items-center
                  justify-between
                  mb-5
                '
              >
                <div
                  className='
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-emerald-600
                    to-teal-600
                    text-white
                    shadow-lg
                    shadow-emerald-500/25
                    border
                    border-emerald-400/30
                    transition-all
                    duration-500
                    group-hover:scale-110
                    group-hover:shadow-emerald-500/40
                    group-hover:rotate-3
                  '
                >
                  <TrendDown size={26} weight='duotone' />
                </div>

                <span
                  className='
                    text-[10px]
                    font-extrabold
                    font-mono
                    text-emerald-700
                    uppercase
                    tracking-widest
                    bg-emerald-50/90
                    px-3
                    py-1
                    rounded-md
                    border
                    border-emerald-200/90
                    shadow-2xs
                  '
                >
                  METHOD 02
                </span>
              </div>

              <h3
                className='
                  text-xl
                  font-extrabold
                  text-slate-900
                  transition-all
                  duration-500
                  group-hover:text-emerald-600
                  group-hover:translate-x-1
                '
              >
                LCM
              </h3>

              <p
                className='
                  text-xs
                  font-bold
                  text-emerald-600
                  mt-0.5
                '
              >
                Least Cost Method
              </p>

              <p
                className='
                  mt-4
                  text-xs
                  text-slate-600
                  leading-relaxed
                  font-medium
                '
              >
                Allocates shipments beginning with the lowest
                transportation-cost routes across the matrix.
              </p>

              <ul
                className='
                  mt-6
                  space-y-3
                  text-xs
                  text-slate-700
                  font-medium
                '
              >
                <li className='flex items-center gap-2.5'>
                  <CheckCircle
                    size={17}
                    weight='fill'
                    className='text-emerald-600 shrink-0'
                  />
                  <span>Cost-aware allocation</span>
                </li>

                <li className='flex items-center gap-2.5'>
                  <CheckCircle
                    size={17}
                    weight='fill'
                    className='text-emerald-600 shrink-0'
                  />
                  <span>Selects lowest-cost cells first</span>
                </li>

                <li className='flex items-center gap-2.5'>
                  <CheckCircle
                    size={17}
                    weight='fill'
                    className='text-emerald-600 shrink-0'
                  />
                  <span>Improved initial feasible solution</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AlgorithmsSection
