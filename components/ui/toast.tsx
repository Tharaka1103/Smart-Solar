'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  CheckCircle, AlertCircle, 
  Info, AlertTriangle, X
} from 'lucide-react'
import { Toast as ToastType } from '@/contexts/toast-context'
import { useToastContext } from '@/contexts/toast-context'

interface ToastProps {
  toast: ToastType
}

export function Toast({ toast }: ToastProps) {
  const { dismiss } = useToastContext()
  
  const statusIcon = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }
  
  const icon = toast.status ? statusIcon[toast.status] : null
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "relative flex w-full max-w-md overflow-hidden rounded-lg shadow-lg",
        "border bg-background p-4 pr-12",
        toast.status === "success" && "border-green-600  bg-green-200 text-black font-bold",
        toast.status === "error" && "border-red-600 bg-red-200 text-black font-bold",
        toast.status === "warning" && "border-amber-600 bg-amber-200 text-blac font-boldk",
        toast.status === "info" && "border-blue-500 bg-blue-50 text-black font-bold",
        !toast.status && "border-gray-200 dark:border-gray-800 "
      )}
    >
      <div className="flex gap-3">
        {icon && <div className="flex-shrink-0 self-start pt-0.5">{icon}</div>}
        <div className="flex-1">
          <div className="font-medium leading-none tracking-tight mb-1">
            {toast.title}
          </div>
          {toast.description && (
            <div className="text-sm opacity-90 mt-1">{toast.description}</div>
          )}
          {toast.action && (
            <div className="mt-3">
              <button
                onClick={toast.action.onClick}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium 
                  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
                  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none h-9 
                  rounded-md px-3 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => dismiss(toast.id)}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 
          opacity-70 transition-opacity hover:text-foreground hover:opacity-100 
          focus:opacity-100 focus:outline-none focus:ring-2"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
