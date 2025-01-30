'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Search, ChevronDown } from 'lucide-react'

const products = [
  {
    id: 1,
    name: "Premium Solar Panel X1",
    category: "Solar Panels",
    price: 299.99,
    rating: 4.8,
    image: "/solar.jpg",
    description: "High-efficiency monocrystalline solar panel with 25-year warranty",
    specs: ["400W Output", "72 Cell", "21% Efficiency"]
  },
  {
    id: 2,
    name: "Smart Inverter Pro",
    category: "Inverters",
    price: 199.99,
    rating: 4.7,
    image: "/solar.jpg",
    description: "Advanced grid-tie inverter with smart monitoring capabilities",
    specs: ["5kW", "97% Efficiency", "WiFi Enabled"]
  },
  {
    id: 3,
    name: "PowerWall Battery",
    category: "Batteries",
    price: 599.99,
    rating: 4.9,
    image: "/solar.jpg",
    description: "High-capacity lithium battery for reliable energy storage",
    specs: ["10kWh", "10-year warranty", "Smart BMS"]
  },
  {
    id: 4,
    name: "Solar Edge Optimizer",
    category: "Optimizers",
    price: 89.99,
    rating: 4.6,
    image: "/solar.jpg",
    description: "Power optimizer for maximum solar panel performance",
    specs: ["99.5% Efficiency", "Module-level MPPT", "Safety Shutdown"]
  }
]

const categories = ["All", "Solar Panels", "Inverters", "Batteries", "Optimizers"]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our range of high-quality solar products designed for maximum efficiency and reliability
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
              <div className="relative w-full md:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-4 py-2 rounded-lg border border-border bg-background focus:border-primary outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all duration-300 group"
            >
              <div className="relative h-48 bg-background">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                    ★ {product.rating}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.specs.map((spec, index) => (
                    <span
                      key={index}
                      className="text-xs bg-background px-2 py-1 rounded-full border border-border"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${product.price}</span>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
