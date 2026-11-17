'use client'

import { FormEvent, useState } from 'react'

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'

export default function OEMInquiryForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    const form = new FormData(event.currentTarget)
    const name = String(form.get('contactName') || '')
    const email = String(form.get('email') || '')
    const company = String(form.get('company') || '')
    const subject = `OEM technical inquiry: ${String(form.get('application') || 'Projection module')}`
    const message = [
      `Business need: ${String(form.get('businessNeed') || '')}`,
      `Application: ${String(form.get('application') || '')}`,
      `Target resolution / brightness: ${String(form.get('performance') || '')}`,
      `Mechanical space / throw distance: ${String(form.get('mechanical') || '')}`,
      `Interfaces / power: ${String(form.get('interfaces') || '')}`,
      `Sample quantity / estimated annual volume: ${String(form.get('volume') || '')}`,
      `Timeline: ${String(form.get('timeline') || '')}`,
      `Additional notes: ${String(form.get('notes') || '')}`,
    ].join('\n')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, subject, message, inquiry_type: 'wholesale' }),
      })
      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
      event.currentTarget.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-900"><h3 className="text-lg font-semibold">Technical inquiry received</h3><p className="mt-2 text-sm">We will review the requirements and reply with suitable module options or follow-up questions.</p></div>
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Contact name<input required name="contactName" className={inputClass} /></label>
        <label className="text-sm font-medium text-slate-700">Work email<input required type="email" name="email" className={inputClass} /></label>
        <label className="text-sm font-medium text-slate-700">Company<input required name="company" className={inputClass} /></label>
        <label className="text-sm font-medium text-slate-700">Business need<select required name="businessNeed" className={inputClass} defaultValue=""><option value="" disabled>Select one</option><option>OEM / ODM product development</option><option>Professional AV procurement</option><option>Rental & staging supply</option><option>3D mapping project</option><option>Other technical application</option></select></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Application or product description<textarea required name="application" rows={3} className={inputClass} placeholder="What will the projection module or board be built into?" /></label>
        <label className="text-sm font-medium text-slate-700">Target resolution / brightness<textarea name="performance" rows={2} className={inputClass} placeholder="For example: 1080p, 4K, target lumens" /></label>
        <label className="text-sm font-medium text-slate-700">Mechanical space / throw distance<textarea name="mechanical" rows={2} className={inputClass} placeholder="Available dimensions, throw ratio or distance" /></label>
        <label className="text-sm font-medium text-slate-700">Interfaces / power<textarea name="interfaces" rows={2} className={inputClass} placeholder="HDMI, MIPI, USB, Ethernet, voltage, etc." /></label>
        <label className="text-sm font-medium text-slate-700">Sample quantity / annual volume<textarea name="volume" rows={2} className={inputClass} placeholder="Samples first, then estimated production quantity" /></label>
        <label className="text-sm font-medium text-slate-700">Target timeline<input name="timeline" className={inputClass} placeholder="Sample date or production target" /></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Additional notes<textarea name="notes" rows={3} className={inputClass} /></label>
      </div>
      <p className="text-xs leading-5 text-slate-500">This catalog is for technical reference and sourcing. Final specifications, availability, pricing, sample lead time and customization are confirmed case by case.</p>
      <button disabled={status === 'submitting'} className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">{status === 'submitting' ? 'Sending…' : 'Request technical matching'}</button>
      {status === 'error' && <p className="text-sm text-red-600">We could not send the request. Please try again or use WhatsApp.</p>}
    </form>
  )
}

