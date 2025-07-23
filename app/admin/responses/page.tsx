'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase/client'
import AdminNavbar from '../../../components/AdminNavbar'

interface FormResponse {
  id: string
  formType: string
  propertyHash?: string
  answers: any
  submittedAt: string
}

interface Property {
  id: string
  location: string
  hash: string
}

export default function ResponsesPage() {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null)

  const supabase = createClient()

  useEffect(() => {
    checkUser()
    loadData()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const loadData = async () => {
    try {
      // Load responses
      const { data: responsesData, error: responsesError } = await supabase
        .from('form_responses')
        .select('*')
        .order('submittedAt', { ascending: false })

      if (responsesError) throw responsesError

      // Load properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, location, hash')

      if (propertiesError) throw propertiesError

      setResponses(responsesData || [])
      setProperties(propertiesData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPropertyLocation = (hash?: string) => {
    if (!hash) return 'N/A'
    const property = properties.find(p => p.hash === hash)
    return property ? property.location : 'Ismeretlen ingatlan'
  }

  const filteredResponses = responses.filter(response => {
    if (selectedType === 'all') return true
    return response.formType === selectedType
  })

  const getFormTypeLabel = (type: string) => {
    switch (type) {
      case 'igenyfelmeres': return 'Igényfelmérés'
      case 'mutatas': return 'Mutatás értékelés'
      case 'ertekeles': return 'Ingatlan értékelés'
      default: return type
    }
  }

  const getFormTypeBadge = (type: string) => {
    switch (type) {
      case 'igenyfelmeres': return 'bg-blue-100 text-blue-800'
      case 'mutatas': return 'bg-green-100 text-green-800'
      case 'ertekeles': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getHungarianLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      // Általános mezők
      'name': 'Név',
      'email': 'Email cím',
      'phone': 'Telefonszám',
      'contact-preference': 'Kapcsolatfelvétel ideje',
      'additional-comments': 'Egyéb megjegyzések',

      // Értékelés form mezők
      'property-rating': 'Ingatlan értékelés',
      'price-rating': 'Ár értékelés',
      'description-accuracy': 'Leírás pontossága',
      'most-attractive': 'Legvonzóbb tulajdonság',
      'main-problems': 'Főbb problémák',
      'service-rating': 'Szolgáltatás értékelés',
      'service-positives': 'Szolgáltatás pozitívumai',
      'service-improvements': 'Szolgáltatás fejlesztések',
      'would-recommend': 'Ajánlaná másoknak',
      'continue-search': 'Folytatja a keresést',
      'more-properties': 'További ingatlanok',
      'parameter-changes': 'Paraméter módosítások',

      // Mutatás form mezők
      'overall-satisfaction': 'Általános elégedettség',
      'liked-most': 'Mi tetszett leginkább',
      'negatives': 'Negatívumok',
      'interested': 'Érdeklődés szintje',
      'offer-price': 'Ajánlati ár',
      'offer-conditions': 'Ajánlati feltételek',

      // Igényfelmérés mezők
      'viewed-properties': 'Megtekintett ingatlanok',
      'search-time': 'Keresési idő',
      'liked-property': 'Tetszett-e ingatlan',
      'family-size-needs': 'Család és igények',
      'preferred-location': 'Preferált helyszín',
      'transportation-needs': 'Közlekedési igények',
      'time-urgency': 'Időbeli sürgősség',
      'budget': 'Költségvetés',
      'payment-method-type': 'Fizetési mód'
    }

    return labels[key] || key.replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar user={user} />
        <div className="flex items-center justify-center py-20">
          <div className="text-primary-blue">Betöltés...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} />
      
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-blue font-playfair">Beküldött válaszok</h1>
            <p className="text-gray-600 mt-1">Űrlap válaszok megtekintése és kezelése</p>
          </div>

          {/* Filter Tabs */}
          <div className="form-container rounded-xl p-6 mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedType === 'all' 
                    ? 'bg-primary-blue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Összes ({responses.length})
              </button>
              <button
                onClick={() => setSelectedType('igenyfelmeres')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedType === 'igenyfelmeres' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Igényfelmérés ({responses.filter(r => r.formType === 'igenyfelmeres').length})
              </button>
              <button
                onClick={() => setSelectedType('mutatas')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedType === 'mutatas' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Mutatás ({responses.filter(r => r.formType === 'mutatas').length})
              </button>
              <button
                onClick={() => setSelectedType('ertekeles')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedType === 'ertekeles' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                Értékelés ({responses.filter(r => r.formType === 'ertekeles').length})
              </button>
            </div>
          </div>

          {/* Responses Table */}
          <div className="form-container rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-primary-blue mb-6">
              {selectedType === 'all' ? 'Összes válasz' : getFormTypeLabel(selectedType)}
            </h2>
            
            {filteredResponses.length === 0 ? (
              <p className="text-gray-600">Nincsenek válaszok ebben a kategóriában.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Típus</th>
                      <th className="text-left py-3 px-4">Ingatlan</th>
                      <th className="text-left py-3 px-4">Beküldés ideje</th>
                      <th className="text-left py-3 px-4">Műveletek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResponses.map((response) => (
                      <tr key={response.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormTypeBadge(response.formType)}`}>
                            {getFormTypeLabel(response.formType)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {response.propertyHash ? (
                            <div>
                              <div className="font-medium">{getPropertyLocation(response.propertyHash)}</div>
                              <div className="text-xs text-gray-500">#{response.propertyHash}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Önálló űrlap</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(response.submittedAt).toLocaleString('hu-HU')}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedResponse(response)}
                            className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            👁️ Megtekintés
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {getFormTypeLabel(selectedResponse.formType)} válasz
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Beküldve: {new Date(selectedResponse.submittedAt).toLocaleString('hu-HU')}
                </p>
                {selectedResponse.propertyHash && (
                  <p className="text-sm text-gray-600">
                    Ingatlan: {getPropertyLocation(selectedResponse.propertyHash)}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                {Object.entries(selectedResponse.answers).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <div className="font-medium text-gray-700 mb-1">
                      {getHungarianLabel(key)}:
                    </div>
                    <div className="text-gray-600">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Bezárás
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 