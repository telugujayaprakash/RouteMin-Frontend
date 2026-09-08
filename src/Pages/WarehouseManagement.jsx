import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  WarehouseIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PackageIcon,
  CheckCircleIcon,
  XCircleIcon,
  WarningCircleIcon,
  ArrowClockwiseIcon
} from '@phosphor-icons/react'
import ErrorCard from '../Components/ErrorCard'
import StatCard from '../Components/StatCard'
import StatusBadge from '../Components/StatusBadge'
import WarehouseTable from '../Components/Entities/WarehouseTable'
import { fetchwarehouse } from '../Redux/Warehouse/WarehouseSlice'
import { postwarehouse } from '../Redux/Warehouse/WarehouseSlice'
import { updatewarehouse } from '../Redux/Warehouse/WarehouseSlice'
import { deletewarehouse } from '../Redux/Warehouse/WarehouseSlice'
import LoadingComponent from '../Components/LoadingComponent'
import WarehouseModal from '../Components/Entities/WarehouseModel'
import { Icon } from '@iconify/react'

function WarehouseManagement () {
  const dispatch = useDispatch()
  const warehouses = useSelector(state => state.Warehouse.warehouses)
  const isLoading = useSelector(state => state.Warehouse.isLoading)
  const error = useSelector(state => state.Warehouse.error)

  const [warehouseModal, setwarehouseModal] = useState({
    open: false,
    mode: 'add',
    warehouse: null
  })

  useEffect(() => {
    dispatch(fetchwarehouse())
  }, [])

  const handleEditWarehouse = factory => {
    setwarehouseModal({
      open: true,
      mode: 'edit',
      factory
    })
  }

  const totalWarehouses = warehouses.length

  const activeWarehouses = warehouses.filter(
    warehouse => warehouse.status === 'ACTIVE'
  ).length

  const inactiveWarehouses = warehouses.filter(
    warehouse => warehouse.status === 'INACTIVE'
  ).length

  const totalDemand = warehouses.reduce(
    (total, warehouse) => total + Number(warehouse.maximumDemand ?? 0),
    0
  )

  if (error) {
    return (
      <ErrorCard
        error={error?.message || error}
        onRetry={() => dispatch(fetchwarehouse())}
      />
    )
  }

  const handleWarehouseSubmit = async data => {
    try {
      if (warehouseModal.mode === 'add') {
        await dispatch(postwarehouse(data)).unwrap()
        console.log('hi')
      } else {
        await dispatch(
          updatewarehouse({
            id: factoryModal.factory.id,
            data
          })
        ).unwrap()
        console.log('hi')
      }

      setwarehouseModal({
        open: false,
        mode: 'add',
        factory: null
      })
      dispatch(fetchwarehouse())
    } catch (error) {
      console.error('Warehouse save failed:', error)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50/60 font-sans antialiased text-slate-900'>
      {/* ================= HEADER ================= */}

      <header className='border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-5 sm:px-8 lg:px-10'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
              Warehouse Management
            </h1>

            <p className='mt-0.5 text-xs font-medium text-slate-500'>
              Manage distribution centers, demand constraints, and operational
              status.
            </p>
          </div>

          <button
            type='button'
            onClick={() =>
              setwarehouseModal({
                open: true,
                mode: 'add',
                factory: null
              })
            }
            className='inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-xs shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
          >
            <PlusIcon size={18} weight='bold' />
            Add Warehouse
          </button>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className='p-5 sm:p-6 lg:p-8'>
        {isLoading ? (
          <div className='w-full h-full flex items-center justify-center'>
            <LoadingComponent />
          </div>
        ) : (
          <div className='mx-auto max-w-[1600px]'>
            {/* ================= SUMMARY CARDS ================= */}

            <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              <StatCard
                title='Total Warehouses'
                value={totalWarehouses}
                icon='streamline-sharp-color:warehouse-1'
                color='blue'
              />

              <StatCard
                title='Total Demand'
                value={totalDemand.toLocaleString()}
                subtitle='units'
                icon='glyphs-poly:box-1'
                color='purple'
              />

              <StatCard
                title='Active Warehouses'
                value={activeWarehouses}
                icon='mdi:check-circle'
                color='green'
              />

              <StatCard
                title='Inactive Warehouses'
                value={inactiveWarehouses}
                icon='mdi:close-circle'
                color='red'
              />
            </section>

            {/* ================= TABLE SECTION ================= */}
            <WarehouseTable
              tabledata={warehouses}
              onEdit={handleEditWarehouse}
            />
            <WarehouseModal
              isOpen={warehouseModal.open}
              mode={warehouseModal.mode}
              initialData={warehouseModal.factory}
              onSubmit={handleWarehouseSubmit}
              onClose={() =>
                setwarehouseModal({
                  open: false,
                  mode: 'add',
                  factory: null
                })
              }
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default WarehouseManagement
