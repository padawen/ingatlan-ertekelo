import React from 'react'

interface FormBrandingProps {
  className?: string
}

export default function FormBranding({ className = '' }: FormBrandingProps) {
  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left side - Rita's info */}
        <div className="flex items-center gap-4">
          {/* Rita's photo placeholder */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-blue to-gold flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg font-bold">DR</span>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-primary-blue">Dzimba Rita</h3>
            <p className="text-gold font-medium">Ingatlanközvetítő</p>
            <p className="text-sm text-gray-600">📧 dzimbarita@dh.hu | 📱 +36 XX XXX XXXX</p>
          </div>
        </div>

        {/* Right side - Logos */}
        <div className="flex items-center gap-6">
          {/* DunaHouse logo placeholder */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">DH</span>
            </div>
            <span className="text-sm font-medium text-gray-700">DunaHouse</span>
          </div>
          
          {/* Credipass logo placeholder */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">CP</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Credipass</span>
          </div>
        </div>
      </div>
    </div>
  )
} 