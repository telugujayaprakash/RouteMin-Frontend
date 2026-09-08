import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FactoryIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PackageIcon,
  CheckCircleIcon,
  XCircleIcon,
  WarningCircleIcon,
  ArrowClockwiseIcon
} from '@phosphor-icons/react'
import StatCard from '../Components/StatCard'
import StatusBadge from '../Components/StatusBadge'
import FactoryTable from '../Components/Entities/FactoryTable'
import { fetchfactory } from '../Redux/Factory/FactorySlice'
import { updatefactory } from '../Redux/Factory/FactorySlice'
import { postfactory } from '../Redux/Factory/FactorySlice'
import { deletefactory } from '../Redux/Factory/FactorySlice'
import LoadingComponent from '../Components/LoadingComponent'
import FactoryModal from '../Components/Entities/FactoryModel'
import { Icon } from '@iconify/react'

function FactoryManagement () {
  const dispatch = useDispatch()
  const factories = useSelector(state => state.Factory.factories)
  const isLoading = useSelector(state => state.Factory.isLoading)
  const error = useSelector(state => state.Factory.error)

  const [factoryModal, setFactoryModal] = useState({
    open: false,
    mode: 'add',
    factory: null
  })

  useEffect(() => {
    dispatch(fetchfactory())
  }, [])

  const handleEditFactory = factory => {
    setFactoryModal({
      open: true,
      mode: 'edit',
      factory
    })
  }

  const totalFactories = factories.length

  const activeFactories = factories.filter(
    factory => factory.status === 'ACTIVE'
  ).length

  const inactiveFactories = factories.filter(
    factory => factory.status === 'INACTIVE'
  ).length

  const totalSupply = factories.reduce(
    (total, factory) => total + factory.maximumSupplyCapacity,
    0
  )

  if (error) {
    return (
      <div className='flex min-h-[80vh] items-center justify-center px-6'>
        <div className='w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm'>
          {/* Icon */}

          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50'>
            <WarningCircleIcon
              size={36}
              weight='fill'
              className='text-red-500'
            />
          </div>

          {/* Title */}

          <h2 className='mt-6 text-2xl font-semibold text-gray-900'>
            Something went wrong
          </h2>

          {/* Description */}

          <p className='mt-2 text-sm leading-6 text-gray-500'>
            We couldn't load the requested information. Please try again or
            refresh the page.
          </p>

          {/* Error Message */}

          <div className='mt-6 rounded-xl border border-red-100 bg-red-50 p-4'>
            <p className='break-words text-sm text-red-600'>{error}</p>
          </div>

          {/* Action */}

          <button
            onClick={() => window.location.reload()}
            className='mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800'
          >
            <ArrowClockwiseIcon size={18} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const handleFactorySubmit = async data => {
    try {
      if (factoryModal.mode === 'add') {
        await dispatch(postfactory(data)).unwrap()
      } else {
        await dispatch(
          updatefactory({
            id: factoryModal.factory.id,
            data
          })
        ).unwrap()
      }

      setFactoryModal({
        open: false,
        mode: 'add',
        factory: null
      })
      dispatch(fetchfactory())
    } catch (error) {
      console.error('Factory save failed:', error)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50/60 font-sans antialiased text-slate-900'>
      {/* ================= HEADER ================= */}
      <header className='border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-5 sm:px-8 lg:px-10'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
              Factory Management
            </h1>

            <p className='mt-0.5 text-xs font-medium text-slate-500'>
              Manage manufacturing nodes, supply capacities, and operational
              status.
            </p>
          </div>

          <button
            type='button'
            onClick={() =>
              setFactoryModal({
                open: true,
                mode: 'add',
                factory: null
              })
            }
            className='inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-xs shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
          >
            <PlusIcon size={18} weight='bold' />
            Add Factory
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
            {/* ================= SUMMARY ================= */}

            <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              {/* <StatCard
                title='Total Factories'
                value={totalFactories}
                icon={FactoryIcon}
              />

              <StatCard
                title='Total Supply Capacity'
                value={totalSupply.toLocaleString()}
                subtitle='units'
                icon={PackageIcon}
              />

              <StatCard
                title='Active Factories'
                value={activeFactories}
                icon={CheckCircleIcon}
              />

              <StatCard
                title='Inactive Factories'
                value={inactiveFactories}
                icon={XCircleIcon}
              /> */}
              <StatCard
                title='Total Factories'
                value={totalFactories}
                icon='emojione:factory'
                color='blue'
              />

              <StatCard
                title='Total Supply Capacity'
                value={totalSupply.toLocaleString()}
                subtitle='units'
                icon='glyphs-poly:box-1'
                color='purple'
              />

              <StatCard
                title='Active Factories'
                value={activeFactories}
                icon='mdi:check-circle'
                color='green'
              />

              <StatCard
                title='Inactive Factories'
                value={inactiveFactories}
                icon='mdi:close-circle'
                color='red'
              />
            </section>

            {/* ================= TABLE SECTION ================= */}
            <FactoryTable tabledata={factories} onEdit={handleEditFactory} />
            <FactoryModal
              isOpen={factoryModal.open}
              mode={factoryModal.mode}
              initialData={factoryModal.factory}
              onSubmit={handleFactorySubmit}
              onClose={() =>
                setFactoryModal({
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

export default FactoryManagement
