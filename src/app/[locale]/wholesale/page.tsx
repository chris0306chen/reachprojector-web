import type { Metadata } from 'next';
import { ArrowDown, Check, MessageCircle } from 'lucide-react';
import RFQForm from '@/components/b2b/RFQForm';

export const metadata: Metadata = {
  title: 'B2B Wholesale Projector Sourcing | REACH PROJECTOR',
  description: 'Request a tailored quotation for projector sourcing, volume orders, shipping coordination, and available OEM or ODM options.',
};

const advantages = [
  {
    number: '01',
    title: 'Volume-based quotations',
    description: 'Pricing is prepared around your product mix, quantity, destination, and requested timeline.',
  },
  {
    number: '02',
    title: 'Product sourcing support',
    description: 'Share your market requirements and shortlist suitable projector options with our team.',
  },
  {
    number: '03',
    title: 'Shipping coordination',
    description: 'Discuss available delivery terms, packing requirements, and documentation before ordering.',
  },
  {
    number: '04',
    title: 'Direct account support',
    description: 'Keep one point of contact from the initial quotation through order follow-up.',
  },
  {
    number: '05',
    title: 'Pre-shipment alignment',
    description: 'Confirm the product, quantity, and packing details before your order is dispatched.',
  },
  {
    number: '06',
    title: 'OEM / ODM discussion',
    description: 'Ask about available branding, packaging, and product customization options for your market.',
  },
];

const steps = [
  { step: '01', title: 'Send your brief', description: 'Tell us the products, quantity, destination, and timeline you need.' },
  { step: '02', title: 'Review the proposal', description: 'Discuss product availability, commercial terms, and shipping options.' },
  { step: '03', title: 'Confirm the order', description: 'Approve the final quotation and complete the agreed payment process.' },
  { step: '04', title: 'Coordinate delivery', description: 'Follow the order through preparation, dispatch, and delivery.' },
];

export default function WholesalePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(circle_at_center,rgba(234,88,12,.2),transparent_65%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-orange-400">
            Wholesale partnerships
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-7xl">
            Projector sourcing, <span className="text-orange-400">made clearer.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            Tell us what your market needs. Our team will prepare a product and pricing proposal around your quantity,
            destination, and timeline.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#rfq-form"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-orange-600 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Request a quotation
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/8615860330104?text=Hi%20REACH%20PROJECTOR%2C%20I%27m%20interested%20in%20your%20wholesale%20program."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-emerald-500 px-8 py-3.5 text-base font-semibold text-emerald-300 transition hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f5] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">How we can help</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Built around your sourcing brief
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              From product selection to delivery planning, each quotation starts with your actual requirements.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((item) => (
              <article key={item.number} className="rounded-2xl border border-slate-200 bg-white p-7">
                <span className="text-xs font-bold tracking-[0.18em] text-orange-600">{item.number}</span>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">A straightforward process</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">From brief to delivery</h2>
          </div>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <li key={item.step} className="rounded-2xl border border-slate-200 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-5 font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 rounded-2xl bg-slate-50 p-6 sm:grid-cols-3">
            {['Product and quantity', 'Destination and timeline', 'Packing or branding needs'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Check className="h-4 w-4 shrink-0 text-orange-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="rfq-form" className="scroll-mt-20 bg-slate-950 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Start the conversation</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Request a tailored quotation</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
              Share your requirements below so the wholesale team can review the products, quantity, and destination with you.
            </p>
          </div>
          <div className="mt-10">
            <RFQForm variant="embedded" />
          </div>
        </div>
      </section>
    </>
  );
}
