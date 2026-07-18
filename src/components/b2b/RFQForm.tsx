'use client'

import { useState } from 'react'
import RFQSuccess from './RFQSuccess'

interface ProductInfo {
  name: string
  slug: string
  brand: string
  basePrice: number
  image: string
}

interface RFQFormData {
  productName: string
  productSlug: string
  quantity: number
  targetPrice: number | null
  intendedUse: string
  companyName: string
  contactName: string
  country: string
  email: string
  phone: string
  whatsapp: string
  message: string
  acceptMarketing: boolean
}

interface RFQFormProps {
  product?: ProductInfo
  onClose?: () => void
  variant?: 'modal' | 'embedded'
}

const COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Spain',
  'Italy', 'Netherlands', 'Poland', 'Brazil', 'Mexico', 'Argentina',
  'Saudi Arabia', 'UAE', 'Egypt', 'South Africa', 'Nigeria',
  'Turkey', 'Russia', 'India', 'Indonesia', 'Thailand', 'Vietnam',
  'Philippines', 'Malaysia', 'Singapore', 'South Korea', 'Japan',
  'Australia', 'Other',
]

const INTENDED_USES = [
  'Retail Resale',
  'Online Store (Amazon/eBay/Shopify)',
  'Corporate Procurement',
  'Government / Education',
  'Distribution / Wholesale',
  'Project Installation',
  'Personal Use',
  'Other',
]

const TIERS = [
  { min: 1, max: 4, discount: 0 },
  { min: 5, max: 9, discount: 5 },
  { min: 10, max: 19, discount: 8 },
  { min: 20, max: 49, discount: 12 },
  { min: 50, max: null, discount: 15 },
]

export default function RFQForm({ product, onClose, variant = 'modal' }: RFQFormProps) {
  const [formData, setFormData] = useState<RFQFormData>({
    productName: product?.name || '',
    productSlug: product?.slug || '',
    quantity: product ? 10 : 1,
    targetPrice: null,
    intendedUse: '',
    companyName: '',
    contactName: '',
    country: '',
    email: '',
    phone: '',
    whatsapp: '',
    message: '',
    acceptMarketing: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof RFQFormData, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const recommendedTier = TIERS.find(
    (t) => (t.max === null ? formData.quantity >= t.min : formData.quantity >= t.min && formData.quantity <= t.max)
  )

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RFQFormData, string>> = {}
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required'
    if (!formData.country) newErrors.country = 'Please select your country'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.phone.trim() && !formData.whatsapp?.trim()) {
      newErrors.phone = 'Phone or WhatsApp required'
    }
    if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1'
    if (!formData.intendedUse) newErrors.intendedUse = 'Please select intended use'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
      // Open WhatsApp as backup channel
      const waMsg = `Hi REACH PROJECTOR, I'd like to request a bulk quote:\nProduct: ${formData.productName || 'Multiple products'}\nQuantity: ${formData.quantity}\nCompany: ${formData.companyName}\nContact: ${formData.contactName}\nCountry: ${formData.country}\nEmail: ${formData.email}`
      window.open(`https://wa.me/8615860330104?text=${encodeURIComponent(waMsg)}`, '_blank')
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (field: keyof RFQFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  if (status === 'success') {
    return <RFQSuccess formData={formData} onClose={onClose} />
  }

  const inputCls = (err?: string) =>
    `w-full px-4 py-2.5 rounded-lg border ${err ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`

  return (
    <div className={variant === 'modal' ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' : ''}>
      <div className={`bg-white rounded-2xl shadow-2xl ${variant === 'modal' ? 'max-w-2xl w-full max-h-[90vh] overflow-y-auto' : 'w-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Request Bulk Quote</h2>
            {product && <p className="text-sm text-gray-500 mt-1">{product.brand} {product.name}</p>}
          </div>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Product info card */}
          {product && (
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
              <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">Brand: {product.brand}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Starting from</p>
                <p className="font-bold text-lg text-blue-600">${product.basePrice}</p>
              </div>
            </div>
          )}

          {/* Quantity & Target Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                className={inputCls(errors.quantity)}
                placeholder="Enter quantity"
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
              {product && recommendedTier && recommendedTier.discount > 0 && (
                <div className="mt-2 text-xs bg-green-50 text-green-700 rounded-lg px-3 py-2">
                  ✓ Quantity {recommendedTier.min}-{recommendedTier.max || '+'} units:{' '}
                  <span className="font-bold">{recommendedTier.discount}% off</span>
                  {' → '}Estimated: ${(product.basePrice * (1 - recommendedTier.discount / 100)).toFixed(2)}/unit
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Price (per unit, optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.targetPrice || ''}
                  onChange={(e) => handleChange('targetPrice', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your target price"
                />
              </div>
            </div>
          </div>

          {/* Intended Use */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intended Use <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.intendedUse}
              onChange={(e) => handleChange('intendedUse', e.target.value)}
              className={`${inputCls(errors.intendedUse)} bg-white`}
            >
              <option value="">Select intended use</option>
              {INTENDED_USES.map((use) => (
                <option key={use} value={use}>{use}</option>
              ))}
            </select>
            {errors.intendedUse && <p className="text-xs text-red-500 mt-1">{errors.intendedUse}</p>}
          </div>

          {/* Company Information */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className={inputCls(errors.companyName)}
                  placeholder="Your company name"
                />
                {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  className={inputCls(errors.contactName)}
                  placeholder="Your full name"
                />
                {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={`${inputCls(errors.country)} bg-white`}
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={inputCls(errors.email)}
                  placeholder="you@company.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={inputCls(errors.phone)}
                  placeholder="+1 234 567 890"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (optional)</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message (optional)</label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Any specific requirements? Color, configuration, packaging, shipping timeline, etc."
            />
          </div>

          {/* Marketing consent */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.acceptMarketing}
              onChange={(e) => handleChange('acceptMarketing', e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              I agree to receive product updates and promotional offers from REACH PROJECTOR.
            </span>
          </label>

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'submitting' ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Quote Request
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>

          {/* WhatsApp fallback */}
          <div className="text-center">
            <span className="text-sm text-gray-400">or</span>
          </div>
          <a
            href={`https://wa.me/8615860330104?text=${encodeURIComponent(`Hi REACH PROJECTOR, I'd like to request a bulk quote for ${formData.productName || 'multiple products'}. Quantity: ${formData.quantity} units.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 border-2 border-green-500 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.481-.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            Chat on WhatsApp Instead
          </a>

          {status === 'error' && (
            <p className="text-sm text-red-600 text-center">
              Something went wrong. Please try again or contact us via WhatsApp.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
