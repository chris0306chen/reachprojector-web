import type { Metadata } from 'next'
import Link from 'next/link'
import { buildLocalizedAlternates } from '@/lib/seo'
import { getPublicCompanyReviews } from '@/lib/reviews'
import { ReviewList } from '@/components/product/review-list'
import { TrustpilotWidget } from '@/components/trustpilot/trustpilot-widget'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Customer Reviews | REACH PROJECTOR',
    description: 'Published customer feedback for REACH PROJECTOR products and sourcing support.',
    alternates: buildLocalizedAlternates(locale, '/reviews'),
  }
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  let reviews = []
  try { reviews = await getPublicCompanyReviews() } catch { reviews = [] }
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Customer evidence</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Real feedback, reviewed before publication.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">We publish customer-submitted feedback only after checking the invitation or transaction record. Product feedback remains attached to the exact model; company feedback is kept separate.</p>
          <Link href={`/${locale}/reviews/submit`} className="mt-9 inline-flex rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600">Submit a review invitation</Link>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <TrustpilotWidget />
        <ReviewList reviews={reviews} title="Company reviews" emptyText="No company reviews have been published yet." />
      </div>
    </main>
  )
}
