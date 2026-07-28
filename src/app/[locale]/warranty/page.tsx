import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy-page';

export const metadata: Metadata = {
  title: 'Product Warranty Policy | REACH PROJECTOR',
  description: 'Warranty coverage, claims, exclusions and remedies for projectors, screens, mounts, furniture and accessories.',
};

export default async function WarrantyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} title="Product Warranty Policy" summary="Warranty duration and service method vary by brand, product, destination, and whether the order is retail, wholesale, OEM, or project-based." sections={[
    { title: 'Applicable warranty', paragraphs: ['The controlling warranty period is the period shown on the product page, order confirmation, proforma invoice, or signed quotation. If these documents differ, the most specific written order term applies.'] },
    { title: 'What the warranty covers', paragraphs: ['During the applicable period, we will assess verified defects in materials or workmanship under normal intended use. Depending on the product, location, parts availability, and manufacturer policy, the remedy may be troubleshooting, replacement parts, repair, replacement, or another commercially reasonable solution.'] },
    { title: 'Exclusions', items: ['Accident, misuse, impact, liquid, fire, unsuitable voltage, poor ventilation, abnormal environment, or failure to follow instructions.', 'Unauthorized repair, modification, disassembly, firmware changes, or use with incompatible accessories.', 'Normal wear, cosmetic change, consumables, batteries, lamps, filters, and expected brightness degradation unless specifically covered.', 'Damage during customer-arranged transport or installation, and faults caused by third-party systems or site conditions.'] },
    { title: 'Making a claim', paragraphs: ['Provide the order number, model, serial number, delivery country, description of the fault, troubleshooting already completed, and clear photographs or video. Do not return or dismantle the product until instructed.'] },
    { title: 'B2B, OEM and project orders', paragraphs: ['Service levels, spare parts, on-site work, advance replacement, and installation support are included only when stated in the applicable quotation or contract. Project customers should agree critical spares and service responsibilities before ordering.'] },
  ]} />;
}
