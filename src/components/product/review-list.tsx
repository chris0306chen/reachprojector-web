import type { PublicReview } from '@/lib/reviews'

interface ReviewListProps {
  reviews: PublicReview[]
  title?: string
  emptyText?: string
}

export function ReviewList({ reviews, title = 'Customer reviews', emptyText = 'No published customer reviews for this product yet.' }: ReviewListProps) {
  return (
    <section className="mt-10" aria-labelledby="customer-reviews-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Verified customer voice</p>
          <h2 id="customer-reviews-title" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        </div>
        <span className="text-sm text-slate-500">Published after review</span>
      </div>
      {!reviews.length ? (
        <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-600">{emptyText}</p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-950">{review.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{review.display_name} · {review.country}{review.company_name ? ` · ${review.company_name}` : ''}</p>
                </div>
                {review.product_rating && <span className="text-sm tracking-wide text-orange-600" aria-label={`${review.product_rating} out of 5 stars`}>{'★'.repeat(review.product_rating)}<span className="text-slate-300">{'★'.repeat(5 - review.product_rating)}</span></span>}
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">{review.body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
