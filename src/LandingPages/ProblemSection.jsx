import React from 'react'
import { motion } from 'framer-motion'
import { Sparkle, Warning, ArrowUpRight } from '@phosphor-icons/react'

import prblmimg1 from './Assets/prblm1.png'
import prblmimg2 from './Assets/prblm2.png'
import prblmimg3 from './Assets/prblm3.png'
import prblmimg4 from './Assets/prblm4.png'

function ProblemSection() {
  const problems = [
    {
      number: '01',
      category: 'Manual Planning',
      title: 'Still planning shipments in spreadsheets?',
      description:
        'Balancing factory supply, warehouse demand, and shipment quantities manually takes time and leaves room for calculation errors.',
      image: prblmimg1,
      // tags: ['VAM Initial Solution', 'Automated Matrix Balancing', 'Zero Formula Errors']
      tags: ["RouteMin automates the transportation planning process."]
    },
    {
      number: '02',
      category: 'Transportation Cost',
      title: 'The cheapest route isn’t always obvious.',
      description:
        'With multiple factories, warehouses, and transportation costs, choosing routes manually can lead to inefficient shipment allocations and higher costs.',
      image: prblmimg2,
      tags: ['RouteMin finds a minimum-cost transportation plan.']
    },
    {
      number: '03',
      category: 'Supply & Demand',
      title: 'When supply changes, your plan changes with it.',
      description:
        'A change in factory supply or warehouse demand can require the entire allocation plan to be recalculated.',
      image: prblmimg3,
      tags: ["RouteMin balances the transportation problem before generating the plan."]
    },
    {
      number: '04',
      category: 'Decision Visibility',
      title: 'Can you explain why this plan is the best one?',
      description:
        'Comparing transportation options manually makes it difficult to understand allocation decisions, costs, and whether the solution has reached optimality.',
      image: prblmimg4,
      tags: ['RouteMin provides allocation details, cost analysis, optimization statistics, and reports.']
    }
  ]

  return (
    <section
      id='problem'
      className='relative bg-white py-20 lg:py-28 border-b border-slate-200/80 text-slate-900 scroll-mt-24'
    >
      <div className='mx-auto max-w-7xl px-5 sm:px-8 lg:px-12'>

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <div className='max-w-3xl mb-16 lg:mb-20 text-left'>
          <div className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs mb-4'>
            <Warning size={15} weight='fill' className='text-blue-600' />
            <span>The Logistics Challenge</span>
          </div>

          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight'>
            Transportation Planning Shouldn't Be This Hard.
          </h2>

          <p className='mt-4 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal'>
            Explore how RouteMin replaces manual spreadsheet errors, unoptimized freight costs, and supply chain bottlenecks with mathematically verified transportation planning.
          </p>
        </div>

        {/* =====================================================
            STICKY STACKING CARDS CONTAINER
        ===================================================== */}
        <div className='relative space-y-8 sm:space-y-12 pb-12'>
          {problems.map((prob, idx) => {
            // Calculate progressive top offset for sticky stacking effect
            const topOffset = `calc(6.5rem + ${idx * 1.25}rem)`

            return (
              <motion.div
                key={prob.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ top: topOffset }}
                className='sticky z-10 rounded-3xl bg-[#f3f4f6] border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-900/5 transition-transform duration-300 hover:shadow-2xl'
              >
                <div className='grid gap-8 lg:grid-cols-12 items-center'>

                  {/* LEFT: PROBLEM IMAGE CONTAINER */}
                  <div className='lg:col-span-5 relative rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-2xs h-[240px] sm:h-[300px] lg:h-[340px] flex items-center justify-center group'>
                    <img
                      src={prob.image}
                      alt={prob.title}
                      className='h-full w-full object-cover object-center rounded-2xl transition-transform duration-700 group-hover:scale-105 select-none'
                    />
                    <div className='absolute inset-0 bg-slate-950/5 pointer-events-none' />
                  </div>

                  {/* RIGHT: PROBLEM DETAILS & ROUTEMIN SOLUTION TAGS */}
                  <div className='lg:col-span-7 flex flex-col justify-between text-left space-y-5'>

                    {/* Top Number Pill */}
                    <div className='flex items-center justify-between'>
                      <span className='inline-flex items-center justify-center rounded-full bg-white px-3.5 py-1 text-xs font-extrabold text-slate-700 border border-slate-200/90 shadow-2xs font-mono'>
                        {prob.number}
                      </span>
                      <span className='text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60'>
                        {prob.category}
                      </span>
                    </div>

                    {/* Problem Title */}
                    <h3 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight sm:leading-snug'>
                      {prob.title}
                    </h3>

                    {/* Description */}
                    <p className='text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl'>
                      {prob.description}
                    </p>

                    {/* RouteMin Solution Tags (Pills) */}
                    <div className='pt-2'>
                      <span className='text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5'>
                        RouteMin Solution
                      </span>
                      <div className='flex flex-wrap items-center gap-2'>
                        {prob.tags.map(tag => (
                          <span
                            key={tag}
                            className='inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:text-blue-600 transition-colors'
                          >
                            <Sparkle size={13} weight='fill' className='text-blue-600' />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default ProblemSection

