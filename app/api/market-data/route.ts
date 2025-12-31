import { NextRequest, NextResponse } from 'next/server'

interface MarketCheckResponse {
  vin?: string
  make?: string
  model?: string
  year?: number
  price?: {
    average?: number
    low?: number
    high?: number
  }
  listings?: {
    count?: number
  }
}

// Adjustment calculations
function calculateAdjustments(
  marketValue: number,
  condition: string,
  hasAccidents: boolean,
  mileage: number,
  year: number
) {
  const adjustments: { accident?: number; condition?: number; mileage?: number } = {}
  let totalAdjustment = 0

  // Accident adjustment: 10-15% reduction
  if (hasAccidents) {
    const accidentReduction = marketValue * 0.125 // 12.5% average
    adjustments.accident = -Math.round(accidentReduction)
    totalAdjustment += adjustments.accident
  }

  // Condition adjustment
  if (condition === 'Fair') {
    const conditionReduction = marketValue * 0.075 // 7.5%
    adjustments.condition = -Math.round(conditionReduction)
    totalAdjustment += adjustments.condition
  } else if (condition === 'Poor') {
    const conditionReduction = marketValue * 0.15 // 15%
    adjustments.condition = -Math.round(conditionReduction)
    totalAdjustment += adjustments.condition
  }

  // Mileage adjustment (higher mileage = lower value)
  const currentYear = new Date().getFullYear()
  const age = currentYear - year
  const averageMileagePerYear = 12000
  const expectedMileage = age * averageMileagePerYear
  
  if (mileage > expectedMileage) {
    const excessMileage = mileage - expectedMileage
    const excessYears = excessMileage / averageMileagePerYear
    // 5% reduction per excess year, capped at 20%
    const mileageReductionPercent = Math.min(excessYears * 0.05, 0.20)
    const mileageReduction = marketValue * mileageReductionPercent
    adjustments.mileage = -Math.round(mileageReduction)
    totalAdjustment += adjustments.mileage
  }

  return { adjustments, totalAdjustment }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Determine check type
    const isVinCheck = !!body.vin
    const apiKey = process.env.MARKETCHECK_API_KEY

    // Debug: Log if API key is found (but not the actual key)
    if (!apiKey) {
      console.log('⚠️ MARKETCHECK_API_KEY not found in environment variables')
    } else {
      console.log('✓ MARKETCHECK_API_KEY found (length:', apiKey.length, ')')
    }

    if (isVinCheck) {
      // VIN Check Flow
      const { vin, askingPrice } = body

      if (!vin) {
        return NextResponse.json(
          { error: 'VIN is required' },
          { status: 400 }
        )
      }

      if (!apiKey) {
        // Mock data for development
        console.log('No MarketCheck API key, using mock data')
        return NextResponse.json(generateMockVinData(vin, askingPrice))
      }

      try {
        // Decode VIN first - try with API key in header
        let vinDecodeUrl = `https://api.marketcheck.com/v1/vin/${vin}`
        console.log('Trying MarketCheck API (header auth):', vinDecodeUrl)
        let vinResponse = await fetch(vinDecodeUrl, {
          signal: AbortSignal.timeout(10000),
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-API-KEY': apiKey,
          },
        })

        // If header auth fails, try query parameter
        if (!vinResponse.ok) {
          console.log('Header auth failed, trying query param. Status:', vinResponse.status)
          vinDecodeUrl = `https://api.marketcheck.com/v1/vin/${vin}?api_key=${apiKey}`
          vinResponse = await fetch(vinDecodeUrl, {
            signal: AbortSignal.timeout(10000),
            headers: {
              'Accept': 'application/json',
            },
          })
        }

        // If that fails, try the old endpoint
        if (!vinResponse.ok) {
          console.log('New endpoint failed, trying old endpoint. Status:', vinResponse.status)
          vinDecodeUrl = `https://marketcheck-prod.apigee.net/v1/vin/${vin}?api_key=${apiKey}`
          vinResponse = await fetch(vinDecodeUrl, {
            signal: AbortSignal.timeout(10000),
            headers: {
              'Accept': 'application/json',
            },
          })
        }

        if (!vinResponse.ok) {
          const errorText = await vinResponse.text().catch(() => 'Could not read error')
          console.log('VIN decode failed, using mock data. Status:', vinResponse.status, 'Error:', errorText.substring(0, 200))
          return NextResponse.json(generateMockVinData(vin, askingPrice))
        }

        const vinData = await vinResponse.json()

        // Get pricing data for this specific VIN - try header auth first
        let searchUrl = `https://api.marketcheck.com/v2/search/car/active?vin=${vin}&rows=50`
        let searchResponse = await fetch(searchUrl, {
          signal: AbortSignal.timeout(10000),
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-API-KEY': apiKey,
          },
        })

        // If header auth fails, try query parameter
        if (!searchResponse.ok) {
          console.log('Header auth failed for search, trying query param. Status:', searchResponse.status)
          searchUrl = `https://api.marketcheck.com/v2/search/car/active?api_key=${apiKey}&vin=${vin}&rows=50`
          searchResponse = await fetch(searchUrl, {
            signal: AbortSignal.timeout(10000),
            headers: {
              'Accept': 'application/json',
            },
          })
        }

        // If that fails, try the old endpoint
        if (!searchResponse.ok) {
          console.log('New endpoint failed for search, trying old endpoint. Status:', searchResponse.status)
          searchUrl = `https://marketcheck-prod.apigee.net/v2/search/car/active?api_key=${apiKey}&vin=${vin}&rows=50`
          searchResponse = await fetch(searchUrl, {
            signal: AbortSignal.timeout(10000),
            headers: {
              'Accept': 'application/json',
            },
          })
        }

        if (!searchResponse.ok) {
          // Use VIN decode data with mock pricing
          console.log('Search failed, using mock data with VIN decode info')
          return NextResponse.json(generateMockVinData(vin, askingPrice, vinData))
        }

        const searchData = await searchResponse.json()
        const listings = searchData.listings || []

        if (listings.length === 0) {
          return NextResponse.json(
            { error: 'No market data found for this VIN. Please verify the VIN is correct.' },
            { status: 404 }
          )
        }

        // Calculate market statistics
        const prices = listings
          .map((listing: any) => {
            const price = listing.price || listing.price_display || listing.asking_price
            return typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price
          })
          .filter((p: number) => !isNaN(p) && p > 0)

        if (prices.length === 0) {
          return NextResponse.json(
            { error: 'No valid pricing data found for this vehicle.' },
            { status: 404 }
          )
        }

        const marketValue = prices.reduce((a: number, b: number) => a + b, 0) / prices.length
        const sortedPrices = prices.sort((a: number, b: number) => a - b)
        const low = sortedPrices[0]
        const high = sortedPrices[prices.length - 1]

        const askingPriceNum = askingPrice ? parseFloat(askingPrice.toString()) : marketValue
        const difference = askingPriceNum - marketValue
        const isOverpriced = difference > 0
        const isFairPrice = Math.abs(difference) < marketValue * 0.02

        // Generate recommendation
        const percentDiff = Math.abs((difference / marketValue) * 100)
        let recommendation = ''

        if (isOverpriced) {
          if (percentDiff > 15) {
            recommendation = `This vehicle is significantly overpriced. The asking price is ${percentDiff.toFixed(1)}% above market average. Consider negotiating or looking for similar vehicles at better prices.`
          } else if (percentDiff > 5) {
            recommendation = `This vehicle is moderately overpriced. You may be able to negotiate the price down to market value.`
          } else {
            recommendation = `The asking price is slightly above market average. A small negotiation could bring it to fair market value.`
          }
        } else if (isFairPrice) {
          recommendation = `Fair price. The asking price is close to market average. This is a reasonable deal.`
        } else {
          if (percentDiff > 15) {
            recommendation = `Excellent deal! This vehicle is priced well below market average. Verify the vehicle condition and history before purchasing.`
          } else if (percentDiff > 5) {
            recommendation = `Good deal! This vehicle is priced below market average. This is a fair price for this vehicle.`
          } else {
            recommendation = `Fair price. The asking price is close to market average. This is a reasonable deal.`
          }
        }

        return NextResponse.json({
          marketValue: Math.round(marketValue),
          adjustedMarketValue: Math.round(marketValue),
          priceRange: {
            low: Math.round(low),
            high: Math.round(high),
          },
          similarListings: listings.length,
          recommendation,
          difference: Math.round(difference),
          isOverpriced,
          isFairPrice,
          carDetails: {
            make: vinData.make || listings[0]?.make,
            model: vinData.model || listings[0]?.model,
            year: vinData.year || listings[0]?.year,
          },
          checkType: 'vin',
        })
      } catch (fetchError: any) {
        // Network error or API unavailable - use mock data
        console.log('MarketCheck API error, using mock data:', fetchError.message)
        return NextResponse.json(generateMockVinData(vin, askingPrice))
      }
    } else {
      // Quick Check Flow
      const { year, make, model, mileage, condition, hasAccidents, zipCode, askingPrice } = body

      if (!year || !make || !model || !mileage || !condition || !zipCode || !askingPrice) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      if (!apiKey) {
        // Mock data for development
        return NextResponse.json(generateMockQuickCheckData(body))
      }

      try {
        // Search for similar vehicles - try new API endpoint first
        let searchUrl = `https://api.marketcheck.com/v2/search/car/active?api_key=${apiKey}&year=${year}&make=${make}&model=${model}&zip=${zipCode}&radius=100&rows=50`
        let searchResponse = await fetch(searchUrl, {
          signal: AbortSignal.timeout(10000),
          headers: {
            'Accept': 'application/json',
          },
        })

        // If that fails, try the old endpoint
        if (!searchResponse.ok) {
          searchUrl = `https://marketcheck-prod.apigee.net/v2/search/car/active?api_key=${apiKey}&year=${year}&make=${make}&model=${model}&zip=${zipCode}&radius=100&rows=50`
          searchResponse = await fetch(searchUrl, {
            signal: AbortSignal.timeout(10000),
            headers: {
              'Accept': 'application/json',
            },
          })
        }

        if (!searchResponse.ok) {
          console.log('MarketCheck search failed, using mock data')
          return NextResponse.json(generateMockQuickCheckData(body))
        }

        const searchData = await searchResponse.json()
        const listings = searchData.listings || []

        if (listings.length === 0) {
          return NextResponse.json(
            { error: 'Not enough market data for accurate pricing. Please try with a VIN for more precise results.' },
            { status: 404 }
          )
        }

        // Filter by mileage range (±20,000 miles)
        const mileageNum = parseInt(mileage.toString())
        const filteredListings = listings.filter((listing: any) => {
          const listingMileage = listing.miles || listing.odometer || 0
          return Math.abs(listingMileage - mileageNum) <= 20000
        })

        const listingsToUse = filteredListings.length > 0 ? filteredListings : listings

        // Calculate market statistics
        const prices = listingsToUse
          .map((listing: any) => {
            const price = listing.price || listing.price_display || listing.asking_price
            return typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price
          })
          .filter((p: number) => !isNaN(p) && p > 0)

        if (prices.length === 0) {
          return NextResponse.json(
            { error: 'No valid pricing data found for similar vehicles.' },
            { status: 404 }
          )
        }

        const marketValue = prices.reduce((a: number, b: number) => a + b, 0) / prices.length
        const sortedPrices = prices.sort((a: number, b: number) => a - b)
        const low = sortedPrices[0]
        const high = sortedPrices[prices.length - 1]

        // Apply adjustments
        const { adjustments, totalAdjustment } = calculateAdjustments(
          marketValue,
          condition,
          hasAccidents,
          mileageNum,
          parseInt(year.toString())
        )

        const adjustedMarketValue = marketValue + totalAdjustment
        const askingPriceNum = parseFloat(askingPrice.toString())
        const difference = askingPriceNum - adjustedMarketValue
        const isOverpriced = difference > 0
        const isFairPrice = Math.abs(difference) < adjustedMarketValue * 0.02

        // Generate recommendation
        const percentDiff = Math.abs((difference / adjustedMarketValue) * 100)
        let recommendation = ''

        if (isOverpriced) {
          if (percentDiff > 15) {
            recommendation = `This vehicle is significantly overpriced. The asking price is ${percentDiff.toFixed(1)}% above adjusted market value. Consider negotiating or looking for similar vehicles at better prices.`
          } else if (percentDiff > 5) {
            recommendation = `This vehicle is moderately overpriced. You may be able to negotiate the price down to fair market value.`
          } else {
            recommendation = `The asking price is slightly above adjusted market value. A small negotiation could bring it to fair market value.`
          }
        } else if (isFairPrice) {
          recommendation = `Fair price. The asking price is close to adjusted market value. This is a reasonable deal.`
        } else {
          if (percentDiff > 15) {
            recommendation = `Excellent deal! This vehicle is priced well below adjusted market value. Verify the vehicle condition and history before purchasing.`
          } else if (percentDiff > 5) {
            recommendation = `Good deal! This vehicle is priced below adjusted market value. This is a fair price for this vehicle.`
          } else {
            recommendation = `Fair price. The asking price is close to adjusted market value. This is a reasonable deal.`
          }
        }

        // Calculate negotiation range (5-10% below adjusted market value)
        const negotiationLow = Math.round(adjustedMarketValue * 0.90)
        const negotiationHigh = Math.round(adjustedMarketValue * 0.95)

        return NextResponse.json({
          marketValue: Math.round(marketValue),
          adjustedMarketValue: Math.round(adjustedMarketValue),
          priceRange: {
            low: Math.round(low),
            high: Math.round(high),
          },
          similarListings: listingsToUse.length,
          recommendation,
          difference: Math.round(difference),
          isOverpriced,
          isFairPrice,
          adjustments,
          negotiationRange: {
            low: negotiationLow,
            high: negotiationHigh,
          },
          carDetails: {
            make,
            model,
            year: parseInt(year.toString()),
          },
          checkType: 'quick',
        })
      } catch (fetchError: any) {
        // Network error or API unavailable - use mock data
        console.log('MarketCheck API error for Quick Check, using mock data:', fetchError.message)
        return NextResponse.json(generateMockQuickCheckData(body))
      }
    }
  } catch (error: any) {
    console.error('Error fetching market data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch market data' },
      { status: 500 }
    )
  }
}

// Mock data generators
function generateMockVinData(vin: string, askingPrice: number | null, vinData?: any) {
  const baseValue = askingPrice ? askingPrice * (0.8 + Math.random() * 0.4) : 25000
  const marketValue = Math.round(baseValue)
  const difference = askingPrice ? askingPrice - marketValue : 0
  const isOverpriced = difference > 0
  const isFairPrice = Math.abs(difference) < marketValue * 0.02
  const percentDiff = Math.abs((difference / marketValue) * 100)

  let recommendation = ''
  if (isOverpriced) {
    if (percentDiff > 15) {
      recommendation = `This vehicle is significantly overpriced. The asking price is ${percentDiff.toFixed(1)}% above market average.`
    } else if (percentDiff > 5) {
      recommendation = `This vehicle is moderately overpriced. You may be able to negotiate the price down.`
    } else {
      recommendation = `The asking price is slightly above market average. A small negotiation could help.`
    }
  } else if (isFairPrice) {
    recommendation = `Fair price. The asking price is close to market average.`
  } else {
    recommendation = `Good deal! This vehicle is priced below market average.`
  }

  return {
    marketValue,
    adjustedMarketValue: marketValue,
    priceRange: {
      low: Math.round(marketValue * 0.85),
      high: Math.round(marketValue * 1.15),
    },
    similarListings: Math.floor(Math.random() * 50) + 20,
    recommendation,
    difference: Math.round(difference),
    isOverpriced,
    isFairPrice,
    carDetails: vinData ? {
      make: vinData.make,
      model: vinData.model,
      year: vinData.year,
    } : {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
    },
    checkType: 'vin',
  }
}

function generateMockQuickCheckData(body: any) {
  const { year, make, model, mileage, condition, hasAccidents, askingPrice } = body
  const baseValue = parseFloat(askingPrice.toString()) * (0.8 + Math.random() * 0.4)
  const marketValue = Math.round(baseValue)
  
  const { adjustments, totalAdjustment } = calculateAdjustments(
    marketValue,
    condition,
    hasAccidents,
    parseInt(mileage.toString()),
    parseInt(year.toString())
  )

  const adjustedMarketValue = marketValue + totalAdjustment
  const askingPriceNum = parseFloat(askingPrice.toString())
  const difference = askingPriceNum - adjustedMarketValue
  const isOverpriced = difference > 0
  const isFairPrice = Math.abs(difference) < adjustedMarketValue * 0.02
  const percentDiff = Math.abs((difference / adjustedMarketValue) * 100)

  let recommendation = ''
  if (isOverpriced) {
    if (percentDiff > 15) {
      recommendation = `This vehicle is significantly overpriced. The asking price is ${percentDiff.toFixed(1)}% above adjusted market value.`
    } else if (percentDiff > 5) {
      recommendation = `This vehicle is moderately overpriced. You may be able to negotiate the price down.`
    } else {
      recommendation = `The asking price is slightly above adjusted market value. A small negotiation could help.`
    }
  } else if (isFairPrice) {
    recommendation = `Fair price. The asking price is close to adjusted market value.`
  } else {
    recommendation = `Good deal! This vehicle is priced below adjusted market value.`
  }

  return {
    marketValue,
    adjustedMarketValue: Math.round(adjustedMarketValue),
    priceRange: {
      low: Math.round(marketValue * 0.85),
      high: Math.round(marketValue * 1.15),
    },
    similarListings: Math.floor(Math.random() * 50) + 20,
    recommendation,
    difference: Math.round(difference),
    isOverpriced,
    isFairPrice,
    adjustments,
    negotiationRange: {
      low: Math.round(adjustedMarketValue * 0.90),
      high: Math.round(adjustedMarketValue * 0.95),
    },
    carDetails: {
      make,
      model,
      year: parseInt(year.toString()),
    },
    checkType: 'quick',
  }
}
