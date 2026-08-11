import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, Layers3, MessageSquareText } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { sceneDetails, sceneNavigation } from '@/lib/catalog-navigation';
import { getProducts } from '@/lib/data-service';

export function generateStaticParams() {
  return sceneNavigation.flatMap((group) => group.items.map(([, slug]) => ({ slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scene = sceneDetails[slug];
  if (!scene) return {};
  return {
    title: `${scene.title} | Projector Packages | REACH PROJECTOR`,
    description: scene.description,
  };
}

export default async function ScenePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const scene = sceneDetails[slug];
  if (!scene) notFound();

  const componentLabels = scene.categorySlugs.map((category) => ({
    slug: category,
    label: category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  }));

  let result = await getProducts({ sceneSlug: slug, pageSize: 8 });
  if (!result.products.length) {
    result = await getProducts({ categorySlugs: scene.categorySlugs, pageSize: 8 });
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-32 text-white">
        <div className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(circle_at_center,rgba(234,88,12,.18),transparent_65%)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link href={`/${locale}/solutions`} className="text-sm text-slate-400 hover:text-white">Solutions / {scene.eyebrow}</Link>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{scene.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{scene.description}</p>
          <Link
            href={`/${locale}/contact?scene=${slug}`}
            className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            Request a project quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Planning checklist</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">What we confirm before recommending a system</h2>
        </div>
        <div className="grid gap-4">
          {scene.considerations.map((item) => (
            <div key={item} className="flex min-h-16 gap-3 rounded-2xl border border-slate-200 bg-[#f7f7f5] p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
              <span className="font-medium leading-6 text-slate-800">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Complete system layers</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Equipment selected to work together</h2>
            <p className="mt-4 leading-7 text-slate-300">These product groups form the starting point for this scene. Final compatibility depends on the room measurements and installation plan.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {componentLabels.map((component, index) => (
              <Link
                key={component.slug}
                href={`/${locale}/products?category=${component.slug}`}
                className="group rounded-2xl border border-white/15 bg-white/5 p-6 transition hover:border-orange-400/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <div className="flex items-center justify-between">
                  <Layers3 className="h-5 w-5 text-orange-400" />
                  <span className="text-xs font-bold tracking-[0.16em] text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-8 font-semibold text-white">{component.label}</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">View compatible products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f7f7f5]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Recommended products</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Build your solution</h2>
            </div>
            <Link href={`/${locale}/products`} className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
              Browse all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {result.products.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {result.products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <MessageSquareText className="mx-auto h-8 w-8 text-orange-500" />
              <h3 className="mt-3 font-semibold text-slate-900">This solution is configured to order.</h3>
              <p className="mt-1 text-sm text-slate-500">Tell us your room size, destination, and quantity for a matched package.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
