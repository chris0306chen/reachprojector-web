'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const applications = [
  {
    id: 1,
    title: 'Home Cinema Experience',
    subtitle: '客厅家庭影院场景',
    description:
      'Transform your living room into a cinematic paradise. Our 4K laser projectors deliver theater-quality visuals with stunning brightness and color accuracy, perfect for family movie nights.',
    image: '/images/cases/case-home-cinema.jpg',
    videoUrl: null, // 视频后续添加
  },
  {
    id: 2,
    title: 'Living Room Entertainment',
    subtitle: '客厅休闲观影场景',
    description:
      'Create the ultimate entertainment hub. Enjoy sports, gaming, and streaming on a massive screen that brings every moment to life with immersive detail.',
    image: '/images/cases/case-living-room.jpg',
    videoUrl: null, // 视频后续添加
  },
];

export default function RealWorldApplications() {
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
      className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Real-World Applications
          </h2>
          <p className="text-lg text-gray-500 mb-4">真实应用场景</p>
          <p className="max-w-2xl mx-auto text-gray-600">
            See how our projectors bring entertainment to life in real homes around the world
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {applications.map((app, index) => (
            <div
              key={app.id}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                <Image
                  src={app.image}
                  alt={`${app.title} - ${app.subtitle}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,eyJzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTYgMTAiPjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxMCIgZmlsbD0iIzFhMWEyZSIvPjwvc3ZnPg=="
                />

                {/* Play Button Overlay */}
                <button
                  className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                  aria-label={`Play video for ${app.title}`}
                  title="Video coming soon"
                >
                  <svg
                    className="w-5 h-5 text-gray-900 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>

                {/* Subtitle Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                  {app.subtitle}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {app.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {app.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expand Notice */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400 italic">
            More application scenarios coming soon...
          </p>
        </div>
      </div>
    </section>
  );
}
