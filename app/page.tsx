'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, Star, Shield, Lock, CreditCard, X, Clock, TrendingUp } from 'lucide-react'

function PurchaseNotification() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(0)

  const notifications = [
    { location: 'New York', car: '2022 Tesla Model 3', time: '5 mins ago', flag: 'US' },
    { location: 'Los Angeles', car: '2021 Ford F-150', time: '3 mins ago', flag: 'US' },
    { location: 'Chicago', car: '2023 Honda Accord', time: '2 mins ago', flag: 'US' },
    { location: 'Houston', car: '2020 BMW 3 Series', time: '8 mins ago', flag: 'US' },
    { location: 'Phoenix', car: '2022 Toyota Camry', time: '1 min ago', flag: 'US' },
    { location: 'Philadelphia', car: '2021 Chevrolet Silverado', time: '4 mins ago', flag: 'US' },
    { location: 'San Antonio', car: '2023 Mercedes-Benz C-Class', time: '6 mins ago', flag: 'US' },
    { location: 'San Diego', car: '2020 Audi A4', time: '7 mins ago', flag: 'US' },
  ]

  useEffect(() => {
    // Show first notification after initial delay
    const initialTimeout = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    // Rotate notifications every 30 seconds
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length)
        setIsVisible(true)
      }, 300) // Small delay for fade out/in
    }, 30000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [notifications.length])

  if (!isVisible) return null

  const notification = notifications[currentNotification]

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm w-full">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700">{notification.flag}</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">
                Someone in {notification.location}
              </p>
              <p className="text-gray-600 text-sm">
                purchased a report for a {notification.car}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{notification.time}</span>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'vin' | 'quick'>('vin')

  return (
    <div className="min-h-screen bg-white">
      {/* Purchase Notification Popup */}
      <PurchaseNotification />
      
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Car Price Checker</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Trusted Market Analysis</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#reviews" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Reviews</a>
              <a href="#faq" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">FAQ</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/quick-check')}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white border border-green-200 px-4 py-2 rounded-md shadow-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-700">30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md shadow-sm">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-700">4.8/5 Rating</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight text-center">
              <span className="whitespace-nowrap">Don't Get Ripped Off.</span>
              <br />
              <span className="text-blue-600">Check Any Car for $4.99</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 text-center max-w-2xl mx-auto">
              Most cars are overpriced by thousands. Find out if you're overpaying in 30 seconds.
            </p>

            {/* Tab Selection */}
            <div className="flex gap-3 mb-8 justify-center">
              <button
                onClick={() => setActiveTab('vin')}
                className={`px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === 'vin'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                VIN Lookup
              </button>
              <button
                onClick={() => setActiveTab('quick')}
                className={`px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === 'quick'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                Quick Check
              </button>
            </div>

            {/* Form */}
            {activeTab === 'vin' ? (
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter VIN (e.g. 1HGBH41JXMN109186)"
                    className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-mono shadow-sm"
                    maxLength={17}
                  />
                  <button
                    onClick={() => router.push('/vin-check')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-md font-semibold text-base hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    Get My Report →
                  </button>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  No account needed • Get your report instantly
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <button
                  onClick={() => router.push('/quick-check')}
                  className="w-full bg-blue-600 text-white px-8 py-4 rounded-md font-semibold text-base hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Start Quick Check →
                </button>
                <p className="text-sm text-gray-500 text-center">
                  No VIN required • Enter car details manually
                </p>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Trusted by 7,250+ buyers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Instant digital delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  <Lock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real reviews from verified customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold text-sm">TS</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Tommy Smith</p>
                  <p className="text-xs text-gray-500">United States</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 text-sm mb-3 leading-relaxed">
                "Had no idea this was a service. Couldn't be more pleased with the savings, the EXACT same product and with the smooth transaction. 5 stars."
              </blockquote>
              <p className="text-xs text-gray-400">7 days ago</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold text-sm">JW</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Jacob Wickham</p>
                  <p className="text-xs text-gray-500">California, US</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 text-sm mb-3 leading-relaxed">
                "This tool works fast and has saved me thousands. I flip cars as a side hustle and this tool helps me save money and make a profit. 10/10 Service."
              </blockquote>
              <p className="text-xs text-gray-400">6 days ago</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-semibold text-sm">TJ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Tee Jay</p>
                  <p className="text-xs text-gray-500">United States</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 text-sm mb-3 leading-relaxed">
                "I've saved thousands with this tool."
              </blockquote>
              <p className="text-xs text-gray-400">Dec 18, 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-lg text-gray-600">Get your car price analysis in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Your Check</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Select Quick Check or Full VIN Report - both $4.99. Get accurate market analysis with or without a VIN.
              </p>
            </div>
            <div className="text-center bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enter Details</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enter your VIN or car details (year, make, model, mileage, condition, etc.) and complete secure payment.
              </p>
            </div>
            <div className="text-center bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your Report</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                View your analysis instantly and download your detailed PDF report. Clear, fast, and way cheaper than buying direct.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-base text-gray-700 mb-4">Ready to check your vehicle?</p>
            <button
              onClick={() => router.push('/quick-check')}
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold text-base hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              See My Report →
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-md mb-4">
              <span className="text-xs font-medium text-blue-700">Over 1,200 reports delivered this week</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Pick the Plan That Matches Your Needs</h2>
            <p className="text-lg text-gray-600">Whether you're buying 1 car or checking multiple, we've got you covered.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Quick Check */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 relative hover:shadow-xl transition-shadow">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  $4<span className="text-3xl text-gray-500">.99</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Check</h3>
                <p className="text-gray-600 text-sm">No VIN Required</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Enter car details manually</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Market comparison analysis</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Accident & condition adjustments</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Location-based pricing</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">PDF report download</span>
                </li>
              </ul>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">30-day money-back guarantee</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-500 text-center">No account needed • Get your report instantly</p>
                <button
                  onClick={() => router.push('/quick-check')}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
                >
                  Get 1 Report Now
                </button>
              </div>
            </div>

            {/* VIN Report */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-xl border border-blue-500 p-8 relative text-white hover:shadow-2xl transition-shadow">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-md">
                BEST VALUE
              </div>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold mb-2">
                  $4<span className="text-3xl opacity-80">.99</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Full VIN Report</h3>
                <p className="text-blue-100 text-sm">Most Accurate</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-yellow-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Everything in Quick Check</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-yellow-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Exact VIN-based matching</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-yellow-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Complete vehicle history</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-yellow-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Accident records & service history</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-yellow-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Most precise pricing available</span>
                </li>
              </ul>

              <div className="bg-blue-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5" />
                  <span className="text-sm font-semibold">Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-semibold">30-day money-back guarantee</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-blue-100 text-center">No account needed • Get your report instantly</p>
                <button
                  onClick={() => router.push('/vin-check')}
                  className="w-full bg-white text-blue-600 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors"
                >
                  Get VIN Report Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Why do I need Car Price Checker?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get the same market analysis data for 85% less. We use the same MarketCheck API that powers major car buying sites, 
                but we pass the savings directly to you. Same accuracy, way cheaper.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Can I get a refund if I get an unhelpful report?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Yes! We offer a 30-day money-back guarantee. If you're not satisfied with your report for any reason, 
                contact us within 30 days for a full refund.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">I've never heard of you. You must be a scam.</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We're a legitimate service that purchases market data in bulk and passes the savings to you. 
                We have thousands of satisfied customers and process all payments securely through Stripe.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Are your reports the same as official market data?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Yes! We use the exact same MarketCheck API that powers major automotive websites. You get the same data, 
                same accuracy, just at a fraction of the cost because we purchase in bulk.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">How fast will I get my report?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Instantly! After payment, you'll see your results in about 30 seconds. You can download your PDF report 
                immediately from the results page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Secure checkout</h3>
              <p className="text-sm text-gray-600">Stripe-encrypted checkout</p>
            </div>
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">No hidden fees</h3>
              <p className="text-sm text-gray-600">No surprise fees - ever</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">100% satisfaction guarantee</h3>
              <p className="text-sm text-gray-600">Full refund if you're not satisfied</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Run a Car Price Check Instantly</h2>
          <p className="text-xl text-gray-600 mb-8">
            Enter your VIN or car details to see if it's overpriced, get market value, and more.
          </p>
          <p className="text-lg text-blue-600 font-semibold mb-8">
            Just $4.99 for any check - get peace of mind before you buy.
          </p>
          <div className="flex gap-3 justify-center mb-4">
            <button
              onClick={() => router.push('/vin-check')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              VIN Number
            </button>
            <button
              onClick={() => router.push('/quick-check')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Quick Check
            </button>
          </div>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter VIN (e.g., 1HGBH41JXMN109186)"
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
              maxLength={17}
            />
            <button
              onClick={() => router.push('/vin-check')}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Run Report →
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Don't know your VIN? Find it on the dashboard, door jamb, or registration papers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Private, secure, and fast. We never store your VIN.</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Instant delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Complete market analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Car Price Checker</h3>
              <p className="text-gray-400 text-sm mb-4">
                We make vehicle price analysis accessible and affordable. Get comprehensive insights into any vehicle's market value, 
                including pricing comparisons and negotiation recommendations – all at the best prices available.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span>🇺🇸</span>
                  <span>United States</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>support@pricecheckcar.com</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm font-semibold text-white mb-1">30-Day Money-Back Guarantee</p>
                <p className="text-xs text-gray-400">
                  Not satisfied? Get a full refund within 30 days.
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/quick-check" className="hover:text-white">Check Vehicle Price</a></li>
                <li><a href="#pricing" className="hover:text-white">Our Pricing</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Refund Policy</a></li>
                <li><a href="#" className="hover:text-white">Money-Back Guarantee</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Fully SSL Secured</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 text-center md:text-right">
                © 2025 Car Price Checker. All rights reserved. This website is not affiliated with MarketCheck Inc or any other related brands mentioned therein.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
