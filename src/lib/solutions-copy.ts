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
    'bars-restaurants': 'Бары и рестораны', 'retail-showrooms': 'Магазины и шоурумы', 'events-rental': 'Мероприятия и аренда', 'large-venues': 'Актовые залы и крупные площадки',
  },
  ar: {
    'home-cinema': 'السينما المنزلية', 'living-room-laser-tv': 'تلفزيون ليزر لغرفة المعيشة', 'bedroom-small-space': 'غرف النوم والمساحات الصغيرة', 'gaming-room': 'غرفة الألعاب',
    'outdoor-cinema': 'السينما الخارجية', 'meeting-rooms': 'المكاتب وغرف الاجتماعات', 'education-training': 'الفصول والتدريب', 'hotels-hospitality': 'الفنادق والضيافة',
    'bars-restaurants': 'الحانات والمطاعم', 'retail-showrooms': 'المتاجر وصالات العرض', 'events-rental': 'الفعاليات والتأجير', 'large-venues': 'القاعات والأماكن الكبيرة',
  },
};

type LocalizedSceneDetails = {
  description: string;
  considerations: string[];
};

const localizedSceneDetails: Record<string, Record<string, LocalizedSceneDetails>> = {
  zh: {
    'home-cinema': {
      description: '根据房间条件组合合适的投影仪、幕布、安装方式和配套设备，搭建完整的家庭影院。',
      considerations: ['环境光与幕布材质', '观看距离与画面尺寸', '投射比与安装位置'],
    },
    'living-room-laser-tv': {
      description: '面向明亮客厅的超短焦投影系统，并兼顾幕布匹配与家具一体化安装。',
      considerations: ['超短焦投影仪与抗光幕兼容性', '电视柜深度与散热空间', '白天环境下的画面亮度'],
    },
    'bedroom-small-space': {
      description: '适合卧室、公寓和灵活小空间的紧凑、安静投影组合。',
      considerations: ['较短的观看距离', '低噪声运行', '便携或紧凑的安装方式'],
    },
    'gaming-room': {
      description: '围绕低输入延迟、刷新率和主机兼容性选择的大画面游戏系统。',
      considerations: ['输入延迟与刷新率', 'HDMI 与游戏主机兼容性', '环境光控制'],
    },
    'outdoor-cinema': {
      description: '适合庭院、露营和临时户外活动的便携投影仪与幕布组合。',
      considerations: ['便携供电与连接方式', '防潮防尘收纳', '幕布快速搭建'],
    },
    'meeting-rooms': {
      description: '适合小型讨论室、董事会议室和会议空间的稳定演示与协作系统。',
      considerations: ['会议人数与画面尺寸', '无线演示流程', '安装方式与线缆布置'],
    },
    'education-training': {
      description: '面向教室、培训中心和多教室部署的低维护投影组合。',
      considerations: ['教室照明下的亮度', '集中维护方式', '批量配置与备用设备'],
    },
    'hotels-hospitality': {
      description: '覆盖客房、休息区、会议和娱乐空间，并支持项目选型与安装规划。',
      considerations: ['住客体验与简易控制', '家具一体化', '多场所部署一致性'],
    },
    'bars-restaurants': {
      description: '适合赛事观看、包间和品牌娱乐空间的大画面投影系统。',
      considerations: ['高环境光下的亮度', '多画面布局', '长时间日常运行'],
    },
    'retail-showrooms': {
      description: '用于产品发布、陈列展示和沉浸式内容的灵活视觉系统。',
      considerations: ['内容格式与投影表面', '每日运行时间', '隐藏式安装与品牌呈现'],
    },
    'events-rental': {
      description: '适合会议、展览和租赁业务的便于运输、搭建与维护的投影组合。',
      considerations: ['快速搭建与拆卸', '运输箱与备用配件', '场地亮度与投射距离'],
    },
    'large-venues': {
      description: '面向礼堂、宗教场所、大厅和大型公共空间的高亮度固定安装方案。',
      considerations: ['投射距离与镜头选择', '吊装与安全要求', '冗余设计与维护空间'],
    },
  },
  es: {
    'home-cinema': { description: 'Cree un cine en casa completo con el proyector, la pantalla, el soporte y los accesorios adecuados para la sala.', considerations: ['Luz ambiental y material de la pantalla', 'Distancia de visión y tamaño de imagen', 'Relación de tiro y posición de montaje'] },
    'living-room-laser-tv': { description: 'Sistemas de proyección de tiro ultracorto para salas luminosas e instalaciones limpias integradas en el mobiliario.', considerations: ['Compatibilidad entre proyector UST y pantalla CLR', 'Profundidad y ventilación del mueble', 'Rendimiento de brillo durante el día'] },
    'bedroom-small-space': { description: 'Opciones de proyección compactas y silenciosas para dormitorios, apartamentos y espacios pequeños flexibles.', considerations: ['Distancia de visión corta', 'Funcionamiento silencioso', 'Montaje portátil o compacto'] },
    'gaming-room': { description: 'Sistemas de juego en gran formato seleccionados por latencia de entrada, frecuencia de actualización y compatibilidad con consolas.', considerations: ['Latencia de entrada y frecuencia de actualización', 'Compatibilidad HDMI y con consolas', 'Control de la luz ambiental'] },
    'outdoor-cinema': { description: 'Combinaciones portátiles de proyector y pantalla para jardines, camping y eventos temporales al aire libre.', considerations: ['Alimentación portátil y conectividad', 'Almacenamiento protegido del clima', 'Montaje rápido de la pantalla'] },
    'meeting-rooms': { description: 'Sistemas fiables de presentación y colaboración para salas pequeñas, juntas y conferencias.', considerations: ['Capacidad de la sala y tamaño de pantalla', 'Flujo de presentación inalámbrica', 'Instalación y recorrido del cableado'] },
    'education-training': { description: 'Paquetes de proyección de bajo mantenimiento para aulas, centros de formación y despliegues en varias salas.', considerations: ['Brillo con iluminación del aula', 'Mantenimiento centralizado', 'Precios por volumen y unidades de repuesto'] },
    'hotels-hospitality': { description: 'Soluciones para habitaciones, salones, reuniones y entretenimiento con precios de proyecto y apoyo de instalación.', considerations: ['Experiencia del huésped y controles sencillos', 'Integración con el mobiliario', 'Coherencia en despliegues de varias sedes'] },
    'bars-restaurants': { description: 'Sistemas de gran pantalla de alto impacto para deportes, salas privadas y espacios de entretenimiento de marca.', considerations: ['Brillo con alta luz ambiental', 'Distribución de varias pantallas', 'Largas horas de funcionamiento diario'] },
    'retail-showrooms': { description: 'Sistemas flexibles de presentación visual para lanzamientos, exposiciones y contenido inmersivo.', considerations: ['Formato del contenido y superficie de proyección', 'Horario de funcionamiento', 'Instalación oculta y presentación de marca'] },
    'events-rental': { description: 'Paquetes transportables y reparables para conferencias, exposiciones y flotas de alquiler.', considerations: ['Montaje y desmontaje rápidos', 'Cajas de transporte y repuestos', 'Brillo del recinto y distancia de tiro'] },
    'large-venues': { description: 'Soluciones de instalación de alto brillo para auditorios, lugares de culto, salas y grandes espacios públicos.', considerations: ['Distancia de proyección y selección de lente', 'Rigging y seguridad', 'Redundancia y acceso para mantenimiento'] },
  },
  ru: {
    'home-cinema': { description: 'Создайте полноценный домашний кинотеатр с подходящими проектором, экраном, креплением и аксессуарами для помещения.', considerations: ['Освещение помещения и материал экрана', 'Расстояние просмотра и размер изображения', 'Проекционное отношение и место установки'] },
    'living-room-laser-tv': { description: 'Ультракороткофокусные системы для светлых гостиных и аккуратной установки с интеграцией в мебель.', considerations: ['Совместимость UST-проектора и CLR-экрана', 'Глубина тумбы и вентиляция', 'Яркость изображения в дневное время'] },
    'bedroom-small-space': { description: 'Компактные и тихие варианты проекции для спален, квартир и гибких небольших пространств.', considerations: ['Небольшое расстояние просмотра', 'Низкий уровень шума', 'Переносная или компактная установка'] },
    'gaming-room': { description: 'Системы для игр на большом экране с учетом задержки ввода, частоты обновления и совместимости с консолями.', considerations: ['Задержка ввода и частота обновления', 'Совместимость с HDMI и игровыми консолями', 'Контроль внешнего освещения'] },
    'outdoor-cinema': { description: 'Переносные комплекты проектора и экрана для сада, кемпинга и временных мероприятий на открытом воздухе.', considerations: ['Переносное питание и подключение', 'Защищенное от погоды хранение', 'Быстрая установка экрана'] },
    'meeting-rooms': { description: 'Надежные системы презентаций и совместной работы для малых переговорных, залов заседаний и конференц-залов.', considerations: ['Вместимость помещения и размер экрана', 'Беспроводной сценарий презентации', 'Монтаж и прокладка кабелей'] },
    'education-training': { description: 'Проекционные комплекты с низкими требованиями к обслуживанию для классов, учебных центров и развертывания в нескольких помещениях.', considerations: ['Яркость при освещении класса', 'Централизованное обслуживание', 'Оптовая цена и запасные устройства'] },
    'hotels-hospitality': { description: 'Решения для номеров, зон отдыха, встреч и развлечений с проектным ценообразованием и поддержкой установки.', considerations: ['Удобство гостей и простое управление', 'Интеграция с мебелью', 'Единообразие развертывания на нескольких объектах'] },
    'bars-restaurants': { description: 'Эффектные системы большого экрана для спортивных трансляций, отдельных залов и фирменных развлекательных пространств.', considerations: ['Яркость при сильном внешнем освещении', 'Схемы с несколькими экранами', 'Продолжительная ежедневная работа'] },
    'retail-showrooms': { description: 'Гибкие системы визуального мерчандайзинга для презентаций товаров, экспозиций и иммерсивного контента.', considerations: ['Формат контента и поверхность проекции', 'График работы', 'Скрытый монтаж и представление бренда'] },
    'events-rental': { description: 'Транспортируемые и обслуживаемые комплекты для конференций, выставок и прокатного парка.', considerations: ['Быстрый монтаж и демонтаж', 'Транспортные кейсы и запасные части', 'Освещенность площадки и расстояние проекции'] },
    'large-venues': { description: 'Высокояркие стационарные решения для актовых и зрительных залов, культовых сооружений и больших общественных пространств.', considerations: ['Расстояние проекции и выбор объектива', 'Несущие конструкции и безопасность', 'Резервирование и доступ для обслуживания'] },
  },
};

const categoryLabels: Record<string, Record<string, string>> = {
  zh: {
    'home-smart-projectors': '家用智能投影仪',
    'high-end-home-theater-projectors': '高端家庭影院投影仪',
    'projection-screens': '投影幕布',
    'ust-laser-tv': '超短焦激光电视',
    'alr-clr-screens': '抗光幕与菲涅尔幕',
    'av-furniture': '影音家具',
    'portable-mini-projectors': '便携与迷你投影仪',
    'desktop-stands': '桌面支架',
    'portable-outdoor-screens': '便携与户外幕布',
    'cases-bags': '收纳箱与便携包',
    'business-education-projectors': '商务与教育投影仪',
    'motorized-screens': '电动幕布',
    'ceiling-mounts': '吊装支架',
    'solution-bundles': '场景套装',
    'engineering-projectors': '工程投影仪',
    'projector-mounts-stands': '投影支架与落地架',
    'accessories-parts': '配件与零部件',
    'fixed-frame-screens': '画框幕布',
  },
  es: {
    'home-smart-projectors': 'Proyectores inteligentes para el hogar',
    'high-end-home-theater-projectors': 'Proyectores de cine en casa de alta gama',
    'projection-screens': 'Pantallas de proyección',
    'ust-laser-tv': 'Televisores láser de tiro ultracorto',
    'alr-clr-screens': 'Pantallas ALR / CLR',
    'av-furniture': 'Mobiliario audiovisual',
    'portable-mini-projectors': 'Proyectores portátiles y mini',
    'desktop-stands': 'Soportes de sobremesa',
    'portable-outdoor-screens': 'Pantallas portátiles y exteriores',
    'cases-bags': 'Maletas y bolsas',
    'business-education-projectors': 'Proyectores para empresas y educación',
    'motorized-screens': 'Pantallas motorizadas',
    'ceiling-mounts': 'Soportes de techo',
    'solution-bundles': 'Paquetes de soluciones',
    'engineering-projectors': 'Proyectores de instalación profesional',
    'projector-mounts-stands': 'Soportes para proyectores',
    'accessories-parts': 'Accesorios y repuestos',
    'fixed-frame-screens': 'Pantallas de marco fijo',
  },
  ru: {
    'home-smart-projectors': 'Умные проекторы для дома',
    'high-end-home-theater-projectors': 'Проекторы высокого класса для домашнего кинотеатра',
    'projection-screens': 'Проекционные экраны',
    'ust-laser-tv': 'Ультракороткофокусные лазерные телевизоры',
    'alr-clr-screens': 'Экраны ALR / CLR',
    'av-furniture': 'Мебель для аудио- и видеотехники',
    'portable-mini-projectors': 'Портативные и мини-проекторы',
    'desktop-stands': 'Настольные подставки',
    'portable-outdoor-screens': 'Переносные и уличные экраны',
    'cases-bags': 'Кейсы и сумки',
    'business-education-projectors': 'Проекторы для бизнеса и образования',
    'motorized-screens': 'Моторизованные экраны',
    'ceiling-mounts': 'Потолочные крепления',
    'solution-bundles': 'Комплекты решений',
    'engineering-projectors': 'Инсталляционные проекторы',
    'projector-mounts-stands': 'Крепления и стойки для проекторов',
    'accessories-parts': 'Аксессуары и запчасти',
    'fixed-frame-screens': 'Экраны с фиксированной рамой',
  },
};

export function getSolutionsCopy(locale: string) {
  return copies[locale] || copies.en;
}

export function getLocalizedSceneTitle(locale: string, slug: string, fallback: string) {
  return sceneTitles[locale]?.[slug] || fallback;
}

export function getLocalizedSceneDetails(
  locale: string,
  slug: string,
  fallback: LocalizedSceneDetails,
) {
  return localizedSceneDetails[locale]?.[slug] || fallback;
}

export function getLocalizedCategoryLabel(locale: string, slug: string, fallback: string) {
  return categoryLabels[locale]?.[slug] || fallback;
}
