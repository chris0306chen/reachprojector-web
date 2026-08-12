import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Home, Layers3 } from 'lucide-react';
import { sceneDetails, sceneNavigation } from '@/lib/catalog-navigation';
import { getLocalizedSceneDetails, getLocalizedSceneTitle, getSolutionsCopy } from '@/lib/solutions-copy';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = getSolutionsCopy(locale);
  return {
    title: `${copy.eyebrow} | REACH PROJECTOR`,
    description: copy.description,
  };
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = getSolutionsCopy(locale);

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-32 text-white">
        <div className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(circle_at_center,rgba(234,88,12,.18),transparent_65%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-orange-400">{copy.eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{copy.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {copy.description}
          </p>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-slate-200">
            <Layers3 className="h-4 w-4 text-orange-400" />
            {copy.systemSummary}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-16 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        {sceneNavigation.map((group) => (
          <div key={group.group}>
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                {group.group === 'Residential' ? <Home className="h-5 w-5 text-orange-700" /> : <Building2 className="h-5 w-5 text-orange-700" />}
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">{copy.chooseUseCase}</p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{group.group === 'Residential' ? copy.residential : copy.business}</h2>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map(([label, slug], index) => (
                <Link
                  key={slug}
                  href={`/${locale}/solutions/${slug}`}
                  className="group flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_24px_60px_-40px_rgba(15,23,42,.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <span className="text-xs font-bold tracking-[0.18em] text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-950 group-hover:text-orange-700">{getLocalizedSceneTitle(locale, slug, label)}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {getLocalizedSceneDetails(locale, slug, sceneDetails[slug]).description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-orange-700">
                    {copy.explore} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
