'use client'
import { useState } from 'react'
import QuoteGenerator from '@/components/QuoteGenerator'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Calculator, Sun, Battery, X } from "lucide-react"

const QuotationGeneratorPage = () => {
  const [showAlert, setShowAlert] = useState(true)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-20 sm:py-10 lg:py-20 space-y-6">
      {showAlert && (
        <Alert className="bg-alert border-primary relative">
          <button 
            onClick={() => setShowAlert(false)}
            className="absolute right-4 top-4 text-primary hover:text-blue-800"
          >
            <X className="h-5 w-5" />
          </button>
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className=" text-lg font-semibold pr-8">
            How Our Solar Quote Generator Works
          </AlertTitle>
          <AlertDescription className="mt-3  space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start space-x-2">
                <Calculator className="h-5 w-5 mt-1 flex-shrink-0 " />
                <p className="text-sm sm:text-base">Enter your monthly electricity bill and we'll calculate the optimal solar system size for your needs</p>
              </div>
              <div className="flex items-start space-x-2">
                <Sun className="h-5 w-5 mt-1 flex-shrink-0 " />
                <p className="text-sm sm:text-base">Our algorithm considers Sri Lanka's average 5-6 peak sun hours and 80% system efficiency</p>
              </div>
              <div className="flex items-start space-x-2">
                <Battery className="h-5 w-5 mt-1 flex-shrink-0 " />
                <p className="text-sm sm:text-base">Get instant cost estimates including delivery, installation, and all applicable taxes</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm mt-2 pt-2 border-t border-primary">
              Fill in all required fields marked with * to generate your personalized solar solution quote. 
              The quote can be downloaded in PNG or JPG format for your reference.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <QuoteGenerator />
    </div>
  )
}

export default QuotationGeneratorPage
