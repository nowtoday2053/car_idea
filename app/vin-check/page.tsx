'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VinCheckPage() {
  const router = useRouter()
  const [vin, setVin] = useState('')
  const [price, setPrice] = useState('')
  const [errors, setErrors] = useState<{ vin?: string; price?: string }>({})

  const validateVin = (value: string) => {
    if (!value) return 'VIN is required'
    if (value.length !== 17) return 'VIN must be exactly 17 characters'
    // VINs cannot contain I, O, or Q
    if (/[IOQ]/.test(value)) return 'VIN cannot contain letters I, O, or Q'
    return null
  }

  const validatePrice = (value: string) => {
    if (!value) return null // Price is optional
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (isNaN(numValue) || numValue <= 0) return 'Please enter a valid price'
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const vinError = validateVin(vin)
    const priceError = validatePrice(price)

    if (vinError || priceError) {
      setErrors({
        vin: vinError || undefined,
        price: priceError || undefined,
      })
      return
    }

    // Store in sessionStorage
    const cleanPrice = price ? price.replace(/[^0-9.]/g, '') : ''
    sessionStorage.setItem('checkType', 'vin')
    sessionStorage.setItem('vin', vin.toUpperCase())
    sessionStorage.setItem('price', cleanPrice)
    sessionStorage.setItem('checkoutPrice', '499') // $4.99 in cents

    router.push('/checkout')
  }

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '')
    if (numericValue) {
      const num = parseFloat(numericValue)
      if (!isNaN(num)) {
        return num.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      }
    }
    return numericValue
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Full VIN Report</h1>
          <p className="text-xl text-gray-600">Get the most accurate pricing with vehicle history</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* VIN Input */}
          <div>
            <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Identification Number (VIN) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="vin"
              value={vin}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().replace(/[IOQ]/gi, '').slice(0, 17)
                setVin(value)
                if (errors.vin) setErrors({ ...errors, vin: undefined })
              }}
              placeholder="Enter 17-character VIN"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono ${
                errors.vin ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={17}
            />
            {errors.vin && (
              <p className="mt-1 text-sm text-red-600">{errors.vin}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Found on your dashboard or driver's side door. VINs cannot contain I, O, or Q.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Characters entered: {vin.length}/17
            </p>
          </div>

          {/* Asking Price (Optional) */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Asking Price (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500">$</span>
              <input
                type="text"
                id="price"
                value={price}
                onChange={(e) => {
                  setPrice(formatPrice(e.target.value))
                  if (errors.price) setErrors({ ...errors, price: undefined })
                }}
                placeholder="25,000 (optional)"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Leave blank if you just want to know the market value
            </p>
          </div>


          {/* Summary Box */}
          {vin.length === 17 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">VIN:</p>
              <p className="font-mono font-semibold text-gray-900 mb-3">{vin}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Full Report Price:</span>
                <span className="text-2xl font-bold text-purple-600">$4.99</span>
              </div>
            </div>
          )}

          {/* Features List */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">This report includes:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Exact VIN-based market value</li>
              <li>✓ Complete vehicle specifications</li>
              <li>✓ Ownership history summary</li>
              <li>✓ Accident records (if any)</li>
              <li>✓ Service records</li>
              <li>✓ Most precise pricing available</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
          >
            Get Full Report - $4.99
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-purple-600 hover:text-purple-700"
            >
              ← Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

