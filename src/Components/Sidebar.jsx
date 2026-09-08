import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import RmIcon from '../Assets/RMIcon.png'
import ProfileDropDown from './ProfileDropDown'

import {
  HouseIcon,
  FactoryIcon,
  WarehouseIcon,
  PathIcon,
  ListIcon,
  XIcon,
  FileArrowUpIcon,
  ClockCounterClockwiseIcon,
  UserIcon,
  CurrencyInrIcon
} from '@phosphor-icons/react'
import Button from './UI/Button'

function Sidebar() {
  const location = useLocation()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const user = useSelector(state => state.Auth?.user)

  const navItems = [
    {
      pageName: 'Dashboard',
      icon: HouseIcon,
      url: '/dashboard'
    },
    {
      pageName: 'Factory Management',
      icon: FactoryIcon,
      url: '/factory-management'
    },
    {
      pageName: 'Warehouse Management',
      icon: WarehouseIcon,
      url: '/warehouse-management'
    },
    {
      pageName: 'New Optimization',
      icon: PathIcon,
      url: '/new-optimization'
    },
    {
      pageName: 'Optimisation History',
      icon: FileArrowUpIcon,
      url: '/optimization-history'
    },
    {
      pageName: 'Reports',
      icon: FileArrowUpIcon,
      url: '/reports'
    },
    {
      pageName: 'Audit Logs',
      icon: ClockCounterClockwiseIcon,
      url: '/auditlogs'
    },
    {
      pageName: 'Pricing',
      icon: CurrencyInrIcon,
      url: '/pricing'
    }
  ]

  const isResultPage = location.pathname.startsWith('/result')

  return (
    <>
      {/* =====================================================
          MOBILE MENU BUTTON
      ===================================================== */}

      <button
        type='button'
        onClick={() => setIsSidebarOpen(true)}
        className='
          fixed right-4 top-4 z-40
          flex h-10 w-10 items-center justify-center
          rounded-xl
          border border-slate-200
          bg-white
          text-slate-700
          shadow-sm
          transition-all
          hover:bg-slate-50
          hover:shadow-md
          active:scale-95
          md:hidden
          cursor-pointer
        '
        aria-label='Open navigation'
      >
        <ListIcon size={22} weight='bold' />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className='
            fixed inset-0 z-40
            bg-slate-950/30
            backdrop-blur-[2px]
            md:hidden
          '
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen
          w-72
          border-r border-slate-200/80
          bg-white
          transition-transform duration-300 ease-in-out

          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}

          md:w-20
          md:translate-x-0

          lg:w-72
        `}
      >
        <div className='flex h-full flex-col justify-between'>
          {/* =================================================
              TOP SECTION
          ================================================= */}

          <div className='min-h-0'>
            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className='
                flex h-20
                items-center justify-between
                border-b border-slate-100
                px-5
                md:justify-center
                lg:justify-between
              '
            >
              <div className='flex items-center gap-3'>
                {/* Logo */}

                <div
                  className='
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-blue-600
                    text-sm font-bold
                    text-white
                    shadow-sm shadow-blue-500/20
                  '
                >
                  <img src={RmIcon} alt='' />
                </div>

                {/* Brand */}

                <div className='md:hidden lg:block'>
                  <h1 className='text-[21px] font-extrabold leading-none tracking-[-0.04em]'>
                    <span className='text-slate-900'>Route</span>
                    <span className='text-cyan-500'>Min</span>
                  </h1>

                  <p className='mt-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-slate-500'>
                    Optimize
                    <span className='mx-1.5 text-cyan-500'>•</span>
                    Allocate
                    <span className='mx-1.5 text-cyan-500'>•</span>
                    Deliver
                  </p>
                </div>
              </div>

              {/* Mobile Close */}

              <button
                type='button'
                onClick={() => setIsSidebarOpen(false)}
                className='
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg
                  text-slate-400
                  transition-colors
                  hover:bg-slate-100
                  hover:text-slate-700
                  md:hidden
                  cursor-pointer
                '
                aria-label='Close navigation'
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className='p-4 md:px-2.5 lg:p-4'>
              <ul className='space-y-1.5'>
                {navItems.map(({ pageName, icon: Icon, url }) => {
                  const isHistoryTab = url === '/optimization-history'

                  return (
                    <li key={url}>
                      <NavLink
                        to={url}
                        onClick={() => setIsSidebarOpen(false)}
                        className='block'
                      >
                        {({ isActive }) => {
                          const active =
                            isActive || (isResultPage && isHistoryTab)

                          return (
                            <Button
                              active={active}
                              className='
                      border-transparent
                      justify-start
                      px-3.5
                      md:justify-center
                      md:px-0
                      lg:justify-start
                      lg:px-3.5
                    '
                            >
                              <Icon
                                size={20}
                                weight={active ? 'bold' : 'regular'}
                                className='shrink-0'
                              />

                              <span
                                className='
                        text-sm
                        md:hidden
                        lg:block
                      '
                              >
                                {pageName}
                              </span>
                            </Button>
                          )
                        }}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* =================================================
              BOTTOM PROFILE SECTION
          ================================================= */}

          <div
            className='
              relative
              border-t border-slate-100
              p-4
              md:px-2.5
              lg:p-4
            '
          >
            {/* Profile Dropdown */}

            <ProfileDropDown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />

            {/* Profile Trigger */}

            <button
              type='button'
              onClick={() => setIsProfileOpen(prev => !prev)}
              className={`
                group
                flex w-full
                items-center gap-3
                rounded-xl
                border
                p-2.5
                text-left
                transition-all
                cursor-pointer

                md:justify-center
                lg:justify-start

                ${isProfileOpen
                  ? `
                      border-blue-200
                      bg-blue-50/70
                      shadow-sm
                    `
                  : `
                      border-slate-200/80
                      bg-slate-50/80
                      hover:border-slate-300
                      hover:bg-white
                      hover:shadow-sm
                    `
                }
              `}
            >
              {/* Avatar */}

              <div
                className={`
                  flex h-9 w-9
                  shrink-0
                  items-center justify-center
                  rounded-full
                  font-semibold
                  text-xs
                  transition-colors

                  ${isProfileOpen
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600'
                  }
                `}
              >
                <UserIcon size={18} weight='bold' />
              </div>

              {/* User Information */}

              <div className='min-w-0 md:hidden lg:block'>
                <p
                  className='
                    truncate
                    text-sm
                    font-semibold
                    text-slate-900
                    select-none
                  '
                >
                  {user?.fullName || 'User Profile'}
                </p>

                <p
                  className='
                    truncate
                    text-[11px]
                    font-medium
                    text-slate-500
                  '
                >
                  {user?.email || 'Operations Team'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
