import type { ExternalProductFeedback } from '@/lib/product-feedback'

interface ExternalFeedbackProps {
  feedback: ExternalProductFeedback[]
}

export function ExternalFeedback({ feedback }: ExternalFeedbackProps) {
  if (!feedback.length) return null

  return (
    <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8" aria-labelledby="external-feedback-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Customer evidence</p>
          <h2 id="external-feedback-title" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Feedback from our Alibaba International store</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">These are seller-owned marketplace feedback records for this exact model. They are shown as customer evidence, not as an independent review-platform rating.</p>
        </div>
        <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">Model-specific</span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {feedback.map((item) => (
          <article key={`${item.country}-${item.summary}`} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-900">{item.country}</span>
              <span className="text-sm tracking-wide text-orange-600" aria-label={`${item.rating} out of 5 stars`}>{'★'.repeat(item.rating)}<span className="text-slate-300">{'★'.repeat(5 - item.rating)}</span></span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
            <p className="mt-4 text-xs text-slate-400">{item.source} · {item.dateLabel}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
