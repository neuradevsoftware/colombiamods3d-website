import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('')
  const [on, setOn] = useState(false)
  const t = useRef()
  const toast = useCallback((m) => {
    setMsg(m); setOn(true)
    clearTimeout(t.current)
    t.current = setTimeout(() => setOn(false), 4200)
  }, [])
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div role="status" aria-live="polite"
        className={`pointer-events-none fixed left-1/2 z-300 max-w-[min(92vw,520px)] rounded-lg border border-amber bg-panel-2 px-4 py-3 text-base leading-[1.35] text-fg shadow-[0_18px_40px_-16px_rgba(0,0,0,.8)] transition-[opacity,transform] duration-[350ms] ease-soft bottom-[calc(24px+env(safe-area-inset-bottom,0px))] max-[760px]:bottom-[calc(88px+env(safe-area-inset-bottom,0px))] ${on ? 'opacity-100 [transform:translate(-50%,0)]' : 'opacity-0 [transform:translate(-50%,24px)]'}`}>
        {msg}
      </div>
    </ToastCtx.Provider>
  )
}
