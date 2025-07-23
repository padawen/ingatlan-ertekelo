'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const formType = searchParams.get('type')
  const hash = searchParams.get('hash')
  
  return (
    <div className="min-h-screen page-background py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main thank you section */}
        <div className="form-container rounded-xl p-8 md:p-12 text-center mb-8">
          {/* Success Icon */}
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Thank you message */}
          <h1 className="text-4xl font-bold text-primary-blue mb-4">Köszönöm!</h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nagyra értékelem a kitöltésre szánt idejét és a bizalmát! Hamarosan felveszem Önnel a kapcsolatot!
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Addig is, ha kérdése merülne fel ingatlan adás-vétellel kapcsolatban, keressen bizalommal!
          </p>
        </div>

        {/* Educational email series CTA */}
        <div className="form-container rounded-xl p-6 mb-8 bg-gradient-to-r from-blue-50 to-gold-light border border-gold">
          <div className="text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary-blue mb-3">
              Szeretne többet megtudni az ingatlanadásvétel folyamatáról?
            </h2>
            <p className="text-gray-700 mb-6">
              Feliratkozhat 5 részes oktató email-sorozatomra, ahol minden fontos információt megtud az ingatlan adás-vételi folyamatról!
            </p>
            <a 
              href="/subscribe"
              className="inline-block bg-gradient-to-r from-primary-blue to-gold text-white py-4 px-8 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              IDE kattintva feliratkozhat!
            </a>
            <p className="text-sm text-gray-600 mt-4">
              Ingyenes oktató sorozat • 5 hasznos email • Bármikor leiratkozhat
            </p>
          </div>
        </div>

        {/* Canva-style branding section */}
        <div className="form-container rounded-xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Rita's photo and info */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                {/* Rita's photo placeholder - replace with actual image URL */}
                <div className="w-32 h-32 mx-auto lg:mx-0 rounded-full bg-gradient-to-br from-primary-blue to-gold flex items-center justify-center mb-4">
                  <span className="text-white text-2xl font-bold">DR</span>
                </div>
                <h2 className="text-2xl font-bold text-primary-blue mb-2">Dzimba Rita</h2>
                <p className="text-gold font-semibold text-lg">Ingatlanközvetítő</p>
              </div>
              
              {/* Contact info */}
              <div className="space-y-2 text-gray-700">
                <p>📧 dzimbarita@dh.hu</p>
                <p>📱 +36 XX XXX XXXX</p>
              </div>
            </div>

            {/* Right side - Links and QR code */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-primary-blue mb-6">Kövessen a közösségi médiában!</h3>
              
              {/* Social links */}
              <div className="space-y-4 mb-6">
                <a 
                  href="https://www.facebook.com/DzimbaRita/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  📘 Facebook oldalam
                </a>
                <a 
                  href="https://dzimbarita.dh.hu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-primary-blue text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  🏠 DunaHouse profilom
                </a>
              </div>

              {/* QR Code placeholder */}
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm text-center">QR kód<br/>Facebook profil</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Szkenneljék a QR kódot a gyors eléréshez!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logos section */}
        <div className="form-container rounded-xl p-6">
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {/* DunaHouse logo placeholder */}
            <div className="flex items-center">
              <div className="w-24 h-16 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">DH</span>
              </div>
              <span className="ml-2 text-gray-700 font-medium">DunaHouse</span>
            </div>
            
            {/* Credipass logo placeholder */}
            <div className="flex items-center">
              <div className="w-24 h-16 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="ml-2 text-gray-700 font-medium">Credipass</span>
            </div>
          </div>
          
          <p className="text-center text-gray-600 text-sm mt-4">
            Megbízható partnereink garantálják a biztonságos ingatlanügyletet
          </p>
        </div>


      </div>
    </div>
  )
} 