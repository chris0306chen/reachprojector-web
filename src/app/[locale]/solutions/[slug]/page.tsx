import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, MessageSquareText } from 'lucide-react';
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

  let result = await getProducts({ sceneSlug: slug, pageSize: 8 });
  if (!result.products.length) {
    result = await getProducts({ categorySlugs: scene.categorySlugs, pageSize: 8 });
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-950 px-4 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href={`/${locale}/solutions`} className="text-sm text-slate-400 hover:text-white">Solutions / {scene.eyebrow}</Link>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">{scene.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{scene.description}</p>
          <Link
            href={`/${locale}/contact?scene=${slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Request a project quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Planning checklist</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">What we confirm before recommending a system</h2>
        </div>
        <div className="grid gap-4">
          {scene.considerations.map((item) => (
            <div key={item} className="flex gap-3 rounded-xl border border-slate-200 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
              <span className="font-medium text-slate-800">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
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
