'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowRight } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-footer relative">
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div className="space-y-6">
            <Link href="/" className="block transform hover:scale-105 transition-transform duration-300">
              <div className="relative w-[120px] h-[48px] md:w-[140px] md:h-[56px]">
                <Image 
                  src="/logo.png" 
                  alt="SolarTech Solutions" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-lg leading-relaxed  hover: transition-colors">
              Pioneering sustainable energy solutions since 2010. Transforming the way the world harnesses solar power with cutting-edge technology and unmatched expertise.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-primary font-semibold">Rating:</span>
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="space-y-6">
            <h4 className="text-xl font-bold  relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/services', text: 'Solar Installation', icon: '🔧' },
                { href: '/products', text: 'Solar Panels', icon: '☀️' },
                { href: '/calculator', text: 'Energy Calculator', icon: '🔢' },
                { href: '/about', text: 'About Us', icon: '👥' },
                { href: '/blog', text: 'Solar Blog', icon: '📝' },
                { href: '/testimonials', text: 'Success Stories', icon: '⭐' }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center space-x-2  hover:text-primary transition-all duration-300">
                    <span>{link.icon}</span>
                    <span>{link.text}</span>
                    <FaArrowRight className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div className="space-y-6">
            <h4 className="text-xl font-bold  relative inline-block">
              Get in Touch
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <div className="space-y-4">
              <a href="tel:5551234567" className="flex items-center gap-4 p-3 rounded-lg bg-footer-light hover:bg-primary/20 transition-all duration-300">
                <div className="bg-primary rounded-full p-2">
                  <FaPhoneAlt className="" />
                </div>
                <div>
                  <p className="text-sm ">Call Us</p>
                  <p className="">(555) 123-4567</p>
                </div>
              </a>
              <a href="mailto:info@solartech.com" className="flex items-center gap-4 p-3 rounded-lg bg-footer-light hover:bg-primary/20 transition-all duration-300">
                <div className="bg-primary rounded-full p-2">
                  <FaEnvelope className="" />
                </div>
                <div>
                  <p className="text-sm ">Email Us</p>
                  <p className="">info@solartech.com</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-footer-light hover:bg-primary/20 transition-all duration-300">
                <div className="bg-primary rounded-full p-2">
                  <FaMapMarkerAlt className="" />
                </div>
                <div>
                  <p className="text-sm ">Visit Us</p>
                  <p className="">123 Solar Street, Sunshine City, SC 12345</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div className="space-y-6">
            <h4 className="text-xl font-bold  relative inline-block">
              Newsletter
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <p className="">Join our community and stay informed about solar innovations and exclusive offers.</p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-footer-light border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-300  placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 ">✉️</div>
              </div>
              <button 
                type="submit"
                className="w-full bg-primary  py-3 rounded-lg font-semibold hover:bg-primary-dark transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/50"
              >
                Subscribe Now
              </button>
            </form>
          </motion.div>
        </div>

        {/* Social Links & Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex space-x-6">
              {[
                { Icon: FaFacebookF, href: '#', color: '#1877F2' },
                { Icon: FaTwitter, href: '#', color: '#1DA1F2' },
                { Icon: FaInstagram, href: '#', color: '#E4405F' },
                { Icon: FaLinkedinIn, href: '#', color: '#0A66C2' }
              ].map(({ Icon, href, color }, index) => (
                <Link 
                  key={index} 
                  href={href} 
                  className="bg-footer-light p-3 rounded-full hover:bg-primary transition-all duration-300 transform hover:scale-110"
                >
                  <Icon className="text-xl" style={{ color }} />
                </Link>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className=" text-sm">
                © {new Date().getFullYear()} SolarTech Solutions. All rights reserved.
              </p>
              <div className="flex items-center justify-center md:justify-end space-x-4 mt-2 text-sm">
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
