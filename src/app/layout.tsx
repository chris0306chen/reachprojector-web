import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'REACH PROJECTOR - Premium Projectors, Printers & Components',
    template: '%s | REACH PROJECTOR',
  },
  description:
    'Your trusted partner for premium 4K projectors, printers, and computer components. Authorized dealer of XGIMI, Hisense, JMGO, HP, Canon, Intel, AMD. Wholesale & retail worldwide.',
  keywords: [
    'projector',
    '4K projector',
    'laser projector',
    'laser TV',
    'UST projector',
    'XGIMI',
    'Hisense',
    'JMGO',
    'printer',
    'HP printer',
    'Canon printer',
    'computer components',
    'CPU',
    'GPU',
    'wholesale electronics',
    'B2B electronics',
  ],
  authors: [{ name: 'REACH PROJECTOR', url: 'https://reachprojector.com' }],
  metadataBase: new URL('https://reachprojector.com'),
  openGraph: {
    title: 'REACH PROJECTOR - Premium Projectors & Electronics',
    description:
      'Authorized dealer of premium projectors, printers, and computer components. Competitive wholesale pricing worldwide.',
    url: 'https://reachprojector.com',
    siteName: 'REACH PROJECTOR',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REACH PROJECTOR - Premium Projectors & Electronics',
    description: 'Authorized dealer of premium projectors, printers, and computer components.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
