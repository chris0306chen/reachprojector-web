import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  products: [
    { href: '/products?category=projectors', label: 'Projectors' },
    { href: '/products?category=printers', label: 'Printers' },
    { href: '/products?category=components', label: 'Components' },
    { href: '/products', label: 'All Products' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/about', label: 'Why Choose Us' },
    { href: '/contact', label: 'Wholesale Inquiry' },
  ],
  support: [
    { href: '/contact', label: 'Technical Support' },
    { href: '/contact', label: 'Warranty Policy' },
    { href: '/contact', label: 'Shipping Info' },
    { href: '/contact', label: 'Returns & Refunds' },
  ],
};

const brands = ['XGIMI', 'Hisense', 'JMGO', 'HP', 'Canon', 'Intel', 'AMD', 'Samsung'];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight leading-tight">
                  REACH
                </span>
                <span className="text-[10px] font-medium text-slate-400 tracking-widest leading-tight uppercase">
                  PROJECTOR
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
              Your trusted partner for premium projectors, printers, and computer components.
              Authorized dealer of top global brands with competitive wholesale pricing.
            </p>
            <div className="space-y-2">
              <a href="mailto:info@reachprojector.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-orange-400 transition-colors">
                <Mail className="w-4 h-4" />
                info@reachprojector.com
              </a>
              <a href="tel:+8613800138000" className="flex items-center gap-2 text-sm text-slate-400 hover:text-orange-400 transition-colors">
                <Phone className="w-4 h-4" />
                +86 138-0013-8000
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 shrink-0" />
                Shenzhen, Guangdong, China
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Products</h3>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link, idx) => (
                <li key={`product-${idx}`}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link, idx) => (
                <li key={`company-${idx}`}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link, idx) => (
                <li key={`support-${idx}`}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Brands */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Authorized Dealer Of</p>
          <div className="flex flex-wrap gap-6">
            {brands.map((brand) => (
              <span key={brand} className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} REACH PROJECTOR. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-orange-400 transition-colors">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-orange-400 transition-colors">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-orange-400 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
