'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'
import { nanoid } from 'nanoid'
import AdminNavbar from '../../components/AdminNavbar'

interface Property {
  id: string
  location: string
  price: number
  dhLink: string
  hash: string
  createdBy: string
  createdAt: string
}

interface FormResponse {
  id: string
  formType: string
  propertyHash?: string
  answers: any
  submittedAt: string
}

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  // Form states
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [dhLink, setDhLink] = useState('')
  const [adding, setAdding] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    checkUser()
    loadProperties()
    loadResponses()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('form_responses')
        .select('*')
        .order('submittedAt', { ascending: false })

      if (error) throw error
      setResponses(data || [])
    } catch (error) {
      console.error('Error loading responses:', error)
    }
  }

  const addProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)

    try {
      const hash = nanoid(10)
      const { error } = await supabase
        .from('properties')
        .insert([{
          location,
          price: parseInt(price),
          dhLink,
          hash,
          createdBy: user?.email || 'unknown'
        }])

      if (error) throw error

      // Reset form
      setLocation('')
      setPrice('')
      setDhLink('')
      setShowAddForm(false)
      
      // Reload properties
      loadProperties()
    } catch (error) {
      console.error('Error adding property:', error)
      alert('Hiba történt az ingatlan hozzáadásakor')
    } finally {
      setAdding(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Link másolva a vágólapra!')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const getPropertyResponses = (propertyHash: string, formType: string) => {
    return responses.filter(r => r.propertyHash === propertyHash && r.formType === formType)
  }

  if (loading) {
    return (
      <div className="min-h-screen page-background flex items-center justify-center">
        <div className="text-primary-blue">Betöltés...</div>
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-primary-blue font-playfair">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Ingatlanok és válaszok kezelése</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="submit-btn px-6 py-2 rounded-md text-white font-medium flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Új ingatlan</span>
              </button>
            </div>
          </div>

          {/* Add Property Form */}
          {showAddForm && (
            <div className="form-container rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-semibold text-primary-blue mb-4">Új ingatlan hozzáadása</h2>
              <form onSubmit={addProperty} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Helyszín</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                    placeholder="pl. Budapest, V. kerület"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ár (Ft)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                    placeholder="50000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DH Link</label>
                  <input
                    type="url"
                    required
                    value={dhLink}
                    onChange={(e) => setDhLink(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                    placeholder="https://dunahouse.hu/..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={adding}
                    className="submit-btn px-6 py-2 rounded-md text-white font-medium disabled:opacity-50"
                  >
                    {adding ? 'Hozzáadás...' : 'Hozzáadás'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Mégse
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Properties Table */}
          <div className="form-container rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-primary-blue mb-6">Ingatlanok</h2>
            
            {properties.length === 0 ? (
              <p className="text-gray-600">Még nincsenek ingatlanok hozzáadva.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Helyszín</th>
                      <th className="text-left py-3 px-4">Ár</th>
                      <th className="text-left py-3 px-4">DH Link</th>
                      <th className="text-left py-3 px-4">Létrehozva</th>
                      <th className="text-left py-3 px-4">Műveletek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{property.location}</td>
                        <td className="py-3 px-4">{property.price.toLocaleString()} Ft</td>
                        <td className="py-3 px-4">
                          <a
                            href={property.dhLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Megtekintés
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(property.createdAt).toLocaleDateString('hu-HU')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => copyToClipboard(`${window.location.origin}/form/mutatas/${property.hash}`)}
                              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                              Mutatás link
                            </button>
                            <button
                              onClick={() => copyToClipboard(`${window.location.origin}/form/ertekeles/${property.hash}`)}
                              className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              Értékelés link
                            </button>
                            <div className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded">
                              Mutatás: {getPropertyResponses(property.hash, 'mutatas').length}
                            </div>
                            <div className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded">
                              Értékelés: {getPropertyResponses(property.hash, 'ertekeles').length}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Form Responses Summary */}
          <div className="form-container rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-primary-blue mb-6">Beküldött válaszok</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Igényfelmérés</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {responses.filter(r => r.formType === 'igenyfelmeres').length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Mutatás űrlapok</h3>
                <p className="text-2xl font-bold text-green-600">
                  {responses.filter(r => r.formType === 'mutatas').length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Értékelés űrlapok</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {responses.filter(r => r.formType === 'ertekeles').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 