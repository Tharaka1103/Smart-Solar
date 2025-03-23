"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Download, FileText, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { generatePDF } from "../../lib/generate-pdf";
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  city: z.string().min(2, { message: "Please enter your city/district." }),
  monthlyBill: z.string().min(1, { message: "Please enter your monthly electricity bill." }),
  roofType: z.string().min(1, { message: "Please select your roof type." }),
  roofSpace: z.string().min(1, { message: "Please enter your available roof space." }),
  buildingType: z.string().min(1, { message: "Please select your building type." }),
  additionalInfo: z.string().optional(),
});

export default function SolarQuotationGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [quotation, setQuotation] = useState<null | any>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const { successt, errort, warningt, infot, dismissAll } = useToast()

  const stages = [
    "Analyzing input data...",
    "Calculating system requirements...",
    "Determining optimal components...",
    "Estimating costs and savings...",
    "Generating environmental impact...",
    "Preparing final quotation...",
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      monthlyBill: "",
      roofType: "",
      roofSpace: "",
      buildingType: "",
      additionalInfo: "",
    },
  });

  // Auto-increment progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGenerating && progress < 90) {
      interval = setInterval(() => {
        const nextStageIndex = Math.floor((progress / 90) * stages.length);
        if (nextStageIndex < stages.length) {
          setCurrentStage(stages[nextStageIndex]);
        }
        setProgress(prev => Math.min(prev + 1, 90));
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, progress]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setShowProgress(true);
    setProgress(0);
    setCurrentStage(stages[0]);
    
    try {
      const response = await fetch("/api/ai/quotation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate quotation");
      }
  
      const data = await response.json();
      
      // Since our API now returns proper string values, we can use it directly
      setQuotation(data);
      setProgress(100);
      setCurrentStage("Quotation generated successfully!");
      
      // Slight delay to show the 100% progress
      setTimeout(() => {
        setShowProgress(false);
        successt({
          title: "Success!",
          description: "Quotation generated successfully.",
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error generating quotation:", error);
      errort({
        title: "Error!",
        description: "Failed to generate quotation. Please try again later.",
      });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setShowProgress(false);
      }, 1000);
    }
  }

  const handleDownloadPDF = async () => {
    if (!quotation) return;
    
    try {
      await generatePDF(quotation, form.getValues());
      successt({
        title: "Success!",
        description: "Quotation downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      errort({
        title: "Error!",
        description: "Failed to download the quotation as a PDF. Please try again later.",
      });
    }
  };

  // Function to safely render HTML content
  const renderHtmlContent = (content: any) => {
    if (!content) return '';
    
    let stringContent = formatQuotationField(content);
    
    // Convert newlines to HTML breaks
    return stringContent
      .replace(/\n/g, '<br/>')
      .replace(/•/g, '<span style="display: inline-block; margin-right: 5px;">•</span>');
  };

  // Format the quotation fields for prettier display
  const formatQuotationField = (field: any): string => {
    if (!field) return '';
    
    // Handle object case
    if (typeof field === 'object') {
      try {
        // Try to create a formatted bullet list from object properties
        return Object.entries(field)
          .map(([key, value]) => `• ${key}: ${value}`)
          .join('\n');
      } catch (e) {
        return String(field);
      }
    }
    
    return String(field);
  };

  return (
    <div className="space-y-8">
      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent className="sm:max-w-md">
            <DialogTitle className="text-2xl">Generating Solar Quotation</DialogTitle> 
          <div className="space-y-6 py-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-center">{currentStage}</h3>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we generate your personalized solar quotation
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="pt-6">
            <Alert className="mb-6 border-blue-500/50 bg-blue-500/10">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <AlertTitle className="text-blue-500 font-medium">Personalized Solar Quote</AlertTitle>
              <AlertDescription>
                Fill in the details below to receive an AI-generated personalized solar system quotation.
                This is an estimate based on the information provided. For a precise quote, our team will
                follow up with you.
              </AlertDescription>
            </Alert>

            {!quotation ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="07X XXX XXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City/District</FormLabel>
                          <FormControl>
                            <Input placeholder="Colombo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthlyBill"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Electricity Bill (Rs.)</FormLabel>
                          <FormControl>
                            <Input placeholder="10000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roofType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roof Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select roof type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="flat">Flat Roof</SelectItem>
                              <SelectItem value="tiled">Tiled Roof</SelectItem>
                              <SelectItem value="metal">Metal Roof</SelectItem>
                              <SelectItem value="asbestos">Asbestos Roof</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roofSpace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Roof Space (sq. meters)</FormLabel>
                          <FormControl>
                            <Input placeholder="50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buildingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Building Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                              <SelectValue placeholder="Select building type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="residential">Residential</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="industrial">Industrial</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any specific requirements or questions about your solar installation?"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Quotation...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Solar Quotation
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-secondary p-6 rounded-lg space-y-4">
                <h2 className="text-2xl font-bold text-primary">Your Personalized Solar Quotation</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold">System Overview</h3>
                      <p className="text-muted-foreground">{formatQuotationField(quotation?.systemOverview)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">System Components</h3>
                      <div dangerouslySetInnerHTML={{ __html: renderHtmlContent(quotation?.components) }} />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Technical Specifications</h3>
                      <div dangerouslySetInnerHTML={{ __html: renderHtmlContent(quotation?.technicalSpecs) }} />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Cost Breakdown</h3>
                      <div dangerouslySetInnerHTML={{ __html: renderHtmlContent(quotation?.costBreakdown) }} />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Financial Analysis</h3>
                      <div dangerouslySetInnerHTML={{ __html: renderHtmlContent(quotation?.financialAnalysis) }} />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Environmental Impact</h3>
                      <div dangerouslySetInnerHTML={{ __html: renderHtmlContent(quotation?.environmentalImpact) }} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">Additional Recommendations</h3>
                      <div dangerouslySetInnerHTML={{ __html: renderHtmlContent(quotation?.recommendations) }} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button onClick={handleDownloadPDF} className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download Quotation as PDF
                    </Button>
                    <Button 
                      onClick={() => setQuotation(null)} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Generate Another Quotation
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
