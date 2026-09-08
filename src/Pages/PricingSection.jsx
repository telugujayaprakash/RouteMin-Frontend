import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CheckCircleIcon,
  LightningIcon,
  CrownIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  StackIcon,
  CalendarIcon,
  CoinsIcon,
  CheckIcon
} from '@phosphor-icons/react'

import {
  createPayment,
  verifyPayment,
  clearPaymentError
} from '../Redux/Payments/PaymentSlice'

import { fetchCurrentUser } from '../Redux/Auth/AuthSlice'

function PricingSection() {
  const dispatch = useDispatch()

  const user = useSelector(state => state.Auth?.user)

  const { isCreating, isVerifying, error } = useSelector(
    state => state.Payment || {}
  )

  const [loadingPlan, setLoadingPlan] = useState(null)

  // =========================================================
  // FETCH CURRENT USER
  // =========================================================

  useEffect(() => {
    dispatch(fetchCurrentUser(user.userId))
  }, [dispatch])

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const today = useMemo(() => {
    const date = new Date()

    date.setHours(0, 0, 0, 0)

    return date
  }, [])

  const isDateActive = dateString => {
    if (!dateString) return false

    const date = new Date(`${dateString}T23:59:59`)

    return date >= today
  }

  const formatDate = dateString => {
    if (!dateString) return '—'

    const date = new Date(`${dateString}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
      return dateString
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // =========================================================
  // CURRENT SUBSCRIPTION STATE
  // =========================================================

  const isPremiumActive =
    user?.planType === 'PREMIUM' &&
    user?.subscriptionStatus === 'ACTIVE' &&
    isDateActive(user?.subscriptionEndDate)

  const isTopUpActive =
    user?.topUpActive === true && isDateActive(user?.topUpEndDate)

  const isFreePlan = !user?.planType || user?.planType === 'FREE'

  // =========================================================
  // PLANS
  // =========================================================

  const plans = [
    {
      id: 'FREE',
      plan: 'FREE',
      name: 'Free',
      description: 'Get started with essential transportation optimization.',
      price: 0,
      period: 'forever',
      icon: StackIcon,
      color: 'blue',

      features: [
        '5 optimization runs / month',
        'Least Cost Method (LCM)',
        'North-West Corner Rule (NWCR)',
        'Factory & warehouse management',
        'Optimization history',
        'Basic reports'
      ],

      button: isFreePlan ? 'Current Plan' : 'Free Plan',

      disabled: true
    },

    {
      id: 'SUBSCRIPTION',
      plan: 'SUBSCRIPTION',
      name: 'Premium',
      description: 'For teams that need more optimization capacity.',
      price: 499,
      period: '/ year',
      icon: CrownIcon,
      color: 'purple',
      popular: true,

      features: [
        '30 optimization runs / month',
        'Least Cost Method (LCM)',
        'North-West Corner Rule (NWCR)',
        "Vogel's Approximation Method (VAM)",
        'Optimization history',
        'Detailed reports',
        'Priority optimization capacity'
      ],

      button: isPremiumActive ? 'Current Plan' : 'Upgrade to Premium',

      disabled: isPremiumActive
    },

    {
      id: 'TOP_UP',
      plan: 'TOP_UP',
      name: 'Top Up',
      description: 'Need more runs? Add another block whenever you need.',
      price: 99,
      period: '/ 30 runs',
      icon: PlusCircleIcon,
      color: 'emerald',

      features: [
        '+30 optimization runs',
        'Use with your current plan',
        'No monthly commitment',
        'Available whenever required',
        'Runs added after successful payment'
      ],

      button: isTopUpActive ? 'Top Up Active' : 'Buy 30 Runs',

      /*
       * Top-up should only be available to a Premium user.
       * Once a top-up is already active, disable it.
       */
      disabled: !isPremiumActive || isTopUpActive
    }
  ]

  // =========================================================
  // VERIFY PAYMENT
  // =========================================================

  const handleVerifyPayment = async (razorpayResponse, payment) => {
    try {
      console.log('Verifying payment:', razorpayResponse)

      await dispatch(
        verifyPayment({
          paymentId: payment.paymentId,

          plan: payment.plan,

          razorpayPaymentId: razorpayResponse.razorpay_payment_id,

          razorpayOrderId: razorpayResponse.razorpay_order_id,

          razorpaySignature: razorpayResponse.razorpay_signature
        })
      ).unwrap()

      console.log('Payment verified successfully.')
      await dispatch(fetchCurrentUser(user.userId)).unwrap()

      console.log('Current user refreshed after payment.')

      setLoadingPlan(null)
    } catch (error) {
      console.error('Payment verification failed:', error)

      setLoadingPlan(null)
    }
  }

  // CREATE PAYMENT
  const handlePayment = async plan => {
    if (plan.disabled || plan.price === 0) {
      return
    }

    try {
      dispatch(clearPaymentError())

      setLoadingPlan(plan.id)

      console.log('Creating payment for:', plan.plan)

      // =====================================================
      // CREATE PAYMENT
      // =====================================================

      const payment = await dispatch(createPayment(plan.plan)).unwrap()

      console.log('Payment created:', payment)

      if (!payment?.orderId) {
        throw new Error('Razorpay order ID was not created.')
      }
      if (!window.Razorpay) {
        throw new Error('Razorpay Checkout failed to load.')
      }
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID

      if (!razorpayKey) {
        throw new Error('Razorpay Key ID is missing.')
      }
      const options = {
        key: razorpayKey,

        amount: Math.round(Number(payment.totalAmount) * 100),

        currency: payment.currency || 'INR',

        name: 'RouteMin',

        description:
          payment.plan === 'SUBSCRIPTION'
            ? 'RouteMin Premium Plan'
            : 'RouteMin Extra Runs',

        order_id: payment.orderId,

        prefill: {
          name: user?.fullName || '',
          email: user?.email || ''
        },

        theme: {
          color: '#2563EB'
        },

        handler: async razorpayResponse => {
          await handleVerifyPayment(razorpayResponse, payment)
        },

        modal: {
          confirm_close: true,

          animation: true,

          ondismiss: () => {
            console.log('Razorpay checkout closed.')

            setLoadingPlan(null)
          }
        }
      }

      // =====================================================
      // OPEN RAZORPAY
      // =====================================================

      const razorpay = new window.Razorpay(options)

      razorpay.on('payment.failed', response => {
        console.error('Razorpay payment failed:', response.error)

        setLoadingPlan(null)
      })

      razorpay.open()
    } catch (error) {
      console.error('Payment creation failed:', error)

      setLoadingPlan(null)
    }
  }

  // =========================================================
  // COLOR SYSTEM
  // =========================================================

  const colorStyles = {
    blue: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      softBg: 'bg-blue-50/60',
      border: 'border-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700',
      ring: 'ring-blue-500/10'
    },

    purple: {
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      softBg: 'bg-purple-50/60',
      border: 'border-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700',
      ring: 'ring-purple-500/10'
    },

    emerald: {
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      softBg: 'bg-emerald-50/60',
      border: 'border-emerald-100',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      ring: 'ring-emerald-500/10'
    }
  }

  return (
    <main className='min-h-screen bg-slate-50 px-5 py-12 text-slate-900 sm:px-8 lg:px-12'>
      <div className='mx-auto max-w-7xl'>
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className='mx-auto max-w-3xl text-center'>
          <span className='inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600'>
            <LightningIcon size={15} weight='fill' />
            Choose the right plan for you
          </span>
        </div>

        {/* PAYMENT ERROR */}

        {error && (
          <div className='mx-auto mt-8 flex max-w-2xl items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700'>
            <span>{error}</span>

            <button
              type='button'
              onClick={() => dispatch(clearPaymentError())}
              className='shrink-0 font-semibold hover:text-red-900'
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ==================================================
            PRICING CARDS
        ================================================== */}

        <section className='mt-12 grid gap-6 lg:grid-cols-3'>
          {plans.map(plan => {
            const Icon = plan.icon
            const styles = colorStyles[plan.color]

            const isLoading =
              loadingPlan === plan.id && (isCreating || isVerifying)

            const isCurrentPremium =
              plan.id === 'SUBSCRIPTION' && isPremiumActive

            const isCurrentTopUp = plan.id === 'TOP_UP' && isTopUpActive

            const isTopUpUnavailable = plan.id === 'TOP_UP' && !isPremiumActive

            return (
              <div
                key={plan.id}
                className={`
                  group relative flex flex-col
                  overflow-hidden rounded-3xl
                  border
                  ${styles.border}
                  ${styles.softBg}
                  p-7

                  shadow-sm

                  transition-all
                  duration-500
                  ease-out

                  hover:-translate-y-1
                  hover:shadow-xl

                  ${plan.popular
                    ? 'ring-2 ring-purple-500/10 lg:-translate-y-2'
                    : ''
                  }

                  ${plan.disabled ? 'opacity-[0.88]' : ''}
                `}
              >
                {/* ==========================================
                    CURRENT PLAN / POPULAR BADGE
                ========================================== */}

                <div className='absolute right-5 top-5 flex flex-col items-end gap-2'>
                  {plan.popular && !isCurrentPremium && (
                    <span className='rounded-full bg-purple-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white'>
                      Most Popular
                    </span>
                  )}

                  {isCurrentPremium && (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm'>
                      <CheckIcon size={12} weight='bold' />
                      Current Plan
                    </span>
                  )}

                  {isCurrentTopUp && (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm'>
                      <CheckIcon size={12} weight='bold' />
                      Active
                    </span>
                  )}
                </div>

                {/* ==========================================
                    ICON
                ========================================== */}

                <div
                  className={`
                    flex h-14 w-14 items-center
                    justify-center rounded-2xl
                    ${styles.iconBg}

                    transition-transform
                    duration-500

                    group-hover:scale-105
                  `}
                >
                  <Icon
                    size={30}
                    weight='duotone'
                    className={styles.iconColor}
                  />
                </div>

                {/* ==========================================
                    NAME
                ========================================== */}

                <div className='mt-7'>
                  <h2 className='text-xl font-bold text-slate-900'>
                    {plan.name}
                  </h2>

                  <p className='mt-2 min-h-[48px] text-sm leading-6 text-slate-500'>
                    {plan.description}
                  </p>
                </div>

                {/* ==========================================
                    PRICE
                ========================================== */}

                <div className='mt-7 flex items-end gap-2'>
                  <span className='text-4xl font-bold tracking-tight text-slate-900'>
                    ₹{plan.price}
                  </span>

                  <span className='mb-1 text-xs font-medium text-slate-400'>
                    {plan.period}
                  </span>
                </div>

                {/* ==========================================
                    CURRENT SUBSCRIPTION INFO
                ========================================== */}

                {isCurrentPremium && (
                  <div className='mt-6 overflow-hidden rounded-2xl border border-purple-100 bg-white/80'>
                    <div className='border-b border-purple-100 bg-purple-50/60 px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <CalendarIcon
                          size={17}
                          weight='duotone'
                          className='text-purple-600'
                        />

                        <p className='text-xs font-bold text-purple-800'>
                          Your Premium subscription
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-px bg-purple-100'>
                      <DateBlock
                        label='Started'
                        value={formatDate(user.subscriptionStartDate)}
                      />

                      <DateBlock
                        label='Renews / Ends'
                        value={formatDate(user.subscriptionEndDate)}
                      />
                    </div>
                  </div>
                )}

                {/* ==========================================
                    TOP UP STATUS
                ========================================== */}

                {plan.id === 'TOP_UP' && isTopUpActive && (
                  <div className='mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-white/80'>
                    <div className='border-b border-emerald-100 bg-emerald-50/60 px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <CalendarIcon
                          size={17}
                          weight='duotone'
                          className='text-emerald-600'
                        />

                        <p className='text-xs font-bold text-emerald-800'>
                          Active top-up period
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-px bg-emerald-100'>
                      <DateBlock
                        label='Started'
                        value={formatDate(user.topUpStartDate)}
                      />

                      <DateBlock
                        label='Ends'
                        value={formatDate(user.topUpEndDate)}
                      />
                    </div>

                    <div className='flex items-center justify-between border-t border-emerald-100 px-4 py-3'>
                      <span className='text-[11px] text-slate-500'>
                        Extra credits
                      </span>

                      <span className='text-sm font-bold text-emerald-700'>
                        +{user.extraCredits ?? 0}
                      </span>
                    </div>
                  </div>
                )}

                {/* ==========================================
                    TOP UP REQUIRES PREMIUM
                ========================================== */}

                {isTopUpUnavailable && (
                  <div className='mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4'>
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500'>
                      <CrownIcon size={17} weight='duotone' />
                    </div>

                    <div>
                      <p className='text-xs font-bold text-slate-800'>
                        Premium required
                      </p>

                      <p className='mt-1 text-[11px] leading-5 text-slate-500'>
                        Activate Premium before purchasing additional
                        optimization credits.
                      </p>
                    </div>
                  </div>
                )}

                {/* ==========================================
                    RUN HIGHLIGHT
                ========================================== */}

                {!isCurrentPremium && !isCurrentTopUp && !isTopUpUnavailable && (
                  <div className='mt-6 rounded-2xl border border-white/80 bg-white/70 p-4'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`
                            rounded-xl p-2
                            ${styles.iconBg}
                          `}
                      >
                        <LightningIcon
                          size={18}
                          weight='fill'
                          className={styles.iconColor}
                        />
                      </div>

                      <div>
                        <p className='text-sm font-bold text-slate-900'>
                          {plan.id === 'FREE' && '5 runs'}

                          {plan.id === 'SUBSCRIPTION' && '30 runs'}

                          {plan.id === 'TOP_UP' && '+30 runs'}
                        </p>

                        <p className='text-[11px] text-slate-500'>
                          {plan.id === 'TOP_UP'
                            ? 'Added to your available capacity'
                            : 'Optimization capacity'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==========================================
                    FEATURES
                ========================================== */}

                <div className='mt-7 flex-1'>
                  <p className='text-[11px] font-bold uppercase tracking-wider text-slate-400'>
                    Includes
                  </p>

                  <ul className='mt-4 space-y-3'>
                    {plan.features.map(feature => (
                      <li
                        key={feature}
                        className='flex items-start gap-3 text-sm text-slate-600'
                      >
                        <CheckCircleIcon
                          size={19}
                          weight='fill'
                          className={`
                              mt-0.5 shrink-0
                              ${styles.iconColor}
                            `}
                        />

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ==========================================
                    BUTTON
                ========================================== */}

                <button
                  type='button'
                  disabled={plan.disabled || isLoading}
                  onClick={() => handlePayment(plan)}
                  className={`
                    mt-8 flex h-12 w-full
                    items-center justify-center
                    gap-2 rounded-xl
                    text-sm font-semibold

                    transition-all
                    duration-300

                    ${isCurrentPremium || isCurrentTopUp
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : plan.id === 'SUBSCRIPTION'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : plan.id === 'TOP_UP'
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }

                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  `}
                >
                  {isLoading ? (
                    <>
                      <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />

                      {isVerifying
                        ? 'Verifying Payment...'
                        : 'Opening Payment...'}
                    </>
                  ) : isCurrentPremium || isCurrentTopUp ? (
                    <>
                      <CheckIcon size={17} weight='bold' />

                      {plan.button}
                    </>
                  ) : isTopUpUnavailable ? (
                    <>Premium Required</>
                  ) : (
                    <>
                      {plan.button}

                      {plan.id !== 'FREE' && <ArrowRightIcon size={17} />}
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </section>

        {/* ==================================================
            SECURITY
        ================================================== */}

        <div className='mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 text-center sm:flex-row'>
          <ShieldCheckIcon
            size={21}
            weight='duotone'
            className='text-emerald-600'
          />

          <p className='text-xs text-slate-500'>
            Payments are securely processed through Razorpay.
          </p>
        </div>
      </div>
    </main>
  )
}

// =============================================================
// DATE BLOCK
// =============================================================

function DateBlock({ label, value }) {
  return (
    <div className='bg-white px-4 py-3'>
      <p className='text-[9px] font-bold uppercase tracking-wider text-slate-400'>
        {label}
      </p>

      <p className='mt-1 text-xs font-bold text-slate-800'>{value}</p>
    </div>
  )
}

export default PricingSection
