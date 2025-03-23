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
    
    // System prompt to guide the AI
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

          Be friendly, professional, and knowledgeable about solar energy. Provide specific information about Sri Lankan context when relevant. When discussing costs, use Sri Lankan Rupees (LKR/Rs).

          DO NOT make specific promises about exact savings without detailed analysis. DO NOT provide misinformation about competitors. DO NOT recommend DIY solar installations for safety reasons. Do NOT provide any codes, informations.

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
