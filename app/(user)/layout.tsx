import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from '@/components/Header'
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from '@/contexts/toast-context'
import { Toaster } from '@/components/ui/toaster'
import ChatBot from "@/components/ChatBot";
import { PreLoader } from "@/components/PreLoader";  // We'll create this component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luminex Engineering",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <PreLoader />
              <Header />
              {children}  
              <ChatBot />
              <Toaster />
              <Footer />
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
  );
}
