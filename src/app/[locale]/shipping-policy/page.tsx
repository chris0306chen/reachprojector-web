import type { Metadata } from 'next';
import { PolicyPage } from '@/components/policy-page';

export const metadata: Metadata = {
  title: 'Shipping, Duties & Delivery Policy | REACH PROJECTOR',
  description: 'International shipping, DDP and DAP terms, delivery estimates, chargeable weight, customs and project freight information.',
};

export default async function ShippingPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} title="Shipping, Duties & Delivery Policy" summary="How shipping prices, trade terms, delivery estimates, customs responsibilities, and freight orders are handled." sections={[
    { title: 'Shipping quotes', paragraphs: ['Available shipping methods and prices are calculated using the delivery country, product quantity, packed weight, package dimensions, shipping class, and the active rate available when the order is placed. Volumetric weight may be used when it is higher than actual packed weight.'] },
    { title: 'DDP and non-DDP destinations', items: ['When checkout or a written quotation states DDP, the quoted shipping service includes import-duty and tax handling to the agreed destination, subject to the stated exclusions.', 'When DDP is not expressly shown, duties, taxes, customs charges, brokerage, storage, remote-area charges, and local compliance costs may be payable by the recipient.', 'Mexico checkout displays DDP services only. Availability for every other country depends on the active shipping route and product type.'] },
    { title: 'Oversized and project freight', paragraphs: ['Projection screens, cabinets, furniture, multi-carton goods, and other freight-class products may require a manual quotation. The order is not accepted until route, price, trade term, delivery address, and estimated schedule are confirmed in writing.'] },
    { title: 'Delivery estimates', paragraphs: ['Processing and transit times are estimates, not guarantees. Customs inspection, remote locations, carrier disruption, weather, peak seasons, and buyer documentation may affect delivery. Tracking is provided when supported by the carrier.'] },
    { title: 'Address and delivery responsibility', items: ['The customer must provide a complete and accurate delivery address, contact name, phone number, and any customs information requested.', 'Address changes after payment may require a new shipping quote and security review.', 'Visible carton damage should be recorded with the carrier and reported to us promptly with photographs.'] },
  ]} />;
}
