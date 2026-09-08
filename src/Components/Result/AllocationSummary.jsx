import React from 'react'
import {
  FactoryIcon,
  WarehouseIcon,
  ArrowRightIcon,
  PackageIcon,
  CurrencyInrIcon,
  TruckIcon
} from '@phosphor-icons/react'

function AllocationSummary({ allocations = [] }) {
  const formatCurrency = value =>
    `₹ ${Number(value || 0).toLocaleString('en-IN')}`

  const formatNumber = value => Number(value || 0).toLocaleString('en-IN')

  // Calculate totals for footer
  const totalUnits = allocations.reduce(
    (sum, item) => sum + Number(item.allocatedQuantity || 0),
    0
  )

  const totalCost = allocations.reduce(
    (sum, item) => sum + Number(item.allocationCost || 0),
    0
  )

  return (
    <div className='overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs'>
      {/* HEADER */}
      <div className='border-b border-slate-100 px-6 py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-lg font-extrabold text-slate-900 flex items-center gap-2'>
            <TruckIcon size={22} className='text-blue-600' />
            <span>Allocation Summary</span>
          </h2>
          <p className='mt-0.5 text-xs font-medium text-slate-500'>
            Optimized route-level transportation flow between manufacturing plants and distribution hubs.
          </p>
        </div>

        <span className='inline-flex items-center gap-1.5 self-start sm:self-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200/70'>
          <PackageIcon size={14} weight='bold' />
          <span>{allocations.length} Active Routes</span>
        </span>
      </div>

      {/* TABLE */}
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          {/* HEAD */}
          <thead>
            <tr className='border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500'>
              <th className='px-6 py-3.5'>Source Factory</th>
              <th className='w-8 px-2 py-3.5 text-center'>Flow</th>
              <th className='px-6 py-3.5'>Destination Warehouse</th>
              <th className='px-6 py-3.5 text-center'>Quantity</th>
              <th className='px-6 py-3.5 text-right'>Cost / Unit</th>
              <th className='px-6 py-3.5 text-right'>Total Freight Cost</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className='divide-y divide-slate-100'>
            {allocations.length === 0 ? (
              <tr>
                <td colSpan={6} className='py-16 text-center'>
                  <div className='flex flex-col items-center gap-2 text-slate-400'>
                    <PackageIcon size={32} weight='duotone' />
                    <p className='text-xs font-semibold'>No allocation routes generated</p>
                  </div>
                </td>
              </tr>
            ) : (
              allocations.map((allocation, index) => {
                const quantity = Number(allocation.allocatedQuantity || 0)
                const cost = Number(allocation.allocationCost || 0)
                const unitCost = quantity > 0 && cost > 0 ? (cost / quantity).toFixed(2) : '—'

                return (
                  <tr
                    key={`${allocation.factoryId}-${allocation.warehouseId}-${index}`}
                    className='group transition-colors hover:bg-blue-50/40'
                  >
                    {/* FACTORY */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                          <FactoryIcon size={18} weight='duotone' />
                        </div>

                        <div>
                          <p className='text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors'>
                            {allocation.factoryName || `Factory #${allocation.factoryId}`}
                          </p>
                          <p className='text-[10px] font-mono text-slate-400'>
                            FAC-{allocation.factoryId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* FLOW ARROW */}
                    <td className='px-2 py-4 text-center'>
                      <ArrowRightIcon
                        size={16}
                        weight='bold'
                        className='inline-block text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500'
                      />
                    </td>

                    {/* WAREHOUSE */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors'>
                          <WarehouseIcon size={18} weight='duotone' />
                        </div>

                        <div>
                          <p className='text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors'>
                            {allocation.warehouseName || `Warehouse #${allocation.warehouseId}`}
                          </p>
                          <p className='text-[10px] font-mono text-slate-400'>
                            WRH-{allocation.warehouseId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* QUANTITY */}
                    <td className='px-6 py-4 text-center'>
                      <span className='inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-800 font-mono'>
                        {formatNumber(quantity)}
                        <span className='text-[10px] font-normal text-slate-500'>units</span>
                      </span>
                    </td>

                    {/* COST / UNIT */}
                    <td className='px-6 py-4 text-right text-xs font-semibold font-mono text-slate-600'>
                      {unitCost !== '—' ? `₹ ${unitCost}` : '—'}
                    </td>

                    {/* TOTAL COST */}
                    <td className='px-6 py-4 text-right'>
                      <span className='text-xs font-extrabold text-emerald-600 font-mono'>
                        {formatCurrency(cost)}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>

          {/* TOTALS FOOTER */}
          {allocations.length > 0 && (
            <tfoot>
              <tr className='border-t-2 border-slate-200 bg-slate-50/90 font-bold text-xs text-slate-900'>
                <td colSpan={3} className='px-6 py-4 text-slate-700 uppercase tracking-wider text-[11px]'>
                  Total Optimization Summary
                </td>
                <td className='px-6 py-4 text-center font-mono text-slate-900'>
                  {formatNumber(totalUnits)} <span className='text-[10px] font-normal text-slate-500'>units</span>
                </td>
                <td className='px-6 py-4 text-right text-slate-400 font-mono text-[10px]'>
                  SUMMARY
                </td>
                <td className='px-6 py-4 text-right font-mono text-sm text-emerald-700 font-black'>
                  {formatCurrency(totalCost)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

export default AllocationSummary
