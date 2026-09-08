import React, { useEffect, useState } from 'react'
import { LockSimpleIcon, LockSimpleOpenIcon } from '@phosphor-icons/react'

function CostMatrixTable ({ factories = [], warehouses = [], onChange, onBack, onNext }) {
  const [matrix, setMatrix] = useState([])

  useEffect(() => {
    const initialMatrix = factories.map(factory => ({
      factoryId: factory.id,
      factoryCode: factory.factoryCode,
      factoryName: factory.factoryName,

      routes: warehouses.map(warehouse => ({
        warehouseId: warehouse.id,
        warehouseCode: warehouse.warehouseCode,
        warehouseName: warehouse.warehouseName,
        costPerUnit: '',
        restricted: false
      }))
    }))

    setMatrix(initialMatrix)

    if (onChange) {
      const routes = initialMatrix.flatMap(row =>
        row.routes.map(route => ({
          factoryId: row.factoryId,
          warehouseId: route.warehouseId,
          costPerUnit: Number(route.costPerUnit || 0),
          restricted: route.restricted
        }))
      )
      onChange(routes)
    }
  }, [factories, warehouses])

  const notifyParent = updatedMatrix => {
    if (onChange) {
      const routes = updatedMatrix.flatMap(row =>
        row.routes.map(route => ({
          factoryId: row.factoryId,
          warehouseId: route.warehouseId,
          costPerUnit: Number(route.costPerUnit || 0),
          restricted: route.restricted
        }))
      )
      onChange(routes)
    }
  }

  const updateCost = (factoryId, warehouseId, value) => {
    setMatrix(prev => {
      const updated = prev.map(row =>
        row.factoryId === factoryId
          ? {
              ...row,
              routes: row.routes.map(route =>
                route.warehouseId === warehouseId
                  ? {
                      ...route,
                      costPerUnit: value
                    }
                  : route
              )
            }
          : row
      )
      notifyParent(updated)
      return updated
    })
  }

  const toggleRestriction = (factoryId, warehouseId) => {
    setMatrix(prev => {
      const updated = prev.map(row =>
        row.factoryId === factoryId
          ? {
              ...row,
              routes: row.routes.map(route =>
                route.warehouseId === warehouseId
                  ? {
                      ...route,
                      restricted: !route.restricted
                    }
                  : route
              )
            }
          : row
      )
      notifyParent(updated)
      return updated
    })
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <p className='text-xs font-bold uppercase tracking-wider text-blue-600'>
          Step 3 of 4
        </p>

        <h2 className='mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
          Transportation Cost Matrix
        </h2>

        <p className='mt-1 text-xs font-medium text-slate-500'>
          Enter transportation cost per unit for every factory to warehouse shipping lane.
        </p>
      </div>

      {/* Matrix */}
      <div className='overflow-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs'>
        <table className='min-w-full'>
          <thead className='bg-slate-50/80 border-b border-slate-100'>
            <tr>
              <th className='sticky left-0 bg-slate-50 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700 z-10'>
                Factory / Warehouse
              </th>

              {warehouses.map(warehouse => (
                <th
                  key={warehouse.id}
                  className='min-w-[170px] px-4 py-4 text-center'
                >
                  <div className='text-xs font-bold text-slate-900'>
                    {warehouse.warehouseCode}
                  </div>

                  <div className='text-[11px] font-medium text-slate-500 truncate'>
                    {warehouse.warehouseName}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-100'>
            {matrix.map(row => (
              <tr key={row.factoryId} className='transition-colors hover:bg-slate-50/40'>
                <td className='sticky left-0 bg-white px-6 py-5 z-10 shadow-xs'>
                  <div className='text-xs font-mono font-bold text-slate-900'>
                    {row.factoryCode}
                  </div>

                  <div className='text-xs font-medium text-slate-500 truncate'>{row.factoryName}</div>
                </td>

                {row.routes.map(route => (
                  <td key={route.warehouseId} className='px-4 py-4'>
                    <div className='rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 shadow-2xs transition-all hover:bg-white hover:border-slate-300'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-[10px] font-bold uppercase text-slate-400'>Lane</span>
                        <button
                          type='button'
                          onClick={() =>
                            toggleRestriction(row.factoryId, route.warehouseId)
                          }
                          className='cursor-pointer p-0.5'
                          title={route.restricted ? 'Route Restricted' : 'Route Open'}
                        >
                          {route.restricted ? (
                            <LockSimpleIcon
                              size={16}
                              weight='fill'
                              className='text-rose-500'
                            />
                          ) : (
                            <LockSimpleOpenIcon
                              size={16}
                              className='text-emerald-600'
                            />
                          )}
                        </button>
                      </div>

                      <input
                        type='text'
                        inputMode='numeric'
                        value={route.costPerUnit ?? ''}
                        disabled={route.restricted}
                        onChange={e =>
                          updateCost(
                            row.factoryId,
                            route.warehouseId,
                            e.target.value.replace(/[^0-9.]/g, '')
                          )
                        }
                        placeholder='₹ Cost/unit'
                        className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-400 placeholder:text-slate-400'
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CostMatrixTable
