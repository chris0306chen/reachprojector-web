'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { getShippingVisualCopy } from '@/lib/shipping-visual-copy';

const shippingCards = [
  {
    id: 1,
    status: 'active' as const,
    image: '/images/shipping/container-loading.jpg',
    icon: (
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: 2,
    status: 'active' as const,
    image: '/images/shipping/warehouse-packing.jpg',
    icon: (
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  {
    id: 3,
    status: 'coming_soon' as const,
    icon: (
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ShippingDelivery() {
  const copy = getShippingVisualCopy(useLocale());
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {copy.title}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            {copy.description}
          </p>
        </div>

        {/* Shipping Cards - Horizontal Scroll on Mobile */}
        <div
          className={`flex gap-6 overflow-x-auto pb-4 scrollbar-hide transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shippingCards.map((card, index) => (
            <div
              key={card.id}
              className="flex-shrink-0 w-[280px] md:w-1/3 bg-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600 transition-all duration-300 group"
            >
              {/* Image Area */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                {card.status === 'active' && card.image ? (
                  <img
                    src={card.image}
                    alt={copy.cards[index].title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-center h-full">
                      <div className="transform transition-transform duration-300 group-hover:scale-110">
                        {card.icon}
                      </div>
                    </div>
                    {/* Coming Soon Badge */}
                    <div className="absolute top-3 end-3 bg-orange-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {copy.comingSoon}
                    </div>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {copy.cards[index].title}
                </h3>
                <p className="text-sm text-gray-400">{copy.cards[index].subtitle}</p>
                {card.status === 'coming_soon' && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {copy.updateSoon}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          {copy.footer}
        </p>
      </div>
    </section>
  );
}
