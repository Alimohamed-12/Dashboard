// Imports
import { useEffect, useMemo, useState, useCallback } from 'react'
import { Search, ChevronDown, X, Loader2, RefreshCw, AlertTriangle } from 'lucide-react'
import api from '../../api/axiosInstance'

//   الجزء ده كان في ملف utils/orders.js
//   (استخراج الليست، تنسيق البيانات، قوائم الخيارات)

function extractList(payload) {
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
function extractTotalCount(payload, fallbackLength) {
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
function normalizeOrder(raw) {
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
function normalizeItem(raw) {
  const name = raw.name || raw.title || raw.product?.name || null
  const quantity = raw.quantity || raw.qty || 1
  const price = raw.price ?? raw.unitPrice ?? raw.product?.price ?? 0
  const image = raw.image || raw.thumbnail || raw.product?.image || raw.images?.[0] || null
  return { raw, name, quantity, price: Number(price) || 0, image }
}

// الفانكشن دي بتكوّن عنوان الشحن من أي شكل بيانات موجود
function formatShippingAddress(raw) {
  const addr = raw.shippingAddress || raw.shipping?.address || raw.address || null
  if (typeof addr === 'string') return addr
  if (addr && typeof addr === 'object') {
    return [addr.city, addr.country].filter(Boolean).join(', ') || null
  }
  return raw.shipTo || null
}

function shortenId(id) {
  if (!id) return '—'
  const clean = String(id).replace(/[^a-zA-Z0-9]/g, '')
  return `#${clean.slice(-8).toUpperCase()}`
}

function formatCurrency(amount, currency = 'EGP') {
  const num = Number(amount) || 0
  return `${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currency}`
}

function formatDate(value) {
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
const STATUS_OPTIONS = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned'
]

// حالات الدفع
const PAYMENT_STATUS_OPTIONS = [
  'pending',
  'paid',
  'failed'
]

// طرق الدفع
const PAYMENT_METHOD_OPTIONS = [
  'cash',
  'card',
  'wallet'
]


//   الجزء ده كان في ملف components/StatusBadge.jsx
//   (StatusPill و PaymentPill)


const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-violet-100 text-violet-700',
  shipped: 'bg-sky-100 text-sky-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  canceled: 'bg-rose-100 text-rose-700',
  returned: 'bg-orange-100 text-orange-700',
  refunded: 'bg-orange-100 text-orange-700',
  paid: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-rose-100 text-rose-700',
}

const DOT_STYLES = {
  pending: 'bg-amber-500',
  processing: 'bg-violet-500',
  shipped: 'bg-sky-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-rose-500',
  canceled: 'bg-rose-500',
  returned: 'bg-orange-500',
  refunded: 'bg-orange-500',
}

function StatusPill({ status }) {
  const key = (status || 'pending').toLowerCase()
  const style = STATUS_STYLES[key] || 'bg-slate-100 text-slate-600'
  const dot = DOT_STYLES[key] || 'bg-slate-400'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {key}
    </span>
  )
}

function PaymentPill({ status }) {
  const key = (status || 'pending').toLowerCase()
  const style =
    key === 'paid'
      ? 'bg-emerald-100 text-emerald-700'
      : key === 'failed'
      ? 'bg-rose-100 text-rose-700'
      : 'bg-amber-100 text-amber-700'
  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${style}`}>
      {key.toUpperCase()}
    </span>
  )
}

//   صفحة الطلبات (Orders) - الكومبوننت الرئيسي


export default function Orders() {

  // بتاع الداتا

  const [orders, setOrders] = useState([]) // كل الطلبات الجاية من السيرفر
  const [totalCount, setTotalCount] = useState(0) // العدد الكلي للطلبات
  const [loading, setLoading] = useState(true) // حالة التحميل
  const [error, setError] = useState('') // رسالة الخطأ لو حصل

  //بتاع الفلاتر

  const [search, setSearch] = useState('') // نص البحث
  const [statusFilter, setStatusFilter] = useState('all') // فلتر حالة الطلب
  const [paymentFilter, setPaymentFilter] = useState('all') // فلتر حالة الدفع
  const [methodFilter, setMethodFilter] = useState('all') // فلتر طريقة الدفع

  // UI

  const [selectedOrder, setSelectedOrder] = useState(null) // الطلب المفتوح
  const [updatingId, setUpdatingId] = useState(null) //  الطلب اللي بيتحدث

  // دالة جلب الطلبات من السيرفر

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/orders/admin')

      // استخراج الليست من الريسبونس وتوحيد شكل كل عنصر فيها

      const list = extractList(data).map(normalizeOrder)
      setOrders(list)
      setTotalCount(extractTotalCount(data, list.length))
    } catch (err) {

      // رسالة خطأ من السيرفر

      setError(
        err.response?.data?.message || err.message || 'تعذر تحميل الطلبات، حاول تاني'
      )
    } finally {
      setLoading(false)
    }
  }, [])


  // بيشغل fetchOrders
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  //  (بحث + فلاتر) useMemo

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return orders.filter((o) => {

      //    id  اسم العميل، إيميل العميل
      const matchesSearch =
        !term ||
        o.shortId.toLowerCase().includes(term) ||
        o.id.toLowerCase().includes(term) ||
        o.customerName?.toLowerCase().includes(term) ||
        o.customerEmail?.toLowerCase().includes(term)

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter
      const matchesPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter
      const matchesMethod = methodFilter === 'all' || o.paymentMethod === methodFilter
      return matchesSearch && matchesStatus && matchesPayment && matchesMethod
    })
  }, [orders, search, statusFilter, paymentFilter, methodFilter])


  // دالة تحديث حالة الطلب

  const updateStatus = async (order, newStatus) => {
    // لو الحالة الجديدة زي القديمة متعملش حاجة

    if (newStatus === order.status) return

    // تأكيد من الأدمن قبل التنفيذ

    const confirmed = window.confirm(`تأكيد تغيير حالة الطلب ${order.shortId} إلى "${newStatus}"؟`)

    if (!confirmed) return

    setUpdatingId(order.id)
    try {
      await api.patch(`/orders/admin/${order.id}/status`, { status: newStatus })
      // تحديث الـ state محليًا بعد نجاح الريكوست، من غير ما نعمل fetch تاني لكل الليستة
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)))
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'تعذر تحديث حالة الطلب')
    } finally {
      setUpdatingId(null)
    }
  }

  // الـ JSX الرئيسي بتاع الصفحة

  return (
    <div className="min-h-screen bg-koda-bg">
      <main className="max-w-7xl mx-auto p-6">

        {/*  الهيدر: العنوان + زرار الريفريش + عدد الطلبات  */}

        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="text-[11px] tracking-[0.2em] font-bold text-koda-muted">
              ADMIN · MANAGEMENT
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Orders</h1>
          </div>
          <div className="flex items-center gap-3">

            {/* زرار الريفريش: يعيد جلب الطلبات،  */}

            <button
              type="button"
              onClick={fetchOrders}
              className="w-10 h-10 rounded-lg border border-koda-border bg-white flex items-center justify-center hover:bg-slate-50"
              title="تحديث"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* كارت صغير بيعرض العدد الكلي للطلبات */}

            <div className="bg-white border border-koda-border rounded-xl2 shadow-soft px-5 py-3 text-center">
              <span className="text-2xl font-extrabold text-slate-900">{totalCount}</span>{' '}
              <span className="text-sm text-koda-muted">total orders</span>
            </div>
          </div>
        </div>

        {/*  الفلاتر: انپت البحث + تلات دروب داونز  */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-koda-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, customer..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-koda-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-koda-teal/40 focus:border-koda-teal"
            />
          </div>

          <FilterSelect value={statusFilter} onChange={setStatusFilter} label="All statuses" options={STATUS_OPTIONS} />
          <FilterSelect value={paymentFilter} onChange={setPaymentFilter} label="All payments" options={PAYMENT_STATUS_OPTIONS} />
          <FilterSelect value={methodFilter} onChange={setMethodFilter} label="All methods" options={PAYMENT_METHOD_OPTIONS} />
        </div>

        {/*  الجدول  */}

        <div className="bg-koda-card border border-koda-border rounded-xl2 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] tracking-wider text-koda-muted font-bold uppercase border-b border-koda-border">
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Payment</th>
                  <th className="px-6 py-3.5">Total</th>
                </tr>
              </thead>
              <tbody>

                {/* حالة اللودينج */}
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-koda-muted">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      جاري تحميل الطلبات...
                    </td>
                  </tr>
                )}

                {/* حالة الخطأ */}
                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-rose-600">
                      <AlertTriangle className="w-5 h-5 mx-auto mb-2" />
                      {error}
                    </td>
                  </tr>
                )}

                {/* حالة عدم وجود نتايج مطابقة للفلاتر */}
                {!loading && !error && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-koda-muted">
                      مفيش طلبات مطابقة لبحثك
                    </td>
                  </tr>
                )}

                {/* الحالة العادية: عرض صف لكل طلب */}
                {!loading &&
                  !error &&
                  filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-koda-border last:border-0 hover:bg-slate-50/60 cursor-pointer"
                      onClick={() => setSelectedOrder(order)} // بيفتح المودال عند الضغط على الصف
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">{order.shortId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          {/* أفاتار بحرف اسم العميل الأول */}
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">
                            {(order.customerName || 'U')[0].toUpperCase()}
                          </div>
                          <span className="text-slate-500">{order.customerName || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(order.date)}</td>
                      {/* stopPropagation عشان الضغط على الدروب داون متفتحش المودال بالغلط */}
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown
                          order={order}
                          disabled={updatingId === order.id}
                          onChange={(status) => updateStatus(order, status)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <PaymentPill status={order.paymentStatus} />
                          <p className="text-xs text-koda-muted capitalize">{order.paymentMethod}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* المودال بيفتح بس لو فيه selectedOrder */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateStatus}
          updating={updatingId === selectedOrder.id}
        />
      )}
    </div>
  )
}


// كومبوننت مساعد: دروب داون فلتر
// نفس فكرة StatusDropdown: قائمة مصممة بالكامل بدل الـ select الأصلي
// عشان شكل الخيارات يبقى بروفيشنال ومتحكم فيه بالكامل


function FilterSelect({ value, onChange, label, options }) {
  const [open, setOpen] = useState(false)

  // النص الظاهر على الزرار: اللابل الافتراضي لو "all"، أو القيمة المختارة
  const display = value === 'all' ? label : value

  const handleSelect = (opt) => {
    setOpen(false)
    onChange(opt)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-lg border border-koda-border bg-white text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-koda-teal/40 focus:border-koda-teal capitalize"
      >
        {display}
        <ChevronDown className={`w-4 h-4 text-koda-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* أوفرلاي شفاف بيقفل القائمة لو دوسنا في أي حتة برة */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-2 w-40 bg-white border border-koda-border rounded-lg shadow-soft py-1 overflow-hidden">
            <button
              type="button"
              onClick={() => handleSelect('all')}
              className={`w-full text-left px-3.5 py-2 text-sm capitalize transition-colors hover:bg-slate-50 ${
                value === 'all' ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-600'
              }`}
            >
              {label}
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-3.5 py-2 text-sm capitalize transition-colors hover:bg-slate-50 ${
                  opt === value ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// كومبوننت مساعد: دروب داون حالة الطلب
// الفكرة: فيه select حقيقي شفاف تمامًا (bg-transparent text-transparent)
// حاطط عليه absolute inset-0 عشان يغطي المساحة ويستقبل الكليكات
// وتحته div بـ pointer-events-none بتعرض الشكل الملون (StatusPill)
// يعني بصريًا بتشوف پيل ملون لكن هو فعليًا select حقيقي


function StatusDropdown({ order, onChange, disabled }) {
  // بدل ما نستخدم select حقيقي (اللي شكل الـ options بتاعه بيبقى ستايل
  // المتصفح الافتراضي ومينفعش نتحكم فيه)، بنعمل قائمة مصممة بالكامل
  // باستخدام state عشان تفتح/تقفل، عشان الشكل يبقى بروفيشنال ومتحكم فيه بالكامل
  const [open, setOpen] = useState(false)

  const handleSelect = (opt) => {
    setOpen(false)
    if (opt !== order.status) onChange(opt)
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="flex items-center gap-1.5 focus:outline-none disabled:cursor-wait"
      >
        <StatusPill status={order.status} />
        {disabled ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-koda-muted" />
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 text-koda-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && (
        <>
          {/* أوفرلاي شفاف بيقفل القائمة لو دوسنا في أي حتة برة */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-2 w-40 bg-white border border-koda-border rounded-lg shadow-soft py-1 overflow-hidden">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-3.5 py-2 text-sm capitalize transition-colors hover:bg-slate-50 ${
                  opt === order.status ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}


// كومبوننت مساعد: مودال تفاصيل الطلب


// كومبوننت المودال دلوقتي شكله "Slide Panel" بيدخل من جهة اليمين
// (زي الصورتين المرجعيتين) بدل ما يكون مودال في نص الشاشة
// وفيه قسم Update Status شغال فعليًا وبيستخدم نفس دالة updateStatus
// الموجودة في الصفحة الرئيسية (بتاعة الـ StatusDropdown برضو)

function OrderDetailsModal({ order, onClose, onUpdateStatus, updating }) {
  // حالة محلية للـ select بتاع تحديث الحالة (مش بتتغير فعليًا لحد ما تدوسي Save)
  const [statusValue, setStatusValue] = useState(order.status)
  // حالة محلية لملاحظة الأدمن (عرض بس دلوقتي، مش متبعتة للسيرفر)
  const [note, setNote] = useState('')
  // حالة محلية لعمل حركة الدخول من الشمال (mount بعد أول render بلحظة بسيطة)
  const [visible, setVisible] = useState(false)
  // حالة فتح/قفل قائمة Update status المصممة بالكامل
  const [statusOpen, setStatusOpen] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // زرار Save changes: بيستدعي نفس دالة updateStatus الموجودة في الصفحة الرئيسية
  const handleSave = () => {
    onUpdateStatus(order, statusValue)
  }

  return (
    // الأوفرلاي السودة الشفافة: الضغط عليها بيقفل الـ panel
    // flex justify-end عشان الـ panel يظهر من جهة اليمين مش في النص
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50" onClick={onClose}>
      <div
        className={`bg-white w-full max-w-md h-full overflow-y-auto shadow-soft transform transition-transform duration-300 ease-out ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هيدر الـ panel: ORDER DETAIL + رقم الطلب + زرار الإغلاق */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-koda-border">
          <div>
            <p className="text-[11px] tracking-[0.2em] font-bold text-koda-muted">ORDER DETAIL</p>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1">{order.shortId}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 text-sm">
          {/* صف الحالة + حالة الدفع + طريقة الدفع */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusPill status={order.status} />
              <PaymentPill status={order.paymentStatus} />
            </div>
            <span className="text-koda-muted capitalize">{order.paymentMethod}</span>
          </div>

          {/* قسم INFO */}
          <div>
            <p className="text-[11px] font-bold text-koda-muted uppercase tracking-wide mb-2">Info</p>
            <div className="border border-koda-border rounded-xl2 divide-y divide-koda-border">
              <div className="px-4 py-3">
                <Row label="Placed" value={formatDate(order.date)} />
              </div>
              <div className="px-4 py-3">
                <Row label="Customer" value={order.customerName || '—'} />
              </div>
              <div className="px-4 py-3">
                <Row label="Email" value={order.customerEmail || '—'} />
              </div>
              <div className="px-4 py-3">
                <Row label="Ship to" value={order.shippingAddress || '—'} />
              </div>
            </div>
          </div>

          {/* قسم ITEMS */}
          {order.items?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-koda-muted uppercase tracking-wide mb-2">
                Items ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 border border-koda-border rounded-xl2 px-3 py-2.5">
                    {/* صورة المنتج، أو مربع رمادي لو مفيش صورة */}
                    {item.image ? (
                      <img src={item.image} alt={item.name || 'product'} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 font-medium truncate">
                        {item.name || `منتج ${i + 1}`}
                      </p>
                      <p className="text-xs text-koda-muted">
                        × {item.quantity} · {formatCurrency(item.price)}
                      </p>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* قسم الأرقام: Subtotal / Shipping / Tax / Total */}
          <div className="border border-koda-border rounded-xl2 divide-y divide-koda-border">
            <div className="px-4 py-3">
              <Row label="Subtotal" value={formatCurrency(order.subtotal ?? order.total)} />
            </div>
            <div className="px-4 py-3">
              <Row label="Shipping" value={formatCurrency(order.shipping)} />
            </div>
            <div className="px-4 py-3">
              <Row label={`Tax (${order.taxRate}%)`} value={formatCurrency(order.tax ?? 0)} />
            </div>
            <div className="px-4 py-3">
              <Row
                label={<span className="font-bold text-slate-800">Total</span>}
                value={<span className="font-bold text-slate-900">{formatCurrency(order.total)}</span>}
              />
            </div>
          </div>

          {/* ملاحظة العميل لو موجودة */}
          {order.customerNote && (
            <div>
              <p className="text-[11px] font-bold text-koda-muted uppercase tracking-wide mb-2">Customer note</p>
              <div className="border border-koda-border rounded-xl2 px-4 py-3 text-slate-600 italic">
                "{order.customerNote}"
              </div>
            </div>
          )}

          {/* قسم تحديث الحالة: شغال فعليًا وبيستخدم دالة updateStatus الموجودة */}
          <div>
            <p className="text-[11px] font-bold text-koda-muted uppercase tracking-wide mb-2">Update status</p>
            <div className="relative mb-3">
              <button
                type="button"
                onClick={() => !updating && setStatusOpen((o) => !o)}
                disabled={updating}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-koda-border bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-koda-teal/40 focus:border-koda-teal capitalize disabled:opacity-60 disabled:cursor-wait"
              >
                {statusValue}
                <ChevronDown className={`w-4 h-4 text-koda-muted transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
              </button>

              {statusOpen && (
                <>
                  {/* أوفرلاي شفاف بيقفل القائمة لو دوسنا في أي حتة برة */}
                  <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                  <div className="absolute z-50 mt-2 w-full bg-white border border-koda-border rounded-lg shadow-soft py-1 overflow-hidden">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setStatusValue(opt)
                          setStatusOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2 text-sm capitalize transition-colors hover:bg-slate-50 ${
                          opt === statusValue ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ملاحظة إضافية للأدمن (عرض/تحرير محلي بس، لسه مش متبعتة للسيرفر) */}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ملاحظة اختيارية..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-koda-border bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-koda-teal/40 focus:border-koda-teal resize-none mb-3"
            />

            <button
              type="button"
              onClick={handleSave}
              disabled={updating}
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {updating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// كومبوننت مساعد بسيط: صف بيانات (Label + Value)
// بيتستخدم جوه المودال عشان يوحد شكل كل صف بيانات



function Row({ label, value, className = '' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-koda-muted">{label}</span>
      <span className={`font-medium text-slate-800 ${className}`}>{value}</span>
    </div>
  )
}
