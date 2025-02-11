  'use client';

  import { useState } from 'react';
  import { Plus, Search, Edit, Trash2, Sun, Battery, Package } from 'lucide-react';
  import { motion } from 'framer-motion';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
  import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
  import { Label } from '@/components/ui/label';

  export default function ProductsPage() {
    const [products, setProducts] = useState([
      {
        id: 1,
        name: 'Solar Panel X1000',
        category: 'Panels',
        price: 999.99,
        efficiency: '21%',
        warranty: '25 years',
        power: '400W',
        stock: 50,
        image: '/products/solar-panel-1.jpg'
      },
      {
        id: 2,
        name: 'Premium Solar Panel Pro',
        category: 'Panels',
        price: 1299.99,
        efficiency: '23%',
        warranty: '30 years',
        power: '500W',
        stock: 35,
        image: '/products/solar-panel-2.jpg'
      },
      {
        id: 3,
        name: 'SolarTech Inverter 5000',
        category: 'Inverters',
        price: 799.99,
        efficiency: '98%',
        warranty: '10 years',
        power: '5000W',
        stock: 25,
        image: '/products/inverter-1.jpg'
      },
      {
        id: 4,
        name: 'PowerMax Inverter',
        category: 'Inverters',
        price: 1099.99,
        efficiency: '97%',
        warranty: '12 years',
        power: '7500W',
        stock: 20,
        image: '/products/inverter-2.jpg'
      },
      {
        id: 5,
        name: 'EcoStorage Battery Pack',
        category: 'Batteries',
        price: 3499.99,
        efficiency: '95%',
        warranty: '15 years',
        power: '10kWh',
        stock: 15,
        image: '/products/battery-1.jpg'
      },
      {
        id: 6,
        name: 'PowerWall Ultra',
        category: 'Batteries',
        price: 4999.99,
        efficiency: '96%',
        warranty: '20 years',
        power: '15kWh',
        stock: 10,
        image: '/products/battery-2.jpg'
      },
      {
        id: 7,
        name: 'Solar Panel Mounting Kit',
        category: 'Accessories',
        price: 199.99,
        efficiency: 'N/A',
        warranty: '10 years',
        power: 'N/A',
        stock: 100,
        image: '/products/mounting-kit.jpg'
      },
      {
        id: 8,
        name: 'Solar Cable Set',
        category: 'Accessories',
        price: 89.99,
        efficiency: 'N/A',
        warranty: '5 years',
        power: 'N/A',
        stock: 150,
        image: '/products/cable-set.jpg'
      }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const categories = ['Panels', 'Inverters', 'Batteries', 'Accessories'];

    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    const handleDelete = (id: number) => {
      setProducts(products.filter(p => p.id !== id));
    };

    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Solar Products Management</h1>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Filter by Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={() => setFilterCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardTitle className="flex justify-between items-center">
                      <span>{product.name}</span>
                      <span className="text-green-600">${product.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{product.power}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span>{product.efficiency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4" />
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new solar product.
              </DialogDescription>
            </DialogHeader>
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label>Price</Label>
                  <Input id="price" name="price" type="number" step="0.01" required />
                </div>
                <div className="grid gap-2">
                  <Label>Image URL</Label>
                  <Input id="image" name="image" required />
                </div>
                <div className="grid gap-2">
                  <Label>Power</Label>
                  <Input id="power" name="power" required />
                </div>
                <div className="grid gap-2">
                  <Label>Efficiency</Label>
                  <Input id="efficiency" name="efficiency" required />
                </div>
                <div className="grid gap-2">
                  <Label>Stock</Label>
                  <Input id="stock" name="stock" type="number" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Product</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>    
        </div>
    );
  }
