import React from 'react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

function CTASection() {
  const navigate = useNavigate()

  return (
    <section className='bg-white py-20 lg:py-28'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='relative overflow-hidden rounded-3xl bg-blue-600 px-8 py-14 sm:px-12 lg:px-16 shadow-xl shadow-blue-600/20'>
          {/* Subtle Background Geometry */}
          <div className='pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-2xl' />
          <div className='pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-400/20 blur-xl' />

          <div className='relative grid items-center gap-8 lg:grid-cols-12'>
            {/* Left Header */}

            <div className='lg:col-span-6'>
              <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-4xl lg:leading-tight'>
                Ready to optimize your transportation network?
              </h2>
              <p className='mt-4 text-sm text-blue-100/90 leading-relaxed max-w-md sm:text-base'>
                Join manufacturers and logistics teams reducing transportation costs, improving efficiency, and making data-driven decisions.
              </p>
            </div>

            {/* Right Action */}

            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:col-span-6 lg:justify-end'>
              <button
                onClick={() => navigate('/')}
                className='inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-600 shadow-md transition-all hover:bg-slate-50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer'
              >
                Get Started for Free
                <ArrowRightIcon size={18} weight='bold' />
              </button>

              <span className='text-xs font-semibold text-blue-100'>
                • Instant Setup & Real-time Results
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection

