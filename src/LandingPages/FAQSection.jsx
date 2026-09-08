import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretDownIcon, QuestionIcon } from '@phosphor-icons/react'

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: 'What is RouteMin?',
      a: 'RouteMin is a transportation optimization platform that helps plan cost-efficient shipments between factories and warehouses. It uses transportation costs, supply, demand, and route constraints to generate optimized shipment allocations.'
    },

    {
      q: 'Which algorithms does RouteMin support?',
      a: 'RouteMin supports three methods for generating the Initial Basic Feasible Solution: North-West Corner Rule (NWCR), Least Cost Method (LCM), and Vogel’s Approximation Method (VAM). After the initial solution is generated, RouteMin uses the MODI method to test and improve the solution toward minimum transportation cost.'
    },

    {
      q: 'Which algorithm should I choose?',
      a: 'VAM is the default algorithm in RouteMin because it generally produces a high-quality initial feasible solution by considering row and column penalties. NWCR is simple and fast but does not consider transportation costs, while LCM prioritizes lower-cost routes during allocation.'
    },

    {
      q: 'Does RouteMin support restricted routes?',
      a: 'Yes. You can mark specific factory-to-warehouse routes as restricted in the transportation cost matrix. Restricted routes are excluded from shipment allocation during optimization.'
    },

    {
      q: 'What happens when supply and demand are not equal?',
      a: 'RouteMin automatically balances the transportation problem before optimization. If total supply is greater than total demand, a dummy warehouse is created for the excess supply. If total demand is greater than total supply, a dummy factory is created for the excess demand.'
    },

    {
      q: 'How does RouteMin determine the optimal solution?',
      a: 'After generating the initial feasible solution, RouteMin uses the Modified Distribution Method (MODI). It calculates row and column potentials and opportunity costs. If an unallocated route has a negative opportunity cost, the allocation can be improved. The process continues until all opportunity costs satisfy the optimality condition.'
    },

    {
      q: 'Can I see the allocation details after optimization?',
      a: 'Yes. The results screen provides the shipment plan, total optimized transportation cost, savings, allocation details, route-level allocations, and cost analysis.'
    },

    {
      q: 'Can I download my optimization reports?',
      a: 'Yes. RouteMin provides transportation plan, cost analysis, and optimization summary reports. Reports can be exported in PDF and Excel formats.'
    },

    {
      q: 'Can I access previous optimization runs?',
      a: 'Yes. RouteMin maintains optimization run history, including the selected algorithm, execution details, costs, savings, status, and generated results.'
    }
  ]

  const toggleFAQ = index => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  return (
    <section
      id='faq'
      className='
        relative
        overflow-hidden
        border-b
        border-slate-200
        bg-white
        text-slate-950
      '
    >
      <div
        className='
          mx-auto
          max-w-[1100px]
          px-6
          py-20

          sm:px-8
          sm:py-24

          lg:px-12
          lg:py-28
        '
      >
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}
          className='mb-12 sm:mb-14'
        >
          <h2
            className="
              max-w-3xl
              text-[2.7rem]
              font-semibold
              leading-[0.98]
              tracking-[-0.045em]
              text-slate-950
              sm:text-[3.5rem] font-['Pacifico'] lg:text-[4.2rem]
            "
          >
            FAQ
          </h2>
        </motion.div>

        {/* =====================================================
            FAQ LIST
        ===================================================== */}

        <div className='border-t border-slate-200'>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                viewport={{
                  once: true,
                  amount: 0.2
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.03,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className='border-b border-slate-200'
              >
                {/* =================================================
                    QUESTION
                ================================================= */}

                <button
                  type='button'
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className='
                    group
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    justify-between
                    gap-6
                    py-6
                    text-left

                    sm:py-7
                  '
                >
                  <div className='flex min-w-0 items-start gap-5'>
                    {/* Number */}

                    <span
                      className={`
                        hidden
                        pt-1
                        font-mono
                        text-[10px]
                        font-bold
                        tracking-wider
                        transition-colors
                        sm:block

                        ${isOpen ? 'text-blue-600' : 'text-slate-300'}
                      `}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Question */}

                    <span
                      className={`
                        text-base
                        font-semibold
                        tracking-tight
                        transition-colors
                        sm:text-lg

                        ${isOpen
                          ? 'text-slate-950'
                          : 'text-slate-700 group-hover:text-slate-950'
                        }
                      `}
                    >
                      {faq.q}
                    </span>
                  </div>

                  {/* =================================================
                      ICON
                  ================================================= */}

                  <motion.div
                    animate={{
                      rotate: isOpen ? 180 : 0,
                      backgroundColor: isOpen ? '#2563eb' : '#f8fafc'
                    }}
                    transition={{
                      duration: 0.3
                    }}
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-colors

                      ${isOpen
                        ? 'border-blue-600 text-white'
                        : 'border-slate-200 text-slate-500 group-hover:border-slate-300 group-hover:text-slate-900'
                      }
                    `}
                  >
                    <CaretDownIcon size={16} weight='bold' />
                  </motion.div>
                </button>

                {/* =================================================
                    ANSWER
                ================================================= */}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0
                      }}
                      animate={{
                        height: 'auto',
                        opacity: 1
                      }}
                      exit={{
                        height: 0,
                        opacity: 0
                      }}
                      transition={{
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className='overflow-hidden'
                    >
                      <div
                        className='
                          pb-7
                          pl-0
                          pr-12

                          sm:pl-10
                          sm:pr-16
                        '
                      >
                        <p
                          className='
                            max-w-3xl
                            text-sm
                            font-normal
                            leading-7
                            text-slate-500
                          '
                        >
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* =====================================================
            BOTTOM NOTE
        ===================================================== */}

        <div
          className='
            mt-8
            flex
            items-center
            gap-3
            text-xs
            font-medium
            text-slate-400
          '
        >
          <QuestionIcon size={15} weight='duotone' />

          <span>Still have a question about RouteMin?</span>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
