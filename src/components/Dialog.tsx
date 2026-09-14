import { useEffect, useRef, type ReactNode } from 'react'

export function Dialog({ children, titleId, alert = false, onClose }: { children: ReactNode; titleId: string; alert?: boolean; onClose: () => void }) {
  const panel = useRef<HTMLElement>(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true })
    return () => { if (previous?.isConnected) previous.focus() }
  }, [])
  return <div className="modal-backdrop">
    <section ref={panel} className="relic-dialog" role={alert ? 'alertdialog' : 'dialog'} aria-modal="true" aria-labelledby={titleId} onKeyDown={(event) => {
      if (event.key === 'Escape') { event.stopPropagation(); close.current(); return }
      if (event.key !== 'Tab') return
      const buttons = panel.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
      if (!buttons?.length) return
      const first = buttons[0], last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }}>{children}</section>
  </div>
}
