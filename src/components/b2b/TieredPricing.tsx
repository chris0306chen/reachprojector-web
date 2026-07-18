'use client';

import { useState } from 'react';

interface PricingTier {
  minQty: number;
  maxQty: number | null;
  discount: number;
  label: string;
}

interface TieredPricingProps {
  basePrice: number;
  currency?: string;
  tiers?: PricingTier[];
}

const DEFAULT_TIERS: PricingTier[] = [
  { minQty: 1, maxQty: 4, discount: 0, label: 'Sample / Retail' },
  { minQty: 5, maxQty: 9, discount: 5, label: 'Small Batch' },
  { minQty: 10, maxQty: 19, discount: 8, label: 'Standard Wholesale' },
  { minQty: 20, maxQty: 49, discount: 12, label: 'Volume Wholesale' },
  { minQty: 50, maxQty: null, discount: 15, label: 'Distribution' },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CNY: '¥',
};

export default function TieredPricing({
  basePrice,
  currency = 'USD',
  tiers = DEFAULT_TIERS,
}: TieredPricingProps) {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const bestValueIndex = tiers.length - 1;

  const formatPrice = (price: number) => {
    return `${symbol}${price.toFixed(2)}`;
  };

  const formatQtyRange = (tier: PricingTier) => {
    if (tier.maxQty === null) {
      return `${tier.minQty}+`;
    }
    return `${tier.minQty}-${tier.maxQty}`;
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Wholesale Tiered Pricing</h3>
        <p className="text-sm text-slate-500 mt-1">
          Order more, save more — volume discounts automatically applied at checkout
        </p>
      </div>

      <div className="space-y-3">
        {tiers.map((tier, index) => {
          const discountedPrice = basePrice * (1 - tier.discount / 100);
          const savings = basePrice - discountedPrice;
          const isSelected = selectedTier === index;
          const isBestValue = index === bestValueIndex;

          return (
            <div
              key={index}
              onClick={() => setSelectedTier(index)}
              className={`relative flex items-center justify-between rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-white shadow-md ring-2 ring-blue-500'
                  : 'bg-white/60 hover:bg-white hover:shadow-sm'
              } ${
                isBestValue ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {isBestValue && (
                <span className="absolute -top-2.5 right-4 bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                  BEST VALUE
                </span>
              )}

              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900">
                  {formatQtyRange(tier)} units
                </span>
                <span className="text-xs text-slate-500">{tier.label}</span>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">
                    {formatPrice(discountedPrice)}
                  </span>
                  {tier.discount > 0 && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(basePrice)}
                    </span>
                  )}
                </div>
                {tier.discount > 0 ? (
                  <span className="text-xs font-medium text-green-600">
                    Save {formatPrice(savings)} ({tier.discount}% off)
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Base price</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-slate-200">
        <a
          href="#rfq-form"
          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          Request Custom Quote
        </a>
      </div>
    </div>
  );
}
