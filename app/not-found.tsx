'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Search, Home, Phone, Mail, MapPin, Clock, Lightbulb, Zap, Sun, Shield, Wrench, ChevronRight, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('')

  const quickLinks = [
    { href: '/services', label: 'Solar Installation', icon: Sun },
    { href: '/products', label: 'Solar Products', icon: Zap },
    { href: '/maintenance', label: 'Maintenance', icon: Wrench },
    { href: '/about', label: 'About Us', icon: Lightbulb },
  ]

  const helpfulLinks = [
    { href: '/services/residential', label: 'Residential Solar Solutions' },
    { href: '/services/commercial', label: 'Commercial Solar Systems' },
    { href: '/calculator', label: 'Solar Calculator' },
    { href: '/financing', label: 'Financing Options' },
    { href: '/warranty', label: 'Warranty Information' },
    { href: '/faq', label: 'Frequently Asked Questions' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="text-center mb-16">
          {/* Animated Solar Panel Illustration */}
          <div className="relative w-80 h-80 mx-auto mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/404notfound.png"
                alt="404 Solar Panel Illustration"
                width={320}
                height={320}
                className="object-contain drop-shadow-2xl"
                priority
              />
              {/* Floating elements */}
              <div className="absolute top-8 right-8 w-6 h-6 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
              <div className="absolute bottom-12 left-12 w-4 h-4 bg-primary rounded-full animate-bounce delay-300"></div>
              <div className="absolute top-16 left-8 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-500"></div>
            </div>
          </div>
          
          {/* Error Message */}
          <div className="space-y-6 mb-12">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Looks like this solar panel is off the grid! The page you're looking for seems to have powered down. 
              Let's get you back to generating some clean energy solutions.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search for solar solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border border-border bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-all"
              >
                Search
              </button>
            </form>
          </div>

          {/* Primary Action */}
          <Link 
            href="/"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-300 mb-8"
          >
            <Home className="w-5 h-5" />
            Return to Homepage
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Quick Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickLinks.map((link) => {
            const IconComponent = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Helpful Links Section */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Popular Solutions</h3>
            </div>
            <div className="space-y-3">
              {helpfulLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 transition-colors group"
                >
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Support Section */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Need Immediate Help?</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Our solar energy experts are standing by to help you find the perfect solution for your energy needs.
            </p>
            
            <div className="space-y-4">
              {/* Phone */}
              <a 
                href="tel:+12345678900"
                className="flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-primary/10 transition-colors group"
              >
                <div className="p-2 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Call Us Now</p>
                  <p className="text-sm text-muted-foreground">+1 (234) 567-8900</p>
                </div>
              </a>

              {/* Email */}
              <a 
                href="mailto:contact@smartsolar.com"
                className="flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-primary/10 transition-colors group"
              >
                <div className="p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email Support</p>
                  <p className="text-sm text-muted-foreground">contact@smartsolar.com</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                <div className="p-2 rounded-full bg-orange-100">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Visit Our Office</p>
                  <p className="text-sm text-muted-foreground">123 Solar Ave, Green City</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                <div className="p-2 rounded-full bg-purple-100">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Business Hours</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 8AM-6PM | Sat: 9AM-4PM</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-800 mb-1">24/7 Emergency Service</p>
              <p className="text-sm text-red-600">For urgent solar system issues: +1 (234) 567-8911</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8">
            <Sun className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Go Solar?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Don't let this detour stop your journey to clean energy. Get a free consultation and discover how much you can save with solar power.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-lg"
              >
                Get Free Quote
              </Link>
              <Link
                href="/calculator"
                className="border border-border text-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/10 transition-all"
              >
                Solar Calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Solar Blog</Link>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            © 2024 Smart Solar. Powering a sustainable future.
          </p>
        </div>
      </div>
    </div>
  )
}
