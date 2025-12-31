'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkType, setCheckType] = useState<'quick' | 'vin' | null>(null)
  const [orderSummary, setOrderSummary] = useState<any>(null)
  const [checkoutPrice, setCheckoutPrice] = useState('499')

  useEffect(() => {
    // Get data from sessionStorage
    const storedCheckType = sessionStorage.getItem('checkType')
    
    if (!storedCheckType) {
      router.push('/')
      return
    }

    setCheckType(storedCheckType as 'quick' | 'vin')

    // Get checkout price
    const price = sessionStorage.getItem('checkoutPrice') || '499'
    setCheckoutPrice(price)

    // Build order summary based on check type
    if (storedCheckType === 'vin') {
      const vin = sessionStorage.getItem('vin')
      const price = sessionStorage.getItem('price')
      setOrderSummary({
        type: 'Full VIN Report',
        vin,
        askingPrice: price,
      })
    } else {
      const year = sessionStorage.getItem('year')
      const make = sessionStorage.getItem('make')
      const model = sessionStorage.getItem('model')
      const trim = sessionStorage.getItem('trim')
      const mileage = sessionStorage.getItem('mileage')
      const condition = sessionStorage.getItem('condition')
      const hasAccidents = sessionStorage.getItem('hasAccidents') === 'true'
      const zipCode = sessionStorage.getItem('zipCode')
      const price = sessionStorage.getItem('price')
      
      setOrderSummary({
        type: 'Quick Check',
        vehicle: `${year} ${make} ${model}${trim ? ` ${trim}` : ''}`,
        mileage: mileage ? parseInt(mileage).toLocaleString() : '',
        condition,
        hasAccidents,
        zipCode,
        askingPrice: price,
      })
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {

      // First, submit the elements to validate the form
      const { error: submitError } = await elements.submit()
      if (submitError) {
        console.error('Form validation error:', submitError)
        alert(`Form Error: ${submitError.message || 'Please check your payment details.'}`)
        setIsProcessing(false)
        return
      }

      // Then confirm the payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/results`,
        },
        redirect: 'if_required',
      })

      if (confirmError) {
        console.error('Stripe confirmation error:', confirmError)
        alert(`Payment Error: ${confirmError.message || 'Please check your payment details and try again.'}`)
        setIsProcessing(false)
      } else {
        // Payment successful, redirect to results
        router.push('/results')
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      const errorMessage = err?.message || 'An error occurred. Please try again.'
      alert(`Error: ${errorMessage}\n\nCheck the browser console for more details.`)
      setIsProcessing(false)
    }
  }

  if (!checkType || !orderSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const priceDisplay = '$4.99'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Complete Your Purchase
        </h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Check Type:</span>
              <span className="font-medium text-gray-900">{orderSummary.type}</span>
            </div>
            
            {checkType === 'vin' ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">VIN:</span>
                  <span className="font-medium text-gray-900 font-mono">{orderSummary.vin}</span>
                </div>
                {orderSummary.askingPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asking Price:</span>
                    <span className="font-medium text-gray-900">
                      ${parseFloat(orderSummary.askingPrice).toLocaleString()}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium text-gray-900">{orderSummary.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-medium text-gray-900">{orderSummary.mileage} miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium text-gray-900">{orderSummary.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accidents:</span>
                  <span className="font-medium text-gray-900">
                    {orderSummary.hasAccidents ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ZIP Code:</span>
                  <span className="font-medium text-gray-900">{orderSummary.zipCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Asking Price:</span>
                  <span className="font-medium text-gray-900">
                    ${parseFloat(orderSummary.askingPrice).toLocaleString()}
                  </span>
                </div>
              </>
            )}
            
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-blue-600">{priceDisplay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {clientSecret ? (
              <PaymentElement />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Payment form is loading... If this persists, please refresh the page.
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Processing time:</strong> Results in 30 seconds
              </p>
            </div>

            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
            >
              {isProcessing ? 'Processing...' : `Pay ${priceDisplay}`}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get checkout price from sessionStorage
    const checkoutPrice = parseInt(sessionStorage.getItem('checkoutPrice') || '499')
    
    // Create payment intent on mount
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: checkoutPrice,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.error || 'Failed to create payment intent')
          })
        }
        return res.json()
      })
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else if (data.error) {
          console.error('Error creating payment intent:', data.error)
          alert(`Error: ${data.error}\n\nPlease check your Stripe API keys in .env.local`)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error creating payment intent:', err)
        alert(`Error: ${err.message}\n\nPlease check:\n1. Stripe API keys are set in .env.local\n2. Server is running\n3. Check browser console for details`)
        setLoading(false)
      })
  }, [])

  if (loading || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  )
}
