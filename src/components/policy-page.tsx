import Link from 'next/link';
import { getPolicyChrome } from '@/lib/policy-copy';
import type { PolicySection } from '@/lib/policy-copy';

export function PolicyPage({
  title,
  summary,
  sections,
  locale,
}: {
  title: string;
  summary: string;
  sections: PolicySection[];
  locale: string;
}) {
  const copy = getPolicyChrome(locale);
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-950 px-4 pb-14 pt-32 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">{copy.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{summary}</p>
          <p className="mt-4 text-sm text-slate-400">{copy.effectiveDate}</p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-7 text-slate-600">{paragraph}</p>
              ))}
              {section.items && (
                <ul className="mt-3 list-disc space-y-2 ps-5 leading-7 text-slate-600">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
          <section className="border-t border-slate-200 pt-7">
            <h2 className="text-xl font-bold text-slate-900">{copy.questions}</h2>
            <p className="mt-3 leading-7 text-slate-600">
              {copy.questionText} <a className="font-medium text-orange-600 hover:underline" href="mailto:info@reachtronics.com">info@reachtronics.com</a>
            </p>
            <Link href={`/${locale}/contact`} className="mt-5 inline-flex rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
              {copy.contact}
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
