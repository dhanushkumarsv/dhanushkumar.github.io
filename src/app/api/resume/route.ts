import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    const ai = new GoogleGenAI({});

    const prompt = `
      You are an expert resume writer. Dhanush Kumar S V is applying for a "${role}" role.
      Dhanush is a Chemical Engineering Graduate Student.
      His core skills: Aspen Plus, GAMS, Optimization, Supply Chain, Wastewater Treatment, Hydrogen Systems.
      
      Write a highly tailored 3-sentence professional summary for Dhanush targeted specifically at the "${role}" position.
      Also, list exactly 4 bullet points of his most relevant skills for this specific role.
      
      Return the response STRICTLY as a JSON object with this exact structure:
      {
        "title": "The exact role name",
        "summary": "The 3 sentence summary",
        "skills": ["skill1", "skill2", "skill3", "skill4"]
      }
      Do not include any markdown formatting, backticks, or other text outside the JSON object.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const jsonText = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
    const resumeData = JSON.parse(jsonText);

    return NextResponse.json({ 
      success: true,
      resumeData
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 });
  }
}
