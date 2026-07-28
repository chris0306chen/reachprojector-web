import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy-page';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy | REACH PROJECTOR',
  description: 'Return authorization, damaged or incorrect goods, refund timing and non-returnable project orders.',
};

export default async function ReturnsRefundsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} title="Returns & Refunds Policy" summary="Return eligibility depends on the product condition, order type, customization status, and the written terms accepted at checkout or in the quotation." sections={[
    { title: 'Requesting a return', paragraphs: ['Contact us within 14 calendar days after recorded delivery for a standard, non-custom retail product. Do not ship goods back until we issue written return instructions and a return authorization.'] },
    { title: 'Return condition', items: ['Products must be unused, complete, and in resalable condition with original packaging, accessories, manuals, serial labels, and promotional items.', 'The customer is responsible for secure return packaging and return freight unless we confirm that the goods were incorrect, materially defective on arrival, or damaged before delivery.', 'Any approved deduction for missing items, damage, use, or loss of resale value will be disclosed during inspection.'] },
    { title: 'Non-returnable orders', items: ['OEM, ODM, private-label, customized, made-to-order, cut-to-size, configured, or specially sourced products.', 'Opened consumables, software or license products, and clearance goods identified as final sale.', 'B2B project orders unless the applicable quotation or contract expressly provides a return right.'] },
    { title: 'Damage, shortage, or incorrect goods', paragraphs: ['Report visible damage, shortages, or an incorrect item as soon as possible and preferably within 48 hours of delivery. Include the order number, carton labels, serial number, unpacking photographs or video, and a clear description of the issue.'] },
    { title: 'Refund processing', paragraphs: ['Approved refunds are issued to the original payment method after returned goods are received and inspected. Bank, card, PayPal, and Stripe processing times are controlled by the payment provider. Original shipping, customs, and payment costs are non-refundable unless required by law or caused by our confirmed error.'] },
  ]} />;
}
