import React, { useMemo, useState } from 'react'
import {
  MagnifyingGlassIcon,
  WarehouseIcon,
  CheckCircleIcon
} from '@phosphor-icons/react'

function WarehouseSelection ({
  warehouses = [],
  selectedWarehouses = [],
  onSelectionChange,
  onBack,
  onNext
}) {
  const [search, setSearch] = useState('')

  const activeWarehouses = useMemo(() => {
    return warehouses.filter(
      warehouse =>
        warehouse.status === 'ACTIVE' &&
        (warehouse.warehouseName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
          warehouse.warehouseCode?.toLowerCase().includes(search.toLowerCase()))
    )
  }, [warehouses, search])

  const toggleWarehouse = warehouse => {
    const exists = selectedWarehouses.find(item => item.id === warehouse.id)

    let updated = []
    if (exists) {
      updated = selectedWarehouses.filter(item => item.id !== warehouse.id)
    } else {
      updated = [
        ...selectedWarehouses,
        {
          id: warehouse.id,
          warehouseCode: warehouse.warehouseCode,
          warehouseName: warehouse.warehouseName,
          maximumDemand: warehouse.maximumStorageCapacity || warehouse.maximumDemand,
          demand: ''
        }
      ]
    }

    if (onSelectionChange) {
      onSelectionChange(updated)
    }
  }

  const updateDemand = (id, rawValue) => {
    const sanitized = rawValue.replace(/[^0-9]/g, '')
    const updated = selectedWarehouses.map(item =>
      item.id === id
        ? {
            ...item,
            demand: sanitized
          }
        : item
    )

    if (onSelectionChange) {
      onSelectionChange(updated)
    }
  }

  return (
    <div>
      {/* Header */}
      <div>
        <p className='text-xs font-bold uppercase tracking-wider text-blue-600'>
          Step 2 of 4
        </p>

        <h2 className='mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
          Select Warehouses
        </h2>

        <p className='mt-1 text-xs font-medium text-slate-500'>
          Choose destination warehouses and set required demand volumes.
        </p>
      </div>

      {/* Search */}
      <div className='relative mt-6'>
        <MagnifyingGlassIcon
          size={18}
          className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
        />

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Search warehouse code or name...'
          className='h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-xs font-medium text-slate-900 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400'
        />
      </div>

      {/* Cards Grid */}
      <div className='mt-6 grid gap-5 lg:grid-cols-2'>
        {activeWarehouses.map(warehouse => {
          const selected = selectedWarehouses.find(
            item => item.id === warehouse.id
          )

          return (
            <div
              key={warehouse.id}
              onClick={() => toggleWarehouse(warehouse)}
              className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
                selected
                  ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/20 shadow-xs'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/10'>
                    <WarehouseIcon size={20} weight='duotone' />
                  </div>

                  <div>
                    <h3 className='text-sm font-bold text-slate-900'>
                      {warehouse.warehouseCode}
                    </h3>

                    <p className='text-xs font-medium text-slate-500'>
                      {warehouse.warehouseName}
                    </p>
                  </div>
                </div>

                {selected && (
                  <CheckCircleIcon
                    weight='fill'
                    size={22}
                    className='text-emerald-600'
                  />
                )}
              </div>

              <div className='mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4'>
                <div>
                  <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                    Maximum Demand
                  </p>

                  <p className='mt-1 text-sm font-black text-slate-900'>
                    {Number(warehouse.maximumStorageCapacity || warehouse.maximumDemand || 0).toLocaleString()}{' '}
                    <span className='text-[10px] font-normal text-slate-400'>
                      units
                    </span>
                  </p>
                </div>

                <div>
                  <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                    Status
                  </p>

                  <p className='mt-1 text-xs font-bold text-emerald-600'>
                    Active
                  </p>
                </div>
              </div>

              {selected && (() => {
                const maxCap = Number(warehouse.maximumStorageCapacity || warehouse.maximumDemand || 0)
                const valStr = selected.demand
                let errorMessage = ''

                if (valStr === '' || valStr === null || valStr === undefined) {
                  errorMessage = 'Demand volume is required'
                } else if (Number(valStr) <= 0) {
                  errorMessage = 'Demand volume must be greater than 0'
                } else if (Number(valStr) > maxCap) {
                  errorMessage = `Demand volume cannot exceed maximum capacity of ${maxCap.toLocaleString()} units`
                }

                return (
                  <div className='mt-4 border-t border-slate-200/60 pt-4'>
                    <div className='flex items-center justify-between'>
                      <label className='text-xs font-bold uppercase tracking-wider text-slate-700'>
                        Allocated Demand Volume
                      </label>
                      {maxCap > 0 && (
                        <span className='text-[10px] font-medium text-slate-400'>
                          Max: {maxCap.toLocaleString()} units
                        </span>
                      )}
                    </div>

                    <input
                      type='text'
                      inputMode='numeric'
                      value={selected.demand ?? ''}
                      placeholder='Enter demand units...'
                      onClick={e => e.stopPropagation()}
                      onChange={e => updateDemand(warehouse.id, e.target.value)}
                      className={`mt-2 h-10 w-full rounded-xl border bg-white px-3.5 text-xs font-semibold shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] outline-none transition-all ${
                        errorMessage
                          ? 'border-rose-400 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-slate-200 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                      } placeholder:text-slate-400`}
                    />

                    {errorMessage && (
                      <p className='mt-1.5 text-[11px] font-bold text-rose-600 flex items-center gap-1'>
                        <span>•</span>
                        {errorMessage}
                      </p>
                    )}
                  </div>
                )
              })()}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WarehouseSelection
