import React from 'react'

function Button ({ children, active = false, onClick, className = '' }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`
        group
        relative
        h-11
        w-full
        overflow-hidden
        rounded-xl
        border
        font-medium
        transition-all
        duration-300
        cursor-pointer
        ${
          active
            ? 'border-indigo-600 bg-black text-white shadow-md shadow-indigo-500/20'
            : 'border-transparent bg-transparent text-slate-600'
        }

        hover:-translate-y-0.5
        hover:shadow-md
        active:translate-y-0
        active:scale-[0.97]

        ${className}
      `}
    >
      {/* Hover background */}

      {!active && (
        <span
          className='
            absolute
            inset-0
            origin-left
            scale-x-0
            bg-gradient-to-r
            from-gray-300
            to-indigo-100
            transition-transform
            duration-500
            ease-out
            group-hover:scale-x-100
          '
        />
      )}

      {/* Content */}

      <span
        className={`
          relative
          z-10
          flex
          h-full
          w-full
          items-center
          justify-start
          px-3.5
          gap-3
          transition-colors
          duration-300
          md:justify-center
          md:px-0
          lg:justify-start
          lg:px-3.5
          ${!active ? 'group-hover:text-black' : 'text-white'}
        `}
      >
        {children}
      </span>
    </button>
  )
}

export default Button
