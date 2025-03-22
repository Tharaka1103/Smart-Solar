import { useToastContext } from '@/contexts/toast-context'
import type { Toast } from '@/contexts/toast-context'

export function useToast() {
  const { toast, dismiss, dismissAll } = useToastContext()
  
  return {
    toast: (props: Omit<Toast, "id">) => toast(props),
    successt: (props: Omit<Omit<Toast, "id">, "status">) => 
      toast({ ...props, status: "success" }),
    errort: (props: Omit<Omit<Toast, "id">, "status">) => 
      toast({ ...props, status: "error" }),
    warningt: (props: Omit<Omit<Toast, "id">, "status">) => 
      toast({ ...props, status: "warning" }),
    infot: (props: Omit<Omit<Toast, "id">, "status">) => 
      toast({ ...props, status: "info" }),
    dismiss,
    dismissAll,
  }
}
