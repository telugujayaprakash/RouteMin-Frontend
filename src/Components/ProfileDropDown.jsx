import React, { useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { UserIcon, GearIcon, SignOutIcon, CaretRightIcon, ReceiptIcon } from '@phosphor-icons/react'
import { logout } from '../Redux/Auth/AuthSlice'

function ProfileDropDown ({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleNavigateProfile = () => {
    onClose()
    navigate('/profile')
  }

  const handleLogout = () => {
    dispatch(logout())
    onClose()
  }

  return (
    <div
      ref={dropdownRef}
      className='
        absolute
        z-[100]

        /* ================= MOBILE ================= */

        bottom-[calc(100%+12px)]
        left-3
        right-3

        rounded-2xl
        border border-slate-200
        bg-white
        shadow-[0_20px_50px_-15px_rgba(15,23,42,0.20)]

        /* ================= TABLET / COLLAPSED ================= */

        md:bottom-[calc(100%+12px)]
        md:left-2
        md:right-auto
        md:w-64

        /* ================= LARGE SIDEBAR ================= */

        lg:left-auto
        lg:right-0
        lg:w-72

        overflow-hidden
        origin-bottom
        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-200
      '
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className='border-b border-slate-100 px-5 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-sm font-bold text-slate-900'>Account Menu</h3>

            <p className='mt-1 text-[11px] font-medium text-slate-500'>
              Manage your profile, password & invoices
            </p>
          </div>

          {/* Close */}

          <button
            type='button'
            onClick={onClose}
            className='
              flex h-7 w-7
              items-center justify-center
              rounded-lg
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-700
              cursor-pointer
            '
            aria-label='Close account menu'
          >
            ×
          </button>
        </div>
      </div>

      {/* =====================================================
          MENU
      ===================================================== */}

      <div className='p-2 space-y-1'>
        {/* Profile */}

        <button
          type='button'
          onClick={handleNavigateProfile}
          className='
            group
            flex w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-left
            text-sm
            font-semibold
            text-slate-700
            transition-all
            hover:bg-blue-50/70
            hover:text-blue-600
            active:scale-[0.98]
            cursor-pointer
          '
        >
          <span
            className='
              flex h-9 w-9
              shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
              transition-colors
              group-hover:bg-blue-600
              group-hover:text-white
            '
          >
            <UserIcon size={19} weight='duotone' />
          </span>

          <span className='flex-1'>
            View Profile
            <span className='block text-[10px] font-medium text-slate-400 group-hover:text-blue-500'>
              Account details & security
            </span>
          </span>

          <CaretRightIcon
            size={15}
            className='text-slate-300 transition-transform group-hover:translate-x-0.5'
          />
        </button>

        {/* Invoices */}

        <button
          type='button'
          onClick={handleNavigateProfile}
          className='
            group
            flex w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-left
            text-sm
            font-semibold
            text-slate-700
            transition-all
            hover:bg-blue-50/70
            hover:text-blue-600
            active:scale-[0.98]
            cursor-pointer
          '
        >
          <span
            className='
              flex h-9 w-9
              shrink-0
              items-center justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600
              transition-colors
              group-hover:bg-emerald-600
              group-hover:text-white
            '
          >
            <ReceiptIcon size={19} weight='duotone' />
          </span>

          <span className='flex-1'>
            Invoices & Receipts
            <span className='block text-[10px] font-medium text-slate-400 group-hover:text-blue-500'>
              Download payment invoices
            </span>
          </span>

          <CaretRightIcon
            size={15}
            className='text-slate-300 transition-transform group-hover:translate-x-0.5'
          />
        </button>

        {/* Divider */}

        <div className='my-1.5 h-px bg-slate-100' />

        {/* Logout */}

        <button
          type='button'
          onClick={handleLogout}
          className='
            group
            flex w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-left
            text-sm
            font-semibold
            text-rose-600
            transition-all
            hover:bg-rose-50
            active:scale-[0.98]
            cursor-pointer
          '
        >
          <span
            className='
              flex h-9 w-9
              shrink-0
              items-center justify-center
              rounded-xl
              bg-rose-50
              text-rose-500
              transition-colors
              group-hover:bg-rose-100
            '
          >
            <SignOutIcon size={19} weight='duotone' />
          </span>

          <span className='flex-1'>
            Logout
            <span className='block text-[10px] font-medium text-rose-400'>
              Sign out of RouteMin
            </span>
          </span>

          <CaretRightIcon
            size={15}
            className='text-rose-300 transition-transform group-hover:translate-x-0.5'
          />
        </button>
      </div>
    </div>
  )
}

export default ProfileDropDown
