import React from 'react'

export default function Settings() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-start justify-center p-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-8 max-w-[1400px] w-full">
        <h2 className='text-cyan-400 text-xs tracking-[3px] uppercase'>Settings</h2>
        <h1 className='text-2xl text-gray-800 mt-2 font-semibold'>Preferences and integrations</h1>
        
         <p className='text-gray-500 mt-2'> Theme mode, API credentials, and dashboard preferences are managed here.</p>
        
      </div>
    </div>
  )
}
