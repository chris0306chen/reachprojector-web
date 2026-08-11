type ShippingVisualCopy = {
  title: string;
  description: string;
  cards: Array<{ title: string; subtitle: string }>;
  comingSoon: string;
  updateSoon: string;
  footer: string;
};

const en: ShippingVisualCopy = {
  title: 'Shipping & Delivery',
  description: 'A look at packing and shipment preparation for international orders.',
  cards: [
    { title: 'Container loading', subtitle: 'Shipment preparation' },
    { title: 'Warehouse packing', subtitle: 'Order protection and packing' },
    { title: 'More shipping records', subtitle: 'Additional material in preparation' },
  ],
  comingSoon: 'Coming soon',
  updateSoon: 'More packing and shipment material will be added here.',
  footer: 'Shipping method and responsibility are confirmed for each destination and order.',
};

const copies: Record<string, ShippingVisualCopy> = {
  en,
  zh: { ...en, title: '包装与交付', description: '了解国际订单的包装和发运准备过程。', cards: [{ title: '集装箱装载', subtitle: '发运准备' }, { title: '仓库包装', subtitle: '订单防护与包装' }, { title: '更多发运记录', subtitle: '补充素材准备中' }], comingSoon: '即将更新', updateSoon: '更多包装和发运素材将在此更新。', footer: '每个目的地和订单的运输方式与责任均会单独确认。' },
  es: { ...en, title: 'Embalaje y entrega', description: 'Preparación del embalaje y envío de pedidos internacionales.', cards: [{ title: 'Carga de contenedores', subtitle: 'Preparación del envío' }, { title: 'Embalaje en almacén', subtitle: 'Protección y embalaje del pedido' }, { title: 'Más registros de envío', subtitle: 'Material adicional en preparación' }], comingSoon: 'Próximamente', updateSoon: 'Aquí añadiremos más material de embalaje y envío.', footer: 'El método y la responsabilidad del envío se confirman para cada destino y pedido.' },
  ru: { ...en, title: 'Упаковка и доставка', description: 'Подготовка упаковки и отправки международных заказов.', cards: [{ title: 'Загрузка контейнера', subtitle: 'Подготовка отправления' }, { title: 'Упаковка на складе', subtitle: 'Защита и упаковка заказа' }, { title: 'Другие материалы об отправке', subtitle: 'Дополнительные материалы готовятся' }], comingSoon: 'Скоро', updateSoon: 'Здесь появятся дополнительные материалы об упаковке и отправке.', footer: 'Способ доставки и ответственность подтверждаются для каждой страны и заказа.' },
  ar: { ...en, title: 'التغليف والتسليم', description: 'نظرة على تجهيز التغليف والشحن للطلبات الدولية.', cards: [{ title: 'تحميل الحاويات', subtitle: 'تجهيز الشحنة' }, { title: 'التغليف في المستودع', subtitle: 'حماية الطلب وتغليفه' }, { title: 'سجلات شحن إضافية', subtitle: 'مواد إضافية قيد التجهيز' }], comingSoon: 'قريباً', updateSoon: 'ستضاف هنا مواد إضافية عن التغليف والشحن.', footer: 'يتم تأكيد طريقة الشحن والمسؤوليات لكل وجهة وطلب.' },
};

export function getShippingVisualCopy(locale: string) { return copies[locale] || en; }
