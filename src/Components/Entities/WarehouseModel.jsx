// import React, { useEffect, useState } from 'react'
// import { WarehouseIcon, XIcon } from '@phosphor-icons/react'

// const emptyWarehouse = {
//   warehouseCode: '',
//   warehouseName: '',
//   warehouseType: '',
//   registrationNumber: '',
//   address: '',
//   country: 'India',
//   latitude: '',
//   longitude: '',
//   maximumStorageCapacity: '',
//   status: 'ACTIVE'
// }

// function WarehouseModal ({
//   isOpen,
//   onClose,
//   onSubmit,
//   mode = 'add',
//   initialData = null,
//   isSubmitting = false
// }) {
//   const [formData, setFormData] = useState(emptyWarehouse)

//   const isEdit = mode === 'edit'

//   useEffect(() => {
//     if (!isOpen) return

//     if (isEdit && initialData) {
//       setFormData({
//         warehouseCode: initialData.warehouseCode ?? '',
//         warehouseName: initialData.warehouseName ?? '',
//         warehouseType: initialData.warehouseType ?? '',
//         registrationNumber: initialData.registrationNumber ?? '',
//         address: initialData.address ?? '',
//         country: initialData.country ?? 'India',
//         latitude: initialData.latitude ?? '',
//         longitude: initialData.longitude ?? '',
//         maximumStorageCapacity: initialData.maximumStorageCapacity ?? '',
//         status: initialData.status ?? 'ACTIVE'
//       })
//     } else {
//       setFormData(emptyWarehouse)
//     }
//   }, [isOpen, isEdit, initialData])

//   const handleChange = e => {
//     const { name, value } = e.target

//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleSubmit = e => {
//     e.preventDefault()

//     const payload = {
//       warehouseCode: formData.warehouseCode.trim(),
//       warehouseName: formData.warehouseName.trim(),
//       warehouseType: formData.warehouseType.trim(),
//       registrationNumber: formData.registrationNumber.trim(),
//       address: formData.address.trim(),
//       country: formData.country.trim(),
//       latitude: Number(formData.latitude),
//       longitude: Number(formData.longitude),
//       maximumStorageCapacity: Number(formData.maximumStorageCapacity),
//       status: formData.status
//     }

//     onSubmit(payload)
//   }

//   if (!isOpen) return null

//   return (
//     <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4'>
//       <div className='flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl'>
//         {/* HEADER */}

//         <div className='flex items-start justify-between border-b border-slate-100 px-6 py-5'>
//           <div className='flex items-center gap-3'>
//             <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/10'>
//               <WarehouseIcon size={20} weight='duotone' />
//             </div>

//             <div>
//               <h2 className='text-base font-bold text-slate-900'>
//                 {isEdit ? 'Edit Warehouse' : 'Add Warehouse'}
//               </h2>

//               <p className='mt-0.5 text-xs font-medium text-slate-500'>
//                 {isEdit
//                   ? 'Update warehouse information and demand capacity.'
//                   : 'Register a new distribution center.'}
//               </p>
//             </div>
//           </div>

//           <button
//             type='button'
//             onClick={onClose}
//             className='flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer'
//           >
//             <XIcon size={18} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className='flex min-h-0 flex-1 flex-col'>
//           <div className='overflow-y-auto px-6 py-5 space-y-2'>
//             {/* BASIC */}

//             <FormSection title='Basic Information'>
//               <FormField label='Warehouse Code'>
//                 <input
//                   name='warehouseCode'
//                   value={formData.warehouseCode}
//                   onChange={handleChange}
//                   placeholder='WH001'
//                   required
//                   className={inputStyle}
//                 />
//               </FormField>

//               <FormField label='Registration Number'>
//                 <input
//                   name='registrationNumber'
//                   value={formData.registrationNumber}
//                   onChange={handleChange}
//                   placeholder='REG1001'
//                   required
//                   className={inputStyle}
//                 />
//               </FormField>

//               <FormField label='Warehouse Name'>
//                 <input
//                   name='warehouseName'
//                   value={formData.warehouseName}
//                   onChange={handleChange}
//                   placeholder='Mumbai Warehouse'
//                   required
//                   className={inputStyle}
//                 />
//               </FormField>

//               <FormField label='Warehouse Type'>
//                 <input
//                   name='warehouseType'
//                   value={formData.warehouseType}
//                   onChange={handleChange}
//                   placeholder='Public'
//                   required
//                   className={inputStyle}
//                 />
//               </FormField>
//             </FormSection>

//             {/* LOCATION */}

//             <FormSection title='Location'>
//               <div className='sm:col-span-2'>
//                 <FormField label='Address'>
//                   <textarea
//                     name='address'
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder='Bhiwandi, Mumbai'
//                     rows={3}
//                     required
//                     className={`${inputStyle} h-auto resize-none py-3`}
//                   />
//                 </FormField>
//               </div>

//               <FormField label='Country'>
//                 <input
//                   name='country'
//                   value={formData.country}
//                   onChange={handleChange}
//                   required
//                   className={inputStyle}
//                 />
//               </FormField>

//               <div />

//               <FormField label='Latitude'>
//                 <input
//                   type='number'
//                   name='latitude'
//                   value={formData.latitude}
//                   onChange={handleChange}
//                   step='any'
//                   min='-90'
//                   max='90'
//                   required
//                   className={inputStyle}
//                 />
//               </FormField>

//               <FormField label='Longitude'>
//                 <input
//                   type='number'
//                   name='longitude'
//                   value={formData.longitude}
//                   onChange={handleChange}
//                   step='any'
//                   min='-180'
//                   max='180'
//                   required
//                   className={inputStyle}
//                 />
//               </FormField>
//             </FormSection>

//             {/* CAPACITY */}

//             <FormSection title='Capacity & Status'>
//               <FormField label='Maximum Storage Capacity'>
//                 <input
//                   type='number'
//                   name='maximumStorageCapacity'
//                   value={formData.maximumStorageCapacity}
//                   onChange={handleChange}
//                   min='0'
//                   step='any'
//                   required
//                   className={inputStyle}
//                 />
//               </FormField>

//               <FormField label='Status'>
//                 <select
//                   name='status'
//                   value={formData.status}
//                   onChange={handleChange}
//                   className={inputStyle}
//                 >
//                   <option value='ACTIVE'>Active</option>
//                   <option value='INACTIVE'>Inactive</option>
//                 </select>
//               </FormField>
//             </FormSection>
//           </div>

//           {/* FOOTER */}

//           <div className='flex justify-end gap-3 border-t border-slate-100 px-6 py-4'>
//             <button
//               type='button'
//               onClick={onClose}
//               disabled={isSubmitting}
//               className='h-10 rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer active:scale-95'
//             >
//               Cancel
//             </button>

//             <button
//               type='submit'
//               disabled={isSubmitting}
//               className='h-10 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
//             >
//               {isSubmitting
//                 ? 'Saving...'
//                 : isEdit
//                 ? 'Save Changes'
//                 : 'Add Warehouse'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// function FormSection ({ title, children }) {
//   return (
//     <section className='border-b border-slate-100 py-4 first:pt-0 last:border-0'>
//       <h3 className='mb-3 text-xs font-bold uppercase tracking-wider text-slate-700'>
//         {title}
//       </h3>

//       <div className='grid grid-cols-1 gap-3.5 sm:grid-cols-2'>{children}</div>
//     </section>
//   )
// }

// function FormField ({ label, children }) {
//   return (
//     <div>
//       <label className='mb-1.5 block text-xs font-semibold text-slate-700'>
//         {label}
//         <span className='ml-1 text-rose-500'>*</span>
//       </label>

//       {children}
//     </div>
//   )
// }

// const inputStyle =
//   'h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-medium text-slate-900 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400'

// export default WarehouseModal
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

function WarehouseModal ({
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
        maximumStorageCapacity: initialData.maximumStorageCapacity ?? '',
        status: initialData.status ?? 'ACTIVE'
      })
    } else {
      setFormData({ ...emptyWarehouse })
    }

    setErrors({})
  }, [isOpen, isEdit, initialData])

  if (!isOpen) return null

  const updateField = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    updateField(name, value)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.warehouseCode.trim()) {
      newErrors.warehouseCode = 'Warehouse code is required.'
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required.'
    }

    if (!formData.warehouseName.trim()) {
      newErrors.warehouseName = 'Warehouse name is required.'
    }

    if (!formData.warehouseType.trim()) {
      newErrors.warehouseType = 'Warehouse type is required.'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Please select a warehouse location.'
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.address =
        'Please search and select the warehouse location on the map.'
    }

    if (!formData.maximumStorageCapacity) {
      newErrors.maximumStorageCapacity = 'Maximum storage capacity is required.'
    } else if (Number(formData.maximumStorageCapacity) <= 0) {
      newErrors.maximumStorageCapacity = 'Capacity must be greater than 0.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!validate()) return

    const payload = {
      warehouseCode: formData.warehouseCode.trim(),
      warehouseName: formData.warehouseName.trim(),
      warehouseType: formData.warehouseType.trim(),
      registrationNumber: formData.registrationNumber.trim(),
      address: formData.address.trim(),
      country: formData.country || 'India',
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      maximumStorageCapacity: Number(formData.maximumStorageCapacity),
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
              disabled={isSubmitting}
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

function FormField ({ label, error, children }) {
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
  `h-12 w-full rounded-xl border bg-slate-50/70 px-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
    error
      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
  }`

export default WarehouseModal
