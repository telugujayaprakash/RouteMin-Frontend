import React, { useEffect, useState } from 'react'
import {
  FactoryIcon,
  XIcon,
  CheckCircleIcon,
  WarningCircleIcon
} from '@phosphor-icons/react'
import LocationPicker from '../Location/LocationPicker'

function FactoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false
}) {
  const isEdit = Boolean(initialData)

  const [formData, setFormData] = useState({
    factoryCode: '',
    registrationNumber: '',
    factoryName: '',
    factoryType: '',
    address: '',
    country: 'India',
    latitude: '',
    longitude: '',
    maximumSupplyCapacity: '',
    status: 'ACTIVE'
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) return

    if (initialData) {
      setFormData({
        factoryCode: initialData.factoryCode || '',
        registrationNumber: initialData.registrationNumber || '',
        factoryName: initialData.factoryName || '',
        factoryType: initialData.factoryType || '',
        address: initialData.address || '',
        country: initialData.country || 'India',
        latitude: initialData.latitude ?? '',
        longitude: initialData.longitude ?? '',
        maximumSupplyCapacity: initialData.maximumSupplyCapacity ?? '',
        status: initialData.status || 'ACTIVE'
      })
    } else {
      setFormData({
        factoryCode: '',
        registrationNumber: '',
        factoryName: '',
        factoryType: '',
        address: '',
        country: 'India',
        latitude: '',
        longitude: '',
        maximumSupplyCapacity: '',
        status: 'ACTIVE'
      })
    }

    setErrors({})
  }, [isOpen, initialData])

  if (!isOpen) return null

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleNumberChange = (field, value) => {
    const numericValue = value.replace(/[^0-9]/g, '')

    updateField(field, numericValue)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.factoryCode.trim()) {
      newErrors.factoryCode = 'Factory code is required.'
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required.'
    }

    if (!formData.factoryName.trim()) {
      newErrors.factoryName = 'Factory name is required.'
    }

    if (!formData.factoryType.trim()) {
      newErrors.factoryType = 'Factory type is required.'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Please select a factory location.'
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.address =
        'Please search and select the factory location on the map.'
    }

    if (!formData.maximumSupplyCapacity) {
      newErrors.maximumSupplyCapacity = 'Maximum supply capacity is required.'
    } else if (Number(formData.maximumSupplyCapacity) <= 0) {
      newErrors.maximumSupplyCapacity = 'Capacity must be greater than 0.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!validate()) return

    const payload = {
      factoryCode: formData.factoryCode.trim(),
      registrationNumber: formData.registrationNumber.trim(),
      factoryName: formData.factoryName.trim(),
      factoryType: formData.factoryType.trim(),
      address: formData.address.trim(),
      country: formData.country || 'India',
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      maximumSupplyCapacity: Number(formData.maximumSupplyCapacity),
      status: formData.status
    }

    onSubmit(payload)
  }

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/50 px-3 py-4 backdrop-blur-[2px] sm:px-6'>
      <div className='relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_80px_-25px_rgba(15,23,42,0.35)]'>
        {/* ================= HEADER ================= */}

        <div className='flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7 sm:py-5'>
          <div className='flex min-w-0 items-center gap-3'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600'>
              <FactoryIcon size={23} weight='duotone' />
            </div>

            <div className='min-w-0'>
              <h2 className='truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl'>
                {isEdit ? 'Edit Factory' : 'Add Factory'}
              </h2>

              <p className='mt-0.5 text-xs font-medium text-slate-500 sm:text-sm'>
                {isEdit
                  ? 'Update the manufacturing node details.'
                  : 'Register a new manufacturing node.'}
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            disabled={loading}
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Close'
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className='min-h-0 flex-1 overflow-y-auto'
          noValidate
        >
          <div className='space-y-8 p-5 sm:p-7 lg:p-8'>
            {/* ================= BASIC INFORMATION ================= */}

            <section>
              <div className='mb-5'>
                <h3 className='text-sm font-bold uppercase tracking-[0.08em] text-slate-700'>
                  Basic Information
                </h3>

                <p className='mt-1 text-xs text-slate-500'>
                  Enter the identifying details of this factory.
                </p>
              </div>

              <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                {/* Factory Code */}

                <div>
                  <label className='mb-2 block text-sm font-semibold text-slate-700'>
                    Factory Code <span className='text-rose-500'>*</span>
                  </label>

                  <input
                    type='text'
                    value={formData.factoryCode}
                    onChange={e => updateField('factoryCode', e.target.value)}
                    placeholder='e.g. FAC-001'
                    className={`h-12 w-full rounded-xl border bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.factoryCode
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                      }`}
                  />

                  {errors.factoryCode && (
                    <p className='mt-1.5 text-xs font-medium text-rose-600'>
                      {errors.factoryCode}
                    </p>
                  )}
                </div>

                {/* Registration Number */}

                <div>
                  <label className='mb-2 block text-sm font-semibold text-slate-700'>
                    Registration Number <span className='text-rose-500'>*</span>
                  </label>

                  <input
                    type='text'
                    value={formData.registrationNumber}
                    onChange={e =>
                      updateField('registrationNumber', e.target.value)
                    }
                    placeholder='e.g. REG-2026-001'
                    className={`h-12 w-full rounded-xl border bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.registrationNumber
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                      }`}
                  />

                  {errors.registrationNumber && (
                    <p className='mt-1.5 text-xs font-medium text-rose-600'>
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>

                {/* Factory Name */}

                <div>
                  <label className='mb-2 block text-sm font-semibold text-slate-700'>
                    Factory Name <span className='text-rose-500'>*</span>
                  </label>

                  <input
                    type='text'
                    value={formData.factoryName}
                    onChange={e => updateField('factoryName', e.target.value)}
                    placeholder='e.g. Green Valley Industries'
                    className={`h-12 w-full rounded-xl border bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.factoryName
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                      }`}
                  />

                  {errors.factoryName && (
                    <p className='mt-1.5 text-xs font-medium text-rose-600'>
                      {errors.factoryName}
                    </p>
                  )}
                </div>

                {/* Factory Type */}

                <div>
                  <label className='mb-2 block text-sm font-semibold text-slate-700'>
                    Factory Type <span className='text-rose-500'>*</span>
                  </label>

                  <input
                    type='text'
                    value={formData.factoryType}
                    onChange={e => updateField('factoryType', e.target.value)}
                    placeholder='e.g. Manufacturing'
                    className={`h-12 w-full rounded-xl border bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.factoryType
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                      }`}
                  />

                  {errors.factoryType && (
                    <p className='mt-1.5 text-xs font-medium text-rose-600'>
                      {errors.factoryType}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ================= LOCATION ================= */}

            <section className='border-t border-slate-200 pt-7'>
              <div className='mb-5'>
                <h3 className='text-sm font-bold uppercase tracking-[0.08em] text-slate-700'>
                  Location
                </h3>

                <p className='mt-1 text-xs text-slate-500'>
                  Search the factory address and select its exact location on
                  the map.
                </p>
              </div>

              <LocationPicker
                value={{
                  address: formData.address,
                  country: formData.country,
                  latitude: formData.latitude,
                  longitude: formData.longitude
                }}
                onChange={location => {
                  setFormData(prev => ({
                    ...prev,
                    address: location.address,
                    country: location.country || 'India',
                    latitude: location.latitude,
                    longitude: location.longitude
                  }))

                  setErrors(prev => ({
                    ...prev,
                    address: ''
                  }))
                }}
                error={errors.address}
              />
            </section>

            {/* ================= CAPACITY & STATUS ================= */}

            <section className='border-t border-slate-200 pt-7'>
              <div className='mb-5'>
                <h3 className='text-sm font-bold uppercase tracking-[0.08em] text-slate-700'>
                  Capacity & Status
                </h3>

                <p className='mt-1 text-xs text-slate-500'>
                  Configure the maximum supply capacity and current factory
                  status.
                </p>
              </div>

              <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                {/* Maximum Supply */}

                <div>
                  <label className='mb-2 block text-sm font-semibold text-slate-700'>
                    Maximum Supply Capacity{' '}
                    <span className='text-rose-500'>*</span>
                  </label>

                  <input
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    value={formData.maximumSupplyCapacity}
                    onChange={e =>
                      handleNumberChange(
                        'maximumSupplyCapacity',
                        e.target.value
                      )
                    }
                    placeholder='e.g. 5000'
                    className={`h-12 w-full rounded-xl border bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${errors.maximumSupplyCapacity
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                      }`}
                  />

                  {errors.maximumSupplyCapacity && (
                    <p className='mt-1.5 text-xs font-medium text-rose-600'>
                      {errors.maximumSupplyCapacity}
                    </p>
                  )}
                </div>

                {/* Status */}

                <div>
                  <label className='mb-2 block text-sm font-semibold text-slate-700'>
                    Status <span className='text-rose-500'>*</span>
                  </label>

                  <select
                    value={formData.status}
                    onChange={e => updateField('status', e.target.value)}
                    className='h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                  >
                    <option value='ACTIVE'>Active</option>
                    <option value='INACTIVE'>Inactive</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* ================= FOOTER ================= */}

          <div className='sticky bottom-0 flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:justify-end sm:px-7 lg:px-8'>
            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={loading}
              className='flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.55)] transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading ? (
                <>
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                  {isEdit ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <CheckCircleIcon size={18} weight='bold' />
                  {isEdit ? 'Update Factory' : 'Add Factory'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FactoryModal
