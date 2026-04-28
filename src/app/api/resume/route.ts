import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Attempt to extract JSON if the AI returned it inside markdown blocks
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : responseText;
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
