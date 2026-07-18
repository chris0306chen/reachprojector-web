import type { Metadata } from 'next';
import RFQForm from '@/components/b2b/RFQForm';

export const metadata: Metadata = {
  title: 'B2B Wholesale Program | Bulk Electronics Pricing | REACH PROJECTOR',
  description: 'Get exclusive wholesale pricing on 4K laser projectors, printers, and computer components. DDP shipping, dedicated account managers, and flexible OEM/ODM solutions for business buyers worldwide.',
};

export default function WholesalePage() {
  const stats = [
    { value: '50+', label: 'Countries Served' },
    { value: '1,200+', label: 'Business Clients' },
    { value: '5,000+', label: 'Orders Delivered' },
    { value: '98.5%', label: 'On-Time Rate' },
  ];

  const advantages = [
    { icon: '💰', title: 'Tiered Wholesale Pricing', desc: 'Volume discounts up to 15% off. The more you buy, the more you save.' },
    { icon: '🚢', title: 'DDP Global Shipping', desc: 'Door-to-door delivery with duties paid. No customs surprises.' },
    { icon: '👤', title: 'Dedicated Account Manager', desc: 'Personal point of contact for quotes, orders, and after-sales support.' },
    { icon: '⚡', title: 'Priority Processing', desc: 'Your orders jump the queue. Faster fulfillment, guaranteed.' },
    { icon: '✅', title: 'Quality Assurance', desc: 'Every unit is inspected before shipping. ISO-certified processes.' },
    { icon: '🔧', title: 'Flexible Solutions (OEM/ODM)', desc: 'Custom branding, packaging, and product modifications to fit your market.' },
  ];

  const steps = [
    { step: 1, title: 'Submit Quote Request', desc: 'Tell us what you need — products, quantity, timeline.' },
    { step: 2, title: 'Receive Custom Pricing', desc: 'We send a tailored quote within 24 hours.' },
    { step: 3, title: 'Confirm and Pay', desc: 'Approve the quote and complete payment securely.' },
    { step: 4, title: 'We Ship DDP', desc: 'Sit back — we handle logistics, customs, and delivery.' },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Bulk Electronics Sourcing, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Simplified.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">Partner with REACH PROJECTOR for competitive wholesale pricing, global DDP shipping, and dedicated support — everything your business needs to scale.</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#rfq-form" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700">Request Bulk Quote<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></a>
            <a href="https://wa.me/8615860330104?text=Hi%20REACH%20PROJECTOR%2C%20I%27m%20interested%20in%20your%20wholesale%20program." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border-2 border-green-500 px-8 py-3.5 text-base font-semibold text-green-400 transition hover:bg-green-500/10"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.481-.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>Chat on WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s) => (<div key={s.label} className="text-center"><p className="text-3xl font-extrabold text-blue-600">{s.value}</p><p className="mt-1 text-sm text-gray-500">{s.label}</p></div>))}
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">Why Partner With Us?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">We go beyond wholesale — we build long-term partnerships that help your business grow.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((c) => (<div key={c.title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"><span className="text-3xl">{c.icon}</span><h3 className="mt-3 text-lg font-semibold text-gray-900">{c.title}</h3><p className="mt-2 text-sm text-gray-500">{c.desc}</p></div>))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">From quote to delivery in four simple steps.</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (<div key={s.step} className="relative text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">{s.step}</div>{s.step < 4 && (<div className="absolute top-6 left-1/2 hidden h-0.5 w-full bg-blue-200 lg:block" />)}<h3 className="mt-4 text-base font-semibold text-gray-900">{s.title}</h3><p className="mt-2 text-sm text-gray-500">{s.desc}</p></div>))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">Explore Our Product Categories</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <a href="/products?category=4k-laser-projectors" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-white shadow-lg transition hover:shadow-xl">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold">4K Laser Projectors</h3>
                <p className="mt-2 text-blue-200">Ultra-bright, long-lasting laser projectors for home theater, business, and education.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 group-hover:gap-2 transition-all">Browse Projectors<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></span>
              </div>
              <div className="absolute -right-6 -bottom-6 h-40 w-40 rounded-full bg-white/10" />
            </a>
            <a href="/products?category=printers-scanners" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 p-8 text-white shadow-lg transition hover:shadow-xl">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold">Printers &amp; Scanners</h3>
                <p className="mt-2 text-gray-300">Reliable office printers and high-speed scanners for every business environment.</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 group-hover:gap-2 transition-all">Browse Printers<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></span>
              </div>
              <div className="absolute -right-6 -bottom-6 h-40 w-40 rounded-full bg-white/10" />
            </a>
          </div>
        </div>
      </section>

      <section id="rfq-form" className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to Place a Bulk Order?</h2>
            <p className="mt-4 text-gray-300">Fill in the form below and our wholesale team will get back to you within 24 hours with custom pricing.</p>
          </div>
          <div className="mt-10">
            <RFQForm variant="embedded" />
          </div>
        </div>
      </section>
    </>
  );
}
