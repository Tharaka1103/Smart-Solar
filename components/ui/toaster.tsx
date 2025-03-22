'use client'

import { AnimatePresence } from 'framer-motion'
import { useToastContext } from '@/contexts/toast-context'
import { Toast } from './toast'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts, position } = useToastContext()
  
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  }
  
  const isTop = position.startsWith('top')
  
  return (
    <div
      className={cn(
        "fixed z-[100] flex flex-col gap-2 p-4 w-full sm:max-w-md",
        positionClasses[position]
      )}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
