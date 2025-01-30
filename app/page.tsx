'use client'
import Image from "next/image";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section id="home" className="pb-20 md:pt-20 md:pb-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Power Your Future with Smart Solar Solutions
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Transform your energy consumption with our cutting-edge solar technology. Save money while saving the planet.
            </p>
            <div className="flex gap-4">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-border px-6 py-3 rounded-lg hover:bg-muted transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative h-[400px] w-[350px] rounded-xl overflow-hidden">
            <Image 
              src="/hero-bg.png" 
              alt="Solar Panel Installation" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
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
      <section className="py-16">
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
              { name: "Solar Panels", price: "From $299" },
              { name: "Inverters", price: "From $199" },
              { name: "Batteries", price: "From $499" },
              { name: "Monitoring Systems", price: "From $99" },
            ].map((product, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-all">
                <div className="aspect-square bg-background rounded-lg mb-4"></div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-primary">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
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
      <section id="contact" className="py-12">
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
  );
}
