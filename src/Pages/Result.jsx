import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
  DownloadSimpleIcon,
  LightningIcon,
  ShieldCheckIcon,
  SparkleIcon
} from '@phosphor-icons/react'

import SummaryCards from '../Components/Result/SummaryCards'
import RouteVisualization from '../Components/Result/RouteVisualization'
import AllocationSummary from '../Components/Result/AllocationSummary'
import CostSummary from '../Components/Result/CostSummary'
import ErrorCard from '../Components/ErrorCard'
import api from '../api/config'
import { generatereport } from '../Redux/Reports/ReportSlice'
import {
  fetchOptimizationById,
  fetchOptimizationMatrix,
  runOptimization
} from '../Redux/Optimisation/OptimisationSlice'
import LoadingComponent from '../Components/LoadingComponent'


function Result() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { result, isLoading, error } = useSelector(state => state.Optimization)

  const [isVamRunning, setIsVamRunning] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    dispatch(fetchOptimizationById(id))
  }, [dispatch, id])

  // ================= STATUS BADGES =================
  const statusColors = {
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    RUNNING: 'bg-blue-50 text-blue-700 border-blue-200/80',
    FAILED: 'bg-rose-50 text-rose-700 border-rose-200/80'
  }

  const statusIcons = {
    COMPLETED: <CheckCircleIcon size={14} weight='fill' className='text-emerald-500' />,
    RUNNING: <SpinnerGapIcon size={14} className='animate-spin text-blue-500' />,
    FAILED: <WarningCircleIcon size={14} weight='fill' className='text-rose-500' />
  }

  // ================= TRY VAM FLOW FOR PREMIUM USERS =================
  const handleTryVam = async optimizationRunId => {
    if (!optimizationRunId || isVamRunning) return

    try {
      setIsVamRunning(true)

      const matrixData = await dispatch(fetchOptimizationMatrix(optimizationRunId)).unwrap()

      const payload = {
        runName: matrixData.runName ? `${matrixData.runName} (VAM)` : 'Optimization Run (VAM)',
        algorithm: 'VAM',
        factories: (matrixData.factories || []).map(f => ({
          factoryId: f.factoryId,
          supply: Number(f.supply || 0)
        })),
        warehouses: (matrixData.warehouses || []).map(w => ({
          warehouseId: w.warehouseId,
          demand: Number(w.demand || 0)
        })),
        routes: (matrixData.routes || []).map(r => ({
          factoryId: r.factoryId,
          warehouseId: r.warehouseId,
          costPerUnit: Number(r.costPerUnit || 0),
          restricted: Boolean(r.restricted)
        }))
      }

      const res = await dispatch(runOptimization(payload)).unwrap()

      if (res?.optimizationRunId) {
        navigate(`/result/${res.optimizationRunId}`)
      }
    } catch (err) {
      console.error('Failed to re-run optimization with VAM:', err)
      alert(err || 'Failed to re-run optimization with VAM.')
    } finally {
      setIsVamRunning(false)
    }
  }

  // ================= DOWNLOAD REPORT =================
  const handleDownload = async optimizationRunId => {
    try {
      const response = await api.get(
        `/api/v1/reports/download/run/${optimizationRunId}`,
        { responseType: 'blob' }
      )

      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')

      link.href = url
      link.download = `Optimization_Report_${optimizationRunId}.pdf`

      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handlegenerate = async optimizationRunId => {
    try {
      setIsExporting(true)
      await dispatch(generatereport(optimizationRunId))
      await handleDownload(optimizationRunId)
    } catch (err) {
      console.error('ERROR during report generation:', err)
    } finally {
      setIsExporting(false)
    }
  }

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className='flex min-h-[75vh] flex-col items-center justify-center gap-4 bg-slate-50/50'>
        <LoadingComponent />
      </div>
    )
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className='p-6 lg:p-10 bg-slate-50/50 min-h-screen'>
        <ErrorCard
          error={error?.message || error}
          onRetry={() => dispatch(fetchOptimizationById(id))}
        />
      </div>
    )
  }

  // ================= SAFETY =================
  if (!result) return null

  const allocations = result.allocations ?? []
  const isVAM = String(result.algorithm || '').toUpperCase().includes('VAM')

  const statusColor = statusColors[result.status] || 'bg-slate-100 text-slate-700 border-slate-200'
  const statusIcon = statusIcons[result.status] || null

  return (
    <div className='min-h-screen bg-slate-50/70 font-sans antialiased pb-12'>
      {/* HEADER BAR */}
      <header className='sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 py-4 sm:px-8 lg:px-10 shadow-xs'>
        <div className='mx-auto max-w-[1400px]'>
          {/* Back Navigation */}
          <button
            onClick={() => navigate('/optimization-history')}
            className='group mb-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer'
          >
            <ArrowLeftIcon size={14} weight='bold' className='transition-transform group-hover:-translate-x-1' />
            <span>Back to Optimization History</span>
          </button>

          {/* Title & Metadata */}
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <div className='flex items-center gap-2.5 flex-wrap'>
                <span className='inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700 border border-blue-200/60 uppercase tracking-wide'>
                  RUN #{result.optimizationRunId}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[11px] font-bold border ${statusColor}`}
                >
                  {statusIcon}
                  <span>{result.status}</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-extrabold ${isVAM
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                >
                  {isVAM ? <SparkleIcon size={13} weight='fill' className='text-purple-600' /> : <LightningIcon size={13} weight='fill' className='text-amber-500' />}
                  <span>{result.algorithm}</span>
                </span>
              </div>

              <h1 className='mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl'>
                {result.runName || 'Transportation Optimization Result'}
              </h1>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-3 shrink-0'>
              <button
                type='button'
                disabled={isExporting}
                onClick={() => handlegenerate(result.optimizationRunId)}
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 cursor-pointer'
              >
                {isExporting ? (
                  <>
                    <SpinnerGapIcon size={16} className='animate-spin' />
                    <span>Generating Report...</span>
                  </>
                ) : (
                  <>
                    <DownloadSimpleIcon size={16} weight='bold' />
                    <span>Export PDF Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className='p-6 lg:p-8'>
        <div className='mx-auto max-w-[1400px] space-y-6'>
          {/* 1. TOP EXECUTIVE SUMMARY CARDS */}
          <SummaryCards
            result={result}
            onTryVam={handleTryVam}
            isVamRunning={isVamRunning}
          />

          {/* 2. ACTION / COST INSIGHT BANNER */}
          <CostSummary
            result={result}
            onTryVam={handleTryVam}
            isVamRunning={isVamRunning}
          />

          {/* 3. VISUALIZATION ENGINE (PRESERVED) */}
          <RouteVisualization allocations={allocations} />

          {/* 4. ALLOCATION SUMMARY TABLE (PRESERVED) */}
          <AllocationSummary allocations={allocations} />
        </div>
      </main>
    </div>
  )
}

export default Result
