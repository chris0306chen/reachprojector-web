import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy-page';

export const metadata: Metadata = {
  title: 'Privacy Policy | REACH PROJECTOR',
  description: 'How REACH PROJECTOR collects, uses, shares, protects and retains customer and website information.',
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} title="Privacy Policy" summary="This policy explains how HK REACH SOURCING LIMITED and its operating partners handle information submitted through REACH PROJECTOR." sections={[
    { title: 'Information we collect', items: ['Contact, company, billing, delivery, tax, customs, and account information you provide.', 'Product inquiries, quotations, orders, communications, uploaded files, support records, and transaction references.', 'Device, browser, IP address, referral, page interaction, security, and cookie information generated when the website is used.'] },
    { title: 'How information is used', items: ['To answer inquiries, prepare quotations, process payments and orders, arrange shipping, provide support, and meet legal obligations.', 'To prevent fraud, secure the website, maintain business records, analyze performance, and improve products and services.', 'To send requested or permitted business communications. You may opt out of marketing messages at any time.'] },
    { title: 'Service providers and international transfers', paragraphs: ['Information may be processed by providers that support hosting, databases, email, analytics, payments, fraud prevention, logistics, customs, and customer service. Current core providers may include Vercel, Supabase, Resend, Stripe, and PayPal. Payment card credentials are handled by the selected payment provider and are not stored by this website. Cross-border processing may occur where necessary to serve an international order.'] },
    { title: 'Retention and security', paragraphs: ['We retain information only as long as reasonably needed for the purposes described, contractual records, tax and customs requirements, dispute handling, security, and applicable law. We use reasonable administrative and technical safeguards, but no internet system can guarantee absolute security.'] },
    { title: 'Your choices and rights', paragraphs: ['Depending on your location, you may have rights to request access, correction, deletion, restriction, objection, portability, or withdrawal of consent. We may need to verify identity and retain information where required by law or legitimate recordkeeping needs.'] },
    { title: 'Cookies', paragraphs: ['The website may use essential cookies for language, security, session, checkout, and site operation. Analytics or advertising cookies should be used only according to the consent requirements applicable to the visitor.'] },
  ]} />;
}
