"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, MessageSquare, FileText, Download, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import SolarQuotationGenerator from "@/components/ai/SolarQuotationGenerator";
import SolarChatInterface from "@/components/ai/SolarChatInterface";
import { WarpBackground } from "@/components/magicui/warp-background";
import { SparklesText } from "@/components/magicui/sparkles-text";
export default function ArtificialIntelligencePage() {
  return (
    <div className="container mx-auto py-5 px-4 max-w-7xl p-5">
      <WarpBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center text-primary mb-2"><SparklesText text="Luminex Intelligence" /></h1>
        <p className="text-lg text-center text-muted-foreground mb-6">
          AI-powered solar solutions to help you make informed decisions
        </p>

        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <AlertTitle className="text-amber-500 font-medium">Important Note</AlertTitle>
          <AlertDescription>
            Our AI tools provide estimates and information based on available data. While we strive for 
            accuracy, these results should be considered as guidance only. For precise quotations, 
            please consult with our solar experts.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="quotation" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="quotation" className="">
              <FileText className="h-4 w-4" /> Solar Quotation Generator
            </TabsTrigger>
            <TabsTrigger value="chat" className="">
              <MessageSquare className="h-4 w-4" /> Ask Luminex AI
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quotation" className="mt-10">
            <SolarQuotationGenerator />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-10">
            <SolarChatInterface />
          </TabsContent>
        </Tabs>
      </motion.div>
      </WarpBackground>
    </div>
  );
}
