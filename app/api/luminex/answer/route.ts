import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load the instructions from the JSON file
const instructionsPath = path.join(process.cwd(), 'data', 'luminex-instructions.json');
let instructions: { questions: Array<{ keywords: string[], answer: string }> };

try {
  const fileContent = fs.readFileSync(instructionsPath, 'utf8');
  instructions = JSON.parse(fileContent);
} catch (error) {
  console.error('Error loading instructions file:', error);
  // Fallback instructions if file load fails
  instructions = {
    questions: [
      {
        keywords: ['what', 'who', 'company', 'about', 'smart solar'],
        answer: 'Smart Solar is a leading provider of solar energy solutions in Sri Lanka. We specialize in residential, commercial, and industrial solar installations, offering end-to-end services from consultation to maintenance.'
      },
      {
        keywords: ['services', 'offer', 'provide', 'solutions'],
        answer: 'We offer a comprehensive range of solar services including solar panel installation, solar water heating systems, energy storage solutions, solar maintenance, and monitoring systems.'
      },
      {
        keywords: ['warranty', 'guarantee'],
        answer: 'Our solar panels come with a 25-year performance warranty, and all installations are guaranteed for 10 years. Our inverters typically have a 5-10 year warranty, depending on the model.'
      },
        {
            "keywords": ["need a solar system on my house", "house", "home", "residential"],
            "answer": "We can help you install a solar system for your home. Our process includes a free site assessment, custom system design based on your energy needs, professional installation, and ongoing support. We'll handle all permits and documentation while ensuring you get the most efficient and cost-effective solution for your home."
        }
    ]
  };
}

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request. Question is required.' },
        { status: 400 }
      );
    }
    
    // Convert question to lowercase for matching
    const lowerQuestion = question.toLowerCase();
    
    // Find the best matching answer based on keywords
    let bestAnswer = "I'm sorry, I don't have specific information about that. Please contact our customer service team for more details.";
    let bestMatchCount = 0;
    
    for (const entry of instructions.questions) {
      let matchCount = 0;
      
      for (const keyword of entry.keywords) {
        if (lowerQuestion.includes(keyword.toLowerCase())) {
          matchCount++;
        }
      }
      
      if (matchCount > bestMatchCount) {
        bestMatchCount = matchCount;
        bestAnswer = entry.answer;
      }
    }
    
    // Calculate dynamic delay based on answer length
    // Minimum 1 second, plus 50ms per character up to a maximum of 3 seconds
    const baseDelay = 1000;
    const charDelay = 50;
    const maxDelay = 3000;
    const calculatedDelay = Math.min(baseDelay + (bestAnswer.length * charDelay / 10), maxDelay);
    
    // Simulate a more realistic delay
    await new Promise(resolve => setTimeout(resolve, calculatedDelay));
    
    return NextResponse.json({ 
      answer: bestAnswer,
      delay: calculatedDelay // Return the delay for reference
    });
  } catch (error: any) {
    console.error('Error processing question:', error);
    return NextResponse.json(
      { error: 'Failed to process your question. Please try again.' },
      { status: 500 }
    );
  }
}
