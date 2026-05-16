interface TabsProps<T extends string> {
  tabs: readonly T[]
  activeTab: T
  onChange: (tab: T) => void
  labels?: Partial<Record<T, string>>
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  labels,
}: TabsProps<T>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const isActive = tab === activeTab

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={[
              'whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
              isActive
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm'
                : 'bg-white text-slate-600 ring-1 ring-emerald-100 hover:bg-emerald-50 hover:text-emerald-700',
            ].join(' ')}
          >
            {labels?.[tab] ?? tab}
          </button>
        )
      })}
    </div>
  )
}