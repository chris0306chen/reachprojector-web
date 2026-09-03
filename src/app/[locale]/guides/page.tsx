import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Building2, Home } from 'lucide-react'
import { buyingGuides } from '@/lib/guides'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Projector Buying Guides | REACH PROJECTOR',
  description: 'Practical projector selection, room planning, international shipping and RFQ guides for home and business buyers.',
  alternates: { canonical: `${SITE_URL}/en/guides` },
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      <section className="bg-slate-950 pb-20 pt-28 lg:pb-24 lg:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Buying Guides</p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">Choose with evidence, not guesswork.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Room-first advice for home buyers and procurement-ready checklists for business customers. Each guide shows its sources and review date.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f5] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-4 border-b border-slate-300 pb-8 md:grid-cols-2">
            <div className="flex gap-4"><Home className="mt-1 h-5 w-5 shrink-0 text-orange-600" /><div><h2 className="font-semibold text-slate-950">For home buyers</h2><p className="mt-1 text-sm leading-6 text-slate-600">Room fit, screen choices and trade-offs explained in plain language.</p></div></div>
            <div className="flex gap-4"><Building2 className="mt-1 h-5 w-5 shrink-0 text-orange-600" /><div><h2 className="font-semibold text-slate-950">For business buyers</h2><p className="mt-1 text-sm leading-6 text-slate-600">RFQ, logistics and purchasing checks for projects and resale.</p></div></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {buyingGuides.map((guide) => (
              <article key={guide.slug} className="group flex min-h-80 flex-col rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
                <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wider"><span className="text-orange-700">{guide.audience}</span><span className="text-slate-400">{guide.readTime}</span></div>
                <BookOpen className="mt-8 h-8 w-8 text-slate-300" />
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{guide.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{guide.description}</p>
                <Link href={`/${locale}/guides/${guide.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition group-hover:text-orange-600">Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
