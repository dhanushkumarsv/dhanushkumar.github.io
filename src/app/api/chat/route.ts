import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Initialize the SDK using the environment variable GEMINI_API_KEY
    const ai = new GoogleGenAI({});

    // The system prompt to feed context to the AI
    const systemInstruction = `
      You are the personal AI assistant for Dhanush Kumar S V's portfolio.
      Dhanush is a Chemical Engineering Graduate Student specializing in Process Simulation, Integration, and Data Analysis.
      His core skills include Aspen Plus, GAMS, Optimization, Supply Chain, Wastewater Treatment, and Hydrogen Systems.
      His key projects are:
      - Green Hydrogen Supply Chain Optimization
      - Phosphoric Acid Removal
      - Membrane Distillation (VMD-MED)
      - Biological Phosphorus Removal

      Respond to the user's message concisely and professionally in maximum 3-4 sentences.
      Do not hallucinate external information. Focus entirely on Dhanush's expertise.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction,
      }
    });

    return NextResponse.json({ 
      reply: response.text || "I'm sorry, I couldn't generate a response."
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
