// statusbadge.jsx

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

export function StatusPill({ status }) {
  const key = (status || 'pending').toLowerCase()
  const style = STATUS_STYLES[key] || 'bg-slate-100 text-slate-600'
  const dot = DOT_STYLES[key] || 'bg-slate-400'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize shadow-sm ${style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {key}
    </span>
  )
}

export function PaymentPill({ status }) {
  const key = (status || 'pending').toLowerCase()
  const style =
    key === 'paid'
      ? 'bg-emerald-100 text-emerald-700'
      : key === 'failed'
      ? 'bg-rose-100 text-rose-700'
      : 'bg-amber-100 text-amber-700'
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm ${style}`}>
      {key.toUpperCase()}
    </span>
  )
}