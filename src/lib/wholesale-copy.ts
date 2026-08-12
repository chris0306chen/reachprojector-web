export type WholesaleCopy = {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  requestQuote: string;
  whatsapp: string;
  helpEyebrow: string;
  helpTitle: string;
  helpDescription: string;
  advantages: Array<{ title: string; description: string }>;
  processEyebrow: string;
  processTitle: string;
  steps: Array<{ title: string; description: string }>;
  briefItems: string[];
  formEyebrow: string;
  formTitle: string;
  formDescription: string;
};

const copies: Record<string, WholesaleCopy> = {
  en: {
    metadataTitle: 'B2B Wholesale Projector Sourcing', metadataDescription: 'Request a tailored quotation for projector sourcing, volume orders, shipping coordination, and available OEM or ODM options.',
    eyebrow: 'Wholesale partnerships', title: 'Projector sourcing,', titleAccent: 'made clearer.', description: 'Tell us what your market needs. Our team will prepare a product and pricing proposal around your quantity, destination, and timeline.', requestQuote: 'Request a quotation', whatsapp: 'Chat on WhatsApp',
    helpEyebrow: 'How we can help', helpTitle: 'Built around your sourcing brief', helpDescription: 'From product selection to delivery planning, each quotation starts with your actual requirements.',
    advantages: [
      { title: 'Volume-based quotations', description: 'Pricing is prepared around your product mix, quantity, destination, and requested timeline.' },
      { title: 'Product sourcing support', description: 'Share your market requirements and shortlist suitable projector options with our team.' },
      { title: 'Shipping coordination', description: 'Discuss available delivery terms, packing requirements, and documentation before ordering.' },
      { title: 'Direct account support', description: 'Keep one point of contact from the initial quotation through order follow-up.' },
      { title: 'Pre-shipment alignment', description: 'Confirm the product, quantity, and packing details before your order is dispatched.' },
      { title: 'OEM / ODM discussion', description: 'Ask about available branding, packaging, and product customization options for your market.' },
    ],
    processEyebrow: 'A straightforward process', processTitle: 'From brief to delivery',
    steps: [
      { title: 'Send your brief', description: 'Tell us the products, quantity, destination, and timeline you need.' },
      { title: 'Review the proposal', description: 'Discuss product availability, commercial terms, and shipping options.' },
      { title: 'Confirm the order', description: 'Approve the final quotation and complete the agreed payment process.' },
      { title: 'Coordinate delivery', description: 'Follow the order through preparation, dispatch, and delivery.' },
    ],
    briefItems: ['Product and quantity', 'Destination and timeline', 'Packing or branding needs'],
    formEyebrow: 'Start the conversation', formTitle: 'Request a tailored quotation', formDescription: 'Share your requirements below so the wholesale team can review the products, quantity, and destination with you.',
  },
  zh: {
    metadataTitle: 'B2B 投影设备批量采购', metadataDescription: '根据产品、数量、目的地与交付计划，获取投影设备及配套产品的定制报价。',
    eyebrow: '批发与项目合作', title: '让投影设备采购，', titleAccent: '更清晰。', description: '告诉我们您的市场和项目需求，我们会围绕产品、数量、目的地与时间准备选型和报价方案。', requestQuote: '获取定制报价', whatsapp: 'WhatsApp 沟通',
    helpEyebrow: '我们如何协助', helpTitle: '从您的真实采购需求出发', helpDescription: '从产品选型到交付规划，每一份报价都以您的实际要求为基础。',
    advantages: [
      { title: '按数量制定报价', description: '结合产品组合、采购数量、目的地和交付时间准备报价。' },
      { title: '产品选型支持', description: '分享市场需求，与我们一起筛选适合的投影及配套产品。' },
      { title: '运输协调', description: '下单前确认可选贸易条款、包装要求与所需文件。' },
      { title: '专人跟进', description: '从首次询价到订单跟进，由固定联系人协助沟通。' },
      { title: '出货前确认', description: '发货前再次确认产品、数量和包装细节。' },
      { title: 'OEM / ODM 沟通', description: '了解适合您市场的品牌、包装及产品定制选项。' },
    ],
    processEyebrow: '清晰的合作流程', processTitle: '从需求到交付',
    steps: [
      { title: '提交采购需求', description: '告诉我们所需产品、数量、目的地和时间。' },
      { title: '确认建议方案', description: '沟通产品供应、商务条款和运输选项。' },
      { title: '确认订单', description: '批准最终报价，并按约定完成付款流程。' },
      { title: '协调交付', description: '持续跟进备货、发运和交付进度。' },
    ],
    briefItems: ['产品与数量', '目的地与时间', '包装或品牌需求'],
    formEyebrow: '开始沟通', formTitle: '获取定制报价', formDescription: '请在下方提交需求，批发团队将根据产品、数量和目的地进行评估。',
  },
  es: {
    metadataTitle: 'Suministro mayorista B2B de proyectores', metadataDescription: 'Solicite una cotización para proyectores, pedidos por volumen, coordinación de envíos y opciones OEM u ODM.',
    eyebrow: 'Alianzas mayoristas', title: 'Suministro de proyectores,', titleAccent: 'más claro.', description: 'Cuéntenos qué necesita su mercado. Prepararemos una propuesta según productos, cantidad, destino y plazo.', requestQuote: 'Solicitar cotización', whatsapp: 'Hablar por WhatsApp',
    helpEyebrow: 'Cómo podemos ayudar', helpTitle: 'Basado en sus necesidades de compra', helpDescription: 'Desde la selección hasta la entrega, cada propuesta parte de sus requisitos reales.',
    advantages: [
      { title: 'Cotización por volumen', description: 'Precios según la combinación de productos, cantidad, destino y plazo.' },
      { title: 'Apoyo en la selección', description: 'Comparta los requisitos de su mercado y seleccione opciones con nuestro equipo.' },
      { title: 'Coordinación de envíos', description: 'Revise condiciones de entrega, embalaje y documentación antes del pedido.' },
      { title: 'Atención directa', description: 'Un único contacto desde la primera cotización hasta el seguimiento.' },
      { title: 'Confirmación antes del envío', description: 'Verifique producto, cantidad y embalaje antes del despacho.' },
      { title: 'Opciones OEM / ODM', description: 'Consulte personalización de marca, embalaje y producto para su mercado.' },
    ],
    processEyebrow: 'Un proceso sencillo', processTitle: 'De la solicitud a la entrega',
    steps: [
      { title: 'Envíe sus requisitos', description: 'Indique productos, cantidad, destino y plazo.' },
      { title: 'Revise la propuesta', description: 'Confirme disponibilidad, condiciones comerciales y envío.' },
      { title: 'Confirme el pedido', description: 'Apruebe la cotización final y complete el pago acordado.' },
      { title: 'Coordinemos la entrega', description: 'Siga la preparación, el despacho y la entrega.' },
    ],
    briefItems: ['Producto y cantidad', 'Destino y plazo', 'Embalaje o marca'],
    formEyebrow: 'Inicie la conversación', formTitle: 'Solicite una cotización personalizada', formDescription: 'Comparta sus requisitos para que revisemos los productos, la cantidad y el destino.',
  },
  ru: {
    metadataTitle: 'Оптовые поставки проекторов B2B', metadataDescription: 'Запросите расчет поставки проекторов, крупного заказа, доставки и доступных вариантов OEM или ODM.',
    eyebrow: 'Оптовое сотрудничество', title: 'Поставка проекторов,', titleAccent: 'понятно и прозрачно.', description: 'Расскажите о потребностях вашего рынка. Мы подготовим предложение с учетом товаров, количества, страны и сроков.', requestQuote: 'Запросить расчет', whatsapp: 'Написать в WhatsApp',
    helpEyebrow: 'Чем мы поможем', helpTitle: 'На основе вашей закупочной задачи', helpDescription: 'От выбора товаров до доставки каждое предложение строится на ваших требованиях.',
    advantages: [
      { title: 'Расчет по объему', description: 'Цена зависит от состава заказа, количества, страны и сроков.' },
      { title: 'Подбор продукции', description: 'Опишите требования рынка и подберите варианты вместе с нашей командой.' },
      { title: 'Организация доставки', description: 'Обсудите условия доставки, упаковку и документы до заказа.' },
      { title: 'Прямая поддержка', description: 'Один контакт от первого запроса до сопровождения заказа.' },
      { title: 'Проверка перед отправкой', description: 'Подтвердите товар, количество и упаковку перед отправкой.' },
      { title: 'OEM / ODM', description: 'Уточните варианты брендинга, упаковки и адаптации продукта.' },
    ],
    processEyebrow: 'Понятный процесс', processTitle: 'От запроса до доставки',
    steps: [
      { title: 'Отправьте запрос', description: 'Укажите товары, количество, страну и сроки.' },
      { title: 'Изучите предложение', description: 'Обсудите наличие, коммерческие условия и доставку.' },
      { title: 'Подтвердите заказ', description: 'Согласуйте итоговый расчет и выполните оплату.' },
      { title: 'Организуйте доставку', description: 'Отслеживайте подготовку, отправку и доставку.' },
    ],
    briefItems: ['Товар и количество', 'Страна и сроки', 'Упаковка или брендирование'],
    formEyebrow: 'Начните диалог', formTitle: 'Запросите индивидуальный расчет', formDescription: 'Отправьте требования, чтобы команда оценила товары, количество и страну назначения.',
  },
  ar: {
    metadataTitle: 'توريد أجهزة العرض بالجملة للشركات', metadataDescription: 'اطلب عرضاً مخصصاً لأجهزة العرض والطلبات الكبيرة وتنسيق الشحن وخيارات OEM أو ODM.',
    eyebrow: 'شراكات الجملة', title: 'توريد أجهزة العرض،', titleAccent: 'بصورة أوضح.', description: 'أخبرنا باحتياجات سوقك وسنعد مقترحاً حسب المنتجات والكمية والوجهة والموعد.', requestQuote: 'اطلب عرض سعر', whatsapp: 'تواصل عبر WhatsApp',
    helpEyebrow: 'كيف نساعدك', helpTitle: 'حل مبني على متطلبات الشراء', helpDescription: 'من اختيار المنتج إلى تخطيط التسليم، يبدأ كل عرض من احتياجاتك الفعلية.',
    advantages: [
      { title: 'عروض حسب الكمية', description: 'تسعير حسب مجموعة المنتجات والكمية والوجهة والموعد.' },
      { title: 'دعم اختيار المنتجات', description: 'شارك متطلبات سوقك واختر الخيارات المناسبة مع فريقنا.' },
      { title: 'تنسيق الشحن', description: 'ناقش شروط التسليم والتغليف والمستندات قبل الطلب.' },
      { title: 'دعم مباشر', description: 'جهة اتصال واحدة من العرض الأول حتى متابعة الطلب.' },
      { title: 'تأكيد قبل الشحن', description: 'أكد المنتج والكمية والتغليف قبل الإرسال.' },
      { title: 'خيارات OEM / ODM', description: 'اسأل عن العلامة والتغليف وتخصيص المنتج لسوقك.' },
    ],
    processEyebrow: 'عملية واضحة', processTitle: 'من المتطلبات إلى التسليم',
    steps: [
      { title: 'أرسل متطلباتك', description: 'حدد المنتجات والكمية والوجهة والموعد.' },
      { title: 'راجع المقترح', description: 'ناقش التوفر والشروط التجارية وخيارات الشحن.' },
      { title: 'أكد الطلب', description: 'وافق على العرض النهائي وأكمل الدفع المتفق عليه.' },
      { title: 'نسق التسليم', description: 'تابع التجهيز والإرسال والتسليم.' },
    ],
    briefItems: ['المنتج والكمية', 'الوجهة والموعد', 'التغليف أو العلامة'],
    formEyebrow: 'ابدأ المحادثة', formTitle: 'اطلب عرضاً مخصصاً', formDescription: 'شارك متطلباتك ليتمكن فريق الجملة من مراجعة المنتجات والكمية والوجهة.',
  },
};

export function getWholesaleCopy(locale: string) {
  return copies[locale] || copies.en;
}
