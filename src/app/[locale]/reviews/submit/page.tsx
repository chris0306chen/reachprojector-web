import type { Metadata } from 'next'
import { buildLocalizedAlternates } from '@/lib/seo'
import ReviewSubmissionForm from './review-submission-form'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Submit a Customer Review | REACH PROJECTOR',
    description: 'Submit an invited product or company review for moderation.',
    alternates: buildLocalizedAlternates(locale, '/reviews/submit'),
  }
}

export default async function ReviewSubmitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Customer review</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Share your experience</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">This form requires a one-time invitation link. Your review will remain pending until our team completes a basic authenticity and content check.</p>
          <ReviewSubmissionForm locale={locale} />
        </div>
      </div>
    </main>
  )
}
