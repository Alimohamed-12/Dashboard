export function extractList(payload) {
  // لو الـ payload نفسه Array رجعه زي ما هو
  if (Array.isArray(payload)) return payload

  // لو الداتا موجودة جوه data
  if (Array.isArray(payload?.data)) return payload.data

  // لو الأوردرات موجودة جوه orders
  if (Array.isArray(payload?.orders)) return payload.orders

  // لو الأوردرات موجودة جوه data.orders
  if (Array.isArray(payload?.data?.orders)) return payload.data.orders

  // لو الداتا موجودة جوه results
  if (Array.isArray(payload?.results)) return payload.results

  // لو ملقاش أي حاجة يرجع Array فاضي
  return []
}

// الفانكشن دي بتجيب إجمالي عدد الأوردرات
export function extractTotalCount(payload, fallbackLength) {
  return (
    // يجرب كل احتمال حسب شكل الـ API
    payload?.total ??
    payload?.count ??
    payload?.totalOrders ??
    payload?.data?.total ??
    // ولو مفيش أي قيمة يستخدم طول الليست
    fallbackLength
  )
}

// الفانكشن دي بتوحد شكل بيانات الأوردر مهما كان الـ API راجعها بإيه
export function normalizeOrder(raw) {
  // يجيب الـ ID بأي اسم موجود
  const id = raw._id || raw.id || raw.orderId || ''

  // يجيب بيانات اليوزر
  const user = raw.user || raw.customer || {}

  // يحدد اسم العميل
  const customerName =
    (typeof user === 'string' ? user : null) ||
    user.username ||
    user.name ||
    raw.customerName ||
    raw.name ||
    null

  // يحدد إيميل العميل
  const customerEmail =
    (typeof user === 'object' ? user.email : null) ||
    raw.customerEmail ||
    raw.email ||
    null

  // يحدد حالة الأوردر
  const status = raw.status || raw.orderStatus || 'pending'

  // يحدد حالة الدفع
  const paymentStatus =
    raw.paymentStatus ||
    raw.payment?.status ||
    (raw.isPaid ? 'paid' : null) ||
    'pending'

  // يحدد طريقة الدفع
  const paymentMethod =
    raw.paymentMethod ||
    raw.payment?.method ||
    raw.method ||
    'cash'

  // يجيب إجمالي السعر مهما كان اسم الفيلد
  const total =
    raw.totalPrice ??
    raw.total ??
    raw.totalAmount ??
    raw.amount ??
    raw.grandTotal ??
    0

  // يجيب تاريخ إنشاء الأوردر
  const date = raw.createdAt || raw.date || raw.orderDate || null

  // يجيب السعر قبل الشحن والضريبة (Subtotal)
  const subtotal = raw.itemsPrice ?? raw.subtotal ?? raw.subTotal ?? null

  // يجيب تكلفة الشحن
  const shipping = raw.shippingPrice ?? raw.shippingCost ?? raw.shipping ?? 0

  // يجيب قيمة الضريبة
  const tax = raw.taxPrice ?? raw.tax ?? null

  // نسبة الضريبة (لو مش موجودة بنفترض 14% كـ default للعرض بس)
  const taxRate = raw.taxRate ?? 14

  // يجيب ملاحظة العميل لو موجودة
  const customerNote = raw.customerNote ?? raw.note ?? raw.notes ?? ''

  // يجيب عنوان الشحن بأي شكل موجود بيه
  const shippingAddress = formatShippingAddress(raw)

  // يرجع أوردر بشكل موحد علشان باقي المشروع يشتغل عليه بسهولة
  return {
    raw, // الداتا الأصلية
    id, // الـ ID الكامل
    shortId: shortenId(id), // نسخة مختصرة من الـ ID
    customerName,
    customerEmail,
    status: (status || 'pending').toLowerCase(),
    paymentStatus: (paymentStatus || 'pending').toLowerCase(),
    paymentMethod: (paymentMethod || 'cash').toLowerCase(),
    total: Number(total) || 0,
    subtotal: subtotal !== null ? Number(subtotal) || 0 : null,
    shipping: Number(shipping) || 0,
    tax: tax !== null ? Number(tax) || 0 : null,
    taxRate,
    customerNote,
    shippingAddress,
    date,
    // المنتجات الموجودة في الأوردر (بشكل موحد: اسم، كمية، سعر، صورة)
    items: (raw.items || raw.products || raw.cartItems || []).map(normalizeItem),
  }
}

// الفانكشن دي بتوحد شكل عنصر المنتج جوه الأوردر
export function normalizeItem(raw) {
  const name = raw.name || raw.title || raw.product?.name || null
  const quantity = raw.quantity || raw.qty || 1
  const price = raw.price ?? raw.unitPrice ?? raw.product?.price ?? 0
  const image = raw.image || raw.thumbnail || raw.product?.image || raw.images?.[0] || null
  return { raw, name, quantity, price: Number(price) || 0, image }
}

// الفانكشن دي بتكوّن عنوان الشحن من أي شكل بيانات موجود
export function formatShippingAddress(raw) {
  const addr = raw.shippingAddress || raw.shipping?.address || raw.address || null
  if (typeof addr === 'string') return addr
  if (addr && typeof addr === 'object') {
    return [addr.city, addr.country].filter(Boolean).join(', ') || null
  }
  return raw.shipTo || null
}

export function shortenId(id) {
  if (!id) return '—'
  const clean = String(id).replace(/[^a-zA-Z0-9]/g, '')
  return `#${clean.slice(-8).toUpperCase()}`
}

export function formatCurrency(amount, currency = 'EGP') {
  const num = Number(amount) || 0
  return `${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currency}`
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// الحالات اللي الأوردر ممكن يكون فيها
export const STATUS_OPTIONS = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned'
]

// حالات الدفع
export const PAYMENT_STATUS_OPTIONS = [
  'pending',
  'paid',
  'failed'
]

// طرق الدفع
export const PAYMENT_METHOD_OPTIONS = [
  'cash',
  'card',
  'wallet'
]