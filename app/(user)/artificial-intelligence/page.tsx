'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { BrainCircuit, Calculator, Sparkles } from "lucide-react"
import QuotationGenerator from "@/components/luminex/QuotationGenerator"
import QuestionAnswering from "@/components/luminex/QuestionAnswering"
import { Card, CardContent } from "@/components/ui/card"

export default function LuminexPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-10 w-10 text-primary mr-2" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-yellow-400 bg-clip-text text-transparent">
            Luminex Intelligence
          </h1>
          <Sparkles className="h-10 w-10 text-yellow-400 ml-2" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your smart assistant for solar solutions and information
        </p>
      </motion.div>

      <Card className="border-2 border-primary/10 shadow-lg">
        <CardContent className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-4 bg-secondary/30 rounded-lg"
          >
            <h2 className="font-medium text-lg mb-2 flex items-center">
              <BrainCircuit className="w-5 h-5 mr-2 text-primary" />
              Instructions
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Use the <strong>Solar Quotation</strong> tab to generate a customized solar system quote</li>
              <li>Use the <strong>Ask Luminex</strong> tab to get answers about our company and services</li>
              <li>Be specific with your requirements to get the most accurate information</li>
            </ul>
          </motion.div>

          <Tabs defaultValue="quotation" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quotation">
                <Calculator className="mr-2 h-5 w-5" />
                Solar Quotation
              </TabsTrigger>
              <TabsTrigger value="questions">
                <BrainCircuit className="mr-2 h-5 w-5" />
                Ask Luminex
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="quotation" className="mt-5">
              <QuotationGenerator />
            </TabsContent>
            
            <TabsContent value="questions" className="mt-5">
              <QuestionAnswering />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
