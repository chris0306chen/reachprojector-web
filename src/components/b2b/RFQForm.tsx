'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  Send,
  Loader2,
  AlertCircle,
  Tag,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Product } from '@/storage/database/shared/schema';
import { RFQSuccess } from './RFQSuccess';

// ─── Constants ────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = '8615860330104';

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'EG', label: 'Egypt' },
  { value: 'IN', label: 'India' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'TH', label: 'Thailand' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'PH', label: 'Philippines' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'RU', label: 'Russia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'PL', label: 'Poland' },
] as const;

const INTENDED_USES = [
  { value: 'resale', labelKey: 'intendedUses.resale' },
  { value: 'corporate', labelKey: 'intendedUses.corporate' },
  { value: 'education', labelKey: 'intendedUses.education' },
  { value: 'government', labelKey: 'intendedUses.government' },
  { value: 'rental', labelKey: 'intendedUses.rental' },
  { value: 'installation', labelKey: 'intendedUses.installation' },
  { value: 'distribution', labelKey: 'intendedUses.distribution' },
  { value: 'other', labelKey: 'intendedUses.other' },
] as const;

// ─── Types ────────────────────────────────────────────────────────────

interface RFQFormProps {
  product?: Product;
  onClose?: () => void;
  variant: 'modal' | 'embedded';
}

interface TierInfo {
  tier_min: number;
  tier_max: number | null;
  discount_percent: string;
  tier_label: string | null;
}

interface FormErrors {
  [key: string]: string;
}

// ─── Component ────────────────────────────────────────────────────────

export function RFQForm({ product, onClose, variant }: RFQFormProps) {
  const t = useTranslations('rfq');

  // Form state
  const [quantity, setQuantity] = useState(product ? 10 : 1);
  const [targetPrice, setTargetPrice] = useState('');
  const [intendedUse, setIntendedUse] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState('');
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rfqNumber, setRfqNumber] = useState('');
  const [tiers, setTiers] = useState<TierInfo[]>([]);

  // Fetch product tiers when product is provided
  useEffect(() => {
    if (!product?.slug) return;
    fetch(`/api/product-tiers?product_slug=${encodeURIComponent(product.slug)}`)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setTiers(res.data);
        }
      })
      .catch(() => {});
  }, [product?.slug]);

  // Get applicable tier for current quantity
  const getApplicableTier = useCallback((): TierInfo | null => {
    if (!tiers.length) return null;
    return (
      tiers.find(
        (tier) =>
          quantity >= tier.tier_min &&
          (tier.tier_max === null || quantity <= tier.tier_max)
      ) || null
    );
  }, [tiers, quantity]);

  const applicableTier = getApplicableTier();

  // ─── Validation ───────────────────────────────────────────────────

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!companyName.trim()) newErrors.companyName = t('errors.required');
    if (!contactName.trim()) newErrors.contactName = t('errors.required');
    if (!country) newErrors.country = t('errors.required');
    if (!intendedUse) newErrors.intendedUse = t('errors.required');
    if (!quantity || quantity < 1) newErrors.quantity = t('errors.minQuantity');

    if (!email.trim()) {
      newErrors.email = t('errors.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    if (!phone.trim()) newErrors.phone = t('errors.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ──────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        product_name: product?.name || '',
        product_slug: product?.slug || '',
        quantity,
        target_price: targetPrice ? parseFloat(targetPrice) : null,
        company_name: companyName.trim(),
        contact_name: contactName.trim(),
        country,
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || null,
        intended_use: intendedUse,
        message: message.trim() || null,
        accept_marketing: acceptMarketing,
      };

      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('errors.submitFailed'));
      }

      // Success
      const rfqNum = data.data?.rfq_number || data.rfqNumber || '';
      setRfqNumber(rfqNum);
      setSubmitted(true);

      // Open WhatsApp follow-up channel
      const whatsappMsg = encodeURIComponent(
        `Hi, I just submitted an RFQ${product ? ` for ${product.name}` : ''} (Qty: ${quantity}). My reference number is ${rfqNum}. I'd like to discuss pricing and details. Thank you!`
      );
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`,
        '_blank'
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : t('errors.submitFailed')
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success View ────────────────────────────────────────────────

  if (submitted) {
    return (
      <RFQSuccess
        formData={{
          contactName,
          productName: product?.name || '',
          quantity,
          companyName,
          country: COUNTRIES.find((c) => c.value === country)?.label || country,
          email,
        }}
        onClose={onClose}
      />
    );
  }

  // ─── Form View ───────────────────────────────────────────────────

  const isModal = variant === 'modal';

  return (
    <div className={isModal ? 'max-h-[85vh] overflow-y-auto' : ''}>
      {/* Modal Header */}
      {isModal && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t('form.title')}
            </h2>
            <p className="text-sm text-slate-500">{t('form.subtitle')}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>
      )}

      {/* Embedded Header */}
      {!isModal && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {t('form.title')}
          </h2>
          <p className="text-slate-500 mt-1">{t('form.subtitle')}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`${isModal ? 'px-6 py-5' : ''} space-y-5`}
        noValidate
      >
        {/* ─── Product Info (if provided) ──────────────────────────── */}
        {product && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {product.name}
                </p>
                <p className="text-sm text-slate-600">
                  {product.brand} · ${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Tier Pricing Tip ───────────────────────────────────── */}
        {applicableTier && product && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Tag className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-blue-700">
                {applicableTier.tier_label ||
                  `${applicableTier.discount_percent}% ${t('form.tierDiscount')}`}
              </span>
              <span className="text-blue-600 ml-1">
                {t('form.tierApplies', {
                  discount: applicableTier.discount_percent,
                  min: applicableTier.tier_min,
                  max: applicableTier.tier_max ?? '∞',
                })}
              </span>
            </div>
          </div>
        )}

        {/* ─── Quantity & Target Price ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('form.quantity')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow ${
                errors.quantity ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder={t('form.quantityPlaceholder')}
            />
            {errors.quantity && (
              <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('form.targetPrice')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* ─── Intended Use ────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('form.intendedUse')} <span className="text-red-500">*</span>
          </label>
          <select
            value={intendedUse}
            onChange={(e) => setIntendedUse(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow bg-white ${
              errors.intendedUse ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
          >
            <option value="">{t('form.selectIntendedUse')}</option>
            {INTENDED_USES.map((use) => (
              <option key={use.value} value={use.value}>
                {t(use.labelKey)}
              </option>
            ))}
          </select>
          {errors.intendedUse && (
            <p className="text-xs text-red-500 mt-1">{errors.intendedUse}</p>
          )}
        </div>

        {/* ─── Divider ─────────────────────────────────────────────── */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            {t('form.companyInfo')}
          </p>
        </div>

        {/* ─── Company Name & Contact Name ─────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('form.companyName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow ${
                errors.companyName ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder={t('form.companyNamePlaceholder')}
            />
            {errors.companyName && (
              <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('form.contactName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow ${
                errors.contactName ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder={t('form.contactNamePlaceholder')}
            />
            {errors.contactName && (
              <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>
            )}
          </div>
        </div>

        {/* ─── Country ─────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('form.country')} <span className="text-red-500">*</span>
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow bg-white ${
              errors.country ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
          >
            <option value="">{t('form.selectCountry')}</option>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-xs text-red-500 mt-1">{errors.country}</p>
          )}
        </div>

        {/* ─── Email & Phone ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('form.email')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="email@company.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('form.phone')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow ${
                errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="+1 234 567 8900"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* ─── WhatsApp (optional) ─────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('form.whatsapp')}
          </label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
            placeholder="+1 234 567 8900"
          />
        </div>

        {/* ─── Message (optional) ──────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('form.message')}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow resize-none"
            placeholder={t('form.messagePlaceholder')}
          />
        </div>

        {/* ─── Marketing Consent ───────────────────────────────────── */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptMarketing}
            onChange={(e) => setAcceptMarketing(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
          />
          <span className="text-sm text-slate-600">
            {t('form.acceptMarketing')}
          </span>
        </label>

        {/* ─── Submit Error ────────────────────────────────────────── */}
        {submitError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* ─── Submit Button ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('form.submitting')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t('form.submit')}
              </>
            )}
          </button>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              product
                ? `Hi, I'm interested in ${product.name} for wholesale. Could you provide a quote?`
                : "Hi, I'd like to inquire about wholesale pricing for your products."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-5 rounded-lg transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t('form.whatsappQuick')}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </form>
    </div>
  );
}
