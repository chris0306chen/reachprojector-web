import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react'
import { buyingGuides, getBuyingGuide } from '@/lib/guides'
import { generateBreadcrumbSchema, SITE_NAME, SITE_URL } from '@/lib/seo'

type GuidePageProps = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return buyingGuides.map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const guide = getBuyingGuide(slug)
  if (!guide) return {}
  return {
    title: `${guide.title} | ${SITE_NAME}`,
    description: guide.description,
    alternates: { canonical: `${SITE_URL}/${locale}/guides/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.description, type: 'article' },
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale, slug } = await params
  const guide = getBuyingGuide(slug)
  if (!guide) notFound()

  const url = `${SITE_URL}/${locale}/guides/${guide.slug}`
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` } },
  }
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
    { name: 'Buying Guides', url: `/${locale}/guides` },
    { name: guide.title, url: `/${locale}/guides/${guide.slug}` },
  ])

  return (
    <article className="bg-white pb-20 pt-28 lg:pb-28 lg:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}/guides`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600"><ArrowLeft className="h-4 w-4" /> All buying guides</Link>
        <header className="mt-10 border-b border-slate-200 pb-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-wider"><span className="text-orange-700">{guide.audience}</span><span className="text-slate-400">Reviewed {guide.updatedAt}</span><span className="text-slate-400">{guide.readTime}</span></div>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">{guide.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{guide.description}</p>
        </header>

        <section className="my-10 rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-6 sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-800">The short answer</h2>
          <p className="mt-3 text-base leading-8 text-slate-800">{guide.directAnswer}</p>
        </section>

        <div className="space-y-12">
          {guide.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 text-base leading-8 text-slate-600">{paragraph}</p>)}
              {section.checklist && <ul className="mt-5 space-y-3">{section.checklist.map((item) => <li key={item} className="flex gap-3 text-base leading-7 text-slate-600"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100"><Check className="h-3 w-3 text-orange-700" /></span><span>{item}</span></li>)}</ul>}
            </section>
          ))}
        </div>

        <section className="mt-14 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-semibold text-slate-950">Sources and review method</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">We prioritize manufacturer documentation and primary trade-rule sources. Product specifications and destination requirements should still be confirmed for the exact order.</p>
          <ul className="mt-4 space-y-2">{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-orange-600">{source.label}<ExternalLink className="h-3.5 w-3.5" /></a></li>)}</ul>
        </section>

        <section className="mt-12 rounded-2xl bg-slate-950 p-7 text-white sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Next step</p>
          <h2 className="mt-3 text-2xl font-semibold">Turn the checklist into a confident decision.</h2>
          <Link href={`/${locale}${guide.cta.href}`} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600">{guide.cta.label}<ArrowRight className="h-4 w-4" /></Link>
        </section>
      </div>
    </article>
  )
}
