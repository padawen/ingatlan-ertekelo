import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

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
  price: number
  dhLink: string
  hash: string
}

// Magyar címkék a formok mezőihez
const getHungarianLabel = (key: string) => {
  const labels: { [key: string]: string } = {
    // Értékelés form mezők
    'property-rating': 'Ingatlan értékelés (1-5 skála)',
    'property-feeling': 'Érzés az ingatlanban járva',
    'most-liked': 'Mi tetszett a legjobban',
    'disliked-option': 'Volt-e valami, ami kevésbé tetszett',
    'disliked-details': 'Mi nem tetszett (részletek)',
    'changes-option': 'Változtatna valamit az ingatlanon',
    'changes-details': 'Mit változtatna (részletek)',
    'advertisement-accuracy': 'Benyomás a hirdetés tükrében',
    'price-realism': 'Ár realitása',
    'realistic-price': 'Reálisnak tartott ár',
    'questions-option': 'Van-e kérdése',
    'questions-details': 'Kérdések (részletek)',
    'revisit': 'Szeretné újra megtekinteni',
    'purchase-offer': 'Szeretne vételi ajánlatot tenni',

    // Igényfelmérés mezők
    'previous-experience': 'Adott el vagy vett már ingatlant',
    'agent-involved': 'Vett részt ingatlanközvetítő az adásvételben',
    'current-agent-help': 'Segíti már a keresésüket ingatlanközvetítő',
    'viewed-properties': 'Hány ingatlant néztek meg eddig',
    'search-time': 'Mióta keresnek ingatlant',
    'liked-property': 'Volt olyan ingatlan, ami nagyon tetszett',
    'liked-property-details': 'Mi az, ami megfogta benne',
    'not-purchased-reason': 'Miért nem vették meg',
    'family-size-needs': 'Hány fős családnak keresnek otthont',
    'preferred-location': 'Milyen településen/kerületben keresnek',
    'transportation-needs': 'Milyen közlekedési igényeik vannak',
    'urgency': 'Mennyire sürgős a költözés',
    'family-additional-comments': 'Van-e egyéb családi szempontjuk',
    'budget': 'Mi a tervezett költségkeret',
    'cash-savings-time': 'Mennyi idő alatt tudják összegyűjteni a teljes összeget',
    'down-payment': 'Mekkora önerő áll rendelkezésükre',
    'down-savings-time': 'Mennyi idő alatt gyűjtik össze az önerőt',
    'loan-type': 'Milyen hitelt terveznek igénybe venni',
    'payment-other': 'Van-e egyéb pénzügyi megjegyzése',

    // Kapcsolatfelvétel mezők
    'name': 'Név',
    'email': 'Email cím',
    'phone': 'Telefonszám',
    'call-time': 'Mikor hívjam fel',
    'contact-preference': 'Kapcsolatfelvétel módja',
    'additional-comments': 'Egyéb megjegyzések'
  }

  return labels[key] || key.replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase())
}

// Magyar válasz fordítások
const translateAnswer = (value: any): string => {
  if (typeof value !== 'string') return JSON.stringify(value)
  
  const translations: { [key: string]: string } = {
    // Általános válaszok
    'yes': 'igen',
    'no': 'nem',
    'maybe': 'talán',
    'none': 'nincs',
    'other': 'egyéb',
    
    // Érzések és vélemények
    'disappointed': 'csalódott',
    'satisfied': 'elégedett',
    'excited': 'izgatott',
    'neutral': 'semleges',
    'positive': 'pozitív',
    'negative': 'negatív',
    'very good': 'nagyon jó',
    'good': 'jó',
    'average': 'átlagos',
    'poor': 'rossz',
    'very poor': 'nagyon rossz',
    
    // Értékelések
    'realistic': 'reális',
    'too high': 'túl magas',
    'too low': 'túl alacsony',
    'fair': 'elfogadható',
    'expensive': 'drága',
    'cheap': 'olcsó',
    'reasonable': 'ésszerű',
    
    // Időzítés
    'morning': 'délelőtt',
    'afternoon': 'délután',
    'evening': 'este',
    'anytime': 'bármikor',
    'weekdays': 'hétköznap',
    'weekends': 'hétvégén',
    
    // Kapcsolatfelvétel
    'phone': 'telefon',
    'email': 'email',
    'both': 'mindkettő',
    'whatsapp': 'WhatsApp',
    'messenger': 'Messenger',
    
    // Gyakori kifejezések
    'definitely': 'biztosan',
    'probably': 'valószínűleg',
    'not sure': 'nem biztos',
    'absolutely': 'feltétlenül',
    'never': 'soha',
    'always': 'mindig',
    'sometimes': 'néha'
  }
  
  // Kisbetűs keresés
  const lowerValue = value.toLowerCase().trim()
  if (translations[lowerValue]) {
    return translations[lowerValue]
  }
  
  // Részleges egyezések
  for (const [eng, hun] of Object.entries(translations)) {
    if (lowerValue.includes(eng)) {
      return value.replace(new RegExp(eng, 'gi'), hun)
    }
  }
  
  return value
}

// Form típus címkék
const getFormTypeLabel = (type: string) => {
  switch (type) {
    case 'igenyfelmeres': return 'Igényfelmérés'
    case 'mutatas': return 'Mutatás értékelés'
    case 'ertekeles': return 'Ingatlan értékelés'
    default: return type
  }
}

// Mezők sorrendje formtípus szerint
const getFieldOrder = (formType: string) => {
  if (formType === 'ertekeles' || formType === 'mutatas') {
    return [
      'property-rating', 'property-feeling', 'most-liked', 'disliked-option', 'disliked-details',
      'changes-option', 'changes-details', 'advertisement-accuracy', 'price-realism', 'realistic-price',
      'questions-option', 'questions-details', 'revisit', 'purchase-offer',
      'name', 'phone', 'email', 'call-time'
    ]
  } else if (formType === 'igenyfelmeres') {
    return [
      'previous-experience', 'agent-involved', 'current-agent-help', 'viewed-properties', 'search-time',
      'liked-property', 'liked-property-details', 'not-purchased-reason', 'family-size-needs', 'preferred-location',
      'transportation-needs', 'urgency', 'family-additional-comments', 'budget', 'cash-savings-time',
      'down-payment', 'down-savings-time', 'loan-type', 'payment-other', 'additional-comments'
    ]
  }
  return []
}

// Rendezett válaszok
const getOrderedAnswers = (response: FormResponse) => {
  const fieldOrder = getFieldOrder(response.formType)
  const orderedEntries: [string, any][] = []
  
  fieldOrder.forEach(field => {
    if (response.answers[field] !== undefined && response.answers[field] !== '') {
      orderedEntries.push([field, response.answers[field]])
    }
  })
  
  Object.entries(response.answers).forEach(([key, value]) => {
    if (!fieldOrder.includes(key) && value !== undefined && value !== '') {
      orderedEntries.push([key, value])
    }
  })
  
  return orderedEntries
}

// Base styles - optimalizált
const getBaseStyles = () => `
  width: 800px; margin: 0 auto; font-family: Arial,Helvetica,sans-serif;
  background: white; padding: 0; box-sizing: border-box; color: #333; line-height: 1.6;
`

const getHeaderStyles = () => `
  background: linear-gradient(135deg,#0c4a6e 0%,#0369a1 100%); color: white; padding: 30px;
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;
`

// Template builder functions - kisebb részekre bontva
const buildHeader = () => {
  const headerDiv = document.createElement('div')
  headerDiv.innerHTML = `
    <div>
      <h1 style="margin:0 0 8px 0;font-size:28px;font-weight:bold;font-family:Georgia,serif">
        Dzimba Rita – Ingatlanközvetítő
      </h1>
      <p style="margin:0;font-size:16px;opacity:0.9">dzimbarita@dh.hu • +36 XX XXX XXXX</p>
    </div>
    <div style="display:flex;gap:15px;align-items:center">
      <div style="background:#dc2663;color:white;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:bold">DUNAHOUSE</div>
      <div style="background:#22c55e;color:white;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:bold">CREDIPASS</div>
    </div>
  `
  return headerDiv
}

const buildPropertyInfo = (property: Property) => {
  const formatNumber = (num: number) => new Intl.NumberFormat('hu-HU').format(num)
  const infoDiv = document.createElement('div')
  infoDiv.innerHTML = `
    <h3 style="color:#0c4a6e;margin:0 0 15px 0;font-size:18px;font-weight:bold">Ingatlan információk</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
      <p style="margin:0;font-size:14px"><strong>Helyszín:</strong> ${property.location}</p>
      <p style="margin:0;font-size:14px"><strong>Ár:</strong> ${property.price ? `${formatNumber(property.price)} Ft` : 'nincs megadva'}</p>
    </div>
  `
  return infoDiv
}

const buildAnswers = (orderedAnswers: [string, any][]) => {
  const answersDiv = document.createElement('div')
  orderedAnswers.forEach(([key, value], index) => {
    const answerDiv = document.createElement('div')
    // Oldaltörés logika - minden 6. kérdés után új oldal
    const shouldBreak = index > 0 && index % 6 === 0
    answerDiv.style.cssText = `margin-bottom:25px;${shouldBreak ? 'page-break-before:always;' : 'page-break-inside:avoid;'}`
    
    const translatedValue = translateAnswer(value)
    answerDiv.innerHTML = `
      <h4 style="color:#374151;font-size:16px;margin:0 0 8px 0;font-weight:bold">${getHungarianLabel(key)}</h4>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:15px;margin-left:20px;font-size:14px;line-height:1.6;color:#4b5563">
        ${translatedValue}
      </div>
    `
    answersDiv.appendChild(answerDiv)
  })
  return answersDiv
}

// Optimalizált template létrehozás
const createPDFTemplate = (response: FormResponse, property?: Property): HTMLElement => {
  const submittedDate = new Date(response.submittedAt).toLocaleString('hu-HU')
  const orderedAnswers = getOrderedAnswers(response)

  const template = document.createElement('div')
  template.style.cssText = getBaseStyles()

  // Header
  const headerWrapper = document.createElement('div')
  headerWrapper.style.cssText = getHeaderStyles()
  headerWrapper.appendChild(buildHeader())
  template.appendChild(headerWrapper)

  // Content wrapper
  const contentDiv = document.createElement('div')
  contentDiv.style.cssText = 'padding:0 30px'

  // Title
  const titleH2 = document.createElement('h2')
  titleH2.style.cssText = 'color:#0c4a6e;font-size:32px;margin:0 0 15px 0;font-weight:bold;font-family:Georgia,serif'
  titleH2.textContent = getFormTypeLabel(response.formType)
  contentDiv.appendChild(titleH2)

  // Date
  const dateP = document.createElement('p')
  dateP.style.cssText = 'color:#6b7280;margin:0 0 30px 0;font-size:14px'
  dateP.textContent = `Beküldve: ${submittedDate}`
  contentDiv.appendChild(dateP)

  // Property info if exists
  if (property) {
    const propertyWrapper = document.createElement('div')
    propertyWrapper.style.cssText = 'background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);border-left:4px solid #b59410;padding:20px;margin-bottom:30px;border-radius:8px'
    propertyWrapper.appendChild(buildPropertyInfo(property))
    contentDiv.appendChild(propertyWrapper)
  }

  // Answers title
  const answersH3 = document.createElement('h3')
  answersH3.style.cssText = 'color:#0c4a6e;font-size:24px;margin:0 0 25px 0;font-weight:bold;border-bottom:2px solid #b59410;padding-bottom:10px'
  answersH3.textContent = 'Válaszok'
  contentDiv.appendChild(answersH3)

  // Answers
  contentDiv.appendChild(buildAnswers(orderedAnswers))
  template.appendChild(contentDiv)

  // Footer
  const footerDiv = document.createElement('div')
  footerDiv.style.cssText = 'border-top:2px solid #b59410;margin-top:40px;padding:20px 30px;display:flex;justify-content:space-between;align-items:center;color:#6b7280;font-size:12px'
  footerDiv.innerHTML = `
    <div>Dzimba Rita – Ingatlanközvetítő • DunaHouse • Bizalmas dokumentum</div>
    <div>Generálva: ${new Date().toLocaleString('hu-HU')}</div>
  `
  template.appendChild(footerDiv)

  // Hozzáadjuk a DOM-hoz (láthatatlanul)
  template.style.position = 'absolute'
  template.style.left = '-9999px'
  template.style.top = '0'
  document.body.appendChild(template)

  return template
}

export const generatePDF = async (response: FormResponse, property?: Property): Promise<void> => {
  try {
    const template = createPDFTemplate(response, property)
    
    // Optimalizált beállítások - kisebb fájlméret
    const canvas = await html2canvas(template, {
      scale: 1.5, // 2-ből 1.5 - kisebb méret
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: template.scrollHeight,
      logging: false // Kevesebb console spam
    })

    document.body.removeChild(template)

    // JPEG formátum - kisebb méret
    const imgData = canvas.toDataURL('image/jpeg', 0.85) // JPEG + 85% quality
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true // PDF tömörítés
    })

    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    // Első oldal
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // További oldalak - javított logika
    while (heightLeft >= 20) { // 20mm margó
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const submittedDate = new Date(response.submittedAt).toLocaleString('hu-HU')
    const dateOnly = submittedDate.split(' ')[0].replace(/\./g, '-') // 2025-01-25 formátum
    
    // Név kinyerése a válaszokból
    const userName = response.answers.name || 'Ismeretlen'
    const cleanName = userName.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]/g, '').replace(/\s+/g, '_')
    
    // Ingatlan neve
    const propertyName = property ? property.location.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ0-9\s]/g, '').replace(/\s+/g, '_') : 'Általános'
    
    // Új fájlnév formátum: Név_Dátum_IngatlanNeve.pdf
    const fileName = `${cleanName}_${dateOnly}_${propertyName}.pdf`

    pdf.save(fileName)
    
  } catch (error) {
    console.error('PDF generation error:', error)
    alert('Hiba történt a PDF generálása során.')
  }
} 