type SolutionsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  systemSummary: string;
  chooseUseCase: string;
  residential: string;
  business: string;
  explore: string;
  planningEyebrow: string;
  planningTitle: string;
  quote: string;
  layersEyebrow: string;
  layersTitle: string;
  layersDescription: string;
  compatibleProducts: string;
  recommended: string;
  buildSolution: string;
  browseAll: string;
  configuredToOrder: string;
  configuredDescription: string;
};

const copies: Record<string, SolutionsCopy> = {
  en: {
    eyebrow: 'Solutions by space and use',
    title: 'Start with your space, not a specification sheet.',
    description: 'Choose a scenario to see recommended projector types, screens, mounts, furniture, and the installation questions for your project.',
    systemSummary: 'Projector + screen + placement + supporting equipment',
    chooseUseCase: 'Choose a use case', residential: 'Residential', business: 'Business & Projects', explore: 'Explore solution',
    planningEyebrow: 'Planning checklist', planningTitle: 'What we confirm before recommending a system', quote: 'Request a project quote',
    layersEyebrow: 'Complete system layers', layersTitle: 'Equipment selected to work together',
    layersDescription: 'These product groups form the starting point for this scene. Final compatibility depends on the room measurements and installation plan.',
    compatibleProducts: 'View compatible products', recommended: 'Recommended products', buildSolution: 'Build your solution', browseAll: 'Browse all products',
    configuredToOrder: 'This solution is configured to order.', configuredDescription: 'Tell us your room size, destination, and quantity for a matched package.',
  },
  zh: {
    eyebrow: '按空间与用途选择方案', title: '先了解空间，而不是先看参数表。',
    description: '选择一个使用场景，查看适合的投影类型、幕布、支架、家具，以及项目开始前需要确认的安装问题。',
    systemSummary: '投影仪 + 幕布 + 摆放安装 + 配套设备', chooseUseCase: '选择使用场景', residential: '住宅与家庭', business: '商业与项目', explore: '查看方案',
    planningEyebrow: '规划清单', planningTitle: '推荐系统前需要确认的条件', quote: '咨询场景方案',
    layersEyebrow: '完整系统组成', layersTitle: '让各项设备协同工作',
    layersDescription: '这些产品类别构成该场景的选型起点，最终兼容性需要结合房间尺寸和安装规划确认。',
    compatibleProducts: '查看兼容产品', recommended: '推荐产品', buildSolution: '搭建您的方案', browseAll: '浏览全部产品',
    configuredToOrder: '此场景需要根据需求进行配置。', configuredDescription: '请告诉我们房间尺寸、目的地和数量，以便匹配合适的组合。',
  },
  es: {
    eyebrow: 'Soluciones por espacio y uso', title: 'Empiece por el espacio, no por una ficha técnica.',
    description: 'Elija un escenario para ver proyectores, pantallas, soportes, mobiliario y preguntas de instalación.',
    systemSummary: 'Proyector + pantalla + ubicación + equipo complementario', chooseUseCase: 'Elija un caso de uso', residential: 'Residencial', business: 'Empresas y proyectos', explore: 'Explorar solución',
    planningEyebrow: 'Lista de planificación', planningTitle: 'Lo que confirmamos antes de recomendar un sistema', quote: 'Solicitar cotización',
    layersEyebrow: 'Capas del sistema completo', layersTitle: 'Equipos seleccionados para funcionar juntos',
    layersDescription: 'Estos grupos son el punto de partida. La compatibilidad final depende de las medidas y del plan de instalación.',
    compatibleProducts: 'Ver productos compatibles', recommended: 'Productos recomendados', buildSolution: 'Construya su solución', browseAll: 'Ver todos los productos',
    configuredToOrder: 'Esta solución se configura bajo pedido.', configuredDescription: 'Indíquenos el tamaño de la sala, el destino y la cantidad.',
  },
  ru: {
    eyebrow: 'Решения по пространству и назначению', title: 'Начните с помещения, а не с таблицы характеристик.',
    description: 'Выберите сценарий, чтобы увидеть типы проекторов, экраны, крепления, мебель и вопросы установки.',
    systemSummary: 'Проектор + экран + размещение + оборудование', chooseUseCase: 'Выберите сценарий', residential: 'Для дома', business: 'Бизнес и проекты', explore: 'Открыть решение',
    planningEyebrow: 'Планирование', planningTitle: 'Что мы уточняем перед рекомендацией системы', quote: 'Запросить расчет',
    layersEyebrow: 'Состав системы', layersTitle: 'Оборудование, которое работает вместе',
    layersDescription: 'Эти категории являются отправной точкой. Итоговая совместимость зависит от размеров помещения и монтажа.',
    compatibleProducts: 'Смотреть совместимые товары', recommended: 'Рекомендуемые товары', buildSolution: 'Соберите решение', browseAll: 'Все товары',
    configuredToOrder: 'Решение комплектуется под заказ.', configuredDescription: 'Сообщите размер помещения, страну назначения и количество.',
  },
  ar: {
    eyebrow: 'حلول حسب المساحة والاستخدام', title: 'ابدأ بالمساحة وليس بجدول المواصفات.',
    description: 'اختر مشهداً لرؤية أنواع أجهزة العرض والشاشات والحوامل والأثاث وأسئلة التركيب.',
    systemSummary: 'جهاز عرض + شاشة + موضع + معدات مساندة', chooseUseCase: 'اختر حالة الاستخدام', residential: 'سكني', business: 'أعمال ومشاريع', explore: 'استكشف الحل',
    planningEyebrow: 'قائمة التخطيط', planningTitle: 'ما نؤكده قبل التوصية بالنظام', quote: 'اطلب عرض مشروع',
    layersEyebrow: 'مكونات النظام الكامل', layersTitle: 'معدات مختارة للعمل معاً',
    layersDescription: 'هذه الفئات نقطة البداية، والتوافق النهائي يعتمد على قياسات الغرفة وخطة التركيب.',
    compatibleProducts: 'عرض المنتجات المتوافقة', recommended: 'منتجات موصى بها', buildSolution: 'ابنِ الحل', browseAll: 'تصفح كل المنتجات',
    configuredToOrder: 'يتم تجهيز هذا الحل حسب الطلب.', configuredDescription: 'أخبرنا بحجم الغرفة والوجهة والكمية.',
  },
};

const sceneTitles: Record<string, Record<string, string>> = {
  zh: {
    'home-cinema': '家庭影院方案', 'living-room-laser-tv': '客厅激光电视方案', 'bedroom-small-space': '卧室与小空间投影', 'gaming-room': '游戏房投影',
    'outdoor-cinema': '庭院与户外影院', 'meeting-rooms': '办公室与会议室方案', 'education-training': '教室与培训空间方案', 'hotels-hospitality': '酒店与民宿投影',
    'bars-restaurants': '酒吧与餐厅投影', 'retail-showrooms': '零售与展厅投影', 'events-rental': '活动与租赁方案', 'large-venues': '礼堂与大型场馆方案',
  },
  es: {
    'home-cinema': 'Cine en casa', 'living-room-laser-tv': 'TV láser para sala de estar', 'bedroom-small-space': 'Dormitorios y espacios pequeños', 'gaming-room': 'Sala de juegos',
    'outdoor-cinema': 'Cine exterior', 'meeting-rooms': 'Oficinas y salas de reuniones', 'education-training': 'Aulas y formación', 'hotels-hospitality': 'Hoteles y hospitalidad',
    'bars-restaurants': 'Bares y restaurantes', 'retail-showrooms': 'Tiendas y salas de exposición', 'events-rental': 'Eventos y alquiler', 'large-venues': 'Auditorios y grandes espacios',
  },
  ru: {
    'home-cinema': 'Домашний кинотеатр', 'living-room-laser-tv': 'Лазерный телевизор для гостиной', 'bedroom-small-space': 'Спальня и небольшие помещения', 'gaming-room': 'Игровая комната',
    'outdoor-cinema': 'Уличный кинотеатр', 'meeting-rooms': 'Офисы и переговорные', 'education-training': 'Классы и обучение', 'hotels-hospitality': 'Гостиницы',
    'bars-restaurants': 'Бары и рестораны', 'retail-showrooms': 'Магазины и шоурумы', 'events-rental': 'Мероприятия и аренда', 'large-venues': 'Аудитории и большие площадки',
  },
  ar: {
    'home-cinema': 'السينما المنزلية', 'living-room-laser-tv': 'تلفزيون ليزر لغرفة المعيشة', 'bedroom-small-space': 'غرف النوم والمساحات الصغيرة', 'gaming-room': 'غرفة الألعاب',
    'outdoor-cinema': 'السينما الخارجية', 'meeting-rooms': 'المكاتب وغرف الاجتماعات', 'education-training': 'الفصول والتدريب', 'hotels-hospitality': 'الفنادق والضيافة',
    'bars-restaurants': 'الحانات والمطاعم', 'retail-showrooms': 'المتاجر وصالات العرض', 'events-rental': 'الفعاليات والتأجير', 'large-venues': 'القاعات والأماكن الكبيرة',
  },
};

export function getSolutionsCopy(locale: string) {
  return copies[locale] || copies.en;
}

export function getLocalizedSceneTitle(locale: string, slug: string, fallback: string) {
  return sceneTitles[locale]?.[slug] || fallback;
}
