"use client"
import * as React from 'react'

type Toast = { id: number; title?: string; description?: string }

const ToastContext = React.createContext<{
  toasts: Toast[]
  show: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
} | null>(null)

export function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const show = (t: Omit<Toast, 'id'>) => setToasts((prev) => [...prev, { id: Date.now(), ...t }])
  const dismiss = (id: number) => setToasts((prev) => prev.filter((x) => x.id !== id))
  return (
    <ToastContext.Provider value={{ toasts, show, dismiss }}>
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} role="status" aria-live="polite" className="rounded-md border border-gray-200 bg-white shadow px-4 py-3">
            {t.title ? <div className="font-medium">{t.title}</div> : null}
            {t.description ? <div className="text-sm text-gray-600">{t.description}</div> : null}
            <button className="mt-2 text-sm text-blue-600 underline" onClick={() => dismiss(t.id)}>Dismiss</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within Toaster')
  return ctx
}
