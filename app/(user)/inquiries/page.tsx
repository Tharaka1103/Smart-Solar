'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
const mockCustomerData = {
  '123': {
    name: 'John Doe',
    address: '123 Solar Street, Colombo',
    systemSize: '5kW',
    installationDate: '2023-01-15'
  }
}

interface CustomerDetails {
  name: string
  address: string
  systemSize: string
  installationDate: string
}

export default function InquiriesPage() {
  const [inquiryType, setInquiryType] = useState<'our' | 'other' | null>(null)
  const [accountNumber, setAccountNumber] = useState('')
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null)
  const { successt, errort, warningt, infot, dismissAll } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleAccountLookup = () => {
    // Simulate account lookup
    const details = (mockCustomerData as any)[accountNumber]
    if (details) {
      setCustomerDetails(details)
      setFormData(prev => ({ ...prev, name: details.name }))
      successt({
        title: 'Success!',
        description: 'Your action was completed successfully.',
      })
    } else {

    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission

    // Reset form
    setFormData({
      name: '',
      contact: '',
      email: '',
      subject: '',
      message: ''
    })
    setInquiryType(null)
    setCustomerDetails(null)
    setAccountNumber('')
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Customer Inquiries</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <Label className="mb-2 block">Select Inquiry Type</Label>
          <Select onValueChange={(value) => setInquiryType(value as 'our' | 'other')}>
            <SelectTrigger>
              <SelectValue placeholder="Select inquiry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="our">Smart Solar Service Inquiry</SelectItem>
              <SelectItem value="other">Other Company Service Inquiry</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {inquiryType && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {inquiryType === 'our' && (
                <div className="space-y-4">
                  <div>
                    <Label>Account Number / NIC</Label>
                    <div className="flex gap-2">
                      <Input
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter account number or NIC"
                      />
                      <Button type="button" onClick={handleAccountLookup}>
                        Look up
                      </Button>
                    </div>
                  </div>

                  {customerDetails && (
                    <div className="bg-background p-4 rounded-lg space-y-2">
                      <h3 className="font-semibold">Customer Details</h3>
                      <p>Name: {customerDetails.name}</p>
                      <p>Address: {customerDetails.address}</p>
                      <p>System Size: {customerDetails.systemSize}</p>
                      <p>Installation Date: {customerDetails.installationDate}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Contact Number</Label>
                  <Input
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Subject</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Message</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Inquiry
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
