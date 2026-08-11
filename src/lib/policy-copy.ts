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

export function getPolicyChrome(locale: string) { return chrome[locale] || chrome.en; }
export function getPrivacyPolicy(locale: string) { return privacy[locale] || privacy.en; }
