import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Gear, Sparkle, ShieldCheck, Lightning } from '@phosphor-icons/react'

function ModiSection () {
  return (
    <section className='relative bg-slate-50/70 py-20 lg:py-28 border-b border-slate-200/80 overflow-hidden'>
      <div className='mx-auto max-w-7xl px-5 sm:px-8 lg:px-12'>
        
        <div className='grid gap-12 lg:grid-cols-12 items-center'>
          
          {/* =====================================================
              LEFT: TEXT EXPLANATION
          ===================================================== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className='lg:col-span-6 space-y-5 text-left max-w-xl mx-auto lg:mx-0'
          >
            <div className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs'>
              <Gear size={15} className='animate-spin text-blue-600' />
              <span>Post-IBFS Optimality Improvement</span>
            </div>

            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight'>
              Then RouteMin Optimizes Further with MODI
            </h2>

            <p className='text-sm sm:text-base text-slate-600 leading-relaxed font-normal'>
              After the initial basic feasible solution (NWCR, LCM, or VAM) is generated, RouteMin automatically executes the Modified Distribution (MODI) algorithm to iteratively refine shipment allocations until the 100% mathematical minimum transportation cost is proven.
            </p>

            <div className='pt-2 space-y-2.5 text-xs font-semibold text-slate-700'>
              <div className='flex items-center gap-2.5'>
                <CheckCircle size={17} weight='fill' className='text-emerald-600 shrink-0' />
                <span>Calculates dual multipliers (u_i and v_j) for occupied cells</span>
              </div>
              <div className='flex items-center gap-2.5'>
                <CheckCircle size={17} weight='fill' className='text-emerald-600 shrink-0' />
                <span>Evaluates opportunity cost evaluations (d_ij = c_ij - u_i - v_j)</span>
              </div>
              <div className='flex items-center gap-2.5'>
                <CheckCircle size={17} weight='fill' className='text-emerald-600 shrink-0' />
                <span>Closed-loop allocation shifting guarantees 100% minimum freight cost</span>
              </div>
            </div>
          </motion.div>

          {/* =====================================================
              RIGHT: EXECUTION PIPELINE CARD
          ===================================================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='lg:col-span-6 relative'
          >
            <div className='p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-900/5'>
              
              <div className='flex items-center justify-between pb-4 border-b border-slate-100 mb-6'>
                <span className='text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2'>
                  <Sparkle size={15} weight='fill' className='text-blue-600' />
                  RouteMin Execution Pipeline
                </span>
                <span className='text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200'>
                  100% OPTIMAL
                </span>
              </div>

              <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                
                {/* Stage 1: Initial Solution */}
                <div className='w-full sm:w-1/3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center shadow-2xs hover:border-slate-300 transition-colors'>
                  <span className='text-[10px] font-mono font-extrabold uppercase text-slate-400 block'>Stage 1</span>
                  <p className='text-xs font-bold text-slate-900 mt-1'>Initial Solution</p>
                  <p className='text-[10px] font-mono font-semibold text-blue-600 mt-1 bg-blue-50 px-2 py-0.5 rounded inline-block'>NWCR / LCM / VAM</p>
                </div>

                {/* Arrow */}
                <div className='text-blue-600 font-bold text-lg rotate-90 sm:rotate-0 shrink-0'>
                  <ArrowRight size={20} weight='bold' />
                </div>

                {/* Stage 2: MODI Optimizer */}
                <div className='w-full sm:w-1/3 p-4 rounded-xl bg-blue-50/70 border-2 border-blue-600 text-center relative shadow-sm hover:shadow-md transition-shadow'>
                  <span className='absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs'>
                    OPTIMIZER
                  </span>
                  <span className='text-[10px] font-mono font-extrabold uppercase text-blue-700 block mt-1'>Stage 2</span>
                  <p className='text-xs font-black text-slate-900 mt-1'>MODI Method</p>
                  <p className='text-[10px] font-mono text-blue-700 mt-0.5'>u_i + v_j = c_ij</p>
                </div>

                {/* Arrow */}
                <div className='text-emerald-600 font-bold text-lg rotate-90 sm:rotate-0 shrink-0'>
                  <ArrowRight size={20} weight='bold' />
                </div>

                {/* Stage 3: Optimal Plan */}
                <div className='w-full sm:w-1/3 p-4 rounded-xl bg-emerald-50/70 border border-emerald-300/90 text-center shadow-2xs hover:border-emerald-400 transition-colors'>
                  <span className='text-[10px] font-mono font-extrabold uppercase text-emerald-700 block'>Stage 3</span>
                  <p className='text-xs font-bold text-slate-900 mt-1'>Optimal Plan</p>
                  <p className='text-[10px] font-mono font-extrabold text-emerald-700 mt-1 bg-emerald-100/80 px-2 py-0.5 rounded inline-block'>Min Freight Cost</p>
                </div>

              </div>

              {/* Bottom Note */}
              <div className='mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500'>
                <span className='font-semibold text-slate-700'>Optimality Test:</span>
                <span className='font-mono text-[11px] text-blue-700 font-bold bg-slate-50 px-2.5 py-1 rounded border border-slate-200'>
                  d_ij ≥ 0 for all non-basic cells
                </span>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default ModiSection
