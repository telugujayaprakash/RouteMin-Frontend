import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon
} from '@phosphor-icons/react'

import TruckImg from './Assets/Truckimg.png'
import { Link } from 'react-router-dom'

const ANIMATED_WORDS = [
  'Optimal Routes',
  'Cost Optimization',
  'Lower Costs',
  'Smarter Allocation'
]

function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  const [currentWord, setCurrentWord] = useState(0)
  const [displayText, setDisplayText] = useState(ANIMATED_WORDS[0])
  const [isDeleting, setIsDeleting] = useState(false)

  /*
   * Typing animation
   *
   * Important:
   * - There is only ONE timer controlling the animation.
   * - The old 2800ms interval has been removed because it was changing
   *   currentWord while the typing effect was still running.
   * - The completed word stays visible for a moment before deleting.
   * - The timeout is always cleaned up.
   */
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayText(ANIMATED_WORDS[currentWord])
      return undefined
    }

    const word = ANIMATED_WORDS[currentWord]

    let delay = isDeleting ? 42 : 72

    if (!isDeleting && displayText === word) {
      delay = 1600
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        if (displayText === word) {
          setIsDeleting(true)
        } else {
          setDisplayText(word.slice(0, displayText.length + 1))
        }
      } else if (displayText.length > 0) {
        setDisplayText(word.slice(0, displayText.length - 1))
      } else {
        setIsDeleting(false)
        setCurrentWord(previous => (previous + 1) % ANIMATED_WORDS.length)
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [currentWord, displayText, isDeleting, shouldReduceMotion])

  const motionTransition = (delay = 0) => ({
    duration: shouldReduceMotion ? 0 : 0.8,
    delay: shouldReduceMotion ? 0 : delay,
    ease: [0.16, 1, 0.3, 1]
  })

  return (
    <section
      id='home'
      className='
        relative
        isolate
        min-h-[100svh]
        w-full
        overflow-hidden
        bg-white
      '
    >
      {/* =====================================================
          HERO VISUAL
      ===================================================== */}

      <div
        className='
          pointer-events-none
          absolute
          inset-y-0
          right-0
          z-0
          w-full
          lg:w-[62%]
          xl:w-[66%]
        '
        aria-hidden='true'
      >
        <img
          src={TruckImg}
          alt=''
          draggable='false'
          className='
            absolute
            inset-0
            h-full
            w-full
            select-none
            object-cover
            object-[98%_center]
            sm:object-[94%_center]
            lg:object-[82%_center]
            xl:object-[95%_center]
          '
        />

        {/* Keeps the page visually white while softly blending the
            illustration into the content area. On mobile, soft gradient from left. */}
        <div
          className='
            absolute
            inset-y-0
            left-0
            w-full
            sm:w-[55%]
            bg-gradient-to-r
            from-white/95
            via-white/85
            to-transparent
            sm:from-white
            sm:via-white/95
          '
        />

        <div
          className='
            absolute
            inset-x-0
            bottom-0
            h-28
            bg-gradient-to-t
            from-white
            to-transparent
            sm:h-36
          '
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className='
          relative
          z-10
          mx-auto
          flex
          min-h-[100svh]
          w-full
          max-w-[1600px]
          items-center
          px-5
          pb-24
          pt-28
          sm:px-10
          sm:pb-28
          sm:pt-32
          lg:px-14
          xl:px-20
        '
      >
        <div className='w-full max-w-[760px]'>
          {/* Small editorial line */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={motionTransition()}
            className='
              mb-6
              flex
              items-center
              gap-3
              sm:mb-7
            '
          >
            <span className='h-px w-9 bg-blue-600 sm:w-11' />

            <span
              className='
                text-[9px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-slate-500
                sm:text-[10px]
                sm:tracking-[0.23em]
              '
            >
              Intelligent Transportation Optimization
            </span>
          </motion.div>

          {/* =================================================
              MAIN HEADING
          ================================================= */}

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionTransition(0.08)}
            className='
              max-w-[720px]
              text-[2.9rem]
              font-semibold
              leading-[0.96]
              tracking-[-0.06em]
              text-slate-950
              sm:text-[4.25rem]
              md:text-[5rem]
              lg:text-[5.45rem]
              xl:text-[5.9rem]
            '
          >
            Stay ahead with
            <br />
            clear route plans.
          </motion.h1>

          {/* =================================================
              TYPING LINE
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionTransition(0.28)}
            className='
              mt-7
              flex
              items-baseline
              gap-x-2
              text-lg
              font-medium
              leading-8
              tracking-[-0.025em]
              text-slate-500
              sm:mt-8
              sm:text-2xl
              sm:leading-9
              lg:text-[1.65rem]
            '
          >
            <span className='shrink-0'>RouteMin for</span>

            {/* Fixed width prevents the whole hero from jumping when
                different phrases have different lengths. */}
            <span
              className='
                inline-flex
                min-w-[12.5rem]
                items-center
                whitespace-nowrap
                text-blue-600
                sm:min-w-[17rem]
                lg:min-w-[20rem]
              '
              aria-live='polite'
              aria-label={`RouteMin for ${displayText}`}
            >
              <span className='font-semibold'>{displayText}</span>

              {!shouldReduceMotion && (
                <span
                  className='
                    ml-1.5
                    inline-block
                    h-[1.25em]
                    w-[2px]
                    translate-y-[0.08em]
                    animate-pulse
                    rounded-full
                    bg-blue-600
                  '
                  aria-hidden='true'
                />
              )}
            </span>
          </motion.div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionTransition(0.4)}
            className='
              mt-5
              max-w-[555px]
              text-[13px]
              font-normal
              leading-6
              text-slate-500
              sm:mt-6
              sm:text-base
              sm:leading-7
            '
          >
            Optimize factory-to-warehouse transportation with intelligent
            allocation, proven optimization algorithms, and data-driven cost
            planning.
          </motion.p>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionTransition(0.52)}
            className='
              mt-7
              flex
              w-full
              flex-col
              gap-2.5
              sm:mt-8
              sm:w-auto
              sm:flex-row
              sm:gap-3
            '
          >
            <Link to='/login'
              className='
                group
                inline-flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-6
                text-xs
                font-semibold
                text-white
                shadow-[0_12px_28px_rgba(37,99,235,0.18)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-blue-700
                hover:shadow-[0_16px_34px_rgba(37,99,235,0.24)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-600
                focus-visible:ring-offset-2
                active:translate-y-0
                sm:w-auto
              '
            >
              Start Optimizing
              <ArrowRightIcon
                size={16}
                weight='bold'
                className='
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                '
              />
            </Link>

            <a
              href='#features'
              className='
                inline-flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-slate-200
                bg-white
                px-6
                text-xs
                font-semibold
                text-slate-700
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-slate-300
                hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-600
                focus-visible:ring-offset-2
                active:translate-y-0
                sm:w-auto
              '
            >
              <PlayIcon size={14} weight='fill' className='text-blue-600' />
              Explore RouteMin
            </a>
          </motion.div>

          {/* =================================================
              VALUE POINTS
          ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionTransition(0.66)}
            className='
              mt-7
              flex
              max-w-[620px]
              flex-wrap
              gap-x-5
              gap-y-2.5
              sm:mt-9
              sm:gap-x-6
              sm:gap-y-3
            '
          >
            <ValuePoint>Lower transportation costs</ValuePoint>
            <ValuePoint>Better allocation decisions</ValuePoint>
            <ValuePoint>Faster planning</ValuePoint>
          </motion.div>
        </div>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.8,
          delay: shouldReduceMotion ? 0 : 1.1
        }}
        className='
          absolute
          bottom-7
          left-5
          z-20
          hidden
          items-center
          gap-3
          sm:flex
          sm:left-10
          lg:left-14
          xl:left-20
        '
      >
        <div className='h-7 w-px bg-slate-300' />

        <span
          className='
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-slate-400
          '
        >
          Scroll to explore
        </span>
      </motion.div>
    </section>
  )
}

function ValuePoint({ children }) {
  return (
    <div className='flex items-center gap-2'>
      <CheckCircleIcon
        size={15}
        weight='fill'
        className='shrink-0 text-emerald-500'
      />

      <span
        className='
          text-[10px]
          font-semibold
          text-slate-600
          sm:text-[11px]
        '
      >
        {children}
      </span>
    </div>
  )
}

export default HeroSection
