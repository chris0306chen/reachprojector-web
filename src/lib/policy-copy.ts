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

const warranty: Record<string, PolicyDocument> = {
  en: {
    title: 'Product Warranty Policy', description: 'Warranty coverage, claims, exclusions and remedies for projectors, screens, mounts, furniture and accessories.', summary: 'Warranty duration and service method vary by brand, product, destination, and whether the order is retail, wholesale, OEM, or project-based.',
    sections: [
      { title: 'Applicable warranty', paragraphs: ['The controlling warranty period is the period shown on the product page, order confirmation, proforma invoice, or signed quotation. If these documents differ, the most specific written order term applies.'] },
      { title: 'What the warranty covers', paragraphs: ['During the applicable period, we will assess verified defects in materials or workmanship under normal intended use. Depending on the product, location, parts availability, and manufacturer policy, the remedy may be troubleshooting, replacement parts, repair, replacement, or another commercially reasonable solution.'] },
      { title: 'Exclusions', items: ['Accident, misuse, impact, liquid, fire, unsuitable voltage, poor ventilation, abnormal environment, or failure to follow instructions.', 'Unauthorized repair, modification, disassembly, firmware changes, or use with incompatible accessories.', 'Normal wear, cosmetic change, consumables, batteries, lamps, filters, and expected brightness degradation unless specifically covered.', 'Damage during customer-arranged transport or installation, and faults caused by third-party systems or site conditions.'] },
      { title: 'Making a claim', paragraphs: ['Provide the order number, model, serial number, delivery country, description of the fault, troubleshooting already completed, and clear photographs or video. Do not return or dismantle the product until instructed.'] },
      { title: 'B2B, OEM and project orders', paragraphs: ['Service levels, spare parts, on-site work, advance replacement, and installation support are included only when stated in the applicable quotation or contract. Project customers should agree critical spares and service responsibilities before ordering.'] },
    ],
  },
  zh: {
    title: '产品保修政策', description: '投影仪、幕布、支架、家具及配件的保修范围、索赔、排除项与补救方式。', summary: '保修期限和服务方式因品牌、产品、目的地以及订单属于零售、批发、OEM 或项目订单而异。',
    sections: [
      { title: '适用的保修', paragraphs: ['保修期限以产品页面、订单确认、形式发票或已签署报价单中所列期限为准。如这些文件不一致，以针对该订单最具体的书面条款为准。'] },
      { title: '保修覆盖范围', paragraphs: ['在适用期限内，我们会评估正常预期使用下经核实的材料或工艺缺陷。根据产品、地点、配件供应情况和制造商政策，补救方式可能包括故障排查、更换零件、维修、更换产品或其他商业上合理的方案。'] },
      { title: '排除项目', items: ['意外、误用、撞击、液体、火灾、电压不合适、通风不足、异常环境或未遵循说明造成的问题。', '未经授权的维修、改装、拆解、固件更改或使用不兼容配件。', '正常磨损、外观变化、耗材、电池、灯泡、滤网及预期亮度衰减，除非明确涵盖。', '客户自行安排运输或安装期间的损坏，以及第三方系统或现场条件造成的故障。'] },
      { title: '提出保修申请', paragraphs: ['请提供订单号、型号、序列号、交付国家、故障说明、已完成的排查步骤以及清晰照片或视频。在收到指示前，请勿退回或拆解产品。'] },
      { title: 'B2B、OEM 与项目订单', paragraphs: ['服务等级、备用零件、现场工作、先行更换和安装支持，只有在适用报价单或合同明确写明时才包含。项目客户应在订购前约定关键备件与服务责任。'] },
    ],
  },
  es: {
    title: 'Política de garantía del producto', description: 'Cobertura, reclamaciones, exclusiones y soluciones para proyectores, pantallas, soportes, mobiliario y accesorios.', summary: 'La duración y el método de servicio varían según marca, producto, destino y si el pedido es minorista, mayorista, OEM o de proyecto.',
    sections: [
      { title: 'Garantía aplicable', paragraphs: ['El período aplicable es el indicado en la página del producto, confirmación del pedido, factura proforma o cotización firmada. Si difieren, prevalece la condición escrita más específica del pedido.'] },
      { title: 'Qué cubre la garantía', paragraphs: ['Durante el período aplicable evaluaremos defectos verificados de materiales o fabricación bajo uso normal previsto. Según el producto, ubicación, disponibilidad de piezas y política del fabricante, la solución puede ser diagnóstico, piezas, reparación, sustitución u otra solución comercialmente razonable.'] },
      { title: 'Exclusiones', items: ['Accidente, uso indebido, golpe, líquido, fuego, voltaje inadecuado, mala ventilación, entorno anormal o incumplimiento de instrucciones.', 'Reparación, modificación, desmontaje o cambio de firmware no autorizado, o accesorios incompatibles.', 'Desgaste normal, cambios estéticos, consumibles, baterías, lámparas, filtros y pérdida de brillo prevista, salvo cobertura expresa.', 'Daños durante transporte o instalación organizados por el cliente, y fallos causados por sistemas de terceros o condiciones del lugar.'] },
      { title: 'Presentar una reclamación', paragraphs: ['Facilite número de pedido, modelo, serie, país de entrega, descripción del fallo, pruebas realizadas y fotos o vídeo claros. No devuelva ni desmonte el producto hasta recibir instrucciones.'] },
      { title: 'Pedidos B2B, OEM y de proyectos', paragraphs: ['Los niveles de servicio, repuestos, trabajo en sitio, sustitución anticipada y apoyo de instalación se incluyen solo si figuran en la cotización o contrato aplicable. Los clientes de proyecto deben acordar repuestos críticos y responsabilidades de servicio antes del pedido.'] },
    ],
  },
  ru: {
    title: 'Политика гарантии на товары', description: 'Гарантийное покрытие, обращения, исключения и способы урегулирования для проекторов, экранов, креплений, мебели и аксессуаров.', summary: 'Срок и способ обслуживания зависят от бренда, товара, страны и типа заказа: розница, опт, OEM или проект.',
    sections: [
      { title: 'Применимая гарантия', paragraphs: ['Действует срок, указанный на странице товара, в подтверждении заказа, счете-проформе или подписанном коммерческом предложении. При расхождениях применяется наиболее конкретное письменное условие заказа.'] },
      { title: 'Что покрывает гарантия', paragraphs: ['В течение применимого срока мы оценим подтвержденные дефекты материалов или изготовления при нормальном предусмотренном использовании. В зависимости от товара, страны, наличия деталей и политики производителя решением могут быть диагностика, детали, ремонт, замена или другое коммерчески разумное решение.'] },
      { title: 'Исключения', items: ['Авария, неправильное использование, удар, жидкость, огонь, неподходящее напряжение, плохая вентиляция, необычная среда или несоблюдение инструкций.', 'Несанкционированные ремонт, изменение, разборка, смена прошивки или несовместимые аксессуары.', 'Обычный износ, внешние изменения, расходники, батареи, лампы, фильтры и ожидаемое снижение яркости, если иное прямо не покрыто.', 'Повреждения при организованной клиентом перевозке или установке, а также неисправности из-за сторонних систем или условий объекта.'] },
      { title: 'Гарантийное обращение', paragraphs: ['Предоставьте номер заказа, модель, серийный номер, страну доставки, описание неисправности, выполненную диагностику и четкие фото или видео. Не возвращайте и не разбирайте товар до получения инструкций.'] },
      { title: 'B2B, OEM и проектные заказы', paragraphs: ['Уровни сервиса, запасные части, выездные работы, предварительная замена и поддержка установки включены только при прямом указании в коммерческом предложении или договоре. Проектным клиентам следует согласовать критические запчасти и обязанности по обслуживанию до заказа.'] },
    ],
  },
  ar: {
    title: 'سياسة ضمان المنتجات', description: 'تغطية الضمان والمطالبات والاستثناءات والحلول لأجهزة العرض والشاشات والحوامل والأثاث والملحقات.', summary: 'تختلف مدة الضمان وطريقة الخدمة بحسب العلامة والمنتج والوجهة وما إذا كان الطلب تجزئة أو جملة أو OEM أو مشروعاً.',
    sections: [
      { title: 'الضمان الساري', paragraphs: ['مدة الضمان المعتمدة هي المذكورة في صفحة المنتج أو تأكيد الطلب أو الفاتورة الأولية أو عرض السعر الموقّع. وإذا اختلفت المستندات، يسري الشرط الكتابي الأكثر تحديداً للطلب.'] },
      { title: 'ما يغطيه الضمان', paragraphs: ['خلال المدة السارية سنقيّم عيوب المواد أو التصنيع المثبتة عند الاستخدام العادي المقصود. وبحسب المنتج والموقع وتوفر القطع وسياسة المصنع، قد يكون الحل استكشاف الخلل أو قطع بديلة أو إصلاحاً أو استبدالاً أو حلاً آخر معقولاً تجارياً.'] },
      { title: 'الاستثناءات', items: ['الحوادث أو سوء الاستخدام أو الصدمات أو السوائل أو الحريق أو الجهد غير المناسب أو التهوية السيئة أو البيئة غير الطبيعية أو عدم اتباع التعليمات.', 'الإصلاح أو التعديل أو التفكيك أو تغيير البرامج الثابتة دون تصريح، أو استخدام ملحقات غير متوافقة.', 'البلى الطبيعي والتغير التجميلي والمواد الاستهلاكية والبطاريات والمصابيح والمرشحات والانخفاض المتوقع في السطوع ما لم تُغطَّ صراحة.', 'الضرر أثناء نقل أو تركيب يرتبه العميل، والأعطال الناتجة عن أنظمة خارجية أو ظروف الموقع.'] },
      { title: 'تقديم مطالبة', paragraphs: ['قدم رقم الطلب والطراز والرقم التسلسلي ودولة التسليم ووصف العطل وخطوات الفحص المنجزة وصوراً أو فيديو واضحاً. لا تعد المنتج أو تفككه قبل تلقي التعليمات.'] },
      { title: 'طلبات B2B وOEM والمشاريع', paragraphs: ['لا تشمل مستويات الخدمة أو قطع الغيار أو العمل في الموقع أو الاستبدال المسبق أو دعم التركيب إلا إذا ذكرت في عرض السعر أو العقد المعني. وينبغي لعملاء المشاريع الاتفاق على قطع الغيار الحرجة ومسؤوليات الخدمة قبل الطلب.'] },
    ],
  },
};

const shipping: Record<string, PolicyDocument> = {
  en: {
    title: 'Shipping, Duties & Delivery Policy', description: 'International shipping, DDP and DAP terms, delivery estimates, chargeable weight, customs and project freight information.', summary: 'How shipping prices, trade terms, delivery estimates, customs responsibilities, and freight orders are handled.',
    sections: [
      { title: 'Shipping quotes', paragraphs: ['Available shipping methods and prices are calculated using the delivery country, product quantity, packed weight, package dimensions, shipping class, and the active rate available when the order is placed. Volumetric weight may be used when it is higher than actual packed weight.'] },
      { title: 'DDP and non-DDP destinations', items: ['When checkout or a written quotation states DDP, the quoted shipping service includes import-duty and tax handling to the agreed destination, subject to the stated exclusions.', 'When DDP is not expressly shown, duties, taxes, customs charges, brokerage, storage, remote-area charges, and local compliance costs may be payable by the recipient.', 'Mexico checkout displays DDP services only. Availability for every other country depends on the active shipping route and product type.'] },
      { title: 'Oversized and project freight', paragraphs: ['Projection screens, cabinets, furniture, multi-carton goods, and other freight-class products may require a manual quotation. The order is not accepted until route, price, trade term, delivery address, and estimated schedule are confirmed in writing.'] },
      { title: 'Delivery estimates', paragraphs: ['Processing and transit times are estimates, not guarantees. Customs inspection, remote locations, carrier disruption, weather, peak seasons, and buyer documentation may affect delivery. Tracking is provided when supported by the carrier.'] },
      { title: 'Address and delivery responsibility', items: ['The customer must provide a complete and accurate delivery address, contact name, phone number, and any customs information requested.', 'Address changes after payment may require a new shipping quote and security review.', 'Visible carton damage should be recorded with the carrier and reported to us promptly with photographs.'] },
    ],
  },
  zh: {
    title: '运输、关税与交付政策', description: '国际运输、DDP 与 DAP 条款、交付时间估算、计费重量、海关及项目货运信息。', summary: '说明运费、贸易条款、交付时间估算、海关责任及货运订单的处理方式。',
    sections: [
      { title: '运费报价', paragraphs: ['可用运输方式和价格根据交付国家、产品数量、包装后重量、包装尺寸、运输类别以及下单时有效的费率计算。当体积重量高于实际包装重量时，可能采用体积重量计费。'] },
      { title: 'DDP 与非 DDP 目的地', items: ['当结账页面或书面报价单明确写明 DDP 时，所报运输服务包含到约定目的地的进口关税及税务处理，但受所列排除项限制。', '未明确显示 DDP 时，关税、税费、海关费用、报关代理费、仓储费、偏远地区附加费及当地合规成本可能由收件人承担。', '墨西哥结账页面仅显示 DDP 服务。其他国家是否可用取决于当时有效的运输路线和产品类型。'] },
      { title: '超大件与项目货运', paragraphs: ['投影幕布、机柜、家具、多箱货物及其他货运类别产品可能需要人工报价。在路线、价格、贸易条款、交付地址和预计时间以书面形式确认前，订单不会被接受。'] },
      { title: '交付时间估算', paragraphs: ['处理和运输时间仅为估算，并非保证。海关检查、偏远地区、承运商中断、天气、旺季及买方文件可能影响交付。承运商支持时会提供物流追踪。'] },
      { title: '地址与交付责任', items: ['客户必须提供完整准确的交付地址、联系人、电话号码及所要求的海关信息。', '付款后更改地址可能需要重新报价运费并进行安全审核。', '包装箱有明显损坏时，应与承运商做好记录，并及时向我们报告和提供照片。'] },
    ],
  },
  es: {
    title: 'Política de envío, aranceles y entrega', description: 'Envíos internacionales, condiciones DDP y DAP, plazos estimados, peso facturable, aduanas y carga de proyectos.', summary: 'Cómo se gestionan los precios de envío, términos comerciales, estimaciones, responsabilidades aduaneras y pedidos de carga.',
    sections: [
      { title: 'Cotizaciones de envío', paragraphs: ['Los métodos y precios disponibles se calculan según país de entrega, cantidad, peso embalado, dimensiones, clase de envío y tarifa vigente al realizar el pedido. Puede usarse el peso volumétrico si supera el peso embalado real.'] },
      { title: 'Destinos DDP y no DDP', items: ['Cuando el proceso de compra o una cotización escrita indique DDP, el servicio cotizado incluye la gestión de aranceles e impuestos de importación hasta el destino acordado, sujeto a las exclusiones indicadas.', 'Si DDP no aparece expresamente, el destinatario puede tener que pagar aranceles, impuestos, cargos aduaneros, corretaje, almacenamiento, recargos de zona remota y costes de cumplimiento local.', 'El proceso de compra para México muestra solo servicios DDP. La disponibilidad en otros países depende de la ruta activa y del tipo de producto.'] },
      { title: 'Carga sobredimensionada y de proyectos', paragraphs: ['Pantallas, armarios, muebles, mercancía de varios bultos y otros productos de carga pueden requerir cotización manual. El pedido no se acepta hasta confirmar por escrito ruta, precio, término comercial, dirección y calendario estimado.'] },
      { title: 'Estimaciones de entrega', paragraphs: ['Los tiempos de preparación y tránsito son estimaciones, no garantías. Inspección aduanera, zonas remotas, interrupciones del transportista, clima, temporada alta y documentos del comprador pueden afectar la entrega. Se facilita seguimiento cuando el transportista lo admite.'] },
      { title: 'Dirección y responsabilidad de entrega', items: ['El cliente debe facilitar dirección completa y exacta, contacto, teléfono y la información aduanera solicitada.', 'Cambiar la dirección tras el pago puede requerir nueva cotización y revisión de seguridad.', 'Los daños visibles del embalaje deben registrarse con el transportista y comunicarse pronto con fotografías.'] },
    ],
  },
  ru: {
    title: 'Политика доставки, пошлин и вручения', description: 'Международная доставка, условия DDP и DAP, расчетные сроки, оплачиваемый вес, таможня и проектные грузы.', summary: 'Порядок расчета доставки, торговых условий, сроков, таможенной ответственности и грузовых заказов.',
    sections: [
      { title: 'Расчет доставки', paragraphs: ['Доступные способы и цены рассчитываются по стране доставки, количеству, весу упакованного отправления, размерам упаковки, классу отправления и действующему тарифу на момент заказа. Если объемный вес выше фактического упакованного веса, может применяться объемный вес.'] },
      { title: 'Направления DDP и без DDP', items: ['Если при оформлении заказа или в письменном коммерческом предложении указано DDP, рассчитанная доставка включает оформление импортных пошлин и налогов до согласованного места с учетом указанных исключений.', 'Если DDP прямо не указано, пошлины, налоги, таможенные сборы, услуги брокера, хранение, сборы за удаленную зону и расходы на соблюдение местных требований могут оплачиваться получателем.', 'Для Мексики при оформлении показываются только услуги DDP. Доступность для других стран зависит от действующего маршрута и типа товара.'] },
      { title: 'Крупногабаритные и проектные грузы', paragraphs: ['Экраны, шкафы, мебель, многоместные и другие грузовые товары могут требовать ручного расчета. Заказ не принимается, пока маршрут, цена, торговое условие, адрес и расчетный график не подтверждены письменно.'] },
      { title: 'Расчетные сроки доставки', paragraphs: ['Сроки обработки и перевозки являются оценкой, а не гарантией. Таможенный досмотр, удаленность, сбои перевозчика, погода, высокий сезон и документы покупателя могут повлиять на доставку. Отслеживание предоставляется, если его поддерживает перевозчик.'] },
      { title: 'Адрес и ответственность за доставку', items: ['Клиент обязан предоставить полный точный адрес, контактное лицо, телефон и запрошенные таможенные сведения.', 'Смена адреса после оплаты может потребовать нового расчета доставки и проверки безопасности.', 'Видимое повреждение коробки следует зафиксировать с перевозчиком и быстро сообщить нам с фотографиями.'] },
    ],
  },
  ar: {
    title: 'سياسة الشحن والرسوم والتسليم', description: 'الشحن الدولي وشروط DDP وDAP ومواعيد التسليم التقديرية والوزن القابل للفوترة والجمارك وشحن المشاريع.', summary: 'كيفية معالجة أسعار الشحن والشروط التجارية وتقديرات التسليم ومسؤوليات الجمارك وطلبات الشحن.',
    sections: [
      { title: 'عروض الشحن', paragraphs: ['تُحسب الطرق والأسعار المتاحة حسب دولة التسليم والكمية والوزن بعد التغليف وأبعاد الطرد وفئة الشحن والتعرفة السارية عند الطلب. وقد يستخدم الوزن الحجمي إذا تجاوز الوزن الفعلي بعد التغليف.'] },
      { title: 'وجهات DDP وغير DDP', items: ['عندما ينص إتمام الطلب أو عرض سعر مكتوب على DDP، تشمل خدمة الشحن المعروضة معالجة رسوم وضرائب الاستيراد إلى الوجهة المتفق عليها، مع مراعاة الاستثناءات المذكورة.', 'عندما لا يظهر DDP صراحة، قد يدفع المستلم الرسوم الجمركية والضرائب ورسوم الجمارك والوساطة والتخزين ورسوم المناطق النائية وتكاليف الامتثال المحلي.', 'يعرض إتمام الطلب للمكسيك خدمات DDP فقط. ويعتمد التوفر للدول الأخرى على مسار الشحن النشط ونوع المنتج.'] },
      { title: 'الشحنات الكبيرة وشحن المشاريع', paragraphs: ['قد تتطلب الشاشات والخزائن والأثاث والبضائع متعددة الطرود وغيرها من منتجات الشحن عرضاً يدوياً. ولا يُقبل الطلب حتى تأكيد المسار والسعر والشرط التجاري وعنوان التسليم والجدول التقديري كتابةً.'] },
      { title: 'تقديرات التسليم', paragraphs: ['أوقات المعالجة والنقل تقديرية وليست ضماناً. وقد يؤثر التفتيش الجمركي والمناطق النائية وتعطل الناقل والطقس ومواسم الذروة ووثائق المشتري على التسليم. ويتوفر التتبع عندما يدعمه الناقل.'] },
      { title: 'العنوان ومسؤولية التسليم', items: ['يجب على العميل تقديم عنوان كامل ودقيق واسم جهة الاتصال والهاتف وأي معلومات جمركية مطلوبة.', 'قد يتطلب تغيير العنوان بعد الدفع عرض شحن جديداً ومراجعة أمنية.', 'يجب توثيق التلف الظاهر في الصندوق مع الناقل وإبلاغنا سريعاً مع الصور.'] },
    ],
  },
};

const returnsRefunds: Record<string, PolicyDocument> = {
  en: {
    title: 'Returns & Refunds Policy', description: 'Return authorization, damaged or incorrect goods, refund timing and non-returnable project orders.', summary: 'Return eligibility depends on the product condition, order type, customization status, and the written terms accepted at checkout or in the quotation.',
    sections: [
      { title: 'Requesting a return', paragraphs: ['Contact us within 7 calendar days after recorded delivery if a product has a verified quality problem. Because international return shipping is costly and operationally complex, we do not accept change-of-mind or other no-fault returns. Do not ship goods back until we issue written return instructions and a return authorization.'] },
      { title: 'Return condition', items: ['Products must be unused, complete, and in resalable condition with original packaging, accessories, manuals, serial labels, and promotional items.', 'The customer is responsible for secure return packaging and return freight unless we confirm that the goods were incorrect, materially defective on arrival, or damaged before delivery.', 'Any approved deduction for missing items, damage, use, or loss of resale value will be disclosed during inspection.'] },
      { title: 'Non-returnable orders', items: ['OEM, ODM, private-label, customized, made-to-order, cut-to-size, configured, or specially sourced products.', 'Opened consumables, software or license products, and clearance goods identified as final sale.', 'B2B project orders unless the applicable quotation or contract expressly provides a return right.'] },
      { title: 'Required evidence', paragraphs: ['A continuous unpacking video is required for any claim involving damage, shortage, an incorrect product, or a quality problem on arrival. The video must clearly show the unopened shipping carton and labels, the complete opening process, all contents, the product serial number, and the reported issue. Also include the order number, photographs, and a clear written description. Claims without sufficient evidence may be declined.'] },
      { title: 'Refund processing', paragraphs: ['Approved refunds are issued to the original payment method after returned goods are received and inspected. Bank, card, PayPal, and Stripe processing times are controlled by the payment provider. Original shipping, customs, and payment costs are non-refundable unless required by law or caused by our confirmed error.'] },
    ],
  },
  zh: {
    title: '退货与退款政策', description: '退货授权、损坏或错误商品、退款时间及不可退项目订单的政策。', summary: '退货资格取决于产品状态、订单类型、定制情况以及结账时或报价单中接受的书面条款。',
    sections: [
      { title: '申请退货', paragraphs: ['如果产品存在经核实的质量问题，请在记录的交付日期后 7 个日历日内联系我们。由于国际退运成本高且操作复杂，我们不接受改变主意或其他非过错原因的退货。在我们发出书面退货说明和退货授权前，请勿寄回商品。'] },
      { title: '退货状态', items: ['产品必须未使用、完整且可再次销售，并保留原包装、配件、说明书、序列号标签及促销赠品。', '客户负责安全的退货包装和退运费用，除非我们确认商品错误、到货时存在重大缺陷或在交付前已损坏。', '因缺少物品、损坏、使用或转售价值损失而批准的任何扣减，会在检查过程中说明。'] },
      { title: '不可退货订单', items: ['OEM、ODM、贴牌、定制、按单生产、按尺寸裁切、配置或特别采购的产品。', '已开封的耗材、软件或许可证产品，以及明确标为最终销售的清仓商品。', 'B2B 项目订单，除非适用的报价单或合同明确规定退货权。'] },
      { title: '所需证据', paragraphs: ['涉及到货损坏、短缺、商品错误或质量问题的索赔，必须提供连续开箱视频。视频必须清楚显示未开封的运输箱及标签、完整开箱过程、全部内容物、产品序列号和所报告的问题。同时请提供订单号、照片和清晰的书面说明。证据不足的索赔可能被拒绝。'] },
      { title: '退款处理', paragraphs: ['批准的退款会在退货收到并检查后退回原付款方式。银行、银行卡、PayPal 和 Stripe 的处理时间由相应支付服务商控制。原始运费、海关费用和支付成本不予退还，法律要求或由我们确认的错误导致的情况除外。'] },
    ],
  },
  es: {
    title: 'Política de devoluciones y reembolsos', description: 'Autorización de devolución, productos dañados o incorrectos, plazos de reembolso y pedidos de proyecto no retornables.', summary: 'La elegibilidad depende del estado del producto, tipo de pedido, personalización y condiciones escritas aceptadas durante la compra o en la cotización.',
    sections: [
      { title: 'Solicitar una devolución', paragraphs: ['Contáctenos dentro de los 7 días naturales posteriores a la entrega registrada si el producto presenta un problema de calidad verificado. Debido al coste y complejidad de las devoluciones internacionales, no aceptamos devoluciones por cambio de opinión ni otras devoluciones sin culpa. No envíe mercancía hasta recibir instrucciones escritas y autorización de devolución.'] },
      { title: 'Estado de la devolución', items: ['Los productos deben estar sin usar, completos y aptos para reventa, con embalaje original, accesorios, manuales, etiquetas de serie y artículos promocionales.', 'El cliente responde del embalaje seguro y del transporte de devolución, salvo que confirmemos que la mercancía era incorrecta, tenía un defecto material al llegar o se dañó antes de la entrega.', 'Toda deducción aprobada por faltantes, daños, uso o pérdida de valor de reventa se comunicará durante la inspección.'] },
      { title: 'Pedidos no retornables', items: ['Productos OEM, ODM, de marca privada, personalizados, fabricados bajo pedido, cortados a medida, configurados o adquiridos especialmente.', 'Consumibles abiertos, productos de software o licencia y liquidaciones identificadas como venta final.', 'Pedidos de proyectos B2B salvo que la cotización o contrato aplicable conceda expresamente un derecho de devolución.'] },
      { title: 'Pruebas requeridas', paragraphs: ['Se exige un vídeo continuo de desembalaje para reclamaciones por daño, faltante, producto incorrecto o problema de calidad al llegar. Debe mostrar claramente la caja sin abrir y sus etiquetas, todo el proceso, todo el contenido, el número de serie y el problema. Incluya además número de pedido, fotos y descripción escrita clara. Las reclamaciones sin pruebas suficientes pueden rechazarse.'] },
      { title: 'Proceso de reembolso', paragraphs: ['Los reembolsos aprobados se emiten al método de pago original tras recibir e inspeccionar la devolución. Los plazos de banco, tarjeta, PayPal y Stripe dependen del proveedor de pago. El envío original, aduanas y costes de pago no se reembolsan salvo obligación legal o error confirmado nuestro.'] },
    ],
  },
  ru: {
    title: 'Политика возврата и возмещения', description: 'Разрешение на возврат, поврежденные или неверные товары, сроки возмещения и невозвратные проектные заказы.', summary: 'Возможность возврата зависит от состояния товара, типа заказа, персонализации и письменных условий, принятых при оформлении заказа или в коммерческом предложении.',
    sections: [
      { title: 'Запрос возврата', paragraphs: ['Свяжитесь с нами в течение 7 календарных дней после зафиксированной доставки, если у товара подтвержденная проблема качества. Из-за стоимости и сложности международного возврата мы не принимаем возвраты из-за изменения решения или иные возвраты без вины продавца. Не отправляйте товар до получения письменных инструкций и разрешения на возврат.'] },
      { title: 'Состояние возврата', items: ['Товар должен быть неиспользованным, полным и пригодным для перепродажи, с оригинальной упаковкой, аксессуарами, инструкциями, серийными наклейками и рекламными предметами.', 'Клиент отвечает за безопасную упаковку и обратную перевозку, если мы не подтвердим, что товар был неверным, имел существенный дефект при получении или был поврежден до доставки.', 'Любой одобренный вычет за недостающие предметы, повреждение, использование или потерю стоимости перепродажи будет раскрыт при проверке.'] },
      { title: 'Невозвратные заказы', items: ['OEM, ODM, товары под частной маркой, индивидуальные, изготовленные под заказ, нарезанные по размеру, настроенные или специально закупленные товары.', 'Открытые расходники, программное обеспечение или лицензии, а также распродажные товары, обозначенные как окончательная продажа.', 'Проектные B2B-заказы, если коммерческое предложение или договор прямо не предоставляет право возврата.'] },
      { title: 'Необходимые доказательства', paragraphs: ['Для претензий о повреждении, недостаче, неверном товаре или проблеме качества при получении требуется непрерывное видео распаковки. Оно должно ясно показывать неоткрытую транспортную коробку и этикетки, весь процесс открытия, всё содержимое, серийный номер и проблему. Также приложите номер заказа, фотографии и ясное письменное описание. Претензия без достаточных доказательств может быть отклонена.'] },
      { title: 'Обработка возмещения', paragraphs: ['Одобренные суммы возвращаются исходным способом оплаты после получения и проверки товара. Сроки банка, карты, PayPal и Stripe контролирует платежный провайдер. Исходная доставка, таможенные и платежные расходы не возвращаются, кроме случаев, требуемых законом или вызванных нашей подтвержденной ошибкой.'] },
    ],
  },
  ar: {
    title: 'سياسة الإرجاع واسترداد الأموال', description: 'تصريح الإرجاع والبضائع التالفة أو الخاطئة ومواعيد الاسترداد وطلبات المشاريع غير القابلة للإرجاع.', summary: 'تعتمد أهلية الإرجاع على حالة المنتج ونوع الطلب والتخصيص والشروط المكتوبة المقبولة عند إتمام الطلب أو في عرض السعر.',
    sections: [
      { title: 'طلب الإرجاع', paragraphs: ['تواصل معنا خلال 7 أيام تقويمية بعد التسليم المسجل إذا كان المنتج يعاني مشكلة جودة مثبتة. ونظراً لتكلفة وتعقيد الإرجاع الدولي، لا نقبل الإرجاع بسبب تغيير الرأي أو أي إرجاع آخر دون خطأ. لا ترسل البضائع قبل إصدار تعليمات كتابية وتصريح بالإرجاع.'] },
      { title: 'حالة الإرجاع', items: ['يجب أن تكون المنتجات غير مستخدمة وكاملة وصالحة لإعادة البيع مع التغليف الأصلي والملحقات والأدلة وملصقات الرقم التسلسلي والعناصر الترويجية.', 'يتحمل العميل مسؤولية التغليف الآمن وشحن الإرجاع ما لم نؤكد أن البضاعة كانت خاطئة أو معيبة مادياً عند الوصول أو تضررت قبل التسليم.', 'سيتم الإفصاح أثناء الفحص عن أي خصم معتمد بسبب نقص أو تلف أو استخدام أو فقدان قيمة إعادة البيع.'] },
      { title: 'طلبات غير قابلة للإرجاع', items: ['منتجات OEM أو ODM أو العلامة الخاصة أو المخصصة أو المصنوعة حسب الطلب أو المقطوعة حسب القياس أو المعدة أو الموردة خصيصاً.', 'المواد الاستهلاكية المفتوحة ومنتجات البرامج أو التراخيص وبضائع التصفية المحددة كبيع نهائي.', 'طلبات مشاريع B2B ما لم يمنح عرض السعر أو العقد المعني حق الإرجاع صراحة.'] },
      { title: 'الأدلة المطلوبة', paragraphs: ['يلزم فيديو متواصل لفتح العبوة لأي مطالبة تتعلق بتلف أو نقص أو منتج خاطئ أو مشكلة جودة عند الوصول. يجب أن يُظهر بوضوح صندوق الشحن غير المفتوح والملصقات وكامل عملية الفتح والمحتويات والرقم التسلسلي والمشكلة. أرفق أيضاً رقم الطلب والصور ووصفاً كتابياً واضحاً. وقد ترفض المطالبات دون أدلة كافية.'] },
      { title: 'معالجة الاسترداد', paragraphs: ['تصدر المبالغ المعتمدة إلى طريقة الدفع الأصلية بعد استلام البضائع وفحصها. ويتحكم مزود الدفع في أوقات معالجة البنك والبطاقة وPayPal وStripe. ولا ترد تكاليف الشحن الأصلي والجمارك والدفع إلا إذا طلب القانون ذلك أو نتجت عن خطأ مؤكد من جانبنا.'] },
    ],
  },
};

export function getPolicyChrome(locale: string) { return chrome[locale] || chrome.en; }
export function getPrivacyPolicy(locale: string) { return privacy[locale] || privacy.en; }
export function getTermsPolicy(locale: string) { return terms[locale] || terms.en; }
export function getWarrantyPolicy(locale: string) { return warranty[locale] || warranty.en; }
export function getShippingPolicy(locale: string) { return shipping[locale] || shipping.en; }
export function getReturnsRefundsPolicy(locale: string) { return returnsRefunds[locale] || returnsRefunds.en; }
