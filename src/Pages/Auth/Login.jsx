import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Eye,
  EyeSlash,
  LockKey,
  Envelope,
  ShieldCheck,
  WarningCircle
} from '@phosphor-icons/react'
import AuthBg from '../../Assets/LandingSectionImages/AuthBg.png'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import { loginAuth, forgotPassword, verifyOtp, resetPassword, clearError } from '../../Redux/Auth/AuthSlice'
import LoginImg from '../../Assets/LandingSectionImages/LoginImg.png'

/* =========================================================
   STEPS
========================================================= */

const STEPS = {
  LOGIN: 'login',
  EMAIL: 'email',
  OTP: 'otp',
  RESET: 'reset'
}

/* =========================================================
   PASSWORD RULES
========================================================= */

const passwordRules = [
  {
    key: 'length',
    label: 'At least 8 characters',
    test: password => password.length >= 8
  },
  {
    key: 'uppercase',
    label: 'One uppercase letter',
    test: password => /[A-Z]/.test(password)
  },
  {
    key: 'lowercase',
    label: 'One lowercase letter',
    test: password => /[a-z]/.test(password)
  },
  {
    key: 'number',
    label: 'One number',
    test: password => /\d/.test(password)
  },
  {
    key: 'special',
    label: 'One special character',
    test: password => /[^A-Za-z0-9]/.test(password)
  }
]

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authLoading = useSelector(state => state.Auth?.isLoading)
  const serverError = useSelector(state => state.Auth?.error)
  const [step, setStep] = useState(STEPS.LOGIN)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [touched, setTouched] = useState({})

  const [localError, setLocalError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [actionLoading, setActionLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const location = useLocation()

  const signupSuccess = location.state?.signupSuccess

  /* =======================================================
     VALIDATION
  ======================================================= */

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }, [email])

  const loginPasswordValid = password.length >= 8

  const isOtpValid = /^\d{6}$/.test(otp)

  const passwordValidation = useMemo(() => {
    return passwordRules.reduce((result, rule) => {
      result[rule.key] = rule.test(newPassword)
      return result
    }, {})
  }, [newPassword])

  const newPasswordValid = Object.values(passwordValidation).every(Boolean)

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword

  /* =======================================================
     PASSWORD STRENGTH
  ======================================================= */

  const passwordStrength = useMemo(() => {
    const score = Object.values(passwordValidation).filter(Boolean).length

    if (!newPassword) {
      return {
        score: 0,
        label: ''
      }
    }

    if (score <= 2) {
      return {
        score,
        label: 'Weak'
      }
    }

    if (score <= 4) {
      return {
        score,
        label: 'Good'
      }
    }

    return {
      score,
      label: 'Strong'
    }
  }, [newPassword, passwordValidation])

  /* =======================================================
     OTP TIMER
  ======================================================= */

  useEffect(() => {
    if (resendTimer <= 0) return

    const timer = setInterval(() => {
      setResendTimer(previous => {
        if (previous <= 1) {
          clearInterval(timer)
          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resendTimer])

  /* =======================================================
     HELPERS
  ======================================================= */

  const markTouched = field => {
    setTouched(previous => ({
      ...previous,
      [field]: true
    }))
  }

  const clearMessages = () => {
    setLocalError('')
    setSuccessMessage('')
    dispatch(clearError())
  }

  const resetTouched = () => {
    setTouched({})
  }

  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = event => {
    event.preventDefault()

    clearMessages()

    setTouched({
      email: true,
      password: true
    })

    if (!isEmailValid) {
      setLocalError('Please enter a valid email address.')
      return
    }

    if (!loginPasswordValid) {
      setLocalError('Password must contain at least 8 characters.')
      return
    }

    dispatch(
      loginAuth({
        email: email.trim(),
        password
      })
    )
  }

  /* =======================================================
     FORGOT PASSWORD
  ======================================================= */

  const handleForgotPassword = async event => {
    event.preventDefault()

    clearMessages()

    setTouched({
      email: true
    })

    if (!isEmailValid) {
      setLocalError('Please enter a valid email address.')
      return
    }

    setActionLoading(true)

    try {
      const res = await dispatch(forgotPassword({ email: email.trim() })).unwrap()

      setSuccessMessage(res?.message || 'OTP sent successfully to your registered email.')
      setStep(STEPS.OTP)
      setOtp('')
      setResendTimer(30)
      resetTouched()
    } catch (error) {
      setLocalError(error || 'Unable to send verification code.')
    } finally {
      setActionLoading(false)
    }
  }

  /* =======================================================
     VERIFY OTP
  ======================================================= */

  const handleVerifyOtp = async event => {
    event.preventDefault()

    clearMessages()

    setTouched({
      otp: true
    })

    if (!isOtpValid) {
      setLocalError('Enter the 6-digit verification code.')
      return
    }

    setActionLoading(true)

    try {
      const res = await dispatch(verifyOtp({ email: email.trim(), otp })).unwrap()

      setSuccessMessage(res?.message || 'Email verified successfully.')
      setStep(STEPS.RESET)
      resetTouched()
    } catch (error) {
      setLocalError(error || 'Unable to verify the code.')
    } finally {
      setActionLoading(false)
    }
  }

  /* =======================================================
     RESEND OTP
  ======================================================= */

  const handleResendOtp = async () => {
    if (resendTimer > 0 || actionLoading) return

    clearMessages()

    setActionLoading(true)

    try {
      const res = await dispatch(forgotPassword({ email: email.trim() })).unwrap()

      setSuccessMessage(res?.message || 'A new verification code has been sent.')
      setResendTimer(30)
      setOtp('')
    } catch (error) {
      setLocalError(error || 'Unable to resend verification code.')
    } finally {
      setActionLoading(false)
    }
  }

  /* =======================================================
     RESET PASSWORD
  ======================================================= */

  const handleResetPassword = async event => {
    event.preventDefault()

    clearMessages()

    setTouched({
      newPassword: true,
      confirmPassword: true
    })

    if (!newPasswordValid) {
      setLocalError('Please satisfy all password requirements.')
      return
    }

    if (!passwordsMatch) {
      setLocalError('New password and confirm password must match.')
      return
    }

    setActionLoading(true)

    try {
      const res = await dispatch(
        resetPassword({
          email: email.trim(),
          newPassword,
          confirmPassword
        })
      ).unwrap()

      setSuccessMessage(res?.message || 'Password reset successfully.')

      setTimeout(() => {
        setStep(STEPS.LOGIN)

        setPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setOtp('')

        resetTouched()
        setSuccessMessage('')
      }, 1400)
    } catch (error) {
      setLocalError(error || 'Unable to reset password.')
    } finally {
      setActionLoading(false)
    }
  }

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const openForgotPassword = () => {
    clearMessages()
    resetTouched()
    setStep(STEPS.EMAIL)
  }

  const goBack = () => {
    clearMessages()
    resetTouched()

    if (step === STEPS.EMAIL) {
      setStep(STEPS.LOGIN)
      return
    }

    if (step === STEPS.OTP) {
      setStep(STEPS.EMAIL)
      return
    }

    if (step === STEPS.RESET) {
      setStep(STEPS.OTP)
    }
  }

  /* =======================================================
     HEADER
  ======================================================= */

  const headerData = {
    login: {
      eyebrow: 'SECURE ACCESS',
      title: 'Welcome back',
      description: 'Sign in to access your logistics optimization dashboard.'
    },

    email: {
      eyebrow: 'ACCOUNT RECOVERY',
      title: 'Reset your password',
      description:
        'Enter your registered email and we’ll send you a verification code.'
    },

    otp: {
      eyebrow: 'VERIFY EMAIL',
      title: 'Check your email',
      description: `Enter the 6-digit code sent to ${email}.`
    },

    reset: {
      eyebrow: 'SECURE YOUR ACCOUNT',
      title: 'Create a new password',
      description:
        'Choose a strong password to keep your RouteMin account secure.'
    }
  }

  const currentHeader = headerData[step]

  const displayedError = localError || serverError

  /* =======================================================
     RENDER
  ======================================================= */

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
            scale: 0.98,
            y: 16
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
          }}
          className='
          relative
          flex
          w-full
          max-w-[1040px]
          max-h-[calc(100vh-100px)]
          overflow-hidden
          rounded-[24px]
          border
          border-slate-200/80
          bg-white
          shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)]
        '
        >
          {/* =================================================
            LEFT IMAGE
        ================================================== */}

          <div
            className='
            relative
            hidden
            w-[48%]
            overflow-hidden
            bg-slate-100
            lg:flex
            lg:items-center
            lg:justify-center
          '
          >
            <img
              src={LoginImg}
              alt='RouteMin transportation optimization'
              draggable='false'
              className='
              h-full
              w-full
              object-cover
              object-center
              select-none
            '
            />
          </div>

          {/* =================================================
            RIGHT AUTH
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
            {/* Form area */}

            <div
              className='
              flex
              flex-1
              items-center
              px-6
              py-6
              sm:px-10
              lg:px-12
              xl:px-14
            '
            >
              <div className='mx-auto w-full max-w-[470px]'>
                {/* Back */}

                {step !== STEPS.LOGIN && (
                  <button
                    type='button'
                    onClick={goBack}
                    className='
                    mb-7
                    inline-flex
                    items-center
                    gap-1.5
                    text-xs
                    font-semibold
                    text-slate-400
                    transition-colors
                    hover:text-slate-800
                  '
                  >
                    <ArrowLeft size={15} />
                    Back
                  </button>
                )}

                {/* Header */}

                <AnimatePresence mode='wait'>
                  <motion.div
                    key={step}
                    initial={{
                      opacity: 0,
                      y: 8
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
                      duration: 0.22
                    }}
                  >
                    <div className='mb-3 flex items-center gap-2'>
                      <div
                        className='
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-50
                        text-blue-600
                      '
                      >
                        {step === STEPS.OTP ? (
                          <Envelope size={17} weight='duotone' />
                        ) : step === STEPS.RESET ? (
                          <LockKey size={17} weight='duotone' />
                        ) : (
                          <ShieldCheck size={17} weight='duotone' />
                        )}
                      </div>

                      <span className='text-[10px] font-bold tracking-[0.16em] text-blue-600'>
                        {currentHeader.eyebrow}
                      </span>
                    </div>

                    <h2
                      className='
                      text-[28px]
                      font-extrabold
                      tracking-[-0.035em]
                      text-slate-950
                      sm:text-[32px]
                    '
                    >
                      {currentHeader.title}
                    </h2>

                    <p className='mt-2 max-w-md text-xs leading-5 text-slate-500 sm:text-sm'>
                      {currentHeader.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Recovery Progress */}

                {step !== STEPS.LOGIN && (
                  <div className='mt-7'>
                    <RecoveryProgress step={step} />
                  </div>
                )}

                {/* Forms */}

                <div className='mt-8'>
                  <AnimatePresence mode='wait' initial={false}>
                    {/* ================= LOGIN ================= */}

                    {step === STEPS.LOGIN && (
                      <motion.form
                        key='login'
                        initial={{
                          opacity: 0,
                          x: 12
                        }}
                        animate={{
                          opacity: 1,
                          x: 0
                        }}
                        exit={{
                          opacity: 0,
                          x: -12
                        }}
                        transition={{
                          duration: 0.25
                        }}
                        onSubmit={handleLogin}
                        noValidate
                        className='space-y-5'
                      >
                        <Field
                          label='Email'
                          type='email'
                          value={email}
                          placeholder='name@company.com'
                          error={touched.email && !isEmailValid}
                          errorText='Enter a valid email address.'
                          onChange={event => {
                            setEmail(event.target.value)
                            setLocalError('')
                            dispatch(clearError())
                          }}
                          onBlur={() => markTouched('email')}
                        />

                        <PasswordField
                          label='Password'
                          value={password}
                          show={showPassword}
                          onToggle={() =>
                            setShowPassword(previous => !previous)
                          }
                          placeholder='Enter your password'
                          error={touched.password && !loginPasswordValid}
                          onChange={event => {
                            setPassword(event.target.value)
                            setLocalError('')
                            dispatch(clearError())
                          }}
                          onBlur={() => markTouched('password')}
                        />

                        {touched.password && !loginPasswordValid && (
                          <p className='-mt-3 text-[11px] text-rose-600'>
                            Password must contain at least 8 characters.
                          </p>
                        )}

                        {/* Forgot Password */}

                        <div className='-mt-1 flex justify-end'>
                          <button
                            type='button'
                            onClick={openForgotPassword}
                            className='
                            text-xs
                            font-semibold
                            text-blue-600
                            transition-colors
                            hover:text-blue-700
                          '
                          >
                            Forgot password?
                          </button>
                        </div>

                        <Feedback
                          error={displayedError}
                          success={successMessage}
                        />
                        {signupSuccess && (
                          <div className='text-green-500 text-lg text-center'>
                            Account created successfully! Please log in.
                          </div>
                        )}

                        <PrimaryButton loading={authLoading}>
                          Login
                        </PrimaryButton>

                        <p className='pt-2 text-center text-xs text-slate-500'>
                          Don't have an account?{' '}
                          <button
                            type='button'
                            onClick={() => navigate('/signup')}
                            className='
                            font-bold
                            text-blue-600
                            hover:text-blue-700
                            hover:underline
                          '
                          >
                            Sign up
                          </button>
                        </p>
                      </motion.form>
                    )}

                    {/* ================= EMAIL ================= */}

                    {step === STEPS.EMAIL && (
                      <motion.form
                        key='email'
                        initial={{
                          opacity: 0,
                          x: 12
                        }}
                        animate={{
                          opacity: 1,
                          x: 0
                        }}
                        exit={{
                          opacity: 0,
                          x: -12
                        }}
                        transition={{
                          duration: 0.25
                        }}
                        onSubmit={handleForgotPassword}
                        noValidate
                        className='space-y-5'
                      >
                        <Field
                          label='Email address'
                          type='email'
                          value={email}
                          placeholder='name@company.com'
                          error={touched.email && !isEmailValid}
                          errorText='Enter a valid email address.'
                          onChange={event => {
                            setEmail(event.target.value)
                            setLocalError('')
                            dispatch(clearError())
                          }}
                          onBlur={() => markTouched('email')}
                        />

                        <Feedback
                          error={displayedError}
                          success={successMessage}
                        />

                        <PrimaryButton loading={actionLoading}>
                          Send verification code
                        </PrimaryButton>

                        <div className='flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400'>
                          <ShieldCheck size={14} />
                          <span>
                            A secure verification code will be sent to your
                            email.
                          </span>
                        </div>
                      </motion.form>
                    )}

                    {/* ================= OTP ================= */}

                    {step === STEPS.OTP && (
                      <motion.form
                        key='otp'
                        initial={{
                          opacity: 0,
                          x: 12
                        }}
                        animate={{
                          opacity: 1,
                          x: 0
                        }}
                        exit={{
                          opacity: 0,
                          x: -12
                        }}
                        transition={{
                          duration: 0.25
                        }}
                        onSubmit={handleVerifyOtp}
                        noValidate
                        className='space-y-5'
                      >
                        <div>
                          <label className='mb-2 block text-xs font-semibold text-slate-700'>
                            Verification code
                          </label>

                          <input
                            type='text'
                            inputMode='numeric'
                            autoComplete='one-time-code'
                            maxLength={6}
                            value={otp}
                            onChange={event => {
                              const value = event.target.value.replace(
                                /\D/g,
                                ''
                              )

                              setOtp(value)
                              setLocalError('')
                            }}
                            onBlur={() => markTouched('otp')}
                            placeholder='000000'
                            className={`
                            h-14
                            w-full
                            rounded-xl
                            border
                            bg-slate-50
                            px-4
                            text-center
                            text-xl
                            font-bold
                            tracking-[0.45em]
                            text-slate-900
                            outline-none
                            transition-all
                            placeholder:text-slate-300
                            ${touched.otp && !isOtpValid
                                ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                                : 'border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10'
                              }
                          `}
                          />

                          {touched.otp && !isOtpValid && (
                            <p className='mt-1.5 text-[11px] text-rose-600'>
                              Enter all 6 digits.
                            </p>
                          )}
                        </div>

                        <Feedback
                          error={displayedError}
                          success={successMessage}
                        />

                        <PrimaryButton loading={actionLoading}>
                          Verify code
                        </PrimaryButton>

                        <div className='text-center'>
                          <p className='text-[11px] text-slate-400'>
                            Didn't receive the code?
                          </p>

                          <button
                            type='button'
                            disabled={resendTimer > 0 || actionLoading}
                            onClick={handleResendOtp}
                            className='
                            mt-1
                            text-xs
                            font-semibold
                            text-blue-600
                            transition-colors
                            hover:text-blue-700
                            disabled:cursor-not-allowed
                            disabled:text-slate-400
                          '
                          >
                            {resendTimer > 0
                              ? `Resend in ${resendTimer}s`
                              : 'Resend code'}
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* ================= RESET ================= */}

                    {step === STEPS.RESET && (
                      <motion.form
                        key='reset'
                        initial={{
                          opacity: 0,
                          x: 12
                        }}
                        animate={{
                          opacity: 1,
                          x: 0
                        }}
                        exit={{
                          opacity: 0,
                          x: -12
                        }}
                        transition={{
                          duration: 0.25
                        }}
                        onSubmit={handleResetPassword}
                        noValidate
                        className='space-y-5'
                      >
                        <PasswordField
                          label='New password'
                          value={newPassword}
                          show={showNewPassword}
                          onToggle={() =>
                            setShowNewPassword(previous => !previous)
                          }
                          placeholder='Create a strong password'
                          error={touched.newPassword && !newPasswordValid}
                          onChange={event => {
                            setNewPassword(event.target.value)
                            setLocalError('')
                          }}
                          onBlur={() => markTouched('newPassword')}
                        />

                        <PasswordRequirements
                          password={newPassword}
                          validation={passwordValidation}
                          strength={passwordStrength}
                        />

                        <PasswordField
                          label='Confirm password'
                          value={confirmPassword}
                          show={showConfirmPassword}
                          onToggle={() =>
                            setShowConfirmPassword(previous => !previous)
                          }
                          placeholder='Repeat your password'
                          error={touched.confirmPassword && !passwordsMatch}
                          onChange={event => {
                            setConfirmPassword(event.target.value)
                            setLocalError('')
                          }}
                          onBlur={() => markTouched('confirmPassword')}
                        />

                        {touched.confirmPassword &&
                          confirmPassword &&
                          !passwordsMatch && (
                            <p className='-mt-3 text-[11px] text-rose-600'>
                              Passwords do not match.
                            </p>
                          )}

                        {touched.confirmPassword && passwordsMatch && (
                          <p className='-mt-3 flex items-center gap-1 text-[11px] font-medium text-emerald-600'>
                            <CheckCircle size={13} weight='fill' />
                            Passwords match.
                          </p>
                        )}

                        <Feedback
                          error={displayedError}
                          success={successMessage}
                        />

                        <PrimaryButton loading={actionLoading}>
                          Reset password
                        </PrimaryButton>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className='border-t border-slate-100 px-6 py-4 text-center'>
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

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  type,
  value,
  placeholder,
  error,
  errorText,
  onChange,
  onBlur
}) {
  return (
    <div>
      <label className='mb-2 block text-xs font-semibold text-slate-700'>
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={type === 'email' ? 'email' : undefined}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          h-11
          w-full
          rounded-xl
          border
          bg-slate-50
          px-3.5
          text-xs
          text-slate-900
          outline-none
          transition-all
          placeholder:text-slate-400
          ${error
            ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10'
            : 'border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10'
          }
        `}
      />

      {error && errorText && (
        <p className='mt-1.5 text-[11px] text-rose-600'>{errorText}</p>
      )}
    </div>
  )
}

/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  value,
  show,
  onToggle,
  placeholder,
  error,
  onChange,
  onBlur
}) {
  return (
    <div>
      <label className='mb-2 block text-xs font-semibold text-slate-700'>
        {label}
      </label>

      <div className='relative'>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          className={`
            h-11
            w-full
            rounded-xl
            border
            bg-slate-50
            px-3.5
            pr-11
            text-xs
            text-slate-900
            outline-none
            transition-all
            placeholder:text-slate-400
            ${error
              ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10'
              : 'border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10'
            }
          `}
        />

        <button
          type='button'
          onClick={onToggle}
          className='
            absolute
            right-3
            top-1/2
            flex
            -translate-y-1/2
            items-center
            justify-center
            text-slate-400
            transition-colors
            hover:text-slate-700
          '
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeSlash size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  )
}

/* =========================================================
   PASSWORD REQUIREMENTS
========================================================= */

function PasswordRequirements({ password, validation, strength }) {
  return (
    <div className='-mt-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3'>
      <div className='mb-2 flex items-center justify-between'>
        <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
          Password requirements
        </p>

        {password && (
          <span
            className={`text-[10px] font-bold ${strength.label === 'Strong'
                ? 'text-emerald-600'
                : strength.label === 'Good'
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
          >
            {strength.label}
          </span>
        )}
      </div>

      <div className='grid grid-cols-1 gap-1.5 sm:grid-cols-2'>
        {passwordRules.map(rule => (
          <Requirement
            key={rule.key}
            valid={password ? Boolean(validation[rule.key]) : false}
            label={rule.label}
          />
        ))}
      </div>
    </div>
  )
}

function Requirement({ valid, label }) {
  return (
    <div
      className={`
        flex
        items-center
        gap-1.5
        text-[10px]
        font-medium
        transition-colors
        ${valid ? 'text-emerald-600' : 'text-slate-400'}
      `}
    >
      <span
        className={`
          flex
          h-4
          w-4
          shrink-0
          items-center
          justify-center
          rounded-full
          ${valid ? 'bg-emerald-100' : 'bg-slate-200'}
        `}
      >
        {valid ? (
          <Check size={10} weight='bold' />
        ) : (
          <span className='h-1 w-1 rounded-full bg-slate-400' />
        )}
      </span>

      {label}
    </div>
  )
}

/* =========================================================
   RECOVERY PROGRESS
========================================================= */

function RecoveryProgress({ step }) {
  const current = step === STEPS.EMAIL ? 1 : step === STEPS.OTP ? 2 : 3

  return (
    <div className='flex items-center gap-2'>
      {[1, 2, 3].map((item, index) => (
        <React.Fragment key={item}>
          <div className='flex items-center gap-1.5'>
            <div
              className={`
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                text-[9px]
                font-bold
                transition-all
                ${item <= current
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-400'
                }
              `}
            >
              {item < current ? <Check size={11} weight='bold' /> : item}
            </div>

            <span
              className={`
                hidden
                text-[9px]
                font-semibold
                sm:block
                ${item <= current ? 'text-blue-600' : 'text-slate-400'}
              `}
            >
              {item === 1 ? 'Email' : item === 2 ? 'Verify' : 'Reset'}
            </span>
          </div>

          {index < 2 && (
            <div
              className={`
                h-px
                flex-1
                transition-colors
                ${item < current ? 'bg-blue-600' : 'bg-slate-200'}
              `}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

/* =========================================================
   FEEDBACK
========================================================= */

function Feedback({ error, success }) {
  if (!error && !success) return null

  if (error) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: -4
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className='
          flex
          items-start
          gap-2
          rounded-xl
          border
          border-rose-200
          bg-rose-50
          px-3
          py-2.5
          text-xs
          font-medium
          text-rose-700
        '
      >
        <WarningCircle size={16} weight='fill' className='mt-0.5 shrink-0' />

        <span>{error}</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -4
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className='
        flex
        items-start
        gap-2
        rounded-xl
        border
        border-emerald-200
        bg-emerald-50
        px-3
        py-2.5
        text-xs
        font-medium
        text-emerald-700
      '
    >
      <CheckCircle size={16} weight='fill' className='mt-0.5 shrink-0' />

      <span>{success}</span>
    </motion.div>
  )
}

/* =========================================================
   PRIMARY BUTTON
========================================================= */

function PrimaryButton({ children, loading }) {
  return (
    <button
      type='submit'
      disabled={loading}
      className='
        flex
        h-11
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-blue-600
        text-xs
        font-bold
        text-white
        shadow-[0_8px_24px_rgba(37,99,235,0.20)]
        transition-all
        duration-200
        hover:bg-blue-700
        hover:shadow-[0_10px_28px_rgba(37,99,235,0.25)]
        active:scale-[0.99]
        disabled:cursor-not-allowed
        disabled:opacity-60
      '
    >
      {loading && (
        <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white' />
      )}

      {loading ? 'Please wait...' : children}
    </button>
  )
}

export default Login
