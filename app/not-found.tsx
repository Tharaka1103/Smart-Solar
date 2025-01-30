'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src="/404.png"
            alt="404 Solar Panel Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-primary bg-clip-text text-transparent">
          404: Page Not Found
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Looks like the solar panel we're looking for is in the dark. Let's get you back to a brighter path.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <Link 
              href="/services"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              View Our Services
            </Link>
            <Link 
              href="/contact"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact Support
            </Link>
            <Link 
              href="/products"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-card rounded-xl border border-border">
          <h2 className="font-semibold mb-2">Need Immediate Assistance?</h2>
          <p className="text-muted-foreground mb-4">Our solar experts are here to help</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a 
              href="tel:+12345678900"
              className="hover:text-primary transition-colors"
            >
              +1 (234) 567-8900
            </a>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <a 
              href="mailto:contact@smartsolar.com"
              className="hover:text-primary transition-colors"
            >
              contact@smartsolar.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
