import React, { useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent
} from 'framer-motion'
import { ListIcon, XIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { useNavigate, useLocation } from 'react-router-dom'
import RMIcon from '../Assets/RMIcon.png'

function Navbar () {
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', latest => {
    setIsScrolled(latest > 30)
  })

  const isLoginPage = location.pathname === '/login'
  const isSignupPage = location.pathname === '/signup'

  const navItems = [
    {
      title: 'Features',
      href: '#features'
    },
    {
      title: 'Problems We solve',
      href: '#problem'
    },
    {
      title: 'Algorithms',
      href: '#algorithms'
    },
    {
      title: 'FAQ',
      href: '#faq'
    }
  ]

  const goToLogin = () => {
    setMobileMenuOpen(false)
    navigate('/login')
  }

  const goToSignup = () => {
    setMobileMenuOpen(false)
    navigate('/signup')
  }

  const handleNavClick = href => {
    setMobileMenuOpen(false)

    if (location.pathname !== '/') {
      navigate(`/${href}`)
      return
    }

    const element = document.querySelector(href)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <motion.header
      initial={{
        y: -20,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }}
      className='
        fixed
        left-0
        right-0
        top-0
        z-50
        px-4
        pt-4
        sm:px-6
      '
    >
      <div className='mx-auto max-w-[1300px]'>
        {/* NAVBAR */}

        <motion.nav
          animate={{
            backgroundColor: isScrolled
              ? 'rgba(255,255,255,0.96)'
              : 'rgba(255,255,255,0.85)',

            borderColor: isScrolled
              ? 'rgba(226,232,240,0.9)'
              : 'rgba(226,232,240,0.65)',

            boxShadow: isScrolled
              ? '0 8px 30px rgba(15,23,42,0.06)'
              : '0 2px 10px rgba(15,23,42,0.03)'
          }}
          transition={{
            duration: 0.3
          }}
          className='
            flex
            h-[60px]
            items-center
            justify-between
            rounded-2xl
            border
            px-4
            backdrop-blur-xl
            sm:px-5
          '
        >
          {/* LOGO */}

          <button
            type='button'
            onClick={() => {
              setMobileMenuOpen(false)
              navigate('/')
            }}
            className='
              group
              flex
              shrink-0
              items-center
              gap-2.5
              cursor-pointer
            '
          >
            <div
              className='
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-blue-600
                shadow-sm
                shadow-blue-600/20
                transition-transform
                duration-300
                group-hover:scale-105
              '
            >
              <img
                src={RMIcon}
                alt='RouteMin'
                className='h-full w-full rounded-lg object-cover'
              />
            </div>

            <div className='hidden sm:block text-left'>
              <h1 className='text-[21px] font-extrabold leading-none tracking-[-0.04em]'>
                <span className='text-slate-900'>Route</span>
                <span className='text-cyan-500'>Min</span>
              </h1>

              <p className='mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-slate-500'>
                Optimize
                <span className='mx-1 text-cyan-500'>•</span>
                Allocate
                <span className='mx-1 text-cyan-500'>•</span>
                Deliver
              </p>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}

          <ul
            className='
              hidden
              items-center
              gap-7
              lg:flex
            '
          >
            {navItems.map(item => (
              <li key={item.title}>
                <button
                  type='button'
                  onClick={() => handleNavClick(item.href)}
                  className='
                    relative
                    text-[15px]
                    font-semibold
                    tracking-wide
                    text-slate-500
                    transition-colors
                    duration-200
                    hover:text-slate-950
                    cursor-pointer

                    after:absolute
                    after:-bottom-1
                    after:left-0
                    after:h-px
                    after:w-0
                    after:bg-blue-600
                    after:transition-all
                    after:duration-300
                    hover:after:w-full
                  '
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>

          {/* DESKTOP ACTIONS */}

          <div className='hidden items-center gap-2.5 sm:flex'>
            {!isLoginPage && (
              <button
                type='button'
                onClick={goToLogin}
                className='
                  h-9
                  rounded-lg
                  px-4
                  text-[14px]
                  font-semibold
                  text-slate-600
                  transition-colors
                  hover:bg-slate-100
                  hover:text-slate-950
                  cursor-pointer
                '
              >
                Login
              </button>
            )}

            {!isSignupPage && (
              <button
                type='button'
                onClick={goToSignup}
                className='
                  inline-flex
                  h-9
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-blue-600
                  px-4
                  text-[14px]
                  font-semibold
                  text-white
                  shadow-sm
                  shadow-blue-600/20
                  transition-all
                  hover:bg-blue-700
                  hover:shadow-md
                  active:scale-[0.97]
                  cursor-pointer
                '
              >
                Get Started
                <ArrowRightIcon size={13} weight='bold' />
              </button>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            type='button'
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label='Toggle navigation'
            aria-expanded={mobileMenuOpen}
            className='
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-700
              transition-colors
              hover:bg-slate-50
              cursor-pointer

              lg:hidden
            '
          >
            {mobileMenuOpen ? <XIcon size={18} /> : <ListIcon size={18} />}
          </button>
        </motion.nav>

        {/* MOBILE MENU */}

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -8
              }}
              transition={{
                duration: 0.2
              }}
              className='
                mt-2
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-lg
                shadow-slate-900/5
                lg:hidden
              '
            >
              {/* Mobile navigation */}

              <nav>
                <ul className='space-y-1'>
                  {navItems.map(item => (
                    <li key={item.title}>
                      <button
                        type='button'
                        onClick={() => handleNavClick(item.href)}
                        className='
                          block
                          w-full
                          rounded-lg
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          font-semibold
                          text-slate-600
                          transition-colors
                          hover:bg-slate-50
                          hover:text-slate-950
                          cursor-pointer
                        '
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile actions */}

              <div
                className='
                  mt-3
                  flex
                  items-center
                  gap-2
                  border-t
                  border-slate-100
                  pt-3
                '
              >
                {!isLoginPage && (
                  <button
                    type='button'
                    onClick={goToLogin}
                    className='
                      h-10
                      flex-1
                      rounded-lg
                      border
                      border-slate-200
                      text-xs
                      font-semibold
                      text-slate-700
                      transition-colors
                      hover:bg-slate-50
                      cursor-pointer
                    '
                  >
                    Login
                  </button>
                )}

                {!isSignupPage && (
                  <button
                    type='button'
                    onClick={goToSignup}
                    className='
                      inline-flex
                      h-10
                      flex-1
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      bg-blue-600
                      text-xs
                      font-semibold
                      text-white
                      transition-colors
                      hover:bg-blue-700
                      cursor-pointer
                    '
                  >
                    Get Started
                    <ArrowRightIcon size={13} weight='bold' />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Navbar
