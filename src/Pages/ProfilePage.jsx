import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  User,
  EnvelopeSimple,
  LockKey,
  Key,
  Eye,
  EyeSlash,
  CheckCircle,
  WarningCircle,
  PaperPlaneRight,
  CreditCard,
  Phone
} from '@phosphor-icons/react'
import InvoiceTable from '../Components/InvoiceTable'
import {
  forgotPassword,
  verifyOtp,
  resetPassword
} from '../Redux/Auth/AuthSlice'
import profileBanner from '../Assets/profileBanner.png'

function ProfilePage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.Auth?.user)

  // Interactive Tabs
  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'security', 'billing'

  // Copied State
  const [copiedEmail, setCopiedEmail] = useState(false)

  // Active Password Mode
  const [passwordMode, setPasswordMode] = useState('direct') // 'direct' or 'otp'

  // Direct Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)

  // OTP Password Form State
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpNewPassword, setOtpNewPassword] = useState('')
  const [otpConfirmPassword, setOtpConfirmPassword] = useState('')

  // Notifications
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const isFree = String(user?.planType || '').toUpperCase() === 'FREE'

  // Clear message after 4s
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 4000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // Copy Email Handler
  const handleCopyEmail = () => {
    const emailToCopy = user?.email || 'user@routemin.com'
    navigator.clipboard.writeText(emailToCopy)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  // Password Strength Meter
  const getPasswordStrength = pass => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' }
    let score = 0
    if (pass.length >= 6) score++
    if (pass.length >= 10) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' }
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' }
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-500' }
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' }
  }

  const passwordStrength = getPasswordStrength(newPassword || otpNewPassword)

  // Handle Direct Password Update
  const handleDirectPasswordChange = e => {
    e.preventDefault()

    if (!currentPassword) {
      setMessage({
        type: 'error',
        text: 'Please enter your current password to verify identity.'
      })
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'New password must be at least 6 characters long.'
      })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New password and confirm password do not match.'
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setMessage({
        type: 'success',
        text: 'Password successfully updated! Please use your new password next time.'
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 1000)
  }

  // Handle Sending OTP for Forgot Password
  const handleSendOtp = async () => {
    if (!user?.email) {
      setMessage({
        type: 'error',
        text: 'No registered email found for current user account.'
      })
      return
    }

    setLoading(true)
    try {
      const res = await dispatch(forgotPassword({ email: user.email })).unwrap()
      setOtpSent(true)
      setMessage({
        type: 'success',
        text: res?.message || `OTP sent successfully to ${user.email}.`
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error || 'Failed to send OTP to registered email.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP Password Reset
  const handleOtpResetPassword = async e => {
    e.preventDefault()

    if (!otpCode || otpCode.trim().length < 4) {
      setMessage({
        type: 'error',
        text: 'Please enter the valid OTP sent to your email.'
      })
      return
    }
    if (!otpNewPassword || otpNewPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'New password must be at least 6 characters long.'
      })
      return
    }
    if (otpNewPassword !== otpConfirmPassword) {
      setMessage({
        type: 'error',
        text: 'New password and confirm password do not match.'
      })
      return
    }

    setLoading(true)
    try {
      await dispatch(
        verifyOtp({ email: user?.email, otp: otpCode.trim() })
      ).unwrap()

      const res = await dispatch(
        resetPassword({
          email: user?.email,
          newPassword: otpNewPassword,
          confirmPassword: otpConfirmPassword
        })
      ).unwrap()

      setMessage({
        type: 'success',
        text:
          res?.message || 'Password successfully reset via OTP verification!'
      })
      setOtpCode('')
      setOtpNewPassword('')
      setOtpConfirmPassword('')
      setOtpSent(false)
      setPasswordMode('direct')
    } catch (error) {
      setMessage({
        type: 'error',
        text: error || 'Unable to reset password.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto text-slate-900 font-sans antialiased'>
      {/* =====================================================
          PAGE HEADER BANNER
      ===================================================== */}
      <div className='relative overflow-hidden rounded-3xl text-white shadow-md'>
        {/* Decorative Glow */}
        <img src={profileBanner} alt='' />
      </div>

      {/* Alert Notification */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-xs transition-all ${
            message.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
          }`}
        >
          <div className='flex items-center gap-2.5'>
            {message.type === 'error' ? (
              <WarningCircle
                size={20}
                weight='fill'
                className='text-rose-600 shrink-0'
              />
            ) : (
              <CheckCircle
                size={20}
                weight='fill'
                className='text-emerald-600 shrink-0'
              />
            )}
            <span>{message.text}</span>
          </div>
          <button
            type='button'
            onClick={() => setMessage({ type: '', text: '' })}
            className='text-slate-400 hover:text-slate-600 text-base leading-none cursor-pointer'
          >
            ×
          </button>
        </div>
      )}

      {/* =====================================================
          INTERACTIVE TABS NAVIGATION
      ===================================================== */}
      <div className='flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto'>
        <button
          type='button'
          onClick={() => setActiveTab('profile')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User size={16} weight='duotone' />
          <span>Profile Overview</span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('security')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LockKey size={16} weight='duotone' />
          <span>Security & Credentials</span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('billing')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'billing'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard size={16} weight='duotone' />
          <span>Billing & Invoices</span>
        </button>
      </div>

      {/* =====================================================
          TAB 1: PROFILE OVERVIEW
      ===================================================== */}
      {activeTab === 'profile' && (
        <div className='grid gap-8 lg:grid-cols-12 items-start'>
          <div className='lg:col-span-8 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6'>
            <div className='pb-4 border-b border-slate-100'>
              <h3 className='text-lg font-extrabold text-slate-900 flex items-center gap-2'>
                <User size={20} className='text-blue-600' />
                <span>Personal Details</span>
              </h3>
              <p className='mt-0.5 text-xs text-slate-500 font-medium'>
                View your registered account credentials and contact details.
              </p>
            </div>

            <div className='grid gap-5 sm:grid-cols-2 text-xs'>
              {/* Full Name */}
              <div>
                <label className='block text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1.5'>
                  Full Name
                </label>
                <div className='flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 font-semibold'>
                  <User size={18} className='text-slate-400 shrink-0' />
                  <span>
                    {user?.fullName || user?.name || 'Authorized User'}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className='block text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1.5'>
                  Email Address{' '}
                  <span className='text-slate-400 font-normal'>(Primary)</span>
                </label>
                <div className='flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 font-mono font-medium'>
                  <EnvelopeSimple
                    size={18}
                    className='text-slate-400 shrink-0'
                  />
                  <span>{user?.email || 'user@routemin.com'}</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className='block text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1.5'>
                  Contact Phone
                </label>
                <div className='flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 font-semibold'>
                  <Phone size={18} className='text-slate-400 shrink-0' />
                  <span>
                    {user?.mobile || user?.phoneNo || '+91 98765 43210'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 2: SECURITY & CREDENTIALS
      ===================================================== */}
      {activeTab === 'security' && (
        <div className='max-w-3xl rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6'>
          <div className='flex items-center justify-between pb-4 border-b border-slate-100'>
            <div className='flex items-center gap-2'>
              <LockKey size={22} className='text-blue-600' weight='duotone' />
              <div>
                <h3 className='text-lg font-extrabold text-slate-900'>
                  Password & Security Settings
                </h3>
                <p className='text-xs text-slate-500 font-medium'>
                  Update your access credentials or perform OTP-based password
                  recovery.
                </p>
              </div>
            </div>

            {/* Toggle Mode */}
            <button
              type='button'
              onClick={() => {
                setPasswordMode(prev => (prev === 'direct' ? 'otp' : 'direct'))
                setMessage({ type: '', text: '' })
              }}
              className='text-xs font-extrabold text-blue-600 hover:text-blue-700 underline cursor-pointer bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100'
            >
              {passwordMode === 'direct'
                ? 'Forgot Password? (OTP Flow)'
                : 'Use Current Password'}
            </button>
          </div>

          {/* MODE 1: DIRECT PASSWORD CHANGE */}
          {passwordMode === 'direct' ? (
            <form
              onSubmit={handleDirectPasswordChange}
              className='space-y-4 text-xs'
            >
              {/* Current Password */}
              <div>
                <label className='block text-slate-700 font-bold mb-1.5'>
                  Current Password <span className='text-rose-500'>*</span>
                </label>
                <div className='relative'>
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder='Enter your current password'
                    className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all pr-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer'
                  >
                    {showCurrentPass ? (
                      <EyeSlash size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className='block text-slate-700 font-bold mb-1.5'>
                  New Password <span className='text-rose-500'>*</span>
                </label>
                <div className='relative'>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder='Enter new password (min. 6 characters)'
                    className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all pr-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowNewPass(!showNewPass)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer'
                  >
                    {showNewPass ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {newPassword && (
                  <div className='mt-2.5 space-y-1.5'>
                    <div className='flex items-center justify-between text-[11px] font-semibold text-slate-500'>
                      <span>Password Strength</span>
                      <span className='font-bold text-slate-700'>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className='h-1.5 w-full bg-slate-100 rounded-full overflow-hidden'>
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className='block text-slate-700 font-bold mb-1.5'>
                  Confirm New Password <span className='text-rose-500'>*</span>
                </label>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder='Re-type new password'
                  className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all'
                />
              </div>

              <div className='pt-3 flex items-center justify-between border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => setPasswordMode('otp')}
                  className='text-blue-600 hover:underline font-extrabold cursor-pointer'
                >
                  Forgot Password?
                </button>

                <button
                  type='submit'
                  disabled={loading}
                  className='inline-flex items-center justify-center gap-2 h-10 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50'
                >
                  <Key size={16} weight='bold' />
                  <span>{loading ? 'Verifying...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* MODE 2: OTP FLOW */
            <form
              onSubmit={handleOtpResetPassword}
              className='space-y-4 text-xs'
            >
              {!otpSent ? (
                <div className='p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3'>
                  <div className='flex items-center gap-2 text-blue-900 font-bold text-sm'>
                    <EnvelopeSimple size={20} className='text-blue-600' />
                    <span>Request OTP Verification Code</span>
                  </div>
                  <p className='text-xs text-slate-600 leading-relaxed'>
                    Click below to send a 6-digit verification OTP code to your
                    registered email address ({' '}
                    <strong className='text-slate-900 font-mono'>
                      {user?.email || 'your email'}
                    </strong>{' '}
                    ).
                  </p>
                  <button
                    type='button'
                    onClick={handleSendOtp}
                    disabled={loading}
                    className='inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50'
                  >
                    <PaperPlaneRight size={16} weight='bold' />
                    <span>{loading ? 'Sending...' : 'Send OTP to Email'}</span>
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className='block text-slate-700 font-bold mb-1.5'>
                      Enter 6-Digit OTP <span className='text-rose-500'>*</span>
                    </label>
                    <input
                      type='text'
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder='e.g. 849201'
                      className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-base tracking-widest focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all'
                    />
                  </div>

                  <div>
                    <label className='block text-slate-700 font-bold mb-1.5'>
                      New Password <span className='text-rose-500'>*</span>
                    </label>
                    <input
                      type='password'
                      value={otpNewPassword}
                      onChange={e => setOtpNewPassword(e.target.value)}
                      placeholder='Enter new password'
                      className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all'
                    />
                  </div>

                  <div>
                    <label className='block text-slate-700 font-bold mb-1.5'>
                      Confirm New Password{' '}
                      <span className='text-rose-500'>*</span>
                    </label>
                    <input
                      type='password'
                      value={otpConfirmPassword}
                      onChange={e => setOtpConfirmPassword(e.target.value)}
                      placeholder='Confirm new password'
                      className='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all'
                    />
                  </div>

                  <div className='pt-3 flex items-center justify-between border-t border-slate-100'>
                    <button
                      type='button'
                      onClick={handleSendOtp}
                      className='text-slate-500 hover:text-blue-600 font-semibold cursor-pointer'
                    >
                      Resend OTP
                    </button>

                    <button
                      type='submit'
                      disabled={loading}
                      className='inline-flex items-center justify-center gap-2 h-10 px-6 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50'
                    >
                      <CheckCircle size={16} weight='bold' />
                      <span>
                        {loading ? 'Resetting...' : 'Verify OTP & Reset'}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      )}

      {/* =====================================================
          TAB 3: BILLING & INVOICE HISTORY
      ===================================================== */}
      {activeTab === 'billing' && (
        <div className='space-y-6'>
          <div className='rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs'>
            <InvoiceTable />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
