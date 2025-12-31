'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'

interface MarketData {
  marketValue: number
  adjustedMarketValue: number
  priceRange: {
    low: number
    high: number
  }
  similarListings: number
  recommendation: string
  difference: number
  isOverpriced: boolean
  isFairPrice?: boolean
  carDetails?: {
    make?: string
    model?: string
    year?: number
    trim?: string
  }
  adjustments?: {
    accident?: number
    condition?: number
    mileage?: number
  }
  negotiationRange?: {
    low: number
    high: number
  }
  checkType: 'quick' | 'vin'
}

export default function ResultsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [checkType, setCheckType] = useState<'quick' | 'vin' | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Get data from sessionStorage
    const storedCheckType = sessionStorage.getItem('checkType')

    if (!storedCheckType) {
      router.push('/')
      return
    }

    setCheckType(storedCheckType as 'quick' | 'vin')

    // Get form data based on check type
    if (storedCheckType === 'vin') {
      const vin = sessionStorage.getItem('vin')
      const price = sessionStorage.getItem('price')
      if (!vin) {
        router.push('/')
        return
      }
      setFormData({ vin, askingPrice: price ? parseFloat(price) : null })
      fetchMarketData({ vin, askingPrice: price ? parseFloat(price) : null })
    } else {
      const formDataObj = {
        year: sessionStorage.getItem('year'),
        make: sessionStorage.getItem('make'),
        model: sessionStorage.getItem('model'),
        trim: sessionStorage.getItem('trim'),
        mileage: sessionStorage.getItem('mileage'),
        condition: sessionStorage.getItem('condition'),
        hasAccidents: sessionStorage.getItem('hasAccidents') === 'true',
        zipCode: sessionStorage.getItem('zipCode'),
        askingPrice: parseFloat(sessionStorage.getItem('price') || '0'),
      }
      setFormData(formDataObj)
      fetchMarketData(formDataObj)
    }
  }, [router])

  const fetchMarketData = async (data: any) => {
    try {
      setLoading(true)
      
      // Simulate loading for better UX (5-10 seconds)
      const minDelay = 5000
      const maxDelay = 10000
      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay

      const [apiResponse] = await Promise.all([
        fetch('/api/market-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }),
        new Promise(resolve => setTimeout(resolve, delay))
      ])

      const result = await apiResponse.json()

      if (!apiResponse.ok) {
        throw new Error(result.error || 'Failed to fetch market data')
      }

      setMarketData(result)
      setError(null)

      // Email sending removed - users can download PDF instead
    } catch (err: any) {
      console.error('Error fetching market data:', err)
      setError(err.message || 'Failed to fetch market data. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  const generatePDF = () => {
    if (!marketData || !formData) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPos = margin

    // Header
    doc.setFontSize(20)
    doc.setTextColor(37, 99, 235)
    doc.text('Car Price Checker Report', pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // Vehicle Info
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    if (marketData.checkType === 'vin') {
      doc.text(`VIN: ${formData.vin}`, margin, yPos)
      yPos += 10
    } else {
      doc.text(`Vehicle: ${formData.year} ${formData.make} ${formData.model}${formData.trim ? ` ${formData.trim}` : ''}`, margin, yPos)
      yPos += 10
      doc.text(`Mileage: ${parseInt(formData.mileage).toLocaleString()} miles`, margin, yPos)
      yPos += 10
      doc.text(`Condition: ${formData.condition}`, margin, yPos)
      yPos += 10
      if (formData.hasAccidents) {
        doc.text(`Accident History: Yes`, margin, yPos)
        yPos += 10
      }
    }

    yPos += 5

    // Results
    doc.setFontSize(16)
    const resultColor = marketData.isOverpriced ? [239, 68, 68] : marketData.isFairPrice ? [59, 130, 246] : [16, 185, 129]
    doc.setTextColor(resultColor[0], resultColor[1], resultColor[2])
    const resultText = marketData.isOverpriced
      ? `OVERPRICED by $${Math.abs(marketData.difference).toLocaleString()}`
      : marketData.isFairPrice
      ? `FAIR PRICE - Within market range`
      : `GOOD DEAL - $${Math.abs(marketData.difference).toLocaleString()} below market`
    doc.text(resultText, margin, yPos)
    yPos += 15

    // Market Analysis
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Market Analysis', margin, yPos)
    yPos += 10

    doc.setFontSize(11)
    doc.text(`Asking Price: $${formData.askingPrice.toLocaleString()}`, margin, yPos)
    yPos += 7
    doc.text(`Market Average: $${marketData.marketValue.toLocaleString()}`, margin, yPos)
    yPos += 7
    if (marketData.adjustedMarketValue !== marketData.marketValue) {
      doc.text(`Adjusted Market Value: $${marketData.adjustedMarketValue.toLocaleString()}`, margin, yPos)
      yPos += 7
    }
    doc.text(
      `Price Range: $${marketData.priceRange.low.toLocaleString()} - $${marketData.priceRange.high.toLocaleString()}`,
      margin,
      yPos
    )
    yPos += 7
    doc.text(`Similar Listings: ${marketData.similarListings}`, margin, yPos)
    yPos += 15

    // Adjustments
    if (marketData.adjustments) {
      doc.setFontSize(12)
      doc.text('Applied Adjustments:', margin, yPos)
      yPos += 8
      doc.setFontSize(10)
      if (marketData.adjustments.accident) {
        doc.text(`Accident History: -${Math.abs(marketData.adjustments.accident).toLocaleString()}`, margin, yPos)
        yPos += 7
      }
      if (marketData.adjustments.condition) {
        doc.text(`Condition: -${Math.abs(marketData.adjustments.condition).toLocaleString()}`, margin, yPos)
        yPos += 7
      }
      if (marketData.adjustments.mileage) {
        doc.text(`Mileage: -${Math.abs(marketData.adjustments.mileage).toLocaleString()}`, margin, yPos)
        yPos += 7
      }
      yPos += 5
    }

    // Recommendation
    doc.setFontSize(12)
    doc.text('Recommendation:', margin, yPos)
    yPos += 8
    doc.setFontSize(10)
    const splitText = doc.splitTextToSize(marketData.recommendation, pageWidth - 2 * margin)
    doc.text(splitText, margin, yPos)
    yPos += splitText.length * 5 + 10

    // Negotiation Range
    if (marketData.negotiationRange) {
      doc.setFontSize(12)
      doc.text('Negotiation Range:', margin, yPos)
      yPos += 8
      doc.setFontSize(11)
      doc.text(
        `$${marketData.negotiationRange.low.toLocaleString()} - $${marketData.negotiationRange.high.toLocaleString()}`,
        margin,
        yPos
      )
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 15
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Generated by Car Price Checker - ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    )

    const filename = marketData.checkType === 'vin' 
      ? `car-price-report-${formData.vin}.pdf`
      : `car-price-report-${formData.year}-${formData.make}-${formData.model}.pdf`
    doc.save(filename)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Analyzing Market Data...</h2>
          <p className="text-gray-600 mb-4">Comparing similar vehicles...</p>
          <p className="text-sm text-gray-500">Calculating fair price...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-red-900 mb-4">Error</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Check Another Car
              </button>
              <p className="text-sm text-gray-600">
                If you were charged, you will receive a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!marketData || !formData) {
    return null
  }

  const difference = marketData.difference
  const isOverpriced = marketData.isOverpriced
  const isFairPrice = marketData.isFairPrice || Math.abs(difference) < marketData.marketValue * 0.02

  // Determine result type and color
  let resultType: 'overpriced' | 'fair' | 'good'
  let resultColor: string
  let resultBg: string
  let resultIcon: string

  if (isOverpriced) {
    resultType = 'overpriced'
    resultColor = 'text-red-900'
    resultBg = 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200'
    resultIcon = '⚠️'
  } else if (isFairPrice) {
    resultType = 'fair'
    resultColor = 'text-blue-900'
    resultBg = 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200'
    resultIcon = '✓'
  } else {
    resultType = 'good'
    resultColor = 'text-green-900'
    resultBg = 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
    resultIcon = '✅'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Result Alert */}
        <div className={`rounded-2xl shadow-xl p-8 mb-8 ${resultBg}`}>
          <div className="text-center">
            <div className="text-6xl mb-4">{resultIcon}</div>
            <h1 className={`text-4xl font-bold mb-4 ${resultColor}`}>
              {isOverpriced
                ? `OVERPRICED by $${Math.abs(difference).toLocaleString()}`
                : isFairPrice
                ? `FAIR PRICE - Within market range`
                : `GOOD DEAL - $${Math.abs(difference).toLocaleString()} below market`}
            </h1>
            <p className="text-xl text-gray-700">{marketData.recommendation}</p>
          </div>
        </div>

        {/* Market Analysis Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Market Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {checkType === 'vin' ? (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">VIN</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">{formData.vin}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Vehicle</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formData.year} {formData.make} {formData.model}{formData.trim ? ` ${formData.trim}` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mileage</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {parseInt(formData.mileage).toLocaleString()} miles
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Condition</p>
                  <p className="text-lg font-semibold text-gray-900">{formData.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Accident History</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formData.hasAccidents ? 'Yes' : 'No'}
                  </p>
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-1">Asking Price</p>
              <p className="text-lg font-semibold text-gray-900">
                ${formData.askingPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Market Average</p>
              <p className="text-lg font-semibold text-blue-600">
                ${marketData.marketValue.toLocaleString()}
              </p>
            </div>
            {marketData.adjustedMarketValue !== marketData.marketValue && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Adjusted Market Value</p>
                <p className="text-lg font-semibold text-purple-600">
                  ${marketData.adjustedMarketValue.toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-1">Price Range</p>
              <p className="text-lg font-semibold text-gray-900">
                ${marketData.priceRange.low.toLocaleString()} - ${marketData.priceRange.high.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Similar Listings</p>
              <p className="text-lg font-semibold text-gray-900">
                {marketData.similarListings} vehicles
              </p>
            </div>
          </div>
        </div>

        {/* Adjustments Section */}
        {marketData.adjustments && Object.keys(marketData.adjustments).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-3">Applied Adjustments</h3>
            <div className="space-y-2 text-sm">
              {marketData.adjustments.accident && (
                <p className="text-yellow-800">
                  • Accident History: -${Math.abs(marketData.adjustments.accident).toLocaleString()}
                </p>
              )}
              {marketData.adjustments.condition && (
                <p className="text-yellow-800">
                  • Condition ({formData.condition}): -${Math.abs(marketData.adjustments.condition).toLocaleString()}
                </p>
              )}
              {marketData.adjustments.mileage && (
                <p className="text-yellow-800">
                  • Mileage Adjustment: -${Math.abs(marketData.adjustments.mileage).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Recommendation Box */}
        {marketData.negotiationRange && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Negotiation Recommendation</h3>
            <p className="text-blue-800 mb-3">
              <strong>Our Recommendation:</strong> Offer ${marketData.negotiationRange.low.toLocaleString()}
            </p>
            <p className="text-blue-800">
              <strong>Negotiation Range:</strong> ${marketData.negotiationRange.low.toLocaleString()} - ${marketData.negotiationRange.high.toLocaleString()}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={generatePDF}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200"
            >
              Download PDF Report
            </button>
            <button
              onClick={() => {
                sessionStorage.clear()
                router.push('/')
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-4 px-6 rounded-lg transition-colors duration-200"
            >
              Check Another Car
            </button>
          </div>
          <p className="text-sm text-gray-600 text-center mt-4">
            Download your PDF report above
          </p>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Negotiation</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use this data to negotiate with the seller</li>
            <li>• Show them the market average and price range</li>
            <li>• Consider similar listings in your area</li>
            <li>• Factor in vehicle condition and mileage</li>
            {marketData.adjustments?.accident && (
              <li>• Mention the accident history adjustment when negotiating</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
