export const INCLUDED_SHIPPING_LABEL = "Shipping included in product price";
export const INCLUDED_TAX_LABEL = "Import duties and taxes are not guaranteed included; confirm separately.";

export function shippingMethodLabel(shipping: { method: string; tradeTerms: string }) {
  return shipping.tradeTerms === "SHIPPING_INCLUDED"
    ? `${INCLUDED_SHIPPING_LABEL}. ${INCLUDED_TAX_LABEL}`
    : `${shipping.method} (${shipping.tradeTerms})`;
}
