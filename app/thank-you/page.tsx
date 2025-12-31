'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ThankYouPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your report is ready to download
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-blue-900 mb-2">What's Next?</h2>
            <ul className="text-left text-blue-800 space-y-2">
              <li>✓ Download your PDF report from the results page</li>
              <li>✓ Review the detailed analysis</li>
              <li>✓ Use the data to negotiate with the seller</li>
              <li>✓ Share the report with others if needed</li>
            </ul>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                sessionStorage.clear()
                router.push('/')
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
            >
              Check Another Car
            </button>
            <p className="text-sm text-gray-600">
              Need help? Contact us at support@carpricechecker.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

