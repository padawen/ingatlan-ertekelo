'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import FormBranding from '../../../../components/FormBranding'

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
  const router = useRouter()
  const hash = params.hash as string
  const supabase = createClient()

  useEffect(() => {
    loadProperty()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Redirect to thank you page instead of showing modal
      router.push(`/form/thank-you?type=mutatas&hash=${hash}`)
      
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
        <div className="max-w-4xl mx-auto">
          {/* Branding Component */}
          <FormBranding className="mb-8" />
          
          <div className="form-container rounded-xl p-6 md:p-10">
            {/* Header with branding */}
            <header className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="var(--primary-blue)" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline stroke="var(--gold)" points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900">Megtekintett ingatlan értékelése</h1>
              <p className="text-lg text-blue-700 mt-2">Dzimba Rita – Ingatlanközvetítő</p>
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
              {/* Ingatlan értékelése */}
              <div className="form-section p-6 rounded-lg">
                <h2 className="section-header text-2xl font-semibold">Ingatlan értékelése</h2>
                
                <div className="mb-6">
                  <label className="block mb-3 font-medium">Kérjük, értékelje az ingatlant egy 1-től 5-ig terjedő skálán, ahol az 1 &quot;egyáltalán nem tetszett&quot;, az 5 pedig &quot;kimagaslóan tetszett&quot;.</label>
                  <div className="flex gap-6">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="flex flex-col items-center">
                        <input 
                          type="radio" 
                          name="property-rating" 
                          value={rating} 
                          className="w-5 h-5 mb-1 accent-gold" 
                          required
                        />
                        <span className="text-sm">{rating}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Milyen érzése volt, amikor bejárta az ingatlant? El tudná itt képzelni a mindennapjait?</label>
                  <textarea 
                    name="property-feeling" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Mi tetszett Önnek a legjobban ebben az ingatlanban?</label>
                  <textarea 
                    name="most-liked" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Volt-e valami, ami kevésbé nyerte el a tetszését?</label>
                  <div className="space-y-2 mb-3">
                    <label className="flex items-center">
                      <input type="radio" name="disliked-option" value="nem" className="w-4 h-4 mr-3 accent-gold" required />
                      Nem volt ilyen
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="disliked-option" value="igen" className="w-4 h-4 mr-3 accent-gold" />
                      Igen, éspedig:
                    </label>
                  </div>
                  <textarea 
                    name="disliked-details" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={2}
                    placeholder="Írja le, mi nem tetszett..."
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Változtatna valamit az ingatlanon, hogy jobban megfeleljen az igényeinek?</label>
                  <div className="space-y-2 mb-3">
                    <label className="flex items-center">
                      <input type="radio" name="changes-option" value="nem" className="w-4 h-4 mr-3 accent-gold" required />
                      Nem
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="changes-option" value="igen" className="w-4 h-4 mr-3 accent-gold" />
                      Igen, ezt:
                    </label>
                  </div>
                  <textarea 
                    name="changes-details" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={2}
                    placeholder="Írja le, mit változtatna..."
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Az ingatlanról szerzett benyomásom a hirdetés tükrében:</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="advertisement-accuracy" value="pleasant-surprise" className="w-4 h-4 mr-3 accent-gold" required />
                      Kellemes meglepetés volt, jobb, mint a képeken/leírásban
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="advertisement-accuracy" value="as-expected" className="w-4 h-4 mr-3 accent-gold" />
                      A hirdetésben ígérteknek megfelelően teljesített
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="advertisement-accuracy" value="disappointed" className="w-4 h-4 mr-3 accent-gold" />
                      Elmaradt a hirdetés által keltett elvárásoktól
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Mennyire tartja reálisnak az ingatlan jelenlegi árát a látottak alapján?</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="price-realism" value="underpriced" className="w-4 h-4 mr-3 accent-gold" required />
                      Alulárazott
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="price-realism" value="realistic" className="w-4 h-4 mr-3 accent-gold" />
                      Reális az ár
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="price-realism" value="negotiable" className="w-4 h-4 mr-3 accent-gold" />
                      Ésszerű alkuval elfogadható az ár
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="price-realism" value="overpriced" className="w-4 h-4 mr-3 accent-gold" />
                      Erősen túlárazott
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Ha most kellene ajánlatot tennie, mennyi lenne az az összeg, amit reálisnak tartana érte?</label>
                  <input 
                    type="text" 
                    name="realistic-price" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    placeholder="pl. 45 000 000 Ft"
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Van-e valamilyen kérdése az ingatlannal vagy a környékkel kapcsolatban, amire nem kaptunk választ?</label>
                  <div className="space-y-2 mb-3">
                    <label className="flex items-center">
                      <input type="radio" name="questions-option" value="nincs" className="w-4 h-4 mr-3 accent-gold" required />
                      Nincs
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="questions-option" value="igen" className="w-4 h-4 mr-3 accent-gold" />
                      Igen:
                    </label>
                  </div>
                  <textarea 
                    name="questions-details" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={2}
                    placeholder="Írja le kérdéseit..."
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Szeretné újra megtekinteni az ingatlant? (pl. házastárssal, szakemberrel, stb.)</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="revisit" value="igen" className="w-4 h-4 mr-3 accent-gold" required />
                      Igen
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="revisit" value="nem" className="w-4 h-4 mr-3 accent-gold" />
                      Nem
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Szeretne tenni az ingatlanra vételi ajánlatot?</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="purchase-offer" value="igen" className="w-4 h-4 mr-3 accent-gold" required />
                      Igen
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="purchase-offer" value="nem" className="w-4 h-4 mr-3 accent-gold" />
                      Nem
                    </label>
                  </div>
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
                  <label className="block mb-1 font-medium">Mikor hívjam fel? *</label>
                  <select 
                    name="call-time" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    required
                  >
                    <option value="">Válasszon időpontot</option>
                    <option value="morning">Délelőtt (9-12)</option>
                    <option value="afternoon">Délután (12-17)</option>
                    <option value="evening">Este (17-19)</option>
                    <option value="anytime">Bármikor</option>
                  </select>
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
      </div>
    </>
  )
} 