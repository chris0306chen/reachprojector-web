import Link from 'next/link';
import { ArrowRight, Settings, Package, Sparkles, Monitor, Tv, Wrench, RectangleVertical } from 'lucide-react';
import { getProducts } from '@/lib/data-service';
import { ProductCard } from '@/components/product-card';
import RealWorldApplications from '@/components/real-world-applications';
import ShippingDelivery from '@/components/shipping-delivery';
import { getTranslations } from 'next-intl/server';
import { generateWebSiteSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations('home');

  const [bestsellers] = await Promise.all([
    getProducts({ pageSize: 8 }),
  ]);

  const categories = [
    {
      icon: Monitor,
      titleKey: 'categories.projectors',
      descKey: 'categories.projectorsDesc',
      href: '/products?category=4k-laser-projectors',
      image: '/images/categories/4k-laser-projector.jpg',
    },
    {
      icon: Tv,
      titleKey: 'categories.ustLaser',
      descKey: 'categories.ustLaserDesc',
      href: '/products?category=ust-laser-tv',
      image: '/images/categories/ust-laser-tv.jpg',
    },
    {
      icon: Wrench,
      titleKey: 'categories.mounts',
      descKey: 'categories.mountsDesc',
      href: '/products?category=projector-mounts',
      image: '/images/categories/projector-mount.jpg',
    },
    {
      icon: RectangleVertical,
      titleKey: 'categories.screens',
      descKey: 'categories.screensDesc',
      href: '/products?category=projection-screens',
      image: '/images/categories/projection-screen.jpg',
    },
  ];

  const solutions = [
    {
      titleKey: 'solutions.hospitality.title',
      descKey: 'solutions.hospitality.desc',
      oemKey: 'solutions.hospitality.oem',
      image: '/images/scenarios/hospitality.jpg',
      href: '/products',
    },
    {
      titleKey: 'solutions.retail.title',
      descKey: 'solutions.retail.desc',
      oemKey: 'solutions.retail.oem',
      image: '/images/scenarios/retail-oem.jpg',
      href: '/products',
    },
    {
      titleKey: 'solutions.events.title',
      descKey: 'solutions.events.desc',
      oemKey: 'solutions.events.oem',
      image: '/images/scenarios/events.jpg',
      href: '/products',
    },
    {
      titleKey: 'solutions.education.title',
      descKey: 'solutions.education.desc',
      oemKey: 'solutions.education.oem',
      image: '/images/scenarios/education.jpg',
      href: '/products',
    },
  ];

  const whyPartnerCards = [
    {
      icon: Settings,
      titleKey: 'whyPartner.cards.0.title',
      descKey: 'whyPartner.cards.0.desc',
    },
    {
      icon: Package,
      titleKey: 'whyPartner.cards.1.title',
      descKey: 'whyPartner.cards.1.desc',
    },
    {
      icon: Sparkles,
      titleKey: 'whyPartner.cards.2.title',
      descKey: 'whyPartner.cards.2.desc',
    },
  ];

  return (
    <>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }} />




      {/* ── 1. Hero Section ── */}


      {/* ── 2. Tailored Solutions ── */}


      {/* ── 3. Why Partner With Us ── */}


      {/* ── 4. Content Studio / Launch Kit ── */}


      {/* ── 5. Category Navigation Cards ── */}


      {/* ── 6. Best Sellers ── */}


      {/* ── 7. Inspiration for Your Space ── */}


      {/* ── 8. Real-World Applications ── */}


      {/* ── 9. Shipping & Delivery ── */}


      {/* ── 10. B2B CTA ── */}
    </>
  );
}
