'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronRight, Home, LightbulbIcon, Zap, PlugZap, Calculator } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type Step = 'input' | 'calculating' | 'result'

export default function QuotationGenerator() {
  const [step, setStep] = useState<Step>('input')
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    propertyType: '',
    area: '',
    monthlyBill: '',
    roofType: '',
    location: '',
    usage: '',
  })
  const [quotation, setQuotation] = useState<any>(null)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('calculating')
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 4
      })
    }, 100)
    
    try {
      // Send data to generate quotation
      const response = await fetch('/api/luminex/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to generate quotation')
      
      const data = await response.json()
      setQuotation(data.quotation)
      
      // After calculation is done
      setTimeout(() => {
        clearInterval(interval)
        setProgress(100)
        setStep('result')
      }, 2500)
    } catch (error) {
      console.error(error)
      // Reset on error
      clearInterval(interval)
      setStep('input')
      setProgress(0)
    }
  }
  const resetForm = () => {
    setStep('input')
    setProgress(0)
    setFormData({
      propertyType: '',
      area: '',
      monthlyBill: '',
      roofType: '',
      location: '',
      usage: '',
    })
  }

  return (
    <div>
      {step === 'input' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Alert className="mb-6 bg-secondary/30 border-primary/20">
            <Calculator className="h-4 w-4 text-primary" />
            <AlertDescription>
              Tell us about your energy needs, and we'll generate a personalized solar solution quote.
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select 
                  value={formData.propertyType} 
                  onValueChange={(value) => handleChange('propertyType', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="area">
                  Approximate Roof/Area Size (sq ft)
                </Label>
                <Input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  placeholder="e.g. 1000"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="monthlyBill">Average Monthly Electricity Bill (Rs)</Label>
                <Input
                  type="number"
                  value={formData.monthlyBill}
                  onChange={(e) => handleChange('monthlyBill', e.target.value)}
                  placeholder="e.g. 5000"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="roofType">Roof Type</Label>
                <Select 
                  value={formData.roofType} 
                  onValueChange={(value) => handleChange('roofType', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select roof type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="sloped">Sloped</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="tile">Tile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="location">Location</Label>
                <Select 
                  value={formData.location} 
                  onValueChange={(value) => handleChange('location', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="western">Western Province</SelectItem>
                    <SelectItem value="central">Central Province</SelectItem>
                    <SelectItem value="southern">Southern Province</SelectItem>
                    <SelectItem value="northern">Northern Province</SelectItem>
                    <SelectItem value="eastern">Eastern Province</SelectItem>
                    <SelectItem value="northwest">North Western Province</SelectItem>
                    <SelectItem value="northcentral">North Central Province</SelectItem>
                    <SelectItem value="uva">Uva Province</SelectItem>
                    <SelectItem value="sabaragamuwa">Sabaragamuwa Province</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label>Primary Usage Time</Label>
                <RadioGroup 
                  value={formData.usage}
                  onValueChange={(value) => handleChange('usage', value)}
                  className="flex flex-col space-y-1"
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daytime" id="daytime" />
                    <Label htmlFor="daytime" className="cursor-pointer">Mainly during daytime</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="evening" id="evening" />
                    <Label htmlFor="evening" className="cursor-pointer">Mainly during evening/night</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="cursor-pointer">Evenly throughout the day</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full sm:w-auto" size="lg">
                Generate Quotation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </motion.div>
      )}
      
      {step === 'calculating' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 space-y-6"
        >
          <div className="text-center space-y-3">
            <h3 className="text-xl font-medium">Generating Your Custom Solar Solution</h3>
            <p className="text-muted-foreground">We're analyzing your energy needs to create the perfect solar system for you.</p>
          </div>
          
          <div className="w-full max-w-md space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-right text-muted-foreground">{progress}% complete</p>
          </div>
          
          <div className="flex flex-col items-center space-y-3 text-muted-foreground text-sm">
            <div className="flex items-center">
              <PlugZap className="animate-pulse mr-2 h-5 w-5 text-primary" />
              <span>Calculating optimal system size...</span>
            </div>
            {progress > 30 && (
              <div className="flex items-center">
                <LightbulbIcon className="animate-pulse mr-2 h-5 w-5 text-primary" />
                <span>Estimating energy production...</span>
              </div>
            )}
            {progress > 50 && (
              <div className="flex items-center">
                <Zap className="animate-pulse mr-2 h-5 w-5 text-primary" />
                <span>Finalizing cost estimates...</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {step === 'result' && quotation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Your Solar Solution</h3>
            <Badge variant="outline" className="text-primary border-primary">
              Customized Quotation
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlugZap className="mr-2 h-5 w-5 text-primary" />
                  System Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">System Size:</span>
                  <span className="font-medium">{quotation.systemSize} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of Panels:</span>
                  <span className="font-medium">{quotation.panelCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inverter Type:</span>
                  <span className="font-medium">{quotation.inverterType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Battery Storage:</span>
                  <span className="font-medium">{quotation.batteryStorage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Monthly Production:</span>
                  <span className="font-medium">{quotation.monthlyProduction} kWh</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5 text-primary" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">System Cost:</span>
                  <span className="font-medium">Rs {quotation.systemCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Installation:</span>
                  <span className="font-medium">Rs {quotation.installationCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Investment:</span>
                  <span className="font-medium font-bold">Rs {quotation.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Monthly Savings:</span>
                  <span className="font-medium text-green-600">Rs {quotation.monthlySavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payback Period:</span>
                  <span className="font-medium">{quotation.paybackPeriod} years</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Components Included</CardTitle>
              <CardDescription>Your solar package includes the following high-quality components</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quotation.components.map((component: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>{component}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <p className="text-sm text-muted-foreground">
                This quotation is valid for 30 days. Contact us to finalize your order.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={resetForm}>
                  Start Over
                </Button>
                <Button>
                  Contact Sales
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}