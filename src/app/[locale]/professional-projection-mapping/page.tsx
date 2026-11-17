import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, CircleDot, Ruler, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Professional AV & 3D Projection Mapping Supply | REACH PROJECTOR',
  description: 'Equipment sourcing and project coordination for projection mapping, rental, staging, immersive spaces and professional AV projects.',
}

const useCases = [
  { icon: Building2, title: 'Architectural mapping', text: 'Source high-brightness projection equipment for buildings, façades, cultural sites and public experiences.' },
  { icon: CircleDot, title: 'Rental & staging supply', text: 'Identify projector, lens and accessory requirements for rental companies and event production teams.' },
  { icon: Ruler, title: 'Immersive spaces', text: 'Plan equipment needs for museums, exhibitions, hospitality spaces and branded experience rooms.' },
  { icon: Wrench, title: 'AV project procurement', text: 'Coordinate product selection, supplier quotations and delivery planning around an approved project brief.' },
]

export default async function ProfessionalProjectionMappingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="bg-slate-950 text-white"><div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-400">Professional AV / projection mapping</p><h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Source the equipment behind the experience.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Reach Projector helps rental companies, AV integrators and project teams define equipment needs, compare suitable supply options and prepare a practical RFQ.</p><div className="mt-9 flex flex-wrap gap-3"><Link href={`/${locale}/oem-projection-modules#technical-rfq`} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Start a project RFQ <ArrowRight className="h-4 w-4" /></Link><Link href={`/${locale}/wholesale`} className="inline-flex items-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500">Wholesale supply</Link></div></div></section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="max-w-2xl"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Where we can help first</h2><p className="mt-4 text-base leading-7 text-slate-600">This is an equipment sourcing and coordination pathway, not a claim of worldwide on-site installation. Local execution depends on the approved rental company, integrator or project partner.</p></div><div className="mt-10 grid gap-5 md:grid-cols-2">{useCases.map((item) => { const Icon = item.icon; return <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p></article> })}</div></section>
      <section className="border-y border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Information that makes a project quote useful</h2><div className="mt-8 grid gap-x-10 gap-y-4 text-sm leading-6 text-slate-600 sm:grid-cols-2 lg:grid-cols-3"><p>• Country and venue type</p><p>• Projection surface size</p><p>• Throw distance and lens constraints</p><p>• Indoor or outdoor conditions</p><p>• Target brightness and resolution</p><p>• Projector quantity and event date</p><p>• Installation responsibility</p><p>• Rental, purchase or hybrid model</p><p>• Budget range and delivery window</p></div></div></section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 rounded-xl bg-slate-900 p-8 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:p-12"><div><h2 className="text-3xl font-semibold tracking-tight">Have a project brief or equipment list?</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">Send the venue, dimensions, timing and intended use. We will identify the missing technical questions before discussing suppliers.</p></div><Link href={`/${locale}/oem-projection-modules#technical-rfq`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Request matching <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
  )
}

