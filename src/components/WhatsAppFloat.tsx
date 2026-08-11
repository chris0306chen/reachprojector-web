'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const WHATSAPP_NUMBER = '8615860330104';

const whatsappCopy: Record<string, { label: string; help: string; product: (slug: string) => string; wholesale: string; general: string }> = {
  en: { label: 'Chat on WhatsApp', help: 'Need help? Chat with us on WhatsApp', product: (slug) => `Hi REACH PROJECTOR, I'm interested in the product (${slug}). Could you share more details?`, wholesale: "Hi REACH PROJECTOR, I'm interested in your wholesale program. Can you tell me more?", general: "Hi REACH PROJECTOR, I'd like to inquire about your products. Can you help?" },
  zh: { label: '通过 WhatsApp 咨询', help: '需要帮助？通过 WhatsApp 联系我们', product: (slug) => `您好 REACH PROJECTOR，我对产品（${slug}）感兴趣，可以提供更多信息吗？`, wholesale: '您好 REACH PROJECTOR，我想了解批发合作，可以提供更多信息吗？', general: '您好 REACH PROJECTOR，我想咨询你们的产品，可以协助吗？' },
  es: { label: 'Chatear por WhatsApp', help: '¿Necesita ayuda? Escríbanos por WhatsApp', product: (slug) => `Hola REACH PROJECTOR, me interesa el producto (${slug}). ¿Podrían compartir más información?`, wholesale: 'Hola REACH PROJECTOR, me interesa su programa mayorista. ¿Podrían contarme más?', general: 'Hola REACH PROJECTOR, quisiera consultar sobre sus productos. ¿Pueden ayudarme?' },
  ru: { label: 'Написать в WhatsApp', help: 'Нужна помощь? Напишите нам в WhatsApp', product: (slug) => `Здравствуйте, REACH PROJECTOR! Меня интересует товар (${slug}). Расскажите о нем подробнее.`, wholesale: 'Здравствуйте, REACH PROJECTOR! Меня интересует оптовое сотрудничество. Расскажите подробнее.', general: 'Здравствуйте, REACH PROJECTOR! Я хотел(а) бы узнать о вашей продукции. Поможете?' },
  ar: { label: 'الدردشة عبر WhatsApp', help: 'هل تحتاج إلى مساعدة؟ تواصل معنا عبر WhatsApp', product: (slug) => `مرحباً REACH PROJECTOR، أنا مهتم بالمنتج (${slug}). هل يمكنكم مشاركة مزيد من التفاصيل؟`, wholesale: 'مرحباً REACH PROJECTOR، أنا مهتم ببرنامج البيع بالجملة. هل يمكنكم تزويدي بالمزيد؟', general: 'مرحباً REACH PROJECTOR، أود الاستفسار عن منتجاتكم. هل يمكنكم مساعدتي؟' },
};

function getMessage(pathname: string, locale: string): string {
  const copy = whatsappCopy[locale] || whatsappCopy.en;
  if (pathname.includes('/products/') && !pathname.endsWith('/products')) {
    const slug = pathname.split('/products/')[1]?.split('/')[0] ?? '';
    return copy.product(slug);
  }
  if (pathname.includes('/wholesale')) {
    return copy.wholesale;
  }
  return copy.general;
}

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const copy = whatsappCopy[locale] || whatsappCopy.en;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const message = getMessage(pathname, locale);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 end-6 z-50 flex items-end gap-3">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center"
      >
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.label}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600"
        >
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.481-.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span className="absolute -top-1 -end-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
          </span>
        </a>
        {hovered && (
          <div className="absolute bottom-full end-0 mb-3 whitespace-nowrap rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
            {copy.help}
            <div className="absolute -bottom-1 end-6 h-2 w-2 rotate-45 bg-gray-900" />
          </div>
        )}
      </div>
    </div>
  );
}

export default WhatsAppFloat;
