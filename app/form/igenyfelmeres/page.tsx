'use client'

import React, { useState } from 'react'
import { createClient } from '../../../lib/supabase/client'

export default function IgenyfelmeresForm() {
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const formValues: any = {}

    // Process form data
    formData.forEach((value, key) => {
      formValues[key] = value
    })

    // Additional fields processing
    const additionalFields = [
      'viewed-other-text', 'search-other-text', 'liked-property-details',
      'not-purchased-reason', 'family-size-needs', 'preferred-location',
      'transportation-needs', 'time-urgency', 'family-additional-comments',
      'budget', 'cash-savings-time', 'down-payment', 'down-savings-time', 
      'loan-other-text', 'payment-other', 'additional-comments'
    ]

    additionalFields.forEach(field => {
      const element = document.getElementById(field) as HTMLInputElement | HTMLTextAreaElement
      if (element) {
        formValues[field] = element.value
      }
    })

    // Add payment method type
    const cashOption = document.getElementById('cash-option')
    const loanOption = document.getElementById('loan-option')
    
    if (cashOption?.classList.contains('selected')) {
      formValues['payment-method-type'] = 'Kizárólag készpénz'
    } else if (loanOption?.classList.contains('selected')) {
      formValues['payment-method-type'] = 'Hitel bevonásával'
    }

    try {
      const { error } = await supabase
        .from('form_responses')
        .insert([{
          formType: 'igenyfelmeres',
          answers: formValues,
          submittedAt: new Date().toISOString()
        }])

      if (error) throw error

      // Reset form before showing confirmation
      if (e.currentTarget) {
        e.currentTarget.reset()
      }
      setShowConfirmation(true)
      
      // Reset payment options
      cashOption?.classList.remove('selected')
      loanOption?.classList.remove('selected')
      const cashOptions = document.getElementById('cash-options')
      const loanOptions = document.getElementById('loan-options')
      cashOptions?.classList.add('hidden-section')
      cashOptions?.classList.remove('visible-section')
      loanOptions?.classList.add('hidden-section')
      loanOptions?.classList.remove('visible-section')
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Hiba történt az űrlap beküldésekor. Kérjük, próbálja újra.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-background py-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto form-container rounded-xl p-6 md:p-10">
          <header className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="var(--primary-blue)" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline stroke="var(--gold)" points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900">Ingatlanigény Felmérő</h1>
            <p className="text-lg text-blue-700 mt-2">Segítünk megtalálni az Ön számára tökéletes otthont</p>
            <div className="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-primary-blue to-gold"></div>
          </header>

          <form id="propertyForm" className="space-y-8" onSubmit={handleSubmit}>
            {/* Személyes tapasztalatok */}
            <div className="form-section p-6 rounded-lg">
              <h2 className="section-header text-2xl font-semibold">Személyes tapasztalatok</h2>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Hány ingatlant tekintett meg eddig?</label>
                <div className="space-y-1">
                  <div className="flex items-center mb-3">
                    <input type="radio" id="viewed-less-5" name="viewed-properties" value="Kevesebb mint 5" className="w-4 h-4 mr-3 accent-gold" />
                    <label htmlFor="viewed-less-5">Kevesebb mint 5</label>
                  </div>
                  <div className="flex items-center mb-3">
                    <input type="radio" id="viewed-5-10" name="viewed-properties" value="5-10" className="w-4 h-4 mr-3 accent-gold" />
                    <label htmlFor="viewed-5-10">5-10</label>
                  </div>
                  <div className="flex items-center mb-3">
                    <input type="radio" id="viewed-more-10" name="viewed-properties" value="Több mint 10" className="w-4 h-4 mr-3 accent-gold" />
                    <label htmlFor="viewed-more-10">Több mint 10</label>
                  </div>
                  <div className="flex items-start mb-3">
                    <input type="radio" id="viewed-other" name="viewed-properties" value="Egyéb" className="w-4 h-4 mr-3 mt-2 accent-gold" />
                    <div className="flex-1">
                      <label htmlFor="viewed-other">Egyéb, éspedig:</label>
                      <input type="text" id="viewed-other-text" className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" disabled />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Mióta keres ingatlant?</label>
                <div className="space-y-1">
                  <div className="flex items-center mb-3">
                    <input type="radio" id="search-less-1month" name="search-time" value="Kevesebb, mint 1 hónap" className="w-4 h-4 mr-3 accent-gold" />
                    <label htmlFor="search-less-1month">Kevesebb, mint 1 hónap</label>
                  </div>
                  <div className="flex items-center mb-3">
                    <input type="radio" id="search-more-1month" name="search-time" value="Több, mint 1 hónap" className="w-4 h-4 mr-3 accent-gold" />
                    <label htmlFor="search-more-1month">Több, mint 1 hónap</label>
                  </div>
                  <div className="flex items-center mb-3">
                    <input type="radio" id="search-more-6months" name="search-time" value="Több, mint 6 hónap" className="w-4 h-4 mr-3 accent-gold" />
                    <label htmlFor="search-more-6months">Több, mint 6 hónap</label>
                  </div>
                  <div className="flex items-start mb-3">
                    <input type="radio" id="search-other" name="search-time" value="Egyéb" className="w-4 h-4 mr-3 mt-2 accent-gold" />
                    <div className="flex-1">
                      <label htmlFor="search-other">Egyéb, éspedig:</label>
                      <input type="text" id="search-other-text" className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" disabled />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Volt-e olyan ingatlan, ami különösen megtetszett? Ha igen, mi volt az, ami megfogta benne?</label>
                <div className="space-y-2">
                  <div className="flex items-center mb-3">
                    <input type="radio" id="liked-property-no" name="liked-property" value="Nem" className="w-4 h-4 mr-3 accent-gold" />
                    <label htmlFor="liked-property-no">Nem</label>
                  </div>
                  <div className="flex items-start mb-3">
                    <input type="radio" id="liked-property-yes" name="liked-property" value="Igen" className="w-4 h-4 mr-3 mt-2 accent-gold" />
                    <div className="w-full">
                      <label htmlFor="liked-property-yes">Igen, ez tetszett benne:</label>
                      <textarea id="liked-property-details" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" rows={2} disabled></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-2">
                <label className="block mb-3 font-medium">Ha volt ilyen ingatlan, miért nem került sor a megvételére?</label>
                <textarea id="not-purchased-reason" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" rows={2}></textarea>
              </div>
            </div>

            {/* Család és ingatlanigények */}
            <div className="form-section p-6 rounded-lg">
              <h2 className="section-header text-2xl font-semibold">Család és ingatlanigények</h2>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Hányan költöznének az új ingatlanba? Mekkora az ingatlan ideális mérete az Önök számára?</label>
                <textarea id="family-size-needs" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" rows={3} placeholder="Pl. szobaszám, alapterület, felnőttek, gyerekek száma"></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Mely a preferált környék vagy település, ahol keresnek?</label>
                <textarea id="preferred-location" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" rows={2}></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Milyen közlekedési lehetőségek fontosak Önöknek?</label>
                <textarea id="transportation-needs" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" rows={2} placeholder="Pl. busz, vonat, autópálya közelsége"></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Van-e valamilyen időbeli sürgősség a költözéssel kapcsolatban?</label>
                <textarea id="time-urgency" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" rows={2}></textarea>
              </div>
              
              <div className="mb-2">
                <label className="block mb-3 font-medium">Bármi egyéb, amit fontosnak talál az ingatlanigényekkel kapcsolatban:</label>
                <textarea id="family-additional-comments" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" rows={3}></textarea>
              </div>
            </div>

            {/* Pénzügyi Információk */}
            <div className="form-section p-6 rounded-lg">
              <h2 className="section-header text-2xl font-semibold">Pénzügyi Információk</h2>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Milyen összeget tervez vásárlásra fordítani?</label>
                <div className="flex items-center">
                  <input type="text" id="budget" className="px-3 py-2 border border-gray-300 rounded-md w-64 focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" placeholder="Pl. 50.000.000" />
                  <span className="ml-2">Ft</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Hogyan tervezi kiegyenlíteni a vételárat?</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div id="cash-option" className="payment-option border rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md">
                    <div className="icon text-4xl mb-2">💰</div>
                    <h3 className="font-medium text-lg mb-1">Kizárólag készpénz</h3>
                    <p className="text-sm text-gray-600">Teljes vételár készpénzben</p>
                  </div>
                  
                  <div id="loan-option" className="payment-option border rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md">
                    <div className="icon text-4xl mb-2">🏦</div>
                    <h3 className="font-medium text-lg mb-1">Hitel bevonásával</h3>
                    <p className="text-sm text-gray-600">Önerő + hitelfelvétel</p>
                  </div>
                </div>
                
                {/* Készpénz opciók */}
                <div id="cash-options" className="hidden-section ml-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="font-medium mb-3 text-blue-800">Kizárólag készpénz:</div>
                  <div className="ml-2 space-y-2">
                    <div className="flex items-center mb-3">
                      <input type="checkbox" id="cash-available" name="payment-method" className="w-4 h-4 mr-3 accent-gold" />
                      <label htmlFor="cash-available">Rendelkezésre áll</label>
                    </div>
                    <div className="flex items-center mb-3">
                      <input type="checkbox" id="cash-sell-property" name="payment-method" className="w-4 h-4 mr-3 accent-gold" />
                      <label htmlFor="cash-sell-property">Még el kell adnom ingatlant</label>
                    </div>
                    <div className="flex items-start mb-3">
                      <input type="checkbox" id="cash-savings" name="payment-method" className="w-4 h-4 mr-3 mt-2 accent-gold" />
                      <div className="flex-1">
                        <label htmlFor="cash-savings">Fel kell szabadítani megtakarítást, ami ennyi időn belül elérhető:</label>
                        <input type="text" id="cash-savings-time" className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" disabled />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hitel opciók */}
                <div id="loan-options" className="hidden-section">
                  <div className="ml-2 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-medium mb-3 text-blue-800">A tervezett önerő:</div>
                    <div className="flex items-center mb-3">
                      <input type="text" id="down-payment" className="px-3 py-2 border border-gray-300 rounded-md w-64 focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" placeholder="Pl. 15.000.000" />
                      <span className="ml-2">Ft</span>
                    </div>
                    <div className="ml-2 space-y-2">
                      <div className="flex items-center mb-3">
                        <input type="checkbox" id="down-available" name="down-payment-source" className="w-4 h-4 mr-3 accent-gold" />
                        <label htmlFor="down-available">Rendelkezésre áll</label>
                      </div>
                      <div className="flex items-center mb-3">
                        <input type="checkbox" id="down-sell-property" name="down-payment-source" className="w-4 h-4 mr-3 accent-gold" />
                        <label htmlFor="down-sell-property">Még el kell adnom ingatlant</label>
                      </div>
                      <div className="flex items-start mb-3">
                        <input type="checkbox" id="down-savings" name="down-payment-source" className="w-4 h-4 mr-3 mt-2 accent-gold" />
                        <div className="flex-1">
                          <label htmlFor="down-savings">Fel kell szabadítani megtakarítást, ami ennyi időn belül elérhető:</label>
                          <input type="text" id="down-savings-time" className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" disabled />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-medium mb-3 text-blue-800">Hitel típusa</div>
                    <div className="ml-2 space-y-2">
                      <div className="flex items-center mb-3">
                        <input type="checkbox" id="loan-csok" name="loan-type" className="w-4 h-4 mr-3 accent-gold" />
                        <label htmlFor="loan-csok">Támogatott hitel (CSOK+, OtthonStart)</label>
                      </div>
                      <div className="flex items-center mb-3">
                        <input type="checkbox" id="loan-market" name="loan-type" className="w-4 h-4 mr-3 accent-gold" />
                        <label htmlFor="loan-market">Piaci lakáshitel</label>
                      </div>
                      <div className="flex items-center mb-3">
                        <input type="checkbox" id="loan-fundamenta" name="loan-type" className="w-4 h-4 mr-3 accent-gold" />
                        <label htmlFor="loan-fundamenta">Fundamenta</label>
                      </div>
                      <div className="flex items-start mb-3">
                        <input type="checkbox" id="loan-other" name="loan-type" className="w-4 h-4 mr-3 mt-2 accent-gold" />
                        <div className="flex-1">
                          <label htmlFor="loan-other">Egyéb:</label>
                          <input type="text" id="loan-other-text" className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" disabled />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-2 mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="font-medium mb-3 text-blue-800">Egyéb, éspedig:</div>
                  <textarea id="payment-other" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" rows={2}></textarea>
                </div>
              </div>
            </div>

            {/* Egyéb megjegyzések */}
            <div className="form-section p-6 rounded-lg">
              <h2 className="section-header text-2xl font-semibold">Egyéb megjegyzések</h2>
              
              <div className="mb-2">
                <label className="block mb-3 font-medium">Bármi egyéb, amit fontosnak talál:</label>
                <textarea id="additional-comments" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" rows={5}></textarea>
              </div>
            </div>

            {/* Beküldés */}
            <div className="text-center pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn px-10 py-3 rounded-md text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Beküldés...' : 'Kérdőív beküldése'}
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
            <p className="text-gray-600 mb-6">A kérdőív sikeresen beküldve. Hamarosan felvesszük Önnel a kapcsolatot.</p>
            <button 
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}

      {/* Interactive JavaScript equivalent */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Payment method selection
            const cashOption = document.getElementById('cash-option');
            const loanOption = document.getElementById('loan-option');
            const cashOptions = document.getElementById('cash-options');
            const loanOptions = document.getElementById('loan-options');
            
            if (cashOption && loanOption && cashOptions && loanOptions) {
              cashOption.addEventListener('click', function() {
                cashOption.classList.add('selected');
                loanOption.classList.remove('selected');
                cashOptions.classList.add('visible-section');
                cashOptions.classList.remove('hidden-section');
                loanOptions.classList.add('hidden-section');
                loanOptions.classList.remove('visible-section');
              });
              
              loanOption.addEventListener('click', function() {
                loanOption.classList.add('selected');
                cashOption.classList.remove('selected');
                loanOptions.classList.add('visible-section');
                loanOptions.classList.remove('hidden-section');
                cashOptions.classList.add('hidden-section');
                cashOptions.classList.remove('visible-section');
              });
            }
            
            // Dynamic field handling - radio buttons
            const viewedOther = document.getElementById('viewed-other');
            const viewedOtherText = document.getElementById('viewed-other-text');
            if (viewedOther && viewedOtherText) {
              viewedOther.addEventListener('change', function() {
                viewedOtherText.disabled = !this.checked;
                if (this.checked) viewedOtherText.focus();
              });
            }
            
            const searchOther = document.getElementById('search-other');
            const searchOtherText = document.getElementById('search-other-text');
            if (searchOther && searchOtherText) {
              searchOther.addEventListener('change', function() {
                searchOtherText.disabled = !this.checked;
                if (this.checked) searchOtherText.focus();
              });
            }
            
            const likedPropertyYes = document.getElementById('liked-property-yes');
            const likedPropertyNo = document.getElementById('liked-property-no');
            const likedPropertyDetails = document.getElementById('liked-property-details');
            if (likedPropertyYes && likedPropertyNo && likedPropertyDetails) {
              likedPropertyYes.addEventListener('change', function() {
                likedPropertyDetails.disabled = !this.checked;
                if (this.checked) likedPropertyDetails.focus();
              });
              
              likedPropertyNo.addEventListener('change', function() {
                likedPropertyDetails.disabled = this.checked;
              });
            }
            
            // Checkbox dependent fields
            const cashSavings = document.getElementById('cash-savings');
            const cashSavingsTime = document.getElementById('cash-savings-time');
            if (cashSavings && cashSavingsTime) {
              cashSavings.addEventListener('change', function() {
                cashSavingsTime.disabled = !this.checked;
                if (this.checked) cashSavingsTime.focus();
              });
            }
            
            const downSavings = document.getElementById('down-savings');
            const downSavingsTime = document.getElementById('down-savings-time');
            if (downSavings && downSavingsTime) {
              downSavings.addEventListener('change', function() {
                downSavingsTime.disabled = !this.checked;
                if (this.checked) downSavingsTime.focus();
              });
            }
            
            const loanOther = document.getElementById('loan-other');
            const loanOtherText = document.getElementById('loan-other-text');
            if (loanOther && loanOtherText) {
              loanOther.addEventListener('change', function() {
                loanOtherText.disabled = !this.checked;
                if (this.checked) loanOtherText.focus();
              });
            }
          });
        `
      }} />
    </>
  )
} 