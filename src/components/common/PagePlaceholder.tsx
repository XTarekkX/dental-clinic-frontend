interface PagePlaceholderProps {
  title: string
  description: string
}

export function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>

      <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-8 text-sm text-emerald-800">
        This page shell is ready. Next we will implement the real content and connect it to the backend.
      </div>
    </div>
  )
}