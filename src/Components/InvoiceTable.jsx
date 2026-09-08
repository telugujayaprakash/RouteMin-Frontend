import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  DownloadSimple,
  Receipt,
  CheckCircle,
  FileText
} from '@phosphor-icons/react'
import { fetchInvoices, downloadInvoice } from '../Redux/Payments/PaymentSlice'

function InvoiceTable () {
  const dispatch = useDispatch()
  const invoices = useSelector(state => state.Payment?.invoice || [])
  const loading = useSelector(state => state.Payment?.isLoading)
  const [downloadingId, setDownloadingId] = useState(null)

  // FETCH INVOICES
  useEffect(() => {
    dispatch(fetchInvoices())
  }, [dispatch])

  // FORMAT DATE
  const formatDate = dateStr => {
    if (!dateStr) return 'N/A'

    try {
      const date = new Date(dateStr)

      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  // DOWNLOAD RECEIPT
  const handleDownload = invoice => {
    dispatch(
      downloadInvoice({
        paymentId: invoice.paymentId,
        invoiceNumber: invoice.invoiceNumber
      })
    )
  }

  // LOADING
  if (loading) {
    return (
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='flex items-center gap-3'>
          <div className='h-9 w-9 animate-pulse rounded-xl bg-slate-100' />

          <div className='space-y-2'>
            <div className='h-4 w-40 animate-pulse rounded bg-slate-100' />
            <div className='h-3 w-64 animate-pulse rounded bg-slate-100' />
          </div>
        </div>

        <div className='mt-6 space-y-3'>
          {[1, 2, 3].map(item => (
            <div
              key={item}
              className='h-14 animate-pulse rounded-xl bg-slate-50'
            />
          ))}
        </div>
      </div>
    )
  }

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (!Array.isArray(invoices) || invoices.length === 0) {
    return (
      <div className='rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'>
        <div className='flex flex-col items-center justify-center py-10 text-center'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500'>
            <Receipt size={24} weight='duotone' />
          </div>

          <h3 className='mt-4 text-sm font-bold text-slate-900'>
            No invoices yet
          </h3>

          <p className='mt-1 max-w-sm text-xs leading-5 text-slate-500'>
            Your RouteMin subscription invoices will appear here after a
            successful payment.
          </p>
        </div>
      </div>
    )
  }

  // ==========================================================
  // TABLE
  // ==========================================================

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
      {/* HEADER */}

      <div className='mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <Receipt size={20} className='text-blue-600' weight='duotone' />

            <h3 className='text-lg font-bold text-slate-900'>
              Billing & Invoices
            </h3>
          </div>

          <p className='mt-1 text-xs text-slate-500'>
            View and download your RouteMin subscription receipts.
          </p>
        </div>

        <span className='inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:self-center'>
          <CheckCircle size={14} weight='fill' />
          Account Active
        </span>
      </div>

      {/* TABLE */}

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-left'>
          <thead>
            <tr className='border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500'>
              <th className='rounded-l-xl px-4 py-3'>#</th>

              <th className='px-4 py-3'>Invoice</th>

              <th className='px-4 py-3'>Payment Date</th>

              <th className='px-4 py-3'>Subscription Period</th>

              <th className='px-4 py-3'>Amount</th>

              <th className='rounded-r-xl px-4 py-3 text-center'>Download</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-100 text-xs font-medium text-slate-700'>
            {invoices.map((inv, index) => {
              const downloadId = inv.paymentId || inv.invoiceNumber

              const isDownloading = downloadingId === downloadId

              // const total = Number(inv.amount || 0) + Number(inv.gst || 0)

              return (
                <tr
                  key={inv.paymentId || inv.invoiceNumber || index}
                  className='transition-colors hover:bg-slate-50/80'
                >
                  {/* NUMBER */}

                  <td className='px-4 py-4 font-mono font-bold text-slate-400'>
                    #{index + 1}
                  </td>

                  {/* INVOICE */}

                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-2'>
                      <FileText size={16} className='shrink-0 text-blue-600' />

                      <span className='font-mono font-bold text-slate-900'>
                        {inv.invoiceNumber}
                      </span>
                    </div>
                  </td>

                  {/* PAYMENT DATE */}

                  <td className='px-4 py-4 font-mono text-slate-600'>
                    {formatDate(inv.paymentDate)}
                  </td>

                  {/* PERIOD */}

                  <td className='whitespace-nowrap px-4 py-4 font-mono text-[11px] text-slate-500'>
                    {formatDate(inv.startDate)}
                    {' → '}
                    {formatDate(inv.endDate)}
                  </td>

                  {/* AMOUNT */}

                  <td className='px-4 py-4'>
                    <div className='font-mono font-bold text-slate-900'>
                      ₹{inv.amount}
                    </div>

                    <span className='text-[10px] text-slate-400'>
                      Including ₹{inv.gst || 0} GST
                    </span>
                  </td>

                  {/* DOWNLOAD */}

                  <td className='px-4 py-4 text-center'>
                    <button
                      type='button'
                      onClick={() => handleDownload(inv)}
                      disabled={isDownloading}
                      className='
                        inline-flex
                        h-8
                        items-center
                        justify-center
                        gap-1.5
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-slate-700
                        shadow-2xs
                        transition-all
                        hover:border-blue-200
                        hover:bg-blue-50
                        hover:text-blue-600
                        active:scale-95
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      '
                    >
                      <DownloadSimple
                        size={15}
                        weight='bold'
                        className='animate-bounce text-blue-600'
                      />

                      <span className='text-[11px] font-semibold'>
                        {isDownloading ? 'Downloading...' : 'Receipt'}
                      </span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvoiceTable
