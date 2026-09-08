import React, { useState, useMemo, useEffect } from 'react'
import {
  MagnifyingGlass,
  Warehouse,
  NotePencil,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react'
import StatusBadge from '../StatusBadge'

const PAGE_SIZE = 10

function WarehouseTable ({ tabledata = [], onEdit }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  /* ================= FILTER ================= */
  const filteredWarehouses = useMemo(() => {
    const value = search.toLowerCase().trim()

    if (!value) return tabledata

    return tabledata.filter(warehouse =>
      [
        warehouse.warehouseCode,
        warehouse.registrationNumber,
        warehouse.warehouseName,
        warehouse.warehouseType,
        warehouse.address,
        warehouse.country,
        warehouse.status
      ].some(field =>
        String(field ?? '')
          .toLowerCase()
          .includes(value)
      )
    )
  }, [search, tabledata])

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredWarehouses.length / PAGE_SIZE)

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredWarehouses.slice(start, start + PAGE_SIZE)
  }, [filteredWarehouses, page])

  useEffect(() => {
    setPage(1)
  }, [search])

  return (
    <section className='rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden mt-6 card-stripe'>
      {/* ================= HEADER ================= */}
      <div className='relative flex flex-col gap-4 border-b p-6 sm:flex-row sm:justify-between bg-gradient-to-r from-slate-50 to-white'>
        <Warehouse
          size={120}
          className='absolute right-4 top-2 opacity-5 text-emerald-500'
        />

        <div className='relative z-10'>
          <h2 className='text-lg font-semibold text-slate-900'>
            Warehouses Network
          </h2>
          <p className='text-xs text-slate-500 mt-1'>
            {filteredWarehouses.length} distribution centers configured
          </p>
        </div>

        <div className='relative w-full sm:w-80 z-10'>
          <MagnifyingGlass
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search warehouses...'
            className='h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-xs shadow-sm focus:ring-2 focus:ring-emerald-500/20 outline-none'
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[900px]'>
          <thead className='bg-slate-50 border-b'>
            <tr className='text-xs text-slate-500 uppercase'>
              <th className='px-6 py-4'>#</th>
              <th className='px-6 py-4'>Warehouse</th>
              <th className='px-6 py-4'>Registration</th>
              <th className='px-6 py-4'>Type</th>
              <th className='px-6 py-4'>Address</th>
              <th className='px-6 py-4 text-right'>Demand</th>
              <th className='px-6 py-4'>Status</th>
              <th className='px-6 py-4 text-right'>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((warehouse, i) => {
              const rowNumber = (page - 1) * PAGE_SIZE + i + 1

              return (
                <tr
                  key={warehouse.id}
                  className={`transition ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                  } hover:bg-emerald-50`}
                >
                  {/* ROW NUMBER */}
                  <td className='px-6 py-4 text-xs text-slate-400'>
                    #{rowNumber}
                  </td>

                  {/* NAME */}
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
                        <Warehouse size={18} />
                      </div>

                      <div>
                        <p className='text-sm font-semibold'>
                          {warehouse.warehouseName}
                        </p>
                        <p className='text-xs text-slate-400'>
                          {warehouse.warehouseCode}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* REG */}
                  <td className='px-6 py-4 text-xs text-slate-600'>
                    {warehouse.registrationNumber}
                  </td>

                  {/* TYPE */}
                  <td className='px-6 py-4'>
                    <span className='px-2 py-1 rounded bg-indigo-50 text-indigo-600 text-xs font-medium'>
                      {warehouse.warehouseType}
                    </span>
                  </td>

                  {/* ADDRESS */}
                  <td className='px-6 py-4 text-xs text-slate-600 max-w-[200px] truncate'>
                    {warehouse.address}
                  </td>

                  {/* DEMAND */}
                  <td className='px-6 py-4 text-right'>
                    <p className='font-semibold'>
                      {Number(
                        warehouse.maximumStorageCapacity ?? 0
                      ).toLocaleString()}
                    </p>
                    <p className='text-[10px] text-slate-400'>units</p>
                  </td>

                  {/* STATUS */}
                  <td className='px-6 py-4'>
                    <StatusBadge status={warehouse.status} />
                  </td>

                  {/* ACTION */}
                  <td className='px-6 py-4 text-right'>
                    <button
                      onClick={() => onEdit(warehouse)}
                      className='flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border hover:bg-emerald-50 hover:text-emerald-600'
                    >
                      <NotePencil size={14} />
                      Edit
                    </button>
                  </td>
                </tr>
              )
            })}

            {/* EMPTY */}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan='8' className='text-center py-16'>
                  <Warehouse size={40} className='mx-auto text-slate-300' />
                  <p className='mt-2 text-sm'>No warehouses found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className='flex items-center justify-between px-6 py-4 border-t bg-slate-50'>
        <p className='text-xs text-slate-500'>
          Page {page} of {totalPages || 1}
        </p>

        <div className='flex items-center gap-2'>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className='p-2 rounded-lg border disabled:opacity-40 hover:bg-white'
          >
            <CaretLeft size={14} />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 text-xs rounded-lg border ${
                page === i + 1
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'hover:bg-white'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className='p-2 rounded-lg border disabled:opacity-40 hover:bg-white'
          >
            <CaretRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default WarehouseTable
