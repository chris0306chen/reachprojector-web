import type { Metadata } from 'next';
import { ArrowDown, Check, MessageCircle } from 'lucide-react';
import RFQForm from '@/components/b2b/RFQForm';
import { getWholesaleCopy } from '@/lib/wholesale-copy';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getWholesaleCopy(locale);
  return { title: `${copy.metadataTitle} | REACH PROJECTOR`, description: copy.metadataDescription };
}

export default async function WholesalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getWholesaleCopy(locale);
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(circle_at_center,rgba(234,88,12,.2),transparent_65%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-orange-400">
            {copy.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-7xl">
            {copy.title} <span className="text-orange-400">{copy.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            {copy.description}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#rfq-form"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-orange-600 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {copy.requestQuote}
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/8615860330104?text=Hi%20REACH%20PROJECTOR%2C%20I%27m%20interested%20in%20your%20wholesale%20program."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-emerald-500 px-8 py-3.5 text-base font-semibold text-emerald-300 transition hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <MessageCircle className="h-4 w-4" />
              {copy.whatsapp}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f5] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">{copy.helpEyebrow}</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {copy.helpTitle}
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              {copy.helpDescription}
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {copy.advantages.map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7">
                <span className="text-xs font-bold tracking-[0.18em] text-orange-600">{String(index + 1).padStart(2, '0')}</span>
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
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">{copy.processEyebrow}</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{copy.processTitle}</h2>
          </div>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.map((item, index) => (
              <li key={item.title} className="rounded-2xl border border-slate-200 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 rounded-2xl bg-slate-50 p-6 sm:grid-cols-3">
            {copy.briefItems.map((item) => (
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
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">{copy.formEyebrow}</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.formTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
              {copy.formDescription}
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
