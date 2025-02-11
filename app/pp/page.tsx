import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#f5f8f0]">
      {/* Navigation */}
      <nav className="p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-start">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image 
                src="/leaf-logo.svg" 
                alt="Healthy Food" 
                width={32} 
                height={32}
              />
            </div>
            <span className="text-[#4a6741] font-medium">HEALTHY FOOD</span>
          </div>
          
          {/* Navigation Links */}
          <div className="px-6 py-2 bg-[#e3f0d8] rounded-full">
            <div className="hidden md:flex gap-8">
              <Link href="/" className="text-[#b5956a] hover:text-[#8e734f]">Home</Link>
              <Link href="/about" className="text-[#4a6741] hover:text-[#3a5233]">About</Link>
              <Link href="/contact" className="text-[#4a6741] hover:text-[#3a5233]">Contact</Link>
              <Link href="/tips" className="text-[#4a6741] hover:text-[#3a5233]">Tips</Link>
              <Link href="/blog" className="text-[#4a6741] hover:text-[#3a5233]">Blog</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between">
          {/* Left Content */}
          <div className="md:w-1/2 space-y-6 z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-[#b5956a]">
              DELIVERY
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-[#4a6741]">
              ORDER NOW
            </h2>
            <p className="text-gray-500 max-w-md">
              Lorem ipsum dolor sit amet, consecte itura dipiscing elit, sed do eiusmod tempor incid idunt ut labore et dolore magna
            </p>
            
            {/* Country Selection */}
            <div className="space-y-4 max-w-md">
              <div className="relative">
                <select 
                  className="w-full p-4 rounded-lg border border-gray-200 bg-white appearance-none text-gray-400"
                  defaultValue=""
                >
                  <option value="" disabled>Enter Your Country</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <button className="px-8 py-3 bg-[#8ab073] hover:bg-[#789b64] text-white rounded-lg transition-colors">
                ORDER NOW
              </button>
            </div>

            {/* Small Avocado Icons */}
            <div className="flex gap-32 mt-8">
              <Image 
                src="/avocado-icon.svg" 
                alt="Avocado" 
                width={32} 
                height={32}
                className="opacity-60"
              />
              <Image 
                src="/avocado-icon.svg" 
                alt="Avocado" 
                width={32} 
                height={32}
                className="opacity-60"
              />
            </div>
          </div>

          {/* Right Content - Overlapping Image */}
          <div className="md:w-1/2 md:absolute right-0 top-0 h-full">
            <div className="relative w-full h-full min-h-[600px]">
              <Image
                src="/banner.jpg"
                alt="Healthy Food"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[#4a6741]">www.healthy.com</p>
            <div className="flex gap-6">
              <Link href="#" className="text-[#4a6741] hover:text-[#3a5233]">
                <FaInstagram size={24} />
              </Link>
              <Link href="#" className="text-[#4a6741] hover:text-[#3a5233]">
                <FaFacebook size={24} />
              </Link>
              <Link href="#" className="text-[#4a6741] hover:text-[#3a5233]">
                <FaTwitter size={24} />
              </Link>
              <Link href="#" className="text-[#4a6741] hover:text-[#3a5233]">
                <FaWhatsapp size={24} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage