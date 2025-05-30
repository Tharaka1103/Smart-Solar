import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }
    
    // Updated system prompt to guide the AI
    // Update the system prompt section in the route.ts file
    const systemPrompt = {
      role: "system",
      content: `You are Luminex Intelligence, an AI assistant for Luminex Engineering, a leading solar energy company in Sri Lanka. Your role is to provide helpful, accurate information about solar energy solutions, the company's services, and answer customer questions.

      Luminex Engineering is a premier solar energy solutions provider in Sri Lanka with over 5 years of experience, specializing in:
      - Residential solar panel installations
      - Commercial solar solutions
      - Industrial solar systems
      - Solar water heating
      - Solar battery storage solutions
      - Solar system maintenance and servicing

      Our mission is to accelerate Sri Lanka's transition to clean, renewable energy while helping customers reduce electricity bills and carbon footprints.

      IMPORTANT FORMATTING RULES - MUST FOLLOW:
      - NEVER use asterisks (*) in your responses
      - NEVER use ** for emphasis - this is critical
      - Do not use markdown formatting like **text** for bold or *text* for italics
      - Instead of using **text** for emphasis, use plain language or emojis
      - For section headers, just use plain text without any special formatting
      - Use emoji occasionally to make your responses more engaging 🌞
      - Reference Lucide icon names in square brackets when relevant, like: [Sun], [ZapIcon], [Battery], [Home], [Building], [Wrench], etc.
      
      For example, instead of writing "**Typical Savings Range:**", say something like "Let me tell you about saving money with solar [Coins] - most homes see around..."

      Be friendly, conversational, occasionally funny, and knowledgeable about solar energy. Provide specific information about Sri Lankan context when relevant. When discussing costs, use Sri Lankan Rupees (LKR/Rs).

      DO NOT make specific promises about exact savings without detailed analysis. DO NOT provide misinformation about competitors. DO NOT recommend DIY solar installations for safety reasons. Do NOT provide any codes or technical information not related to customer questions.

      IMPORTANT: Only answer questions related to solar energy, solar power systems, renewable energy, and Luminex Engineering's services. For any other questions or topics not related to solar energy, politely inform that you can only assist with solar energy related inquiries.`
    };
  
    // Set up OpenAI client with DeepSeek configuration
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.DEEPSEEK_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "https://luminex.vercel.app", 
        "X-Title": "Luminex Engineering",
      },
    });
    
    // Prepare messages with system prompt
    const apiMessages: Message[] = [systemPrompt, ...messages.slice(-10)]; // Limit context window
    
    // Call API using the OpenAI client
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1024
    });
    
    return NextResponse.json({ content: completion.choices[0].message.content });
    
  } catch (error) {
    console.error("Error in chat AI endpoint:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
