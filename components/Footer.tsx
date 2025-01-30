import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-footer">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-[100px] h-[40px] md:w-[120px] md:h-[48px]">
                  <Image 
                    src="/logo.png" 
                    alt="SolarTech Solutions" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link> 
            </div>
            <p className="">
              Powering a sustainable future through innovative solar solutions. We're committed to making clean energy accessible to everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/services', text: 'Solar Installation' },
                { href: '/products', text: 'Solar Panels' },
                { href: '/calculator', text: 'Energy Calculator' },
                { href: '/about', text: 'About Us' }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-yellow-400 transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-primary" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-primary" />
                <span>info@solartech.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary" />
                <span>123 Solar Street, Sunshine City, SC 12345</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Updated</h4>
            <p className="">Subscribe to our newsletter for solar tips and updates.</p>
            <form className="space-y-2" >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-background border border-primary focus:outline-none focus:border-yellow-400"
              />
              <button 
                type="submit"
                className="w-full bg-footer text-primary py-2 rounded border border-primary font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-primary">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              {[
                { Icon: FaFacebookF, href: '#' },
                { Icon: FaTwitter, href: '#' },
                { Icon: FaInstagram, href: '#' },
                { Icon: FaLinkedinIn, href: '#' }
              ].map(({ Icon, href }, index) => (
                <Link 
                  key={index} 
                  href={href} 
                  className="hover:text-primary transition-colors"
                >
                  <Icon />
                </Link>
              ))}
            </div>
            <div className="text-sm ">
              © {new Date().getFullYear()} SolarTech Solutions. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
