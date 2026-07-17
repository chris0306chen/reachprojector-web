import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContactForm } from './contact-form';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with REACH PROJECTOR for product inquiries, wholesale pricing, and technical support. WhatsApp, email, and phone support available.',
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-900 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Contact Us
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-6">
              Let&apos;s Start a Conversation
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Have a question about our products? Need a wholesale quote? Our team is ready
              to help you find the perfect solution.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <a href="mailto:info@reachprojector.com" className="flex items-start gap-3 text-slate-600 hover:text-orange-500 transition-colors">
                    <Mail className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Email</p>
                      <p className="text-sm">info@reachprojector.com</p>
                    </div>
                  </a>
                  <a href="tel:+8613800138000" className="flex items-start gap-3 text-slate-600 hover:text-orange-500 transition-colors">
                    <Phone className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Phone</p>
                      <p className="text-sm">+86 138-0013-8000</p>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/8613800138000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-slate-600 hover:text-orange-500 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">WhatsApp</p>
                      <p className="text-sm">+86 138-0013-8000</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Address</p>
                      <p className="text-sm">Shenzhen, Guangdong Province, China</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Business Hours</p>
                      <p className="text-sm">Mon - Sat: 9:00 AM - 6:00 PM (GMT+8)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp CTA */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-base font-semibold text-green-900 mb-2">
                  Quick Response via WhatsApp
                </h3>
                <p className="text-sm text-green-700 mb-4">
                  For the fastest response, message us on WhatsApp. We typically reply within 30 minutes during business hours.
                </p>
                <a
                  href="https://wa.me/8613800138000?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-50 rounded-xl p-6 lg:p-8 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
                <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-10 bg-slate-200 rounded" /><div className="h-10 bg-slate-200 rounded" /><div className="h-32 bg-slate-200 rounded" /><div className="h-12 bg-slate-200 rounded" /></div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
