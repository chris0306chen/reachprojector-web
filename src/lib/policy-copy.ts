export interface PolicySection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

type PolicyDocument = { title: string; description: string; summary: string; sections: PolicySection[] };
type PolicyChrome = { eyebrow: string; effectiveDate: string; questions: string; questionText: string; contact: string };

const chrome: Record<string, PolicyChrome> = {
  en: { eyebrow: 'Customer information', effectiveDate: 'Effective date: July 28, 2026', questions: 'Questions', questionText: 'Contact us before ordering if you need written confirmation for a product, destination, project, or trade term.', contact: 'Contact REACH PROJECTOR' },
  zh: { eyebrow: '客户信息', effectiveDate: '生效日期：2026 年 7 月 28 日', questions: '问题咨询', questionText: '如果您需要对产品、目的地、项目或贸易条款进行书面确认，请在订购前联系我们。', contact: '联系 REACH PROJECTOR' },
  es: { eyebrow: 'Información para clientes', effectiveDate: 'Fecha de vigencia: 28 de julio de 2026', questions: 'Preguntas', questionText: 'Contáctenos antes de comprar si necesita confirmación escrita sobre un producto, destino, proyecto o término comercial.', contact: 'Contactar con REACH PROJECTOR' },
  ru: { eyebrow: 'Информация для клиентов', effectiveDate: 'Дата вступления в силу: 28 июля 2026 г.', questions: 'Вопросы', questionText: 'Свяжитесь с нами до заказа, если вам нужно письменное подтверждение по товару, стране, проекту или торговому условию.', contact: 'Связаться с REACH PROJECTOR' },
  ar: { eyebrow: 'معلومات العملاء', effectiveDate: 'تاريخ السريان: 28 يوليو 2026', questions: 'الأسئلة', questionText: 'تواصل معنا قبل الطلب إذا احتجت إلى تأكيد كتابي بشأن منتج أو وجهة أو مشروع أو شرط تجاري.', contact: 'تواصل مع REACH PROJECTOR' },
};

const privacy: Record<string, PolicyDocument> = {
  en: {
    title: 'Privacy Policy', description: 'How REACH PROJECTOR collects, uses, shares, protects and retains customer and website information.', summary: 'This policy explains how HK REACH SOURCING LIMITED and its operating partners handle information submitted through REACH PROJECTOR.',
    sections: [
      { title: 'Information we collect', items: ['Contact, company, billing, delivery, tax, customs, and account information you provide.', 'Product inquiries, quotations, orders, communications, uploaded files, support records, and transaction references.', 'Device, browser, IP address, referral, page interaction, security, and cookie information generated when the website is used.'] },
      { title: 'How information is used', items: ['To answer inquiries, prepare quotations, process payments and orders, arrange shipping, provide support, and meet legal obligations.', 'To prevent fraud, secure the website, maintain business records, analyze performance, and improve products and services.', 'To send requested or permitted business communications. You may opt out of marketing messages at any time.'] },
      { title: 'Service providers and international transfers', paragraphs: ['Information may be processed by providers supporting hosting, databases, email, analytics, payments, fraud prevention, logistics, customs, and customer service. Core providers may include Vercel, Supabase, Resend, Stripe, and PayPal. Card credentials are handled by the selected payment provider and are not stored by this website. Cross-border processing may occur when needed for an international order.'] },
      { title: 'Retention and security', paragraphs: ['We retain information only as long as reasonably needed for the stated purposes, contractual records, tax and customs requirements, disputes, security, and applicable law. We use reasonable administrative and technical safeguards, but no internet system can guarantee absolute security.'] },
      { title: 'Your choices and rights', paragraphs: ['Depending on your location, you may have rights to request access, correction, deletion, restriction, objection, portability, or withdrawal of consent. We may verify identity and retain information where law or legitimate recordkeeping requires it.'] },
      { title: 'Cookies', paragraphs: ['The website may use essential cookies for language, security, session, checkout, and operation. Analytics or advertising cookies should be used only under consent requirements applicable to the visitor.'] },
    ],
  },
  zh: {
    title: '隐私政策', description: '说明 REACH PROJECTOR 如何收集、使用、共享、保护及保留客户与网站信息。', summary: '本政策说明 HK REACH SOURCING LIMITED 及其运营合作方如何处理通过 REACH PROJECTOR 提交的信息。',
    sections: [
      { title: '我们收集的信息', items: ['您提供的联系人、公司、账单、配送、税务、海关及账户信息。', '产品询价、报价、订单、沟通记录、上传文件、支持记录及交易参考信息。', '使用网站时产生的设备、浏览器、IP 地址、来源、页面互动、安全及 Cookie 信息。'] },
      { title: '信息的使用方式', items: ['回复询价、准备报价、处理付款与订单、安排运输、提供支持并履行法律义务。', '防止欺诈、保护网站、保存业务记录、分析表现并改进产品与服务。', '发送您请求或法律允许的业务信息；您可随时退订营销信息。'] },
      { title: '服务提供商与跨境传输', paragraphs: ['信息可能由提供托管、数据库、邮件、分析、付款、反欺诈、物流、海关及客户服务的供应商处理，核心供应商可能包括 Vercel、Supabase、Resend、Stripe 和 PayPal。银行卡信息由所选支付服务商处理，本网站不予存储。为履行国际订单，信息可能跨境处理。'] },
      { title: '保留与安全', paragraphs: ['我们仅在实现上述目的、保存合同记录、满足税务海关要求、处理争议、安全及适用法律所合理需要的期限内保留信息。我们采取合理的管理和技术措施，但任何互联网系统都无法保证绝对安全。'] },
      { title: '您的选择与权利', paragraphs: ['根据您所在地区，您可能有权申请访问、更正、删除、限制处理、反对、数据可携或撤回同意。我们可能需要验证身份，并在法律或合理记录保存要求下保留信息。'] },
      { title: 'Cookie', paragraphs: ['网站可能使用语言、安全、会话、结账及正常运行所需的必要 Cookie。分析或广告 Cookie 仅应按照适用于访问者的同意要求使用。'] },
    ],
  },
  es: {
    title: 'Política de privacidad', description: 'Cómo REACH PROJECTOR recopila, usa, comparte, protege y conserva información.', summary: 'Esta política explica cómo HK REACH SOURCING LIMITED y sus socios operativos tratan la información enviada mediante REACH PROJECTOR.',
    sections: [
      { title: 'Información que recopilamos', items: ['Datos de contacto, empresa, facturación, entrega, impuestos, aduanas y cuenta que proporcione.', 'Consultas, cotizaciones, pedidos, comunicaciones, archivos cargados, soporte y referencias de transacción.', 'Datos de dispositivo, navegador, IP, procedencia, interacción, seguridad y cookies generados al usar el sitio.'] },
      { title: 'Cómo usamos la información', items: ['Responder consultas, preparar cotizaciones, procesar pagos y pedidos, coordinar envíos, prestar soporte y cumplir obligaciones legales.', 'Prevenir fraude, proteger el sitio, mantener registros, analizar resultados y mejorar productos y servicios.', 'Enviar comunicaciones solicitadas o permitidas; puede cancelar el marketing en cualquier momento.'] },
      { title: 'Proveedores y transferencias internacionales', paragraphs: ['La información puede ser tratada por proveedores de alojamiento, bases de datos, correo, análisis, pagos, prevención de fraude, logística, aduanas y atención. Pueden incluir Vercel, Supabase, Resend, Stripe y PayPal. El proveedor de pago trata los datos de tarjeta; este sitio no los almacena. Puede haber tratamiento transfronterizo para pedidos internacionales.'] },
      { title: 'Conservación y seguridad', paragraphs: ['Conservamos datos solo durante el tiempo razonablemente necesario para los fines indicados, registros contractuales, requisitos fiscales y aduaneros, disputas, seguridad y ley aplicable. Aplicamos medidas administrativas y técnicas razonables, pero ningún sistema de Internet garantiza seguridad absoluta.'] },
      { title: 'Sus opciones y derechos', paragraphs: ['Según su ubicación, puede solicitar acceso, corrección, eliminación, limitación, oposición, portabilidad o retirar el consentimiento. Podemos verificar su identidad y conservar datos cuando lo exijan la ley o registros legítimos.'] },
      { title: 'Cookies', paragraphs: ['El sitio puede usar cookies esenciales de idioma, seguridad, sesión, proceso de compra y funcionamiento. Las cookies analíticas o publicitarias deben usarse conforme a los requisitos de consentimiento aplicables.'] },
    ],
  },
  ru: {
    title: 'Политика конфиденциальности', description: 'Как REACH PROJECTOR собирает, использует, передает, защищает и хранит информацию.', summary: 'Эта политика объясняет, как HK REACH SOURCING LIMITED и операционные партнеры обрабатывают информацию, переданную через REACH PROJECTOR.',
    sections: [
      { title: 'Какие данные мы собираем', items: ['Предоставленные вами контактные, корпоративные, платежные, доставочные, налоговые, таможенные и учетные данные.', 'Запросы, расчеты, заказы, переписка, загруженные файлы, обращения в поддержку и сведения о транзакциях.', 'Данные устройства, браузера, IP-адреса, источника перехода, взаимодействий, безопасности и cookie.'] },
      { title: 'Как используются данные', items: ['Для ответов, расчетов, обработки платежей и заказов, доставки, поддержки и выполнения правовых обязанностей.', 'Для предотвращения мошенничества, защиты сайта, учета, анализа и улучшения товаров и услуг.', 'Для запрошенных или разрешенных деловых сообщений; от маркетинга можно отказаться в любое время.'] },
      { title: 'Поставщики услуг и международная передача', paragraphs: ['Данные могут обрабатываться поставщиками хостинга, баз данных, почты, аналитики, платежей, защиты от мошенничества, логистики, таможни и поддержки, включая Vercel, Supabase, Resend, Stripe и PayPal. Данные карт обрабатывает платежный провайдер; сайт их не хранит. Для международного заказа возможна трансграничная обработка.'] },
      { title: 'Хранение и безопасность', paragraphs: ['Мы храним данные только разумно необходимый срок для указанных целей, договорного учета, налоговых и таможенных требований, споров, безопасности и закона. Мы применяем разумные административные и технические меры защиты, но абсолютная безопасность в Интернете невозможна.'] },
      { title: 'Ваш выбор и права', paragraphs: ['В зависимости от страны вы можете запросить доступ, исправление, удаление, ограничение, возражение, переносимость или отзыв согласия. Мы можем проверить личность и сохранить данные, когда этого требует закон или законный учет.'] },
      { title: 'Cookie', paragraphs: ['Сайт может использовать обязательные cookie для языка, безопасности, сеанса, оформления заказа и работы. Аналитические и рекламные cookie должны использоваться согласно применимым требованиям согласия.'] },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية', description: 'كيفية جمع REACH PROJECTOR لمعلومات العملاء والموقع واستخدامها ومشاركتها وحمايتها والاحتفاظ بها.', summary: 'توضح هذه السياسة كيفية معالجة HK REACH SOURCING LIMITED وشركائها التشغيليين للمعلومات المقدمة عبر REACH PROJECTOR.',
    sections: [
      { title: 'المعلومات التي نجمعها', items: ['معلومات الاتصال والشركة والفوترة والتسليم والضرائب والجمارك والحساب التي تقدمها.', 'استفسارات المنتجات وعروض الأسعار والطلبات والمراسلات والملفات المرفوعة وسجلات الدعم ومراجع المعاملات.', 'بيانات الجهاز والمتصفح وعنوان IP والإحالة وتفاعل الصفحة والأمان وملفات تعريف الارتباط.'] },
      { title: 'كيفية استخدام المعلومات', items: ['للرد على الاستفسارات وإعداد العروض ومعالجة المدفوعات والطلبات وترتيب الشحن وتقديم الدعم والوفاء بالالتزامات القانونية.', 'لمنع الاحتيال وحماية الموقع وحفظ السجلات وتحليل الأداء وتحسين المنتجات والخدمات.', 'لإرسال اتصالات تجارية مطلوبة أو مسموحة؛ ويمكنك إلغاء الرسائل التسويقية في أي وقت.'] },
      { title: 'مقدمو الخدمات والنقل الدولي', paragraphs: ['قد يعالج المعلومات مزودو الاستضافة وقواعد البيانات والبريد والتحليلات والمدفوعات ومنع الاحتيال والخدمات اللوجستية والجمارك والدعم، وقد يشملون Vercel وSupabase وResend وStripe وPayPal. يعالج مزود الدفع بيانات البطاقة ولا يخزنها هذا الموقع. وقد تحدث معالجة عبر الحدود لخدمة الطلبات الدولية.'] },
      { title: 'الاحتفاظ والأمان', paragraphs: ['نحتفظ بالمعلومات فقط للمدة اللازمة بصورة معقولة للأغراض المذكورة والسجلات التعاقدية ومتطلبات الضرائب والجمارك والنزاعات والأمان والقانون. نستخدم ضمانات إدارية وتقنية معقولة، لكن لا يوجد نظام إنترنت يضمن الأمان المطلق.'] },
      { title: 'خياراتك وحقوقك', paragraphs: ['بحسب موقعك، قد يحق لك طلب الوصول أو التصحيح أو الحذف أو التقييد أو الاعتراض أو النقل أو سحب الموافقة. قد نتحقق من الهوية ونحتفظ بالمعلومات عندما يتطلب القانون أو حفظ السجلات المشروع ذلك.'] },
      { title: 'ملفات تعريف الارتباط', paragraphs: ['قد يستخدم الموقع ملفات ضرورية للغة والأمان والجلسة وإتمام الطلب والتشغيل. ويجب استخدام ملفات التحليل أو الإعلان وفق متطلبات الموافقة السارية على الزائر.'] },
    ],
  },
};

const terms: Record<string, PolicyDocument> = {
  en: {
    title: 'Terms of Sale & Website Use', description: 'Terms for website use, retail purchases, B2B quotations, pricing, payment, shipping, product information and liability.', summary: 'These terms apply to use of this website and supplement the checkout terms, quotation, proforma invoice, or contract governing a specific order.',
    sections: [
      { title: 'Seller and order acceptance', paragraphs: ['The selling entity identified on the order confirmation, invoice, or quotation is responsible for that transaction. An online submission is an offer to purchase. An order is accepted only when payment and product availability are confirmed and we issue acceptance or begin fulfillment.'] },
      { title: 'Product information and suitability', paragraphs: ['We work to keep descriptions and specifications accurate, but manufacturers may revise packaging, firmware, accessories, regional features, plugs, languages, or specifications. Customers must confirm critical compatibility, installation, certification, and regional requirements before ordering.'] },
      { title: 'Prices and payment', items: ['Unless otherwise stated, website prices are in USD and exclude shipping, duties, taxes, installation, and local charges.', 'Card payments may be processed by Stripe and wallet payments by PayPal. B2B orders may use the payment schedule stated in the quotation or proforma invoice.', 'We may cancel and refund an order affected by an obvious pricing error, suspected fraud, unavailable stock, export restriction, or an unsupported destination.'] },
      { title: 'B2B, OEM and project orders', paragraphs: ['A written quotation, proforma invoice, specification sheet, sample approval, or contract may add or replace these general terms. Tooling, branding, packaging, certification, sample, deposit, balance, inspection, tolerance, and lead-time requirements must be recorded in that document.'] },
      { title: 'Shipping, risk and customs', paragraphs: ['Shipping terms are described in our Shipping, Duties & Delivery Policy and the applicable checkout or quotation. Trade terms such as DDP or DAP apply only when expressly stated. Title, risk, insurance, and delivery responsibilities may be further defined by the applicable order document.'] },
      { title: 'Intellectual property and website use', paragraphs: ['Website content, branding, layout, text, and original media may not be copied, scraped for republication, misrepresented, or commercially reused without permission. Third-party trademarks and product materials remain the property of their respective owners.'] },
      { title: 'Liability and applicable terms', paragraphs: ['To the maximum extent permitted by applicable law, indirect, incidental, or consequential losses are excluded. Mandatory consumer rights are not limited. Any governing law, dispute procedure, or liability allocation stated in a signed quotation or contract controls that order; otherwise applicable law is determined by the selling entity and transaction.'] },
    ],
  },
  zh: {
    title: '销售与网站使用条款', description: '关于网站使用、零售购买、B2B 报价、定价、付款、运输、产品信息与责任的条款。', summary: '本条款适用于本网站的使用，并补充适用于具体订单的结账条款、报价单、形式发票或合同。',
    sections: [
      { title: '卖方与订单接受', paragraphs: ['订单确认、发票或报价单中标明的销售主体对该交易负责。在线提交仅构成购买要约。只有在付款及产品供应情况确认，并且我们发出接受通知或开始履约后，订单才被接受。'] },
      { title: '产品信息与适用性', paragraphs: ['我们尽力保持描述和规格准确，但制造商可能调整包装、固件、配件、地区功能、插头、语言或规格。客户必须在订购前确认关键兼容性、安装、认证及地区要求。'] },
      { title: '价格与付款', items: ['除非另有说明，网站价格以美元计价，不含运输、关税、税费、安装及当地费用。', '银行卡付款可由 Stripe 处理，电子钱包付款可由 PayPal 处理。B2B 订单可采用报价单或形式发票中规定的付款计划。', '对于明显定价错误、涉嫌欺诈、库存不足、出口限制或不支持的目的地，我们可能取消订单并退款。'] },
      { title: 'B2B、OEM 与项目订单', paragraphs: ['书面报价单、形式发票、规格书、样品批准或合同可以补充或替代这些一般条款。模具、品牌、包装、认证、样品、定金、尾款、检验、公差和交期要求必须记录在该文件中。'] },
      { title: '运输、风险与海关', paragraphs: ['运输条款见《运输、关税与交付政策》以及适用的结账页面或报价单。DDP、DAP 等贸易条款仅在明确写明时适用。所有权、风险、保险及交付责任可由适用的订单文件进一步规定。'] },
      { title: '知识产权与网站使用', paragraphs: ['未经许可，不得复制网站内容、品牌、布局、文字和原创媒体，不得抓取后重新发布、歪曲呈现或商业再利用。第三方商标和产品资料仍归各自权利人所有。'] },
      { title: '责任与适用条款', paragraphs: ['在适用法律允许的最大范围内，间接、附带或后果性损失不予承担。法定消费者权利不受限制。签署的报价单或合同中关于适用法律、争议程序或责任分配的约定适用于该订单；否则，适用法律由销售主体和交易情况决定。'] },
    ],
  },
  es: {
    title: 'Condiciones de venta y uso del sitio', description: 'Condiciones de uso, compras minoristas, cotizaciones B2B, precios, pagos, envíos, información del producto y responsabilidad.', summary: 'Estas condiciones se aplican al uso del sitio y complementan las condiciones del proceso de compra, la cotización, la factura proforma o el contrato de cada pedido.',
    sections: [
      { title: 'Vendedor y aceptación del pedido', paragraphs: ['La entidad vendedora indicada en la confirmación, factura o cotización responde de la transacción. El envío en línea es una oferta de compra. El pedido se acepta solo cuando se confirman el pago y la disponibilidad y emitimos la aceptación o iniciamos su preparación.'] },
      { title: 'Información e idoneidad del producto', paragraphs: ['Procuramos mantener descripciones y especificaciones exactas, pero el fabricante puede cambiar embalaje, firmware, accesorios, funciones regionales, enchufes, idiomas o especificaciones. El cliente debe confirmar antes de comprar la compatibilidad, instalación, certificación y requisitos regionales críticos.'] },
      { title: 'Precios y pagos', items: ['Salvo indicación contraria, los precios están en USD y no incluyen envío, aranceles, impuestos, instalación ni cargos locales.', 'Stripe puede procesar tarjetas y PayPal pagos con monedero. Los pedidos B2B pueden seguir el calendario de pago de la cotización o factura proforma.', 'Podemos cancelar y reembolsar pedidos afectados por un error evidente de precio, sospecha de fraude, falta de existencias, restricción de exportación o destino no admitido.'] },
      { title: 'Pedidos B2B, OEM y de proyectos', paragraphs: ['Una cotización, factura proforma, ficha técnica, aprobación de muestra o contrato por escrito puede complementar o sustituir estas condiciones generales. Los requisitos de utillaje, marca, embalaje, certificación, muestras, depósito, saldo, inspección, tolerancias y plazo deben constar en ese documento.'] },
      { title: 'Envío, riesgo y aduanas', paragraphs: ['Las condiciones de envío figuran en nuestra Política de envío, aranceles y entrega y en el proceso de compra o cotización aplicable. DDP o DAP solo se aplican si se indican expresamente. El documento del pedido puede definir además propiedad, riesgo, seguro y responsabilidades de entrega.'] },
      { title: 'Propiedad intelectual y uso del sitio', paragraphs: ['Sin permiso no se pueden copiar, extraer para republicar, tergiversar ni reutilizar comercialmente el contenido, marca, diseño, texto o material original del sitio. Las marcas y materiales de terceros pertenecen a sus titulares.'] },
      { title: 'Responsabilidad y condiciones aplicables', paragraphs: ['En la máxima medida permitida por la ley, se excluyen pérdidas indirectas, incidentales o consecuentes. No se limitan los derechos obligatorios del consumidor. La ley, procedimiento de disputa o reparto de responsabilidad de una cotización o contrato firmado regirá ese pedido; en otro caso, dependerá de la entidad vendedora y la transacción.'] },
    ],
  },
  ru: {
    title: 'Условия продажи и использования сайта', description: 'Условия использования сайта, розничных покупок, B2B-расчетов, цен, оплаты, доставки, информации о товарах и ответственности.', summary: 'Эти условия применяются к сайту и дополняют условия оформления заказа, расчет, счет-проформу или договор для конкретного заказа.',
    sections: [
      { title: 'Продавец и принятие заказа', paragraphs: ['За сделку отвечает продавец, указанный в подтверждении, счете или расчете. Онлайн-заявка является предложением купить. Заказ принят только после подтверждения оплаты и наличия, когда мы подтверждаем принятие или начинаем исполнение.'] },
      { title: 'Информация о товаре и пригодность', paragraphs: ['Мы стремимся к точности описаний и характеристик, но производитель может менять упаковку, прошивку, аксессуары, региональные функции, вилки, языки или характеристики. До заказа клиент обязан подтвердить критически важную совместимость, установку, сертификацию и региональные требования.'] },
      { title: 'Цены и оплата', items: ['Если не указано иное, цены сайта указаны в USD без доставки, пошлин, налогов, установки и местных сборов.', 'Платежи картой может обрабатывать Stripe, а платежи через электронный кошелек — PayPal. Заказы B2B могут использовать график оплаты из расчета или счета-проформы.', 'Мы можем отменить и вернуть оплату по заказу при очевидной ошибке цены, подозрении на мошенничество, отсутствии товара, экспортном ограничении или неподдерживаемой стране.'] },
      { title: 'B2B, OEM и проектные заказы', paragraphs: ['Письменный расчет, счет-проформа, спецификация, одобрение образца или договор могут дополнять или заменять общие условия. Требования к оснастке, брендингу, упаковке, сертификации, образцам, авансу, остатку, инспекции, допускам и срокам должны быть записаны в этом документе.'] },
      { title: 'Доставка, риск и таможня', paragraphs: ['Условия доставки указаны в Политике доставки, пошлин и вручения, а также при оформлении заказа или в расчете. DDP и DAP действуют только при прямом указании. Документ заказа может дополнительно определить право собственности, риск, страхование и обязанности по доставке.'] },
      { title: 'Интеллектуальная собственность и сайт', paragraphs: ['Без разрешения нельзя копировать, извлекать для повторной публикации, искажать или коммерчески использовать содержимое, бренд, оформление, текст и оригинальные материалы сайта. Сторонние товарные знаки и материалы принадлежат их владельцам.'] },
      { title: 'Ответственность и применимые условия', paragraphs: ['В максимальной степени, разрешенной законом, исключаются косвенные, случайные и последующие убытки. Обязательные права потребителей не ограничиваются. Закон, порядок спора и распределение ответственности в подписанном расчете или договоре регулируют заказ; иначе применимое право определяется продавцом и сделкой.'] },
    ],
  },
  ar: {
    title: 'شروط البيع واستخدام الموقع', description: 'شروط استخدام الموقع والشراء وعروض B2B والأسعار والدفع والشحن ومعلومات المنتج والمسؤولية.', summary: 'تسري هذه الشروط على استخدام الموقع وتكمل شروط إتمام الطلب أو عرض السعر أو الفاتورة الأولية أو العقد الخاص بطلب محدد.',
    sections: [
      { title: 'البائع وقبول الطلب', paragraphs: ['تكون جهة البيع المحددة في تأكيد الطلب أو الفاتورة أو عرض السعر مسؤولة عن المعاملة. يعد الإرسال عبر الإنترنت عرضاً للشراء. ولا يُقبل الطلب إلا بعد تأكيد الدفع وتوفر المنتج وإصدار القبول أو بدء التنفيذ.'] },
      { title: 'معلومات المنتج وملاءمته', paragraphs: ['نسعى إلى دقة الأوصاف والمواصفات، لكن المصنع قد يغير التغليف أو البرامج الثابتة أو الملحقات أو الميزات الإقليمية أو القوابس أو اللغات أو المواصفات. يجب على العميل تأكيد التوافق والتركيب والشهادات والمتطلبات الإقليمية المهمة قبل الطلب.'] },
      { title: 'الأسعار والدفع', items: ['ما لم يذكر خلاف ذلك، أسعار الموقع بالدولار الأمريكي ولا تشمل الشحن أو الرسوم الجمركية أو الضرائب أو التركيب أو التكاليف المحلية.', 'قد تعالج Stripe مدفوعات البطاقات وPayPal مدفوعات المحافظ. وقد تتبع طلبات B2B جدول الدفع المذكور في العرض أو الفاتورة الأولية.', 'يجوز لنا إلغاء الطلب ورد المبلغ عند وجود خطأ واضح في السعر أو اشتباه احتيال أو عدم توفر المخزون أو قيد تصدير أو وجهة غير مدعومة.'] },
      { title: 'طلبات B2B وOEM والمشاريع', paragraphs: ['يجوز لعرض سعر أو فاتورة أولية أو مواصفات أو اعتماد عينة أو عقد مكتوب أن يضيف إلى هذه الشروط العامة أو يحل محلها. ويجب تسجيل متطلبات القوالب والعلامة والتغليف والشهادات والعينة والعربون والرصيد والفحص والتفاوت ومدة التنفيذ في ذلك المستند.'] },
      { title: 'الشحن والمخاطر والجمارك', paragraphs: ['ترد شروط الشحن في سياسة الشحن والرسوم والتسليم وفي إتمام الطلب أو عرض السعر المعني. ولا تسري شروط مثل DDP أو DAP إلا إذا ذكرت صراحة. وقد يحدد مستند الطلب كذلك الملكية والمخاطر والتأمين ومسؤوليات التسليم.'] },
      { title: 'الملكية الفكرية واستخدام الموقع', paragraphs: ['لا يجوز دون إذن نسخ محتوى الموقع أو علامته أو تصميمه أو نصه أو وسائطه الأصلية، أو استخراجه لإعادة النشر أو تحريفه أو إعادة استخدامه تجارياً. وتبقى علامات ومواد الأطراف الأخرى ملكاً لأصحابها.'] },
      { title: 'المسؤولية والشروط السارية', paragraphs: ['إلى أقصى حد يسمح به القانون، تستبعد الخسائر غير المباشرة أو العرضية أو التبعية. ولا تُقيد حقوق المستهلك الإلزامية. ويحكم الطلب أي قانون حاكم أو إجراء لتسوية النزاع أو توزيع للمسؤولية وارد في عرض سعر أو عقد موقّع؛ وإلا فيتحدد القانون بحسب جهة البيع والمعاملة.'] },
    ],
  },
};

export function getPolicyChrome(locale: string) { return chrome[locale] || chrome.en; }
export function getPrivacyPolicy(locale: string) { return privacy[locale] || privacy.en; }
export function getTermsPolicy(locale: string) { return terms[locale] || terms.en; }
