import { Metadata } from 'next';
import { CheckoutPage } from './checkout-client';

export const metadata: Metadata = {
  title: 'Checkout - REACH PROJECTOR',
  description: 'Complete your purchase securely with PayPal or credit card',
};

export default function Checkout() {
  return <CheckoutPage />;
}
