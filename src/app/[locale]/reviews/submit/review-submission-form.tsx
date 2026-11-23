'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ReviewSubmissionForm({ locale }: { locale: string }) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = new FormData(event.currentTarget)
      const payload = {
      token,
      review_type: String(form.get('review_type') || 'product'),
      product_rating: form.get('product_rating') ? Number(form.get('product_rating')) : null,
      service_rating: form.get('service_rating') ? Number(form.get('service_rating')) : null,
      title: String(form.get('title') || ''),
      body: String(form.get('body') || ''),
      display_name: String(form.get('display_name') || ''),
      country: String(form.get('country') || ''),
      company_name: String(form.get('company_name') || '') || null,
      allow_public_name: form.get('allow_public_name') === 'on',
      allow_public_company: form.get('allow_public_company') === 'on',
      allow_public_image: form.get('allow_public_image') === 'on',
      locale,
    }
    try {
      const image = form.get('image')
      const requestBody = image instanceof File && image.size > 0 ? (() => { const multipart = new FormData(); Object.entries(payload).forEach(([key, value]) => multipart.append(key, String(value ?? ''))); multipart.append('image', image); return multipart })() : JSON.stringify(payload)
      const response = await fetch('/api/reviews/submit', { method: 'POST', headers: requestBody instanceof FormData ? undefined : { 'Content-Type': 'application/json' }, body: requestBody })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to submit review')
      setStatus('success')
      setMessage('Thank you. Your review was submitted for moderation.')
      event.currentTarget.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to submit review')
    }
  }

  if (status === 'success') return <p className="mt-8 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>

  return (
    <form onSubmit={submit} className="mt-8 grid gap-5">
      {!token && <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">Please open this page from a valid review invitation link.</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Review type<select name="review_type" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" defaultValue="product"><option value="product">Product</option><option value="company">Company</option></select></label>
        <label className="text-sm font-medium text-slate-700">Product rating<select name="product_rating" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" defaultValue="5"><option value="">Not applicable</option>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700">Service rating<select name="service_rating" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" defaultValue=""><option value="">Not applicable</option>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700">Country<input required name="country" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label>
      </div>
      <label className="text-sm font-medium text-slate-700">Title<input required minLength={3} name="title" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label>
      <label className="text-sm font-medium text-slate-700">Your review<textarea required minLength={10} name="body" rows={6} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Display name<input required name="display_name" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label>
        <label className="text-sm font-medium text-slate-700">Company (optional)<input name="company_name" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label>
      </div>
      <label className="flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" name="allow_public_name" className="mt-1" />Allow my display name to appear publicly.</label>
      <label className="flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" name="allow_public_company" className="mt-1" />Allow my company name to appear publicly.</label>
      <label className="text-sm font-medium text-slate-700">Photo (optional)<input type="file" name="image" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-sm" /></label>
      <label className="flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" name="allow_public_image" className="mt-1" />Allow this photo to appear publicly if the review is approved.</label>
      {message && <p className={status === 'error' ? 'text-sm text-red-600' : 'text-sm text-slate-600'}>{message}</p>}
      <button disabled={!token || status === 'submitting'} className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">{status === 'submitting' ? 'Submitting…' : 'Submit for review'}</button>
    </form>
  )
}
