import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy-page';
import { getShippingPolicy } from '@/lib/policy-copy';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const policy = getShippingPolicy(locale);
  return { title: `${policy.title} | REACH PROJECTOR`, description: policy.description };
}

export default async function ShippingPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const policy = getShippingPolicy(locale);
  return <PolicyPage locale={locale} title={policy.title} summary={policy.summary} sections={policy.sections} />;
}
