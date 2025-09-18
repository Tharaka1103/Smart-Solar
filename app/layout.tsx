"use client"

import { ReactNode, useEffect } from "react"
import { SessionProvider, useSession, signOut } from "next-auth/react"
import type { Metadata } from "next"
import { Abril_Fatface, Montserrat, Merienda  } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { AuthProvider } from "@/lib/auth-context"
import { ToastProvider } from '@/contexts/toast-context'
import { Toaster } from '@/components/ui/toaster'

// Create a component to check session validity
function SessionCheck({ children }: { children: ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    // If we have a session but it's invalid or expired
    if (session && (session as any).error === "RefreshAccessTokenError") {
      // Force sign out
      signOut({ callbackUrl: "/" })
    }
  }, [session])

  return <>{children}</>
}

// Import Abril Fatface and Montserrat fonts
const abrilFatface = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abril-fatface",
})
const merienda = Merienda({
  subsets: ["latin"],
  variable: "--font-merienda",
})
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${abrilFatface.variable} ${montserrat.variable} ${merienda.variable}`}>
      <body>
        <div>
          <AuthProvider>
            <ThemeProvider>
              <ToastProvider>
                {children}
                <Toaster />
              </ToastProvider>
            </ThemeProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
