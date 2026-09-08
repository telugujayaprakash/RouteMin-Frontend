import React from 'react'
import { WarningCircleIcon, ArrowClockwiseIcon } from '@phosphor-icons/react'

function ErrorCard ({ error, onRetry }) {
  return (
    <div className='flex items-center justify-center min-h-[60vh] px-6'>
      <div className='relative w-full max-w-md rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50/40 p-6 text-center shadow-sm'>
        {/* Soft glow */}
        <div className='absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-red-100 blur-2xl opacity-40' />

        {/* Icon */}
        <div className='relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100'>
          <WarningCircleIcon size={28} weight='fill' className='text-red-500' />
        </div>

        {/* Title */}
        <h3 className='mt-5 text-lg font-semibold text-gray-900'>
          Something went wrong
        </h3>

        {/* Message */}
        <p className='mt-2 text-sm text-gray-500 break-words'>
          {error || 'Unexpected error occurred'}
        </p>

        {/* Action */}
        <button
          onClick={onRetry}
          className='mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md active:scale-95'
        >
          <ArrowClockwiseIcon size={18} />
          Try Again
        </button>
      </div>
    </div>
  )
}

export default ErrorCard
