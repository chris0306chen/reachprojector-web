'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

function OrderSuccessContent() {
  const t = useTranslations('orderSuccess');
  const searchParams = useSearchParams();
  const productName = searchParams.get('product') || 'your product';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-slate-600">
            {t('thankYou', { product: productName })}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-slate-900">{t('whatNext')}</h2>
          </div>
          <ul className="text-left text-sm text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">1.</span>
              {t('step1')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">2.</span>
              {t('step2')}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">3.</span>
              {t('step3')}
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('continueShopping')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 font-medium rounded-lg transition-colors"
          >
            {t('contactSupport')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto" />
          <div className="h-8 bg-slate-200 rounded w-48 mx-auto" />
          <div className="h-4 bg-slate-200 rounded w-64 mx-auto" />
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
