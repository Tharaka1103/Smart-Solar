'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useToastContext } from '@/contexts/toast-context'

export function ToastDemo() {
  const { successt, errort, warningt, infot, dismissAll } = useToast()
  const { position, setPosition } = useToastContext()
  
  const positions: Array<typeof position> = [
    'top-right', 'top-left', 'bottom-right', 
    'bottom-left', 'top-center', 'bottom-center'
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() =>
            successt({
              title: 'Success!',
              description: 'Your action was completed successfully.',
            })
          }
          className="bg-green-600 hover:bg-green-700"
        >
          Success Toast
        </Button>
        
        <Button
          onClick={() =>
            errort({
              title: 'Error!',
              description: 'There was a problem with your request.',
            })
          }
          className="bg-red-600 hover:bg-red-700"
        >
          Error Toast
        </Button>
        
        <Button
          onClick={() =>
            warningt({
              title: 'Warning!',
              description: 'This action might have consequences.',
            })
          }
          className="bg-amber-600 hover:bg-amber-700"
        >
          Warning Toast
        </Button>
        
        <Button
          onClick={() =>
            infot({
              title: 'Information',
              description: 'Here is some information you might need.',
              action: {
                label: 'Learn More',
                onClick: () => window.open('https://your-docs-url.com', '_blank'),
              }
            })
          }
          className="bg-blue-600 hover:bg-blue-700"
        >
          Info Toast
        </Button>
        
        <Button
          onClick={dismissAll}
          variant="outline"
        >
          Dismiss All
        </Button>
      </div>
      
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-medium">Toast Position</h3>
        <div className="flex flex-wrap gap-2">
          {positions.map((pos) => (
            <Button
              key={pos}
              variant={position === pos ? "default" : "outline"}
              onClick={() => setPosition(pos)}
              size="sm"
            >
              {pos}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
