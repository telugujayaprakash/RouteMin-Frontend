import React from 'react'
import {
  LinkedinLogo,
  GithubLogo,
  TwitterLogo,
  Envelope
} from '@phosphor-icons/react'
import RMIcon from '../Assets/RMIcon.png'

function Footer() {
  return (
    <footer id='footer' className='border-t border-slate-200/80 bg-white text-slate-700 relative z-20'>
      <div className='mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-12 lg:px-8'>
        {/* Brand Column */}
        <div className='lg:col-span-4 space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-500/20 overflow-hidden'>
              <img src={RMIcon} alt="RouteMin" className='h-full w-full object-cover' />
            </div>
            <div>
              <div className='flex items-center gap-0.5 text-lg font-extrabold tracking-tight text-slate-900'>
                <span>Route</span>
                <span className='text-cyan-500'>Min</span>
              </div>
              <p className='text-[8px] font-bold tracking-widest text-slate-400 uppercase -mt-0.5'>
                OPTIMIZE • ALLOCATE • DELIVER
              </p>
            </div>
          </div>

          <p className='max-w-sm text-xs leading-relaxed text-slate-500 font-medium'>
            Transportation optimization for smarter supply chain decisions. RouteMin enables factory-to-warehouse route allocation and freight cost minimization.
          </p>
        </div>

        {/* Links Columns */}
        <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8'>
          <div>
            <h3 className='text-xs font-extrabold uppercase tracking-wider text-slate-900'>Product</h3>
            <ul className='mt-4 space-y-2.5 text-xs font-semibold text-slate-600'>
              <li><a href='#features' className='transition-colors hover:text-blue-600'>Features</a></li>
              <li><a href='#problem' className='transition-colors hover:text-blue-600'>Problems We Solve</a></li>
              <li><a href='#algorithms' className='transition-colors hover:text-blue-600'>Algorithms</a></li>
              <li><a href='#faq' className='transition-colors hover:text-blue-600'>FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className='text-xs font-extrabold uppercase tracking-wider text-slate-900'>Resources</h3>
            <ul className='mt-4 space-y-2.5 text-xs font-semibold text-slate-600'>
              <li className='hover:text-blue-600 cursor-pointer transition-colors'>Optimization Engine</li>
              <li className='hover:text-blue-600 cursor-pointer transition-colors'>Reports & Analytics</li>
              <li><a href='#faq' className='transition-colors hover:text-blue-600'>Help & Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className='text-xs font-extrabold uppercase tracking-wider text-slate-900'>Company</h3>
            <ul className='mt-4 space-y-2.5 text-xs font-semibold text-slate-600 mb-4'>
              <li className='hover:text-blue-600 cursor-pointer transition-colors'>About RouteMin</li>
              <li className='hover:text-blue-600 cursor-pointer transition-colors'>Contact Support</li>
              <li className='hover:text-blue-600 cursor-pointer transition-colors'>Privacy Policy</li>
              <li className='hover:text-blue-600 cursor-pointer transition-colors'>Terms of Service</li>
            </ul>

            <div className='flex items-center gap-2'>
              <button aria-label='LinkedIn' className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 cursor-pointer'>
                <LinkedinLogo size={16} />
              </button>
              <button aria-label='GitHub' className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 cursor-pointer'>
                <GithubLogo size={16} />
              </button>
              <button aria-label='Twitter' className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 cursor-pointer'>
                <TwitterLogo size={16} />
              </button>
              <button aria-label='Email' className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 cursor-pointer'>
                <Envelope size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='border-t border-slate-100 py-6 text-center text-xs font-medium text-slate-400'>
        © 2026 RouteMin. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer


