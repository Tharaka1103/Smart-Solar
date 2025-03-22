"use client"
import { ReactNode, useEffect } from "react"
import { SessionProvider, useSession, signOut } from "next-auth/react"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from '@/contexts/toast-context'
import { Toaster } from '@/components/ui/toaster'


// Create a component to check session validity
function SessionCheck({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  
  useEffect(() => {
    // If we have a session but it's invalid or expired
    if (session && (session as any).error === "RefreshAccessTokenError") {
      // Force sign out
      signOut({ callbackUrl: "/" })
    }
  }, [session])  
  return <>{children}</>
}
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
  );
}
