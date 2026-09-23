import React, { useEffect, useState } from 'react'
import { WarehouseIcon, XIcon, CheckCircleIcon } from '@phosphor-icons/react'
import LocationPicker from '../Location/LocationPicker'

const emptyWarehouse = {
  warehouseCode: '',
  warehouseName: '',
  warehouseType: '',
  registrationNumber: '',
  address: '',
  country: 'India',
  latitude: '',
  longitude: '',
  maximumStorageCapacity: '',
  status: 'ACTIVE'
}

function WarehouseModal({
  isOpen,
  onClose,
  onSubmit,
  mode = 'add',
  initialData = null,
  isSubmitting = false
}) {
  const [formData, setFormData] = useState(emptyWarehouse)
  const [errors, setErrors] = useState({})

  const isEdit = mode === 'edit'

  useEffect(() => {
    if (!isOpen) return

    if (isEdit && initialData) {
      setFormData({
        warehouseCode: initialData.warehouseCode ?? '',
        warehouseName: initialData.warehouseName ?? '',
        warehouseType: initialData.warehouseType ?? '',
        registrationNumber: initialData.registrationNumber ?? '',
        address: initialData.address ?? '',
        country: initialData.country ?? 'India',
        latitude: initialData.latitude ?? '',
        longitude: initialData.longitude ?? '',
        maximumStorageCapacity:
          initialData.maximumStorageCapacity ??
          initialData.maximumDemand ??
          '',
        status: initialData.status ?? 'ACTIVE'
      })
    } else {
      setFormData({ ...emptyWarehouse })
    }

    setErrors({})
  }, [isOpen, isEdit, initialData])

  if (!isOpen) return null

  const validateData = data => {
    const newErrors = {}

    if (!data.warehouseCode.trim()) {
      newErrors.warehouseCode = 'Warehouse code is required.'
    } else if (!/^WH\d{3}$/.test(data.warehouseCode.trim())) {
      newErrors.warehouseCode = 'Must match pattern (e.g., WH001).'
    }

    if (!data.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required.'
    } else if (!/^REG\d{4}$/.test(data.registrationNumber.trim())) {
      newErrors.registrationNumber = 'Must match pattern (e.g., REG1001).'
    }

    if (!data.warehouseName.trim()) {
      newErrors.warehouseName = 'Warehouse name is required.'
    } else if (!/^[A-Za-z\s]{2,50}$/.test(data.warehouseName.trim())) {
      newErrors.warehouseName = 'Only letters and spaces are allowed (max 50).'
    }

    if (!data.warehouseType.trim()) {
      newErrors.warehouseType = 'Warehouse type is required.'
    } else if (!/^[A-Za-z\s]{2,50}$/.test(data.warehouseType.trim())) {
      newErrors.warehouseType = 'Only letters and spaces are allowed (max 50).'
    }

    if (!data.address.trim()) {
      newErrors.address = 'Please select a warehouse location.'
    }

    if (!data.latitude || !data.longitude) {
      newErrors.address =
        'Please search and select the warehouse location on the map.'
    }

    if (!data.maximumStorageCapacity) {
      newErrors.maximumStorageCapacity = 'Maximum storage capacity is required.'
    } else if (Number(data.maximumStorageCapacity) <= 0) {
      newErrors.maximumStorageCapacity = 'Capacity must be greater than 0.'
    }

    return newErrors
  }

  const updateField = (name, value) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      const newErrors = validateData(newData)

      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: newErrors[name] || ''
      }))

      return newData
    })
  }

  const handleChange = e => {
    const { name, value } = e.target
    updateField(name, value)
  }

  const validate = () => {
    const newErrors = validateData(formData)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!validate()) return

    const capacity = Number(formData.maximumStorageCapacity)
    const payload = {
      warehouseCode: formData.warehouseCode.trim(),
      warehouseName: formData.warehouseName.trim(),
      warehouseType: formData.warehouseType.trim(),
      registrationNumber: formData.registrationNumber.trim(),
      address: formData.address.trim(),
      country: formData.country || 'India',
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      maximumStorageCapacity: capacity,
      maximumDemand: capacity,
      status: formData.status
    }

    onSubmit(payload)
  }

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-[2px] sm:p-5'>
      <div className='flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_80px_-25px_rgba(15,23,42,0.35)]'>
        {/* ================= HEADER ================= */}

        <div className='flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7 sm:py-5'>
          <div className='flex min-w-0 items-center gap-3'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/10'>
              <WarehouseIcon size={23} weight='duotone' />
            </div>

            <div className='min-w-0'>
              <h2 className='truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl'>
                {isEdit ? 'Edit Warehouse' : 'Add Warehouse'}
              </h2>

              <p className='mt-0.5 text-xs font-medium text-slate-500 sm:text-sm'>
                {isEdit
                  ? 'Update warehouse information and demand capacity.'
                  : 'Register a new distribution center.'}
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            disabled={isSubmitting}
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
          <div className='space-y-7 p-5 sm:p-7'>
            {/* ================= BASIC INFORMATION ================= */}

            <section>
              <div className='mb-5'>
                <h3 className='text-sm font-bold uppercase tracking-[0.08em] text-slate-700'>
                  Basic Information
                </h3>

                <p className='mt-1 text-xs text-slate-500'>
                  Enter the identifying details of this warehouse.
                </p>
              </div>

              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                {/* Warehouse Code */}

                <FormField label='Warehouse Code' error={errors.warehouseCode}>
                  <input
                    name='warehouseCode'
                    value={formData.warehouseCode}
                    onChange={handleChange}
                    placeholder='WH001'
                    className={inputStyle(errors.warehouseCode)}
                  />
                </FormField>

                {/* Registration Number */}

                <FormField
                  label='Registration Number'
                  error={errors.registrationNumber}
                >
                  <input
                    name='registrationNumber'
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder='REG1001'
                    className={inputStyle(errors.registrationNumber)}
                  />
                </FormField>

                {/* Warehouse Name */}

                <FormField label='Warehouse Name' error={errors.warehouseName}>
                  <input
                    name='warehouseName'
                    value={formData.warehouseName}
                    onChange={handleChange}
                    placeholder='Mumbai Warehouse'
                    className={inputStyle(errors.warehouseName)}
                  />
                </FormField>

                {/* Warehouse Type */}

                <FormField label='Warehouse Type' error={errors.warehouseType}>
                  <input
                    name='warehouseType'
                    value={formData.warehouseType}
                    onChange={handleChange}
                    placeholder='Distribution Center'
                    className={inputStyle(errors.warehouseType)}
                  />
                </FormField>
              </div>
            </section>

            {/* ================= LOCATION ================= */}

            <section className='border-t border-slate-200 pt-7'>
              <div className='mb-5'>
                <h3 className='text-sm font-bold uppercase tracking-[0.08em] text-slate-700'>
                  Location
                </h3>

                <p className='mt-1 text-xs text-slate-500'>
                  Search the warehouse address and select its exact location on
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
                    address: location.address || '',
                    country: location.country || 'India',
                    latitude: location.latitude ?? '',
                    longitude: location.longitude ?? ''
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
                  Configure the warehouse demand capacity and current status.
                </p>
              </div>

              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                {/* Storage Capacity */}

                <FormField
                  label='Maximum Storage Capacity'
                  error={errors.maximumStorageCapacity}
                >
                  <input
                    type='text'
                    inputMode='numeric'
                    name='maximumStorageCapacity'
                    value={formData.maximumStorageCapacity}
                    onChange={e =>
                      updateField(
                        'maximumStorageCapacity',
                        e.target.value.replace(/[^0-9]/g, '')
                      )
                    }
                    placeholder='e.g. 5000'
                    className={inputStyle(errors.maximumStorageCapacity)}
                  />
                </FormField>

                {/* Status */}

                <FormField label='Status'>
                  <select
                    name='status'
                    value={formData.status}
                    onChange={handleChange}
                    className={inputStyle(false)}
                  >
                    <option value='ACTIVE'>Active</option>
                    <option value='INACTIVE'>Inactive</option>
                  </select>
                </FormField>
              </div>
            </section>
          </div>

          {/* ================= FOOTER ================= */}

          <div className='sticky bottom-0 flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:justify-end sm:px-7'>
            <button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={isSubmitting || Object.values(errors).some(err => err)}
              className='flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.55)] transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isSubmitting ? (
                <>
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                  {isEdit ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <CheckCircleIcon size={18} weight='bold' />
                  {isEdit ? 'Save Changes' : 'Add Warehouse'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ================= FORM COMPONENTS ================= */

function FormField({ label, error, children }) {
  return (
    <div>
      <label className='mb-2 block text-sm font-semibold text-slate-700'>
        {label}
        <span className='ml-1 text-rose-500'>*</span>
      </label>

      {children}

      {error && (
        <p className='mt-1.5 text-xs font-medium text-rose-600'>{error}</p>
      )}
    </div>
  )
}

const inputStyle = error =>
  `h-12 w-full rounded-xl border bg-slate-50/70 px-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${error
    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
  }`

export default WarehouseModal
