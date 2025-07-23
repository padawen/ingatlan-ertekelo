'use client'

import React, { useState } from 'react'
import { createClient } from '../../../lib/supabase/client'
import FormBranding from '../../../components/FormBranding'

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
        <div className="max-w-4xl mx-auto">
          {/* Branding Component */}
          <FormBranding className="mb-8" />
          
          <div className="form-container rounded-xl p-6 md:p-10">
            <header className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="var(--primary-blue)" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline stroke="var(--gold)" points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900">Ingatlanigény Felmérő</h1>
              <p className="text-lg text-blue-700 mt-2">Dzimba Rita – Ingatlanközvetítő</p>
              <div className="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-primary-blue to-gold"></div>
            </header>

            <form id="propertyForm" className="space-y-8" onSubmit={handleSubmit}>
              {/* Korábbi tapasztalatok */}
              <div className="form-section p-6 rounded-lg">
                <h2 className="section-header text-2xl font-semibold">Korábbi tapasztalatok</h2>
                
                <div className="mb-6">
                  <label className="block mb-3 font-medium">Adott el vagy vett már ingatlant valaha?</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="previous-experience" value="igen" className="w-4 h-4 mr-3 accent-gold" required />
                      Igen
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="previous-experience" value="nem" className="w-4 h-4 mr-3 accent-gold" />
                      Nem
                    </label>
                  </div>
                </div>

                <div className="mb-6" id="agent-experience-question" style={{display: 'none'}}>
                  <label className="block mb-3 font-medium">Vett részt ingatlanközvetítő az adásvételben?</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="agent-involved" value="igen" className="w-4 h-4 mr-3 accent-gold" />
                      Igen
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="agent-involved" value="nem" className="w-4 h-4 mr-3 accent-gold" />
                      Nem
                    </label>
                  </div>
                </div>
              </div>

              {/* Jelenlegi ingatlanvásárlás */}
              <div className="form-section p-6 rounded-lg">
                <h2 className="section-header text-2xl font-semibold">Jelenlegi ingatlanvásárlás</h2>
                
                <div className="mb-6">
                  <label className="block mb-3 font-medium">Segíti már a keresésüket ingatlanközvetítő?</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="current-agent-help" value="nem" className="w-4 h-4 mr-3 accent-gold" required />
                      Nem
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="current-agent-help" value="igen-nagy-halozat" className="w-4 h-4 mr-3 accent-gold" />
                      Igen, nagy hálózat
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="current-agent-help" value="igen-kis-ceg" className="w-4 h-4 mr-3 accent-gold" />
                      Igen, kis cég
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block mb-3 font-medium">Hány ingatlant néztek meg eddig?</label>
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
                  <label className="block mb-3 font-medium">Mióta keresnek ingatlant?</label>
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
                  <label className="block mb-3 font-medium">Volt olyan ingatlan, ami nagyon tetszett?</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="liked-property" value="igen" className="w-4 h-4 mr-3 accent-gold" required />
                      Igen
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="liked-property" value="nem" className="w-4 h-4 mr-3 accent-gold" />
                      Nem
                    </label>
                  </div>
                </div>

                <div className="mb-6" id="liked-property-details-section" style={{display: 'none'}}>
                  <label className="block mb-3 font-medium">Mi az, ami megfogta benne?</label>
                  <textarea 
                    id="liked-property-details" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={3}
                    placeholder="Írja le, mi tetszett legjobban..."
                  ></textarea>
                </div>

                <div className="mb-6" id="not-purchased-reason-section" style={{display: 'none'}}>
                  <label className="block mb-3 font-medium">Miért nem vették meg?</label>
                  <textarea 
                    id="not-purchased-reason" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={3}
                    placeholder="Írja le az okokat..."
                  ></textarea>
                </div>
              </div>

              {/* Family and Property Needs */}
              <div className="form-section p-6 rounded-lg">
                <h2 className="section-header text-2xl font-semibold">Család és ingatlan igények</h2>
                
                <div className="mb-6">
                  <label className="block mb-3 font-medium">Hány fős családnak keresnek otthont?</label>
                  <input 
                    type="text" 
                    id="family-size-needs" 
                    className="px-3 py-2 border border-gray-300 rounded-md w-32 focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    placeholder="pl. 4 fő"
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Milyen településen/kerületben keresnek?</label>
                  <input 
                    type="text" 
                    id="preferred-location" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    placeholder="pl. II. kerület, Budakeszi, stb."
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Milyen közlekedési igényeik vannak?</label>
                  <textarea 
                    id="transportation-needs" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={3}
                    placeholder="pl. közel a munkahelyhez, tömegközlekedés, autóval könnyen megközelíthető, stb."
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Mennyire sürgős a költözés?</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="urgency" value="nagyon-surgo" className="w-4 h-4 mr-3 accent-gold" required />
                      Nagyon sürgős (1-2 hónap)
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="urgency" value="surgo" className="w-4 h-4 mr-3 accent-gold" />
                      Sürgős (3-6 hónap)
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="urgency" value="nem-surgo" className="w-4 h-4 mr-3 accent-gold" />
                      Nem sürgős (6+ hónap)
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Van-e egyéb családi szempontjuk?</label>
                  <textarea 
                    id="family-additional-comments" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={3}
                    placeholder="pl. kisgyermek, idős családtag, háziállat, stb."
                  ></textarea>
                </div>
              </div>

              {/* Pénzügyi információk */}
              <div className="form-section p-6 rounded-lg">
                <h2 className="section-header text-2xl font-semibold">Pénzügyi információk</h2>
                
                <div className="mb-6">
                  <label className="block mb-3 font-medium">Mi a tervezett költségkeret?</label>
                  <div className="flex items-center">
                    <input 
                      type="text" 
                      id="budget" 
                      className="px-3 py-2 border border-gray-300 rounded-md w-64 focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                      placeholder="50 000 000" 
                    />
                    <span className="ml-2">Ft</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block mb-3 font-medium">Hogyan tervezik kifizetni az ingatlan vételárát?</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div id="cash-option" className="payment-option p-4 rounded-lg border cursor-pointer hover:border-gold transition-colors">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 border-2 border-gold rounded-full mr-3 flex items-center justify-center">
                          <div className="w-3 h-3 bg-gold rounded-full opacity-0 transition-opacity"></div>
                        </div>
                        <h3 className="text-lg font-semibold">Kizárólag készpénz</h3>
                      </div>
                      <p className="text-gray-600 ml-9">Teljes vételár saját forrásból</p>
                    </div>
                    
                    <div id="loan-option" className="payment-option p-4 rounded-lg border cursor-pointer hover:border-gold transition-colors">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 border-2 border-gold rounded-full mr-3 flex items-center justify-center">
                          <div className="w-3 h-3 bg-gold rounded-full opacity-0 transition-opacity"></div>
                        </div>
                        <h3 className="text-lg font-semibold">Hitel bevonásával</h3>
                      </div>
                      <p className="text-gray-600 ml-9">Részben saját forrás + bankhitel</p>
                    </div>
                  </div>
                </div>

                {/* Cash Payment Details */}
                <div id="cash-options" className="hidden-section mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-4">Készpénzes vásárlás részletei:</h4>
                    
                    <div className="mb-4">
                      <label className="block mb-2 font-medium">Mennyi idő alatt tudják összegyűjteni a teljes összeget?</label>
                      <input 
                        type="text" 
                        id="cash-savings-time" 
                        className="px-3 py-2 border border-gray-300 rounded-md w-full focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                        placeholder="pl. 2 hónap, már rendelkezésre áll, stb."
                      />
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div id="loan-options" className="hidden-section mb-6">
                  <div className="bg-gold-light p-4 rounded-lg">
                    <h4 className="font-semibold mb-4">Hiteles vásárlás részletei:</h4>
                    
                    <div className="mb-4">
                      <label className="block mb-2 font-medium">Mekkora önerő áll rendelkezésükre?</label>
                      <div className="flex items-center">
                        <input 
                          type="text" 
                          id="down-payment" 
                          className="px-3 py-2 border border-gray-300 rounded-md w-64 focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                          placeholder="15 000 000" 
                        />
                        <span className="ml-2">Ft</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 font-medium">Mennyi idő alatt gyűjtik össze az önerőt?</label>
                      <input 
                        type="text" 
                        id="down-savings-time" 
                        className="px-3 py-2 border border-gray-300 rounded-md w-full focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                        placeholder="pl. 3 hónap, már rendelkezésre áll, stb."
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 font-medium">Milyen hitelt terveznek igénybe venni?</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="radio" name="loan-type" value="lakashitel" className="w-4 h-4 mr-3 accent-gold" />
                          Lakáshitel
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="loan-type" value="szabad-felhasznalasu" className="w-4 h-4 mr-3 accent-gold" />
                          Szabad felhasználású hitel
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="loan-type" value="csok" className="w-4 h-4 mr-3 accent-gold" />
                          CSOK
                        </label>
                        <label className="flex items-start">
                          <input type="radio" name="loan-type" value="egyeb" className="w-4 h-4 mr-3 mt-1 accent-gold" />
                          <div className="flex-1">
                            <span>Egyéb:</span>
                            <input type="text" id="loan-other-text" className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" disabled />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-3 font-medium">Van-e egyéb pénzügyi megjegyzése?</label>
                  <textarea 
                    id="payment-other" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={3}
                    placeholder="pl. befektetési célú vásárlás, csere, stb."
                  ></textarea>
                </div>
              </div>

              {/* Egyéb megjegyzések */}
              <div className="form-section p-6 rounded-lg">
                <h2 className="section-header text-2xl font-semibold">Egyéb megjegyzések</h2>
                
                <div className="mb-2">
                  <label className="block mb-3 font-medium">Bármi egyéb, amit fontosnak talál megjegyezni:</label>
                  <textarea 
                    id="additional-comments" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 focus:outline-none" 
                    rows={4}
                    placeholder="Itt írhatja le minden egyéb kérését, megjegyzését..."
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
                  {loading ? 'Beküldés...' : 'Igényfelmérő beküldése'}
                </button>
              </div>
            </form>
          </div>
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
            <p className="text-gray-600 mb-6">Az igényfelmérő sikeresen beküldve. Hamarosan felvesszük Önnel a kapcsolatot!</p>
            <button 
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}

      {/* JavaScript for dynamic form behavior */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Payment method selection
          document.addEventListener('DOMContentLoaded', function() {
            const cashOption = document.getElementById('cash-option');
            const loanOption = document.getElementById('loan-option');
            const cashOptions = document.getElementById('cash-options');
            const loanOptions = document.getElementById('loan-options');

            function selectPaymentMethod(selected, other, optionsToShow, optionsToHide) {
              selected.classList.add('selected');
              other.classList.remove('selected');
              
              selected.querySelector('.w-3').style.opacity = '1';
              other.querySelector('.w-3').style.opacity = '0';
              
              optionsToShow.classList.remove('hidden-section');
              optionsToShow.classList.add('visible-section');
              optionsToHide.classList.add('hidden-section');
              optionsToHide.classList.remove('visible-section');
            }

            cashOption.addEventListener('click', () => selectPaymentMethod(cashOption, loanOption, cashOptions, loanOptions));
            loanOption.addEventListener('click', () => selectPaymentMethod(loanOption, cashOption, loanOptions, cashOptions));

            // Enable/disable text inputs based on radio selection
            const radioGroups = [
              { radios: 'input[name="viewed-properties"]', textInput: 'viewed-other-text', triggerValue: 'Egyéb' },
              { radios: 'input[name="search-time"]', textInput: 'search-other-text', triggerValue: 'Egyéb' },
              { radios: 'input[name="loan-type"]', textInput: 'loan-other-text', triggerValue: 'egyeb' }
            ];

            radioGroups.forEach(group => {
              const radios = document.querySelectorAll(group.radios);
              const textInput = document.getElementById(group.textInput);
              
              if (radios && textInput) {
                radios.forEach(radio => {
                  radio.addEventListener('change', function() {
                    textInput.disabled = this.value !== group.triggerValue;
                    if (this.value !== group.triggerValue) {
                      textInput.value = '';
                    }
                  });
                });
              }
            });

            // Show/hide conditional sections
            const previousExperienceRadios = document.querySelectorAll('input[name="previous-experience"]');
            const agentExperienceQuestion = document.getElementById('agent-experience-question');
            
            previousExperienceRadios.forEach(radio => {
              radio.addEventListener('change', function() {
                if (this.value === 'igen') {
                  agentExperienceQuestion.style.display = 'block';
                } else {
                  agentExperienceQuestion.style.display = 'none';
                }
              });
            });

            const likedPropertyRadios = document.querySelectorAll('input[name="liked-property"]');
            const likedPropertyDetailsSection = document.getElementById('liked-property-details-section');
            const notPurchasedReasonSection = document.getElementById('not-purchased-reason-section');
            
            likedPropertyRadios.forEach(radio => {
              radio.addEventListener('change', function() {
                if (this.value === 'igen') {
                  likedPropertyDetailsSection.style.display = 'block';
                  notPurchasedReasonSection.style.display = 'block';
                } else {
                  likedPropertyDetailsSection.style.display = 'none';
                  notPurchasedReasonSection.style.display = 'none';
                }
              });
            });
          });
        `
      }} />
    </>
  )
} 