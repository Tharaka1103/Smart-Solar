'use client'

import React, { createContext, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface Toast {
  id: string
  title: string
  description?: string
  status?: "info" | "success" | "warning" | "error"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
  dismissAll: () => void
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  setPosition: (position: ToastContextType['position']) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [position, setPosition] = useState<ToastContextType['position']>('bottom-right')

  const toast = (newToast: Omit<Toast, 'id'>) => {
    const id = uuidv4()
    const toast = { id, ...newToast }
    
    setToasts((current) => [...current, toast])
    
    if (newToast.duration !== 0) {
      setTimeout(() => {
        dismiss(id)
      }, newToast.duration || 5000)
    }
  }

  const dismiss = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  const dismissAll = () => {
    setToasts([])
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll, position, setPosition }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  
  return context
}
