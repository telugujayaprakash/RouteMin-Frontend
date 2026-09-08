import React, { useEffect, useState } from 'react'

function CostMatrix ({ factories, warehouses, onBack, onNext }) {
  const [matrix, setMatrix] = useState([])

  useEffect(() => {
    const rows = factories.map(factory => ({
      factoryId: factory.id,
      factoryName: factory.factoryName,

      routes: warehouses.map(warehouse => ({
        warehouseId: warehouse.id,
        warehouseName: warehouse.warehouseName,
        cost: '',
        restricted: false
      }))
    }))

    setMatrix(rows)
  }, [factories, warehouses])

  const updateCost = (factoryId, warehouseId, value) => {
    setMatrix(prev =>
      prev.map(row =>
        row.factoryId === factoryId
          ? {
              ...row,
              routes: row.routes.map(route =>
                route.warehouseId === warehouseId
                  ? {
                      ...route,
                      cost: value
                    }
                  : route
              )
            }
          : row
      )
    )
  }

  const toggleRestriction = (factoryId, warehouseId) => {
    setMatrix(prev =>
      prev.map(row =>
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
    )
  }

  return (
    <div>
      <div>
        <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>
          Step 4 of 5
        </p>

        <h2 className='mt-2 text-2xl font-semibold'>
          Transportation Cost Matrix
        </h2>

        <p className='mt-1 text-sm text-gray-500'>
          Enter transportation cost for each route.
        </p>
      </div>

      <div className='mt-8 overflow-auto rounded-2xl border border-gray-200'>
        <table className='min-w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-5 py-4 text-left'>Factory</th>

              {warehouses.map(warehouse => (
                <th key={warehouse.id} className='px-5 py-4 text-center'>
                  {warehouse.warehouseCode}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {matrix.map(row => (
              <tr key={row.factoryId} className='border-t'>
                <td className='px-5 py-5 font-semibold'>{row.factoryName}</td>

                {row.routes.map(route => (
                  <td key={route.warehouseId} className='px-3 py-5'>
                    <div className='space-y-3'>
                      <input
                        type='number'
                        value={route.cost}
                        onChange={e =>
                          updateCost(
                            row.factoryId,
                            route.warehouseId,
                            e.target.value
                          )
                        }
                        placeholder='Cost'
                        className='w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm'
                      />

                      <label className='flex items-center justify-center gap-2 text-xs'>
                        <input
                          type='checkbox'
                          checked={route.restricted}
                          onChange={() =>
                            toggleRestriction(row.factoryId, route.warehouseId)
                          }
                        />
                        Restricted
                      </label>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-8 flex justify-between'>
        <button
          onClick={onBack}
          className='rounded-xl border border-gray-200 px-5 py-3'
        >
          Back
        </button>

        <button
          onClick={() => onNext(matrix)}
          className='rounded-xl bg-gray-900 px-6 py-3 text-white'
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default CostMatrix
