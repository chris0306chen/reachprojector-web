import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy-page';

export const metadata: Metadata = {
  title: 'Terms of Sale & Website Use | REACH PROJECTOR',
  description: 'Terms for website use, retail purchases, B2B quotations, pricing, payment, shipping, product information and liability.',
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} title="Terms of Sale & Website Use" summary="These terms apply to use of this website and supplement the checkout terms, quotation, proforma invoice, or contract governing a specific order." sections={[
    { title: 'Seller and order acceptance', paragraphs: ['The selling entity identified on the order confirmation, invoice, or quotation is responsible for that transaction. An online submission is an offer to purchase. An order is accepted only when payment and product availability are confirmed and we issue acceptance or begin fulfillment.'] },
    { title: 'Product information and suitability', paragraphs: ['We work to keep descriptions and specifications accurate, but manufacturers may revise packaging, firmware, accessories, regional features, plugs, languages, or specifications. Customers must confirm critical compatibility, installation, certification, and regional requirements before ordering.'] },
    { title: 'Prices and payment', items: ['Unless otherwise stated, website prices are in USD and exclude shipping, duties, taxes, installation, and local charges.', 'Card payments may be processed by Stripe and wallet payments by PayPal. B2B orders may use the payment schedule stated in the quotation or proforma invoice.', 'We may cancel and refund an order affected by an obvious pricing error, suspected fraud, unavailable stock, export restriction, or an unsupported destination.'] },
    { title: 'B2B, OEM and project orders', paragraphs: ['A written quotation, proforma invoice, specification sheet, sample approval, or contract may add or replace these general terms. Tooling, branding, packaging, certification, sample, deposit, balance, inspection, tolerance, and lead-time requirements must be recorded in that document.'] },
    { title: 'Shipping, risk and customs', paragraphs: ['Shipping terms are described in our Shipping, Duties & Delivery Policy and the applicable checkout or quotation. Trade terms such as DDP or DAP apply only when expressly stated. Title, risk, insurance, and delivery responsibilities may be further defined by the applicable order document.'] },
    { title: 'Intellectual property and website use', paragraphs: ['Website content, branding, layout, text, and original media may not be copied, scraped for republication, misrepresented, or commercially reused without permission. Third-party trademarks and product materials remain the property of their respective owners.'] },
    { title: 'Liability and applicable terms', paragraphs: ['To the maximum extent permitted by applicable law, indirect, incidental, or consequential losses are excluded. Mandatory consumer rights are not limited. Any governing law, dispute procedure, or liability allocation stated in a signed quotation or contract controls that order; otherwise applicable law is determined by the selling entity and transaction.'] },
  ]} />;
}
