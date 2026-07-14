import type { Metadata } from 'next';
import { Shield, Truck, DollarSign, Globe, Award, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about REACH PROJECTOR - your trusted partner for premium projectors and electronics. Authorized dealer with global shipping.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-900 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
              About REACH PROJECTOR
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-6">
              Your Trusted Partner in Premium Electronics
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Founded with a mission to bring premium electronics to the global market,
              REACH PROJECTOR has grown into a trusted name for projectors, printers, and
              computer components. We bridge the gap between world-class manufacturers and
              customers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  REACH PROJECTOR started as a small team of electronics enthusiasts in Shenzhen,
                  China - the heart of the global electronics industry. Our deep connections with
                  manufacturers and our passion for technology gave us a unique advantage.
                </p>
                <p>
                  Today, we serve customers in over 50 countries, from individual consumers looking
                  for the best home theater setup to businesses seeking bulk procurement solutions.
                  Our commitment to quality, competitive pricing, and exceptional service has made us
                  the preferred partner for many.
                </p>
                <p>
                  As authorized dealers for brands like XGIMI, Hisense, JMGO, HP, Canon, and more,
                  we guarantee 100% genuine products with full manufacturer warranty. Every product
                  goes through our quality inspection before shipping.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Products' },
                { value: '50+', label: 'Countries Served' },
                { value: '12+', label: 'Brand Partners' },
                { value: '99%', label: 'Customer Satisfaction' },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100">
                  <p className="text-3xl font-bold text-orange-500 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              Why Businesses Choose Us
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              We provide end-to-end solutions for B2B and B2C customers worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: 'Authorized Dealer',
                desc: 'Official authorization from all brands we carry. Every product is 100% genuine with full manufacturer warranty and support.',
              },
              {
                icon: Truck,
                title: 'DDP Global Shipping',
                desc: 'Delivered Duty Paid service to 50+ countries. We handle all customs, duties, taxes, and logistics. Zero hassle for you.',
              },
              {
                icon: DollarSign,
                title: 'Competitive Pricing',
                desc: 'Direct relationships with manufacturers mean we can offer the most competitive prices. Volume discounts available for B2B orders.',
              },
              {
                icon: Shield,
                title: 'Quality Assurance',
                desc: 'Every product undergoes quality inspection before shipping. We stand behind every product with comprehensive after-sales support.',
              },
              {
                icon: Globe,
                title: 'Global Reach',
                desc: 'Serving customers across Europe, Americas, Southeast Asia, Russia, and the Middle East. Multi-language support available.',
              },
              {
                icon: Users,
                title: 'Dedicated Support',
                desc: 'Expert product consultation, technical support, and account management. Available via WhatsApp, email, and phone.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Ready to Start a Partnership?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            Whether you need a single projector or a container load of electronics,
            we have the products, pricing, and logistics to make it happen.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </>
  );
}
