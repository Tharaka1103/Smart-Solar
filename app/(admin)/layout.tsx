import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ToastProvider } from '@/contexts/toast-context'
import { Toaster } from '@/components/ui/toaster'
import { QuickAccessMenu } from "@/components/admin/QuickAccessMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luminex Admin Dashboard",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <ThemeProvider> 
            <ToastProvider>
              <main className="pt-16">
                <AdminHeader />
                {children}
                <QuickAccessMenu />
                <Toaster />
                <AdminFooter />
              </main>
            </ToastProvider>
          </ThemeProvider>
  );
}
