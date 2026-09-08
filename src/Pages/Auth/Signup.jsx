import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  CheckIcon
} from '@phosphor-icons/react'
import Navbar from '../../Components/Navbar'
import { signupAuth, clearError } from '../../Redux/Auth/AuthSlice'
import SignupImage from '../../Assets/LandingSectionImages/SignupImg.png'
import AuthBg from '../../Assets/LandingSectionImages/AuthBg.png'

// INDIAN STATES + UNION TERRITORIES
const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
]

//animation
const pageEase = [0.16, 1, 0.3, 1]

function Signup({ onLogin }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loading = useSelector(state => state.Auth?.isLoading)
  const serverError = useSelector(state => state.Auth?.error)
  const [fullname, setFullname] = useState('')
  const [phoneno, setPhoneno] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [touched, setTouched] = useState({
    fullname: false,
    phoneno: false,
    email: false,
    state: false,
    password: false,
    confirmpassword: false
  })

  const validation = useMemo(() => {
    const cleanName = fullname.trim()
    const cleanPhone = phoneno.replace(/\D/g, '')
    const cleanEmail = email.trim()

    const nameValid =
      cleanName.length >= 2 &&
      cleanName.length <= 50 &&
      /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(cleanName)

    const phoneValid =
      cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone)

    const emailValid =
      cleanEmail.length <= 100 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)

    const passwordRules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    }

    const passwordValid =
      passwordRules.length &&
      passwordRules.uppercase &&
      passwordRules.lowercase &&
      passwordRules.number &&
      passwordRules.special

    const confirmValid =
      confirmpassword.length > 0 && confirmpassword === password

    return {
      nameValid,
      phoneValid,
      emailValid,
      stateValid: state.length > 0,
      passwordValid,
      confirmValid,
      passwordRules
    }
  }, [fullname, phoneno, email, state, password, confirmpassword])

  const isFormValid =
    validation.nameValid &&
    validation.phoneValid &&
    validation.emailValid &&
    validation.stateValid &&
    validation.passwordValid &&
    validation.confirmValid

  // ==========================================================
  // HELPERS
  // ==========================================================

  const markTouched = field => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
  }

  const clearServerError = () => {
    if (serverError) {
      dispatch(clearError())
    }
  }

  const getState = (field, valid) => {
    if (!touched[field]) return 'default'

    return valid ? 'valid' : 'invalid'
  }

  // ==========================================================
  // SIGNUP
  // ==========================================================

  const handleSignup = async e => {
    e.preventDefault()

    setTouched({
      fullname: true,
      phoneno: true,
      email: true,
      state: true,
      password: true,
      confirmpassword: true
    })

    if (!isFormValid || loading) {
      return
    }

    try {
      await dispatch(
        signupAuth({
          fullname: fullname.trim(),
          email: email.trim().toLowerCase(),
          phoneno: phoneno.replace(/\D/g, ''),
          state,
          password
        })
      ).unwrap()

      navigate('/login', {
        state: {
          signupSuccess: true
        }
      })
    } catch (error) {
      console.error('Signup failed:', error)
    }
  }

  return (
    <div
      style={{ backgroundImage: `url(${AuthBg})` }}
      className='min-h-screen lg:h-screen lg:max-h-screen bg-slate-50/50 flex flex-col justify-between selection:bg-blue-500 selection:text-white bg-cover bg-center overflow-y-auto lg:overflow-hidden'
    >
      <Navbar />
      <main className='w-full pt-20 pb-6 sm:pt-22 sm:pb-8 lg:py-0 px-4 sm:px-6 flex-1 flex items-center justify-center'>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.99
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          transition={{
            duration: 0.55,
            ease: pageEase
          }}
          className='
          mx-auto
          flex
          w-full
          max-w-[1140px]
          max-h-[calc(100vh-95px)]
          overflow-hidden
          rounded-[24px]
          border
          border-slate-200/80
          bg-white
          shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)]
        '
        >
          {/* =================================================
            LEFT VISUAL
        ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 1.03
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.8,
              ease: pageEase
            }}
            className='
            hidden
            w-[44%]
            p-4
            lg:block
            xl:w-[46%]
          '
          >
            <div
              className='
              relative
              h-full
              min-h-[460px]
              overflow-hidden
              rounded-2xl
              bg-[#f1f3f5]
            '
            >
              <img
                src={SignupImage}
                alt='RouteMin transportation optimization'
                draggable='false'
                className='
                absolute
                inset-0
                h-full
                w-full
                object-contain
                object-center
                select-none
              '
              />
            </div>
          </motion.div>

          {/* =================================================
            RIGHT FORM
        ================================================== */}

          <div
            className='
            flex
            min-w-0
            flex-1
            flex-col
            bg-white
            overflow-y-auto
          '
          >
            <div className='pt-4 lg:pt-6' />

            {/* =================================================
              FORM AREA
          ================================================== */}

            <div
              className='
              flex
              flex-1
              items-start
              px-5
              pb-6
              sm:px-8
              sm:pb-8
              lg:px-10
              lg:pb-8
            '
            >
              <div className='mx-auto w-full max-w-[650px]'>
                {/* =================================================
                  HEADER
              ================================================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1,
                    ease: pageEase
                  }}
                  className='mb-5 sm:mb-6'
                >
                  <p
                    className='
                    mb-3
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                    text-blue-600
                  '
                  >
                    Create your RouteMin account
                  </p>

                  <h1
                    className='
                    text-[32px]
                    font-black
                    leading-[0.98]
                    tracking-[-0.055em]
                    text-slate-950
                    sm:text-[40px]
                    lg:text-[44px]
                  '
                  >
                    Start planning
                    <br />
                    better routes.
                  </h1>

                  <p
                    className='
                    mt-3
                    max-w-[500px]
                    text-xs
                    leading-5
                    text-slate-500
                    sm:text-sm
                    sm:leading-6
                  '
                  >
                    Create your account to optimize transportation, allocate
                    shipments, and build cost-efficient plans.
                  </p>
                </motion.div>

                {/* =================================================
                  FORM
              ================================================== */}

                <motion.form
                  initial={{
                    opacity: 0,
                    y: 15
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.18,
                    ease: pageEase
                  }}
                  onSubmit={handleSignup}
                  noValidate
                  className='space-y-4'
                >
                  {/* NAME + PHONE */}

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      label='Full name'
                      state={getState('fullname', validation.nameValid)}
                      message={
                        touched.fullname && !validation.nameValid
                          ? 'Enter a valid name.'
                          : null
                      }
                    >
                      <input
                        type='text'
                        value={fullname}
                        placeholder='Your full name'
                        autoComplete='name'
                        maxLength={50}
                        onChange={e => {
                          setFullname(e.target.value)
                          clearServerError()
                        }}
                        onBlur={() => markTouched('fullname')}
                        className={inputClass(
                          getState('fullname', validation.nameValid)
                        )}
                      />
                    </FormField>

                    <FormField
                      label='Phone number'
                      state={getState('phoneno', validation.phoneValid)}
                      message={
                        touched.phoneno && !validation.phoneValid
                          ? 'Enter a valid 10-digit number.'
                          : null
                      }
                    >
                      <input
                        type='tel'
                        value={phoneno}
                        placeholder='98765 43210'
                        autoComplete='tel'
                        maxLength={15}
                        onChange={e => {
                          const value = e.target.value

                          if (/^[0-9+\-\s()]*$/.test(value)) {
                            setPhoneno(value)
                            clearServerError()
                          }
                        }}
                        onBlur={() => markTouched('phoneno')}
                        className={inputClass(
                          getState('phoneno', validation.phoneValid)
                        )}
                      />
                    </FormField>
                  </div>

                  {/* EMAIL + STATE */}

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      label='Email address'
                      state={getState('email', validation.emailValid)}
                      message={
                        touched.email && !validation.emailValid
                          ? 'Enter a valid email address.'
                          : null
                      }
                    >
                      <input
                        type='email'
                        value={email}
                        placeholder='you@company.com'
                        autoComplete='email'
                        maxLength={100}
                        onChange={e => {
                          setEmail(e.target.value)
                          clearServerError()
                        }}
                        onBlur={() => markTouched('email')}
                        className={inputClass(
                          getState('email', validation.emailValid)
                        )}
                      />
                    </FormField>

                    <FormField
                      label='State'
                      state={getState('state', validation.stateValid)}
                      message={
                        touched.state && !validation.stateValid
                          ? 'Select your state.'
                          : null
                      }
                    >
                      <select
                        value={state}
                        onChange={e => {
                          setState(e.target.value)
                          clearServerError()
                        }}
                        onBlur={() => markTouched('state')}
                        className={`
                        ${inputClass(getState('state', validation.stateValid))}
                        cursor-pointer
                        appearance-none
                      `}
                      >
                        <option value='' disabled>
                          Select your state
                        </option>

                        {indianStates.map(item => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  {/* PASSWORD + CONFIRM */}

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      label='Password'
                      state={getState('password', validation.passwordValid)}
                    >
                      <div className='relative'>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          placeholder='Create a password'
                          autoComplete='new-password'
                          onChange={e => {
                            setPassword(e.target.value)
                            clearServerError()
                          }}
                          onBlur={() => markTouched('password')}
                          className={`
                          ${inputClass(
                            getState('password', validation.passwordValid)
                          )}
                          pr-11
                        `}
                        />

                        <PasswordToggle
                          visible={showPassword}
                          onClick={() => setShowPassword(previous => !previous)}
                        />
                      </div>
                    </FormField>

                    <FormField
                      label='Confirm password'
                      state={getState(
                        'confirmpassword',
                        validation.confirmValid
                      )}
                      message={
                        touched.confirmpassword && !validation.confirmValid
                          ? 'Passwords do not match.'
                          : null
                      }
                    >
                      <div className='relative'>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmpassword}
                          placeholder='Repeat your password'
                          autoComplete='new-password'
                          onChange={e => {
                            setConfirmPassword(e.target.value)
                            clearServerError()
                          }}
                          onBlur={() => markTouched('confirmpassword')}
                          className={`
                          ${inputClass(
                            getState('confirmpassword', validation.confirmValid)
                          )}
                          pr-11
                        `}
                        />

                        <PasswordToggle
                          visible={showConfirmPassword}
                          onClick={() =>
                            setShowConfirmPassword(previous => !previous)
                          }
                        />
                      </div>
                    </FormField>
                  </div>

                  {/* =================================================
                    PASSWORD REQUIREMENTS
                ================================================== */}

                  <AnimatePresence initial={false}>
                    {password.length > 0 && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0
                        }}
                        animate={{
                          opacity: 1,
                          height: 'auto'
                        }}
                        exit={{
                          opacity: 0,
                          height: 0
                        }}
                        transition={{
                          duration: 0.25,
                          ease: pageEase
                        }}
                        className='overflow-hidden'
                      >
                        <div
                          className='
                          border-l
                          border-blue-600
                          py-1
                          pl-3
                        '
                        >
                          <p
                            className='
                            mb-2
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-slate-400
                          '
                          >
                            Password requirements
                          </p>

                          <div className='flex flex-wrap gap-x-4 gap-y-1.5'>
                            <Rule valid={validation.passwordRules.length}>
                              8+ characters
                            </Rule>

                            <Rule valid={validation.passwordRules.uppercase}>
                              Uppercase
                            </Rule>

                            <Rule valid={validation.passwordRules.lowercase}>
                              Lowercase
                            </Rule>

                            <Rule valid={validation.passwordRules.number}>
                              Number
                            </Rule>

                            <Rule valid={validation.passwordRules.special}>
                              Special character
                            </Rule>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* =================================================
                    SERVER ERROR
                ================================================== */}

                  <AnimatePresence>
                    {serverError && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -5
                        }}
                        animate={{
                          opacity: 1,
                          y: 0
                        }}
                        exit={{
                          opacity: 0,
                          y: -5
                        }}
                        className='
                        border-l-2
                        border-red-500
                        bg-red-50
                        px-3
                        py-2.5
                        text-xs
                        leading-5
                        text-red-700
                      '
                      >
                        {serverError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* =================================================
                    SUBMIT
                ================================================== */}

                  <button
                    type='submit'
                    disabled={loading || !isFormValid}
                    className='
                    group
                    flex
                    h-[52px]
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    text-sm
                    font-bold
                    text-white
                    transition-all
                    duration-300
                    hover:bg-blue-700
                    hover:shadow-[0_12px_30px_-10px_rgba(37,99,235,0.55)]
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:bg-slate-200
                    disabled:text-slate-400
                    disabled:shadow-none
                  '
                  >
                    {loading ? (
                      <>
                        <span
                          className='
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        '
                        />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRightIcon
                          size={17}
                          weight='bold'
                          className='
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        '
                        />
                      </>
                    )}
                  </button>

                  {/* Sign in prompt */}

                  <div className='pt-2 text-center sm:text-left'>
                    <p className='text-xs text-slate-500'>
                      Already have an account?{' '}
                      <button
                        type='button'
                        onClick={() => navigate('/login')}
                        className='
                          cursor-pointer
                          font-bold
                          text-blue-600
                          transition-colors
                          duration-200
                          hover:text-blue-700
                          hover:underline
                        '
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </motion.form>
              </div>
            </div>

            {/* =================================================
              FOOTER
          ================================================== */}

            <div
              className='
              border-t
              border-slate-100
              px-5
              py-4
              text-center
            '
            >
              <p className='text-[10px] font-medium text-slate-400'>
                © {new Date().getFullYear()} RouteMin
                <span className='mx-1.5'>·</span>
                Transportation Optimizer
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

// ============================================================
// FORM FIELD
// ============================================================

function FormField({ label, state, message, children }) {
  return (
    <div className='min-w-0'>
      <label
        className='
          mb-1.5
          block
          text-[11px]
          font-bold
          text-slate-800
        '
      >
        {label}
      </label>

      {children}

      <AnimatePresence initial={false}>
        {message && (
          <motion.p
            initial={{
              opacity: 0,
              y: -3
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -3
            }}
            className='
              mt-1
              text-[10px]
              font-medium
              text-red-600
            '
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// INPUT CLASS
// ============================================================

function inputClass(state) {
  const base = `
    h-[46px]
    w-full
    rounded-xl
    border
    bg-white
    px-3.5
    text-[13px]
    font-medium
    text-slate-900
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    focus:ring-4
  `

  if (state === 'valid') {
    return `
      ${base}
      border-emerald-300
      focus:border-blue-600
      focus:ring-blue-600/8
    `
  }

  if (state === 'invalid') {
    return `
      ${base}
      border-red-300
      bg-red-50/20
      focus:border-red-500
      focus:ring-red-500/8
    `
  }

  return `
    ${base}
    border-slate-200
    hover:border-slate-300
    focus:border-blue-600
    focus:ring-blue-600/8
  `
}

// ============================================================
// PASSWORD TOGGLE
// ============================================================

function PasswordToggle({ visible, onClick }) {
  return (
    <button
      type='button'
      onClick={onClick}
      tabIndex={-1}
      aria-label={visible ? 'Hide password' : 'Show password'}
      className='
        absolute
        right-2
        top-1/2
        flex
        h-8
        w-8
        -translate-y-1/2
        cursor-pointer
        items-center
        justify-center
        rounded-lg
        text-slate-400
        transition-colors
        duration-200
        hover:bg-slate-100
        hover:text-slate-700
      '
    >
      {visible ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />}
    </button>
  )
}

// ============================================================
// PASSWORD RULE
// ============================================================

function Rule({ valid, children }) {
  return (
    <span
      className={`
        flex
        items-center
        gap-1
        text-[10px]
        font-semibold
        transition-colors
        duration-200
        ${valid ? 'text-emerald-600' : 'text-slate-400'}
      `}
    >
      {valid ? (
        <CheckIcon size={11} weight='bold' />
      ) : (
        <span className='text-[11px]'>○</span>
      )}

      {children}
    </span>
  )
}

export default Signup
