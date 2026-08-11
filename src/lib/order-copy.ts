type OrderCopy = {
  lookupTitle: string; lookupIntro: string; orderNumber: string; checkoutEmail: string;
  checking: string; viewOrder: string; retrieveError: string; order: string; product: string;
  paid: string; status: string; shipping: string; tracking: string; processing: string;
  notShipped: string; deliveryAddress: string; providerAddress: string; trackOrder: string;
  productFallback: string; invalidLookup: string; orderNotFound: string;
};

const en: OrderCopy = {
  lookupTitle: 'Track your order', lookupIntro: 'Enter the order number and checkout email from your confirmation.', orderNumber: 'Order number', checkoutEmail: 'Checkout email', checking: 'Checking…', viewOrder: 'View order', retrieveError: 'Unable to retrieve order', order: 'Order', product: 'Product', paid: 'Paid', status: 'Status', shipping: 'Shipping', tracking: 'Tracking', processing: 'Processing', notShipped: 'Not shipped yet', deliveryAddress: 'Delivery address', providerAddress: 'Confirmed by payment provider', trackOrder: 'Track order', productFallback: 'your product', invalidLookup: 'Enter a valid order number and email', orderNotFound: 'Order not found',
};

const copies: Record<string, OrderCopy> = {
  en,
  zh: { ...en, lookupTitle: '查询订单', lookupIntro: '请输入确认信息中的订单号和结账邮箱。', orderNumber: '订单号', checkoutEmail: '结账邮箱', checking: '正在查询…', viewOrder: '查看订单', retrieveError: '无法查询订单', order: '订单', product: '产品', paid: '已付款', status: '状态', shipping: '配送', tracking: '物流追踪', processing: '处理中', notShipped: '尚未发货', deliveryAddress: '收货地址', providerAddress: '由支付服务商确认', trackOrder: '查询订单', productFallback: '您购买的产品', invalidLookup: '请输入有效的订单号和邮箱', orderNotFound: '未找到订单' },
  es: { ...en, lookupTitle: 'Seguir su pedido', lookupIntro: 'Introduzca el número de pedido y el correo usado al finalizar la compra.', orderNumber: 'Número de pedido', checkoutEmail: 'Correo de compra', checking: 'Consultando…', viewOrder: 'Ver pedido', retrieveError: 'No se pudo recuperar el pedido', order: 'Pedido', product: 'Producto', paid: 'Pagado', status: 'Estado', shipping: 'Envío', tracking: 'Seguimiento', processing: 'En proceso', notShipped: 'Aún no enviado', deliveryAddress: 'Dirección de entrega', providerAddress: 'Confirmada por el proveedor de pago', trackOrder: 'Seguir pedido', productFallback: 'su producto', invalidLookup: 'Introduzca un número de pedido y correo válidos', orderNotFound: 'Pedido no encontrado' },
  ru: { ...en, lookupTitle: 'Отследить заказ', lookupIntro: 'Введите номер заказа и адрес электронной почты, указанный при оформлении.', orderNumber: 'Номер заказа', checkoutEmail: 'Электронная почта', checking: 'Проверка…', viewOrder: 'Показать заказ', retrieveError: 'Не удалось получить заказ', order: 'Заказ', product: 'Товар', paid: 'Оплачено', status: 'Статус', shipping: 'Доставка', tracking: 'Отслеживание', processing: 'В обработке', notShipped: 'Еще не отправлен', deliveryAddress: 'Адрес доставки', providerAddress: 'Подтверждено платежным сервисом', trackOrder: 'Отследить заказ', productFallback: 'ваш товар', invalidLookup: 'Введите действительный номер заказа и адрес электронной почты', orderNotFound: 'Заказ не найден' },
  ar: { ...en, lookupTitle: 'تتبّع طلبك', lookupIntro: 'أدخل رقم الطلب والبريد الإلكتروني المستخدم عند إتمام الشراء.', orderNumber: 'رقم الطلب', checkoutEmail: 'بريد إتمام الشراء', checking: 'جارٍ التحقق…', viewOrder: 'عرض الطلب', retrieveError: 'تعذر استرداد الطلب', order: 'الطلب', product: 'المنتج', paid: 'المدفوع', status: 'الحالة', shipping: 'الشحن', tracking: 'التتبع', processing: 'قيد المعالجة', notShipped: 'لم يُشحن بعد', deliveryAddress: 'عنوان التسليم', providerAddress: 'تم تأكيده من مزود الدفع', trackOrder: 'تتبّع الطلب', productFallback: 'منتجك', invalidLookup: 'أدخل رقم طلب وبريداً إلكترونياً صالحين', orderNotFound: 'لم يتم العثور على الطلب' },
};

export function getOrderCopy(locale: string) { return copies[locale] || en; }

export function getOrderErrorLabel(locale: string, error: unknown) {
  const copy = getOrderCopy(locale);
  if (error === 'Enter a valid order number and email') return copy.invalidLookup;
  if (error === 'Order not found') return copy.orderNotFound;
  return copy.retrieveError;
}

const statusCopies: Record<string, Record<string, string>> = {
  en: { pending: 'Pending', pending_payment: 'Awaiting payment', paid: 'Paid', preparing: 'Preparing', shipped: 'Shipped', completed: 'Completed', delivered: 'Delivered', cancelled: 'Cancelled', refunded: 'Refunded', partially_refunded: 'Partially refunded' },
  zh: { pending: '待处理', pending_payment: '等待付款', paid: '已付款', preparing: '备货中', shipped: '已发货', completed: '已完成', delivered: '已送达', cancelled: '已取消', refunded: '已退款', partially_refunded: '部分退款' },
  es: { pending: 'Pendiente', pending_payment: 'Pendiente de pago', paid: 'Pagado', preparing: 'En preparación', shipped: 'Enviado', completed: 'Completado', delivered: 'Entregado', cancelled: 'Cancelado', refunded: 'Reembolsado', partially_refunded: 'Reembolso parcial' },
  ru: { pending: 'Ожидает обработки', pending_payment: 'Ожидает оплаты', paid: 'Оплачен', preparing: 'Готовится', shipped: 'Отправлен', completed: 'Завершен', delivered: 'Доставлен', cancelled: 'Отменен', refunded: 'Средства возвращены', partially_refunded: 'Средства возвращены частично' },
  ar: { pending: 'قيد الانتظار', pending_payment: 'بانتظار الدفع', paid: 'مدفوع', preparing: 'قيد التجهيز', shipped: 'تم الشحن', completed: 'مكتمل', delivered: 'تم التسليم', cancelled: 'ملغى', refunded: 'تم رد المبلغ', partially_refunded: 'تم رد جزء من المبلغ' },
};

export function getOrderStatusLabel(locale: string, status: string) {
  return statusCopies[locale]?.[status] || statusCopies.en[status] || status;
}
