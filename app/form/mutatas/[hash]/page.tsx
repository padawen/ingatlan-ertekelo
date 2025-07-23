'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase/client'
import { useParams } from 'next/navigation'

interface Property {
  id: string
  location: string
  price: number
  dhLink: string
  hash: string
}

export default function MutatasForm() {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [propertyLoading, setPropertyLoading] = useState(true)
  
  const params = useParams()
  const hash = params.hash as string
  const supabase = createClient()

  useEffect(() => {
    loadProperty()
  }, [hash])

  const loadProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('hash', hash)
        .single()

      if (error) throw error
      setProperty(data)
    } catch (error) {
      console.error('Error loading property:', error)
    } finally {
      setPropertyLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const formValues: any = {}

    // Convert FormData to object
    formData.forEach((value, key) => {
      formValues[key] = value
    })

    try {
      const { error } = await supabase
        .from('form_responses')
        .insert([{
          formType: 'mutatas',
          propertyHash: hash,
          answers: formValues,
          submittedAt: new Date().toISOString()
        }])

      if (error) throw error

      // Reset form before showing confirmation
      if (e.currentTarget) {
        e.currentTarget.reset()
      }
      setShowConfirmation(true)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Hiba történt az űrlap beküldésekor. Kérjük, próbálja újra.')
    } finally {
      setLoading(false)
    }
  }

  if (propertyLoading) {
    return (
      <div className="min-h-screen page-background flex items-center justify-center">
        <div className="text-primary-blue">Betöltés...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen page-background flex items-center justify-center">
        <div className="form-container rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ingatlan nem található</h1>
          <p className="text-gray-600">A megadott ingatlan nem létezik vagy már nem elérhető.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="page-background py-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto form-container rounded-xl p-6 md:p-10">
          <header className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="var(--primary-blue)" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline stroke="var(--gold)" points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900">Ingatlan Mutatás Értékelő</h1>
            <p className="text-lg text-blue-700 mt-2">Kérjük, ossza meg velünk tapasztalatait a mutatásról</p>
            <div className="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-primary-blue to-gold"></div>
          </header>

          {/* Property Info */}
          <div className="form-section p-6 rounded-lg mb-8">
            <h2 className="section-header text-2xl font-semibold">Ingatlan információk</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Helyszín:</span> {property.location}
              </div>
              <div>
                <span className="font-medium">Ár:</span> {property.price.toLocaleString()} Ft
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">DunaHouse link:</span>{' '}
                <a
                  href={property.dhLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Ingatlan megtekintése
                </a>
              </div>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Általános elégedettség */}
            <div className="form-section p-6 rounded-lg">
              <h2 className="section-header text-2xl font-semibold">Általános elégedettség</h2>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Összességében mennyire elégedett a mutatással? (1-5 skála)</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input 
                        type="radio" 
                        name="overall-satisfaction" 
                        value={rating} 
                        className="w-4 h-4 mr-2 accent-gold" 
                        required
                      />
                      {rating}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-3 font-medium">Mi tetszett leginkább az ingatlanban?</label>
                <textarea 
                  name="liked-most" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                  rows={3}
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block mb-3 font-medium">Mik voltak a negatívumok?</label>
                <textarea 
                  name="negatives" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                  rows={3}
                ></textarea>
              </div>
            </div>

            {/* Döntés */}
            <div className="form-section p-6 rounded-lg">
              <h2 className="section-header text-2xl font-semibold">Döntés és következő lépések</h2>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Érdekli ez az ingatlan?</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="interested" value="igen" className="w-4 h-4 mr-3 accent-gold" required />
                    Igen, szeretnék ajánlatot tenni
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="interested" value="talán" className="w-4 h-4 mr-3 accent-gold" />
                    Még nem biztos, szeretnék gondolkodni
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="interested" value="nem" className="w-4 h-4 mr-3 accent-gold" />
                    Nem, nem felel meg az igényeinknek
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-3 font-medium">Ha érdekel, milyen áron szeretne ajánlatot tenni?</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    name="offer-price" 
                    className="px-3 py-2 border border-gray-300 rounded-md w-64 focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    placeholder="Pl. 48.000.000" 
                  />
                  <span className="ml-2">Ft</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-3 font-medium">Milyen feltételekkel szeretne ajánlatot tenni?</label>
                <textarea 
                  name="offer-conditions" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                  rows={3}
                  placeholder="Pl. hitelfelvétel függvényben, 30 napos fizetési határidő, stb."
                ></textarea>
              </div>
            </div>

            {/* Kapcsolatfelvétel */}
            <div className="form-section p-6 rounded-lg">
              <h2 className="section-header text-2xl font-semibold">Kapcsolatfelvétel</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-1 font-medium">Név *</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Telefon *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-medium">Email cím *</label>
                <input 
                  type="email" 
                  name="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-3 font-medium">Mikor vehetjük fel Önnel a kapcsolatot?</label>
                <textarea 
                  name="contact-preference" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                  rows={2}
                  placeholder="Pl. hétköznap 9-17 között, hétvégén bármikor"
                ></textarea>
              </div>
            </div>

            {/* Egyéb megjegyzések */}
            <div className="form-section p-6 rounded-lg">
              <h2 className="section-header text-2xl font-semibold">Egyéb megjegyzések</h2>
              
              <div className="mb-2">
                <label className="block mb-3 font-medium">Bármi egyéb, amit fontosnak talál megjegyezni:</label>
                <textarea 
                  name="additional-comments" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                  rows={4}
                ></textarea>
              </div>
            </div>

            {/* Beküldés */}
            <div className="text-center pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn px-10 py-3 rounded-md text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Beküldés...' : 'Értékelés beküldése'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Köszönjük!</h3>
            <p className="text-gray-600 mb-6">Az értékelés sikeresen beküldve. Hamarosan felvesszük Önnel a kapcsolatot.</p>
            <button 
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}
    </>
  )
} 