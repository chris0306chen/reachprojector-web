import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy-page';
import { getTermsPolicy } from '@/lib/policy-copy';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const policy = getTermsPolicy(locale);
  return { title: `${policy.title} | REACH PROJECTOR`, description: policy.description };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const policy = getTermsPolicy(locale);
  return <PolicyPage locale={locale} title={policy.title} summary={policy.summary} sections={policy.sections} />;
}
