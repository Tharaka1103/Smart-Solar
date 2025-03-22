'use client'

import dynamic from 'next/dynamic'

// Dynamically import the Toaster with SSR disabled
const Toaster = dynamic(
  () => import('./toaster').then(mod => mod.Toaster),
  { ssr: false } // This is the key - prevents server-side rendering
)

export function ClientToaster() {
  return <Toaster />
}
