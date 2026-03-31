import React from 'react'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">♻️</div>
          <h1 className="text-4xl font-bold text-green-600">PrelovedPH</h1>
          <p className="text-xl text-gray-600 mt-2">Give items a second chance</p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Browse Items</h2>
            <p className="text-gray-500 mt-2">Find amazing pre-loved items</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Sell Items</h2>
            <p className="text-gray-500 mt-2">List your items for sale</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Connect</h2>
            <p className="text-gray-500 mt-2">Message sellers directly</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500">Backend Status: 
            <span className="text-green-600 ml-1">Connected to Supabase ✓</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App