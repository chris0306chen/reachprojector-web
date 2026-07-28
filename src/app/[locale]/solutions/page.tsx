import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Home } from 'lucide-react';
import { sceneNavigation } from '@/lib/catalog-navigation';

export const metadata: Metadata = {
  title: 'Projection Solutions by Application | REACH PROJECTOR',
  description: 'Explore projector, screen, mount and AV furniture solutions for homes, meeting rooms, education, hospitality, events and large venues.',
};

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-4 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">Solutions by application</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">Start with your space, not a specification sheet.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Choose a scenario to see the recommended projector types, screens, mounts, furniture, and the key installation questions for your project.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-12 px-4 py-14 sm:px-6 lg:px-8">
        {sceneNavigation.map((group) => (
          <div key={group.group}>
            <div className="mb-5 flex items-center gap-3">
              {group.group === 'Residential' ? <Home className="h-5 w-5 text-orange-500" /> : <Building2 className="h-5 w-5 text-orange-500" />}
              <h2 className="text-2xl font-bold text-slate-900">{group.group}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map(([label, slug]) => (
                <Link
                  key={slug}
                  href={`/${locale}/solutions/${slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-orange-600">{label}</h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-orange-600">
                    Explore solution <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
