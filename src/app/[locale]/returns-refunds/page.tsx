import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy-page';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy | REACH PROJECTOR',
  description: 'Return authorization, damaged or incorrect goods, refund timing and non-returnable project orders.',
};

export default async function ReturnsRefundsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} title="Returns & Refunds Policy" summary="Return eligibility depends on the product condition, order type, customization status, and the written terms accepted at checkout or in the quotation." sections={[
    { title: 'Requesting a return', paragraphs: ['Contact us within 7 calendar days after recorded delivery if a product has a verified quality problem. Because international return shipping is costly and operationally complex, we do not accept change-of-mind or other no-fault returns. Do not ship goods back until we issue written return instructions and a return authorization.'] },
    { title: 'Return condition', items: ['Products must be unused, complete, and in resalable condition with original packaging, accessories, manuals, serial labels, and promotional items.', 'The customer is responsible for secure return packaging and return freight unless we confirm that the goods were incorrect, materially defective on arrival, or damaged before delivery.', 'Any approved deduction for missing items, damage, use, or loss of resale value will be disclosed during inspection.'] },
    { title: 'Non-returnable orders', items: ['OEM, ODM, private-label, customized, made-to-order, cut-to-size, configured, or specially sourced products.', 'Opened consumables, software or license products, and clearance goods identified as final sale.', 'B2B project orders unless the applicable quotation or contract expressly provides a return right.'] },
    { title: 'Required evidence', paragraphs: ['A continuous unpacking video is required for any claim involving damage, shortage, an incorrect product, or a quality problem on arrival. The video must clearly show the unopened shipping carton and labels, the complete opening process, all contents, the product serial number, and the reported issue. Also include the order number, photographs, and a clear written description. Claims without sufficient evidence may be declined.'] },
    { title: 'Refund processing', paragraphs: ['Approved refunds are issued to the original payment method after returned goods are received and inspected. Bank, card, PayPal, and Stripe processing times are controlled by the payment provider. Original shipping, customs, and payment costs are non-refundable unless required by law or caused by our confirmed error.'] },
  ]} />;
}
