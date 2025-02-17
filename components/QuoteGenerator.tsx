'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import html2canvas from 'html2canvas'
import { districts } from '@/lib/districts'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

interface QuoteDetails {
  name: string
  email: string
  phone: string
  district: string
  address: string
  roofArea: number
  monthlyBill: number
  systemSize?: number
  totalCost?: number
  deliveryCharge?: number
}

export default function QuoteGenerator() {
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails>({
    name: '',
    email: '',
    phone: '',
    district: '',
    address: '',
    roofArea: 0,
    monthlyBill: 0
  })
  const [loading, setLoading] = useState(false)
  const quoteRef = useRef<HTMLDivElement>(null)

  const calculateSystemSize = (monthlyBill: number): number => {
    // Average daily solar production per kW in Sri Lanka (4.5-6 peak sun hours)
    const avgDailyProductionPerKW = 5 * 30 // kWh per month
    const systemEfficiency = 0.8 // 80% system efficiency
    const requiredSystem = (monthlyBill / (avgDailyProductionPerKW * systemEfficiency))
    return Math.ceil(requiredSystem * 10) / 10 // Round to 1 decimal place
  }

  const calculateDeliveryCharge = (district: string): number => {
    const distanceMap: { [key: string]: number } = {
        'Kandy': 0,
        'Matale': 28,
        'Nuwara Eliya': 38,
        'Ampara': 198,
        'Anuradhapura': 128,
        'Badulla': 89,
        'Batticaloa': 207,
        'Colombo': 115,
        'Galle': 198,
        'Gampaha': 129,
        'Hambantota': 214,
        'Jaffna': 314,
        'Kalutara': 158,
        'Kegalle': 45,
        'Kilinochchi': 264,
        'Kurunegala': 72,
        'Mannar': 228,
        'Matara': 214,
        'Monaragala': 142,
        'Mullaitivu': 252,
        'Polonnaruwa': 122,
        'Puttalam': 155,
        'Ratnapura': 123,
        'Trincomalee': 159,
        'Vavuniya': 195
    }
      
    const distance = distanceMap[district] || 250
    const baseCharge = 500
    const ratePerKm = 10
    
    return baseCharge + (distance * ratePerKm)
  }

  const calculateTotalCost = (systemSize: number, deliveryCharge: number): number => {
    const costPerKW = 95000 // Updated cost per KW in LKR
    const installationCost = systemSize * costPerKW
    const serviceFee = 35000 // Updated service fee
    const taxRate = 0.15 // 15% tax
    const subtotal = installationCost + deliveryCharge + serviceFee
    const tax = subtotal * taxRate
    return Math.ceil(subtotal + tax)
  }

  const validateInputs = (): boolean => {
    if (!quoteDetails.name || !quoteDetails.email || !quoteDetails.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all customer details",
        variant: "destructive"
      })
      return false
    }
    if (quoteDetails.monthlyBill <= 0) {
      toast({
        title: "Validation Error",
        description: "Monthly bill must be greater than 0",
        variant: "destructive"
      })
      return false
    }
    if (quoteDetails.roofArea < 10) {
      toast({
        title: "Validation Error",
        description: "Minimum roof area required is 10 square meters",
        variant: "destructive"
      })
      return false
    }
    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let parsedValue: string | number = value
    
    if (name === 'monthlyBill' || name === 'roofArea') {
      parsedValue = parseFloat(value) || 0
    }
    
    const updatedDetails = {
      ...quoteDetails,
      [name]: parsedValue
    }
  
    // Calculate new values if we have the required fields
    if (updatedDetails.monthlyBill > 0 && updatedDetails.district) {
      const systemSize = calculateSystemSize(updatedDetails.monthlyBill)
      const deliveryCharge = calculateDeliveryCharge(updatedDetails.district)
      const totalCost = calculateTotalCost(systemSize, deliveryCharge)
  
      updatedDetails.systemSize = systemSize
      updatedDetails.deliveryCharge = deliveryCharge
      updatedDetails.totalCost = totalCost
    }
    
    setQuoteDetails(updatedDetails)
  }
  

  const generateQuote = () => {
    if (!validateInputs()) return

    const systemSize = calculateSystemSize(quoteDetails.monthlyBill)
    const deliveryCharge = calculateDeliveryCharge(quoteDetails.district)
    const totalCost = calculateTotalCost(systemSize, deliveryCharge)

    setQuoteDetails(prev => ({
      ...prev,
      systemSize,
      deliveryCharge,
      totalCost
    }))
  }

  const downloadQuote = async (format: 'png' | 'jpg') => {
    if (!quoteRef.current) return
    
    setLoading(true)
    try {
      const scale = 2 // Increase quality
      const canvas = await html2canvas(quoteRef.current, {
        scale,
        useCORS: true,
        logging: false
      })
      const image = canvas.toDataURL(`image/${format}`, 1.0)
      const link = document.createElement('a')
      link.href = image
      link.download = `solar-quote-${quoteDetails.name.replace(/\s+/g, '-')}-${Date.now()}.${format}`
      link.click()
      toast({
        title: "Success!",
        description: "Quote downloaded successfully"
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Error",
        description: "Failed to download quote. Please try again.",
        variant: "destructive"
      })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Solar System Quote Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
          <div className="space-y-4">
          <label className="block text-sm mb-1">Full Name <span className='text-red-600 font-bold'>*</span></label>
            <Input
              name="name"
              placeholder="Full Name"
              value={quoteDetails.name}
              onChange={handleInputChange}
              required
            />
            <label className="block text-sm mb-1">Email*</label>
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={quoteDetails.email}
              onChange={handleInputChange}
              required
            />
            <label className="block text-sm mb-1">Phone Number*</label>
            <Input
              name="phone"
              placeholder="Phone Number"
              value={quoteDetails.phone}
              onChange={handleInputChange}
              required
            />
            <label className="block text-sm mb-1">City*</label>
            <select
              name="district"
              value={quoteDetails.district}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-background"
              required
            >
              <option value="">Select District</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            <label className="block text-sm mb-1">Address*</label>
            <Input
              name="address"
              placeholder="Installation Address"
              value={quoteDetails.address}
              onChange={handleInputChange}
              required
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Requirements</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Roof Area (sq. meters)*</label>
              <Input
                name="roofArea"
                type="number"
                min="10"
                value={quoteDetails.roofArea}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Monthly Electricity Bill (LKR)*</label>
              <Input
                name="monthlyBill"
                type="number"
                min="1"
                value={quoteDetails.monthlyBill}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button 
              className="w-full"
              onClick={generateQuote}
              disabled={!quoteDetails.district || !quoteDetails.monthlyBill || loading}
            >
              Generate Quote
            </Button>
          </div>
        </Card>
      </div>

      {quoteDetails.totalCost && (
        <div ref={quoteRef} className="mt-8">
        <Card className="p-6 bg-gradient-to-br from-white to-blue-50">
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.png" alt="Company Logo" className="h-16 mb-2" width={100} height={100} priority />
            <h1 className="text-xl font-bold text-blue-800">Solar Solutions Lanka</h1>
            <p className="text-gray-600">123 Solar Street, Colombo 03, Sri Lanka</p>
            <p className="text-gray-600">+94 11 234 5678 | info@solarsolutions.lk</p>
          </div>

          <div className="text-center mb-6 bg-blue-800 text-white py-4 rounded-lg">
            <h2 className="text-2xl font-bold">Solar System Quotation</h2>
            <p className="text-blue-100">{new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-blue-800 mb-2">Customer Details</h3>
              <div className="space-y-1 text-gray-700">
                <p><span className="font-medium">Name:</span> {quoteDetails.name}</p>
                <p><span className="font-medium">Email:</span> {quoteDetails.email}</p>
                <p><span className="font-medium">Phone:</span> {quoteDetails.phone}</p>
                <p><span className="font-medium">District:</span> {quoteDetails.district}</p>
                <p><span className="font-medium">Address:</span> {quoteDetails.address}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-blue-800 mb-2">System Details</h3>
              <div className="space-y-1 text-gray-700">
                <p><span className="font-medium">System Size:</span> {quoteDetails.systemSize} kW</p>
                <p><span className="font-medium">Roof Area:</span> {quoteDetails.roofArea} sq.m</p>
                <p><span className="font-medium">Monthly Bill:</span> LKR {quoteDetails.monthlyBill.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-blue-800 mb-3">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>System Cost:</span>
                <span>LKR {(quoteDetails.totalCost! - quoteDetails.deliveryCharge! - 35000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charge:</span>
                <span>LKR {quoteDetails.deliveryCharge!.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Service Fee:</span>
                <span>LKR 35,000</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (15%):</span>
                <span>LKR {(quoteDetails.totalCost! * 0.15).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-blue-200 pt-3 text-blue-800">
                <span>Total Cost:</span>
                <span>LKR {quoteDetails.totalCost!.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-blue-200 pt-4">
            <div className="text-center text-gray-600">
              <p className="font-medium text-blue-800">Contact Us</p>
              <p>Email: info@solarsolutions.lk | Website: www.solarsolutions.lk</p>
              <p>Hotline: +94 11 234 5678</p>
              <p className="mt-2 text-sm">Quote valid for 30 days. Terms and conditions apply. Prices are subject to change without prior notice.</p>
            </div>
          </div>
        </Card>
      </div>
      )}
      <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={() => downloadQuote('png')}
              disabled={loading || !quoteDetails.totalCost}
            >
              Download as PNG
            </Button>
            <Button
              onClick={() => downloadQuote('jpg')}
              disabled={loading || !quoteDetails.totalCost}
            >
              Download as JPG
            </Button>
          </div>
    </div>
  )
}