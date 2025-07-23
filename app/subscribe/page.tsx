'use client'

import React, { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import FormBranding from '../../components/FormBranding'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email.trim()) {
      setError('Email cím megadása kötelező')
      setLoading(false)
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setError('Kérjük, adjon meg egy érvényes email címet')
      setLoading(false)
      return
    }

    try {
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{
          email: email.toLowerCase().trim(),
          name: name.trim() || null,
          source: 'email-series-subscription',
          status: 'subscribed'
        }])

      if (dbError) {
        if (dbError.code === '23505') { // Unique constraint violation
          setError('Ez az email cím már fel van iratkozva')
        } else {
          setError('Hiba történt a feliratkozás során. Kérjük, próbálja újra.')
        }
        console.error('Database error:', dbError)
      } else {
        setSubscribed(true)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Hiba történt a feliratkozás során. Kérjük, próbálja újra.')
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="min-h-screen page-background py-10 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <FormBranding className="mb-8" />
          
          <div className="form-container rounded-xl p-8 text-center">
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-primary-blue mb-4">Sikeres feliratkozás!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Köszönjük a feliratkozást! Hamarosan megkapja az első levelünket az ingatlan adás-vételi folyamatról.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-primary-blue mb-2">Mit fog kapni:</h3>
              <ul className="text-left text-gray-700 space-y-1">
                <li>• 5 részes oktató email-sorozat</li>
                <li>• Praktikus tippek és tanácsok</li>
                <li>• Ingatlan adás-vételi folyamat lépései</li>
                <li>• Hasznos dokumentumok és checklista</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Az email-eket Dzimba Rita küldi személyesen. Bármikor leiratkozhat a levelek alján található linkre kattintva.
            </p>

            <div className="flex justify-center gap-4">
              <a 
                href="https://www.facebook.com/DzimbaRita/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                📘 Facebook oldalam
              </a>
              <a 
                href="https://dzimbarita.dh.hu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-blue text-sm hover:underline"
              >
                🏠 DunaHouse profilom
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-background py-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <FormBranding className="mb-8" />
        
        <div className="form-container rounded-xl p-8">
          <header className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">Ingatlan Oktató Sorozat</h1>
            <p className="text-lg text-gray-700">5 részes email-sorozat az ingatlan adás-vételi folyamatról</p>
            <div className="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-primary-blue to-gold"></div>
          </header>

          {/* Benefits section */}
          <div className="bg-gradient-to-r from-blue-50 to-gold-light rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-primary-blue mb-4">Mit fog megtudni:</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  Mi az a vételi ajánlat és hogyan készítse el?
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  Mit kell tudni a tulajdoni lapról?
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  Ingatlan finanszírozási lehetőségek
                </li>
              </ul>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  Adásvételi szerződés buktatói
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  Költségek és illetékek áttekintése
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  Praktikus tippek a sikeres vásárláshoz
                </li>
              </ul>
            </div>
          </div>

          {/* Subscription form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email cím *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none text-lg"
                placeholder="valaki@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Név (opcionális)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none text-lg"
                placeholder="Az Ön neve"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-blue to-gold text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Feliratkozás...' : 'Feliratkozom az oktató sorozatra'}
            </button>
          </form>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p className="mb-2">
              Az email-eket Dzimba Rita küldi személyesen. Bármikor leiratkozhat.
            </p>
            <p>
              Az adatait bizalmasan kezeljük és nem adjuk át harmadik félnek.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 