'use client';

import { useState } from 'react';
import TieredPricing from './TieredPricing';
import RFQForm from './RFQForm';

interface PricingRFQWrapperProps {
  basePrice: number;
  productName: string;
  productSlug: string;
  productBrand: string;
  productImage: string;
}

export default function PricingRFQWrapper({
  basePrice,
  productName,
  productSlug,
  productBrand,
  productImage,
}: PricingRFQWrapperProps) {
  const [showRFQ, setShowRFQ] = useState(false);

  return (
    <div className="mt-8 space-y-6">
      <TieredPricing basePrice={basePrice} />

      <button
        onClick={() => setShowRFQ(true)}
        className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold text-sm hover:bg-blue-600 hover:text-white transition-colors"
      >
        Request Bulk Quote
      </button>

      {showRFQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Request Bulk Quote</h3>
              <button
                onClick={() => setShowRFQ(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6" id="rfq-form">
              <RFQForm
                product={{
                  name: productName,
                  slug: productSlug,
                  brand: productBrand,
                  basePrice,
                  image: productImage,
                }}
                onClose={() => setShowRFQ(false)}
                variant="embedded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
