import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  NavigationArrowIcon,
  SpinnerGapIcon,
  CheckCircleIcon,
  WarningCircleIcon
} from '@phosphor-icons/react'

import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

// const TOKEN = "pk.b0ebc97b9c1419682c43235694329d25"
const TOKEN = import.meta.env.VITE_LOCATIONIQ_TOKEN

const DEFAULT_LOCATION = [17.385, 78.4867]

function MapController({ location }) {
  const map = useMap()

  useEffect(() => {
    if (!location) return

    map.flyTo(location, 16, {
      duration: 0.8
    })
  }, [location, map])

  return null
}

function LocationPicker({ value, onChange, disabled = false, error = '' }) {
  const [query, setQuery] = useState(value?.address || '')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [reverseLoading, setReverseLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const searchTimeout = useRef(null)

  const latitude = Number(value?.latitude)
  const longitude = Number(value?.longitude)

  const hasLocation =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude !== 0 &&
    longitude !== 0

  const mapLocation = hasLocation ? [latitude, longitude] : DEFAULT_LOCATION

  useEffect(() => {
    setQuery(value?.address || '')
  }, [value?.address])

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [])

  const searchLocation = text => {
    setQuery(text)
    setSearchError('')

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    if (text.trim().length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams({
          key: TOKEN,
          q: text.trim(),
          limit: '6',
          countrycodes: 'in',
          format: 'json',
          addressdetails: '1',
          normalizeaddress: '1'
        })

        const response = await fetch(
          `https://api.locationiq.com/v1/autocomplete?${params}`
        )

        if (!response.ok) {
          throw new Error('Location search failed')
        }

        const data = await response.json()

        setSuggestions(Array.isArray(data) ? data : [])
        setShowSuggestions(true)
      } catch (error) {
        console.error(error)
        setSuggestions([])
        setSearchError('Unable to search this location.')
      } finally {
        setLoading(false)
      }
    }, 350)
  }

  const selectLocation = location => {
    const lat = Number(location.lat)
    const lng = Number(location.lon)

    const address = location.display_name || location.display_address || ''

    setQuery(address)
    setSuggestions([])
    setShowSuggestions(false)

    onChange({
      address,
      country: location.address?.country || 'India',
      latitude: lat,
      longitude: lng
    })
  }

  const reverseGeocode = async (lat, lng) => {
    try {
      setReverseLoading(true)
      setSearchError('')

      const params = new URLSearchParams({
        key: TOKEN,
        lat: String(lat),
        lon: String(lng),
        format: 'json',
        addressdetails: '1',
        normalizeaddress: '1'
      })

      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse?${params}`
      )

      if (!response.ok) {
        throw new Error('Reverse geocoding failed')
      }

      const data = await response.json()

      const address = data.display_name || ''

      setQuery(address)

      onChange({
        address,
        country: data.address?.country || 'India',
        latitude: lat,
        longitude: lng
      })
    } catch (error) {
      console.error(error)

      // Still save coordinates even if address lookup fails
      onChange({
        address: query,
        country: value?.country || 'India',
        latitude: lat,
        longitude: lng
      })

      setSearchError('Coordinates selected, but address could not be updated.')
    } finally {
      setReverseLoading(false)
    }
  }

  const handleMarkerDrag = event => {
    const position = event.target.getLatLng()

    reverseGeocode(
      Number(position.lat.toFixed(7)),
      Number(position.lng.toFixed(7))
    )
  }

  if (!TOKEN) {
    return (
      <div className='rounded-xl border border-rose-200 bg-rose-50 p-4'>
        <div className='flex items-start gap-3'>
          <WarningCircleIcon
            size={20}
            weight='fill'
            className='mt-0.5 shrink-0 text-rose-500'
          />

          <div>
            <p className='text-sm font-semibold text-rose-800'>
              Location service is not configured
            </p>

            <p className='mt-1 text-xs text-rose-600'>
              Add VITE_LOCATIONIQ_TOKEN to your environment file.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Search */}
      <div className='relative'>
        <div
          className={`flex h-12 items-center rounded-xl border bg-white transition-all ${error
              ? 'border-rose-300 focus-within:border-rose-500'
              : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10'
            }`}
        >
          <MagnifyingGlassIcon
            size={20}
            className='ml-4 shrink-0 text-slate-400'
          />

          <input
            value={query}
            disabled={disabled}
            onChange={e => searchLocation(e.target.value)}
            onFocus={() => {
              if (suggestions.length) {
                setShowSuggestions(true)
              }
            }}
            placeholder='Search factory or warehouse location...'
            className='h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60'
          />

          {loading && (
            <SpinnerGapIcon
              size={19}
              className='mr-4 animate-spin text-blue-500'
            />
          )}

          {!loading && hasLocation && (
            <CheckCircleIcon
              size={19}
              weight='fill'
              className='mr-4 text-emerald-500'
            />
          )}
        </div>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className='absolute left-0 right-0 top-[calc(100%+6px)] z-[1000] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.3)]'>
            {suggestions.map((item, index) => (
              <button
                key={`${item.place_id}-${index}`}
                type='button'
                onClick={() => selectLocation(item)}
                className='flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-blue-50 last:border-b-0'
              >
                <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                  <MapPinIcon size={17} weight='fill' />
                </div>

                <div className='min-w-0'>
                  <p className='truncate text-sm font-semibold text-slate-800'>
                    {item.display_place || item.display_name}
                  </p>

                  <p className='mt-0.5 line-clamp-2 text-xs text-slate-500'>
                    {item.display_address || item.display_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {showSuggestions &&
          !loading &&
          query.trim().length >= 3 &&
          suggestions.length === 0 &&
          !searchError && (
            <div className='absolute left-0 right-0 top-[calc(100%+6px)] z-[1000] rounded-xl border border-slate-200 bg-white p-4 shadow-lg'>
              <p className='text-sm font-semibold text-slate-700'>
                No locations found
              </p>

              <p className='mt-1 text-xs text-slate-400'>
                Try adding a city, state or PIN code.
              </p>
            </div>
          )}
      </div>

      {searchError && (
        <div className='flex items-center gap-2 text-xs font-medium text-rose-600'>
          <WarningCircleIcon size={15} weight='fill' />
          {searchError}
        </div>
      )}

      {/* Map */}
      <div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100'>
        <MapContainer
          center={mapLocation}
          zoom={hasLocation ? 16 : 5}
          scrollWheelZoom
          className='h-[320px] w-full sm:h-[360px]'
        >
          <TileLayer
            url={`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${TOKEN}`}
            attribution='&copy; LocationIQ &copy; OpenStreetMap contributors'
          />

          <MapController location={hasLocation ? mapLocation : null} />

          {hasLocation && (
            <Marker
              position={mapLocation}
              draggable={!disabled}
              eventHandlers={{
                dragend: handleMarkerDrag
              }}
            />
          )}
        </MapContainer>

        {/* Map hint */}
        {hasLocation && (
          <div className='pointer-events-none absolute bottom-4 left-1/2 z-[500] -translate-x-1/2'>
            <div className='flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-4 py-2 text-xs font-semibold text-slate-600 shadow-lg backdrop-blur'>
              {reverseLoading ? (
                <>
                  <SpinnerGapIcon
                    size={14}
                    className='animate-spin text-blue-500'
                  />
                  Updating address...
                </>
              ) : (
                <>
                  <NavigationArrowIcon
                    size={14}
                    weight='fill'
                    className='text-blue-500'
                  />
                  Drag the pin to adjust the exact location
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected location details */}
      {hasLocation && (
        <div className='rounded-xl border border-emerald-200 bg-emerald-50/60 p-4'>
          <div className='flex items-start gap-3'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600'>
              <CheckCircleIcon size={19} weight='fill' />
            </div>

            <div className='min-w-0 flex-1'>
              <p className='text-xs font-bold uppercase tracking-wider text-emerald-700'>
                Location selected
              </p>

              <p className='mt-1 text-sm font-semibold leading-relaxed text-slate-800'>
                {value?.address || 'Selected location'}
              </p>

              <div className='mt-3 flex flex-wrap gap-2'>
                <span className='rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200'>
                  Lat: {latitude.toFixed(6)}
                </span>

                <span className='rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200'>
                  Lng: {longitude.toFixed(6)}
                </span>

                <span className='rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200'>
                  {value?.country || 'India'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className='text-xs font-medium text-rose-600'>{error}</p>}
    </div>
  )
}

export default LocationPicker
