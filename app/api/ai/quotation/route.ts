import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    
    if (!formData) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    
    // System prompt to guide the AI
    const systemPrompt = {
        role: "system" as const,
        content: `You are Luminex Intelligence, an AI quotation generator for Smart Solar, a leading solar energy company in Sri Lanka. 
    
        Your task is to generate a detailed solar system quotation based on the user's inputs.
    
        IMPORTANT: You MUST return your response in valid JSON format with these exact keys:
        - systemOverview: Brief summary of recommended solution
        - components: Detailed breakdown of all components
        - technicalSpecs: Size, capacity, and expected output
        - costBreakdown: Itemized costs for transparency
        - financialAnalysis: Savings, payback period, and long-term financial benefits
        - environmentalImpact: CO2 reduction and other ecological benefits
        - recommendations: Custom advice based on specific situation
    
        The values for each key must be strings, not nested objects.
        DO NOT include markdown code fences, quotes, or any formatting that would make the response invalid JSON.
        
        Pricing guidelines:
        - Basic residential system (1-5kW): Rs. 250,000-400,000 per kW
        - Mid-range residential system (5-10kW): Rs. 230,000-350,000 per kW
        - Commercial system (10-100kW): Rs. 200,000-300,000 per kW
        - Battery storage: Rs. 150,000-250,000 per kWh of storage
        - Inverter costs: Rs. 50,000-150,000 depending on capacity
        - Typical payback period: 5-7 years for grid-tied systems
        
        For a customer with a monthly bill of Rs. 10,000:
        - Recommend approximately 3-4kW system
        - Total cost range: Rs. 750,000-1,200,000
        - Estimated annual savings: Rs. 120,000-180,000
        
        REMEMBER: Return ONLY valid JSON with string values for each key.`
    };
  

    // Format the user's request
    const userPrompt = {
        role: "user" as const,
        content: `Please generate a detailed solar quotation based on the following information:
        
        Name: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
        City/District: ${formData.city}
        Monthly Electricity Bill: Rs. ${formData.monthlyBill}
        Roof Type: ${formData.roofType}
        Available Roof Space: ${formData.roofSpace} sq. meters
        Building Type: ${formData.buildingType}
        Additional Information: ${formData.additionalInfo || "None provided"}
        
        Provide a comprehensive quotation with all required sections.`
      };
      
      // Set up OpenAI client with DeepSeek configuration
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.DEEPSEEK_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": "https://smartsolar.vercel.app", 
          "X-Title": "Smart Solar",
        },
      });
      
      // Call API using the OpenAI client
    const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1:free",
        messages: [systemPrompt, userPrompt],
        temperature: 0.5,  // Lower temperature for more consistent responses
        max_tokens: 3000,
        response_format: { type: "json_object" }
    });
  
      
    // Parse the response
    const content = completion.choices[0].message.content || "{}";
      
    // Attempt to parse the JSON response
    try {
      // Parse the JSON content
      const parsedContent = JSON.parse(content);
      
      // Define expected fields
      const requiredFields = [
        "systemOverview", "components", "technicalSpecs", 
        "costBreakdown", "financialAnalysis", "environmentalImpact", 
        "recommendations"
      ];
      
      // Create a standardized quotation object with string values
      const quotation: { [key: string]: string } = {};
      
      // Process each field
      for (const field of requiredFields) {
        if (parsedContent[field]) {
          // If the field exists, convert it to a string format if it's an object
          if (typeof parsedContent[field] === 'object') {
            quotation[field] = Object.entries(parsedContent[field])
              .map(([key, value]) => `• ${key}: ${value}`)
              .join('\n');
          } else {
            quotation[field] = String(parsedContent[field]);
          }
        } else {
          // Provide default values for missing fields
          quotation[field] = `Information not available`;
        }
      }
      
      return NextResponse.json(quotation);
      
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw content received:", content);
      
      // Create a fallback quotation with formatted strings
      const fallbackQuotation = {
        systemOverview: `Based on your monthly electricity bill of Rs. ${formData.monthlyBill} and ${formData.roofSpace} sq. meters of roof space, we recommend a ${formData.buildingType === 'residential' ? '3.5kW' : '10kW'} solar system for your ${formData.buildingType} property in ${formData.city}.`,
        
        components: `• 9 x 400W Monocrystalline Solar Panels
• 1 x 5kW Grid-Tied Inverter
• Mounting Structure for ${formData.roofType} roof
• DC & AC Protection Devices
• Power Monitoring System
• Complete Wiring Kit`,
        
        technicalSpecs: `• System Size: 3.6kW
• Estimated Daily Production: 14-16 kWh
• Estimated Monthly Production: 420-480 kWh
• Panel Efficiency: 20.4%
• Inverter Efficiency: 98%
• System Lifetime: 25+ years`,
        
        costBreakdown: `• Solar Panels: Rs. 540,000
• Inverter: Rs. 110,000
• Mounting Structure: Rs. 65,000
• Protection Devices: Rs. 30,000
• Monitoring System: Rs. 25,000
• Installation & Labor: Rs. 90,000
• Total System Cost: Rs. 860,000`,
        
        financialAnalysis: `• Current Monthly Electricity Bill: Rs. ${formData.monthlyBill}
• Estimated Monthly Savings: Rs. ${Math.round(parseInt(formData.monthlyBill) * 0.7)}
• Annual Savings: Rs. ${Math.round(parseInt(formData.monthlyBill) * 0.7 * 12)}
• Payback Period: 6-7 years
• 25-Year Savings: Rs. ${Math.round(parseInt(formData.monthlyBill) * 0.7 * 12 * 20)}
• ROI: 15-18% per year`,
        
        environmentalImpact: `• CO2 Reduction: 4.8 tons per year
• Equivalent to Planting: 240 trees annually
• Reduction of Carbon Footprint: 70-80%
• Clean Energy Production: 5,400 kWh annually`,
        
        recommendations: `For your ${formData.roofType} roof in ${formData.city}, we recommend using additional weather protection for the mounting system. Given the high solar irradiance in your district, your system will likely perform at the higher end of our estimated range.

Based on your additional information, we suggest considering a small battery backup system in the future to maximize your energy independence.`
      };
      
      return NextResponse.json(fallbackQuotation);
    }
      
  } catch (error) {
    console.error("Error in quotation AI endpoint:", error);
    return NextResponse.json(
      { error: "Failed to generate quotation" },
      { status: 500 }
    );
  }
}
