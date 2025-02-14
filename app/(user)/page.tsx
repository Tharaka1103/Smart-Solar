'use client'
import Image from "next/image";
import { ArrowRight, Phone, Mail, MapPin, Link } from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useTheme } from '@/providers/ThemeProvider'

export default function Home() {
  const { theme } = useTheme()
  return (
    <div className="min-h-screen bg-background relative">
      {/* Hero Section */}
      <section className="fixed top-0 left-0 w-full h-screen flex items-center overflow-hidden">
              {/* Background Banner */}
              <div className="absolute inset-0 md:right-0 md:left-auto md:w-1/2 h-full z-0">
                <Image
                  src="/banner1.jpg"
                  alt="Solar Banner"
                  fill
                  className="object-cover opacity-40 md:opacity-100"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background md:block"></div>
              </div>

              {/* Sun/Moon Image */}
              <div className="absolute right-3 top-3 w-[300px] h-[300px] hidden md:block">
                {theme === 'dark' ? (
                  <Image
                    src="/moon.png"
                    alt="Moon"
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <Image
                    src="/sun.png"
                    alt="Sun"
                    fill
                    className="object-contain"
                    priority
                  />
                )}
              </div>

              {/* Solar Panel 3D Image */}
              <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[600px] h-[400px] animate-float z-10 hidden lg:block">
                <Image
                  src="/hero-bg.png"
                  alt="Solar Panel"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
      
              {/* Content */}
              <div className="container mx-auto px-4 z-20 mt-10">
                <div className="max-w-2xl">
                  <div className="overflow-hidden">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slideUp">
                      Power Your Future With
                      <span className="text-primary block mt-2 animate-morphText">
                        Smart Solar Solutions
                      </span>
                    </h1>
                  </div>
                  
                  <p className="text-xl mb-8 animate-fadeIn">
                    Transform your energy consumption with our innovative solar solutions. 
                    Sustainable, efficient, and future-ready.
                  </p>
      
                  <div className="flex flex-col sm:flex-row gap-4 animate-slideUp delay-300">
                    <button className="px-8 py-3 bg-primary text-white rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors group">
                      Get Started
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      type="submit"
                      className="px-8 py-3 text-primary rounded-full border border-primary font-semibold relative overflow-hidden group"
                    >
                      <span className="relative z-10 group-hover:text-white transition-colors duration-700">Learn More</span>
                      <div className="absolute inset-0 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"></div>
                    </button>
                  </div>
      
                  {/* Stats */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn delay-500">
                    <div className="flex flex-wrap gap-6 items-center">
                      <a href="#" className="text-2xl hover:text-primary transition-colors" aria-label="Twitter">
                        <FaTwitter size={24} />
                      </a>
                      <a href="#" className="text-2xl hover:text-primary transition-colors" aria-label="Facebook">
                        <FaFacebook size={24} />
                      </a>
                      <a href="#" className="text-2xl hover:text-primary transition-colors" aria-label="Instagram">
                        <FaInstagram size={24} />
                      </a>
                      <a href="#" className="text-2xl hover:text-primary transition-colors" aria-label="LinkedIn">
                        <FaLinkedin size={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Animated Particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-[20%] w-2 h-2 bg-primary rounded-full animate-float"></div>
                <div className="absolute top-40 left-[60%] w-3 h-3 bg-primary rounded-full animate-float delay-300"></div>
                <div className="absolute top-60 left-[80%] w-2 h-2 bg-primary rounded-full animate-float delay-700"></div>
              </div>
      </section>

      {/* Content that scrolls over hero */}
      <div className="relative z-10 mt-[90vh]">
      <section id="services" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Residential Solar",
                description: "Custom solar solutions for your home",
                icon: "🏠"
              },
              {
                title: "Commercial Solar",
                description: "Power your business sustainably",
                icon: "🏢"
              },
              {
                title: "Energy Storage",
                description: "Advanced battery solutions",
                icon: "🔋"
              }
            ].map((service, index) => (
              <div key={index} className="p-6 rounded-xl bg-card border border-border hover:border-primary transition-colors">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Why Choose Us Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Smart Solar</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "10+", text: "Years Experience" },
              { number: "500+", text: "Projects Completed" },
              { number: "98%", text: "Customer Satisfaction" },
              { number: "24/7", text: "Support Available" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Installation Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Consultation", description: "Free site assessment and custom solution design" },
              { step: "2", title: "Installation", description: "Professional installation by certified experts" },
              { step: "3", title: "Activation", description: "System testing and grid connection" },
            ].map((process, index) => (
              <div key={index} className="relative p-6 border border-border rounded-xl">
                <div className="absolute -top-4 left-4 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold mt-4 mb-2">{process.title}</h3>
                <p className="text-muted-foreground">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Solar Panels", price: "From $299", image: "/solar.jpg" },
              { name: "Inverters", price: "From $199", image: "/solar.jpg" },
              { name: "Batteries", price: "From $499", image: "/solar.jpg" },
              { name: "Monitoring Systems", price: "From $99", image: "/solar.jpg" },
            ].map((product, index) => (
              <div key={index} className="group bg-card p-6 rounded-xl border border-border hover:border-primary transition-all duration-300">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    priority={index === 0}
                  />
                </div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-primary mt-2">{product.price}</p>
                <button className="w-full mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "John Smith", role: "Homeowner", text: "Best investment we have made for our home. The savings are incredible!" },
              { name: "Sarah Johnson", role: "Business Owner", text: "Smart Solar transformed our energy costs. Highly recommended!" },
              { name: "Mike Williams", role: "Property Manager", text: "Professional service from start to finish. Excellent support team!" },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-card rounded-xl border border-border">
                <p className="mb-4 text-muted-foreground">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full"></div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Switch to Solar?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made the smart choice for a sustainable future.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-background text-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Get Free Quote
            </button>
            <button className="bg-primary-foreground text-primary px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
        {/* Contact Section */}
        <section id="contact" className="bg-background py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+1 (234) 567-8900</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>contact@smartsolar.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>123 Solar Street, Energy City, EC 12345</span>
                </div>
              </div>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                ></textarea>
                <button className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
