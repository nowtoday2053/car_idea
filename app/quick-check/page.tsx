'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { carMakesModels, years, conditions, type Condition } from '../data/carMakesModels'

export default function QuickCheckPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    trim: '',
    mileage: '',
    condition: 'Good' as Condition,
    hasAccidents: false,
    zipCode: '',
    askingPrice: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availableModels, setAvailableModels] = useState<string[]>([])

  const handleMakeChange = (make: string) => {
    setFormData({ ...formData, make, model: '' })
    setAvailableModels(carMakesModels[make] || [])
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.year) newErrors.year = 'Year is required'
    if (!formData.make) newErrors.make = 'Make is required'
    if (!formData.model) newErrors.model = 'Model is required'
    if (!formData.mileage) {
      newErrors.mileage = 'Mileage is required'
    } else {
      const mileageNum = parseInt(formData.mileage.replace(/,/g, ''))
      if (isNaN(mileageNum) || mileageNum < 0 || mileageNum > 300000) {
        newErrors.mileage = 'Please enter a valid mileage (0-300,000)'
      }
    }
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required'
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit ZIP code'
    }
    if (!formData.askingPrice) {
      newErrors.askingPrice = 'Asking price is required'
    } else {
      const priceNum = parseFloat(formData.askingPrice.replace(/[^0-9.]/g, ''))
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.askingPrice = 'Please enter a valid price'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // Store in sessionStorage
    const cleanPrice = formData.askingPrice.replace(/[^0-9.]/g, '')
    const cleanMileage = formData.mileage.replace(/,/g, '')
    
    sessionStorage.setItem('checkType', 'quick')
    sessionStorage.setItem('year', formData.year)
    sessionStorage.setItem('make', formData.make)
    sessionStorage.setItem('model', formData.model)
    sessionStorage.setItem('trim', formData.trim)
    sessionStorage.setItem('mileage', cleanMileage)
    sessionStorage.setItem('condition', formData.condition)
    sessionStorage.setItem('hasAccidents', formData.hasAccidents.toString())
    sessionStorage.setItem('zipCode', formData.zipCode)
    sessionStorage.setItem('price', cleanPrice)
    sessionStorage.setItem('checkoutPrice', '499') // $4.99 in cents

    // Redirect to Stripe payment link with success URL parameter
    // After successful payment, user will be redirected to /results
    const successUrl = encodeURIComponent(`${window.location.origin}/results`)
    window.location.replace(`https://buy.stripe.com/eVq3cw7xv4RV3mz8VH6EU01?success_url=${successUrl}`)
  }

  const formatMileage = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    if (numericValue) {
      return parseInt(numericValue).toLocaleString()
    }
    return numericValue
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

  const vehicleDescription = formData.year && formData.make && formData.model
    ? `${formData.year} ${formData.make} ${formData.model}${formData.trim ? ` ${formData.trim}` : ''}`
    : ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quick Check</h1>
          <p className="text-xl text-gray-600">No VIN required - just enter the car details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <select
              id="year"
              value={formData.year}
              onChange={(e) => {
                setFormData({ ...formData, year: e.target.value })
                if (errors.year) setErrors({ ...errors, year: '' })
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.year ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
          </div>

          {/* Make */}
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
              Make <span className="text-red-500">*</span>
            </label>
            <select
              id="make"
              value={formData.make}
              onChange={(e) => {
                handleMakeChange(e.target.value)
                if (errors.make) setErrors({ ...errors, make: '' })
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.make ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Make</option>
              {Object.keys(carMakesModels).map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
            {errors.make && <p className="mt-1 text-sm text-red-600">{errors.make}</p>}
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Model <span className="text-red-500">*</span>
            </label>
            <select
              id="model"
              value={formData.model}
              onChange={(e) => {
                setFormData({ ...formData, model: e.target.value })
                if (errors.model) setErrors({ ...errors, model: '' })
              }}
              disabled={!formData.make}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.model ? 'border-red-500' : 'border-gray-300'
              } ${!formData.make ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">{formData.make ? 'Select Model' : 'Select Make first'}</option>
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
          </div>

          {/* Trim */}
          <div>
            <label htmlFor="trim" className="block text-sm font-medium text-gray-700 mb-2">
              Trim Level (Optional)
            </label>
            <input
              type="text"
              id="trim"
              value={formData.trim}
              onChange={(e) => setFormData({ ...formData, trim: e.target.value })}
              placeholder="EX, LX, Sport, Limited, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Mileage */}
          <div>
            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
              Mileage <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="mileage"
              value={formData.mileage}
              onChange={(e) => {
                setFormData({ ...formData, mileage: formatMileage(e.target.value) })
                if (errors.mileage) setErrors({ ...errors, mileage: '' })
              }}
              placeholder="50,000"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.mileage ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.mileage && <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>}
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {conditions.map((condition) => (
                <label
                  key={condition}
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.condition === condition
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="condition"
                    value={condition}
                    checked={formData.condition === condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as Condition })}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Accident History */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accident History
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasAccidents: false })}
                className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                  !formData.hasAccidents
                    ? 'bg-green-50 border-green-500 text-green-700 font-semibold'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                No Accidents
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasAccidents: true })}
                className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                  formData.hasAccidents
                    ? 'bg-red-50 border-red-500 text-red-700 font-semibold'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                Has Accidents
              </button>
            </div>
          </div>

          {/* ZIP Code */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 5)
                setFormData({ ...formData, zipCode: value })
                if (errors.zipCode) setErrors({ ...errors, zipCode: '' })
              }}
              placeholder="90210"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.zipCode ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={5}
            />
            {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
            <p className="mt-1 text-xs text-gray-500">For location-based pricing</p>
          </div>

          {/* Asking Price */}
          <div>
            <label htmlFor="askingPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Asking Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500">$</span>
              <input
                type="text"
                id="askingPrice"
                value={formData.askingPrice}
                onChange={(e) => {
                  setFormData({ ...formData, askingPrice: formatPrice(e.target.value) })
                  if (errors.askingPrice) setErrors({ ...errors, askingPrice: '' })
                }}
                placeholder="25,000"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.askingPrice ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.askingPrice && <p className="mt-1 text-sm text-red-600">{errors.askingPrice}</p>}
          </div>

          {/* Summary Box */}
          {vehicleDescription && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Vehicle:</p>
              <p className="font-semibold text-gray-900 mb-3">{vehicleDescription}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Check Price:</span>
                <span className="text-2xl font-bold text-blue-600">$4.99</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
          >
            Check Price Now - $4.99
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

