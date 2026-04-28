import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Placeholder for future Gemini/OpenAI integration
    // Here we will use the AI to generate a response based on Dhanush's expertise
    
    return NextResponse.json({ 
      reply: `[AI Placeholder] I received your question about: "${message}". In the future, I will use Gemini to analyze Dhanush's portfolio and provide a detailed answer.` 
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
