import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CircuitBoard, Focus, Layers3, ScanLine } from 'lucide-react'
import OEMInquiryForm from '@/components/b2b/OEMInquiryForm'

export const metadata: Metadata = {
  title: 'OEM Projection Modules & Optical Engines | REACH PROJECTOR',
  description: 'Technical reference and sourcing support for OEM projection modules, optical engines, driver boards and short-throw projection assemblies.',
}

const families = [
  { icon: Layers3, title: 'DLP optical engines', text: 'Production-ready optical engine sourcing for teams building a projector or an embedded display product.', tags: ['DLP', 'LED / laser', 'Optics matching'] },
  { icon: Focus, title: 'Embedded projection modules', text: 'Compact projection assemblies evaluated against your available space, throw distance, power and interface requirements.', tags: ['Compact form factors', 'Focus options', 'Thermal planning'] },
  { icon: CircuitBoard, title: 'HDMI driver boards', text: 'Controller and driver-board matching for a selected optical module, with interface and power requirements reviewed together.', tags: ['HDMI', 'Control boards', 'System integration'] },
  { icon: ScanLine, title: 'Short-throw and UST assemblies', text: 'Optical assemblies for interactive, display, education, retail and other applications where installation distance is limited.', tags: ['Short throw', 'UST', 'Application fit'] },
]

const process = [
  ['01', 'Share the application', 'Tell us what the projection system is being built into and the constraints that matter.'],
  ['02', 'Match the technology', 'We compare suitable supplier options and identify missing technical information.'],
  ['03', 'Validate a sample', 'Samples, technical documents and integration questions are handled before volume discussions.'],
  ['04', 'Plan production supply', 'Once the fit is confirmed, we coordinate quotation, lead time and repeat supply.'],
]

export default async function OEMProjectionModulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white"><div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.18),transparent_62%)]" /><div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28"><div><p className="max-w-xl text-sm font-semibold uppercase tracking-[0.18em] text-orange-400">OEM / ODM projection technology</p><h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Build projection into your product.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Reach Projector helps overseas product teams source and evaluate optical engines, embedded modules and driver boards from China.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#technical-rfq" className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Start a technical RFQ <ArrowRight className="h-4 w-4" /></a><Link href={`/${locale}/wholesale`} className="inline-flex items-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500">Wholesale supply</Link></div></div><div className="self-end rounded-xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl shadow-black/20"><p className="text-sm font-semibold text-orange-400">For teams that need a fit, not a catalog number</p><ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300"><li>• Resolution, brightness and throw-ratio matching</li><li>• Mechanical space, interfaces and power review</li><li>• Sample-first validation before production planning</li><li>• Supplier coordination without pretending every module is in stock</li></ul></div></div></section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="max-w-2xl"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Technical reference families</h2><p className="mt-4 text-base leading-7 text-slate-600">These are sourcing categories, not direct-purchase products. Final specifications and availability are confirmed against your application and the selected supplier.</p></div><div className="mt-10 grid gap-5 md:grid-cols-2">{families.map((family) => { const Icon = family.icon; return <article key={family.title} className="rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-slate-900/5"><div className="flex items-start justify-between gap-4"><div className="rounded-lg bg-orange-50 p-3 text-orange-600"><Icon className="h-5 w-5" /></div><span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Quote only</span></div><h3 className="mt-5 text-xl font-semibold">{family.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{family.text}</p><div className="mt-5 flex flex-wrap gap-2">{family.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{tag}</span>)}</div></article> })}</div></section>
      <section className="border-y border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">A practical path from idea to sample</h2><div className="mt-10 grid gap-8 md:grid-cols-4">{process.map(([number, title, text]) => <div key={number}><span className="text-sm font-semibold text-orange-500">{number}</span><h3 className="mt-3 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></div></section>
      <section id="technical-rfq" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><div><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Tell us what you are building</h2><p className="mt-4 max-w-md text-base leading-7 text-slate-600">The more technical context you share, the faster we can determine whether an existing module fits or whether a supplier conversation is needed.</p><div className="mt-8 rounded-xl bg-slate-950 p-6 text-sm leading-6 text-slate-300"><p className="font-semibold text-white">Not ready with every specification?</p><p className="mt-2">That is fine. Start with the product idea, target market and sample quantity. We will identify the missing questions.</p></div></div><OEMInquiryForm /></div></section>
    </main>
  )
}

