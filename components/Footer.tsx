
import { FaSun, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-footer">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaSun className="text-yellow-400 text-2xl" />
              <h3 className="text-xl font-bold">SolarTech Solutions</h3>
            </div>
            <p className="text-gray-300">
              Powering a sustainable future through innovative solar solutions. We're committed to making clean energy accessible to everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/services" className="hover:text-yellow-400 transition-colors">Solar Installation</a></li>
              <li><a href="/products" className="hover:text-yellow-400 transition-colors">Solar Panels</a></li>
              <li><a href="/calculator" className="hover:text-yellow-400 transition-colors">Energy Calculator</a></li>
              <li><a href="/about" className="hover:text-yellow-400 transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-yellow-400" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-yellow-400" />
                <span>info@solartech.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-yellow-400" />
                <span>123 Solar Street, Sunshine City, SC 12345</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Updated</h4>
            <p className="text-gray-300">Subscribe to our newsletter for solar tips and updates.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-blue-800 border border-blue-700 focus:outline-none focus:border-yellow-400"
              />
              <button className="w-full bg-yellow-400 text-blue-900 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-blue-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <a href="#" className="hover:text-yellow-400 transition-colors"><FaFacebookF /></a>
              <a href="#" className="hover:text-yellow-400 transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-yellow-400 transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-yellow-400 transition-colors"><FaLinkedinIn /></a>
            </div>
            <div className="text-sm text-gray-300">
              © {new Date().getFullYear()} SolarTech Solutions. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
