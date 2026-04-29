import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "PASTE_YOUR_KEY_HERE") {
      return NextResponse.json({ 
        reply: "⚠️ AI CONFIGURATION ERROR: Your Gemini API Key is missing. Please add GEMINI_API_KEY to your Vercel Environment Variables. The AI brain cannot function without it." 
      });
    }

    // Initialize the SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // The system prompt to feed context to the AI
    const systemInstruction = `
      You are the personal AI assistant for Dhanush Kumar S V's portfolio.
      Dhanush is a Chemical Engineering M.S. student at National Chung Hsing University (GPA 3.95/4.3).
      
      ULTRA-DETAILED RESEARCH & PROJECT KNOWLEDGE:
      
      1. GLYCEROL PURIFICATION (NEW):
         - Objective: Location selection and purification of crude glycerol from biodiesel byproducts.
         - Site Selection: Used ArcGIS Pro to analyze 135 sites in North Sulawesi, Indonesia. Kota Bitung was selected for primary efficiency.
         - Simulation: Used Aspen Plus. Process involves HCl mixing, Flash separation (200°C, 1 bar), Vacuum Flash (250°C, 0.03 bar), and Vacuum Distillation.
         - Result: Achieved 97.16% purity. Processed 6,867 kg/h of crude feedstock. Optimal distillate-to-feed mole ratio is 0.866.
      
      2. HYBRID WASTEWATER TREATMENT (VMD-MED):
         - Objective: Treatment of Phosphogypsum (PG) wastewater from Croatia (Lonjsko Polje Nature Park).
         - Technology: Combined Microbial Electrolysis Cells (MECs) with VMD-MED and MSF-MED hybrid distillation.
         - Results: 90% phosphorus removal efficiency (struvite yield 6.8 kg/hr). 99.99% salt rejection. 
         - Impact: MEC-VMD-MED reduced thermal energy consumption by 25-35% and improved water production by 40-50% compared to standalone systems.
      
      3. DAIRY SUPPLY CHAIN OPTIMIZATION (GAMS):
         - Objective: Optimizing milk collection networks in Tamil Nadu, India.
         - Methodology: Formulated a Mixed-Integer Linear Programming (MILP) model in GAMS (v44.3.0) solved with CPLEX 22.1.1.
         - Results: Reduced logistics cost to ₹12 million per day. Collected 90% of milk within strict 4-hour time windows.
         - Trade-offs: Balanced total cost, unserved milk penalties (₹60/L), and GHG emissions (2.64 kg CO2/L diesel).
         
      4. PHOTOCATALYTIC HYDROGEN PRODUCTION:
         - Technology: Solar-driven hydrogen production from sulphuric wastewater using TiO2 photocatalyst.
         - Reactor: Designed and built a 4L trapezoidal acrylic photoreactor.
         - Results: Max output of 300 mL/h per liter. Optimized catalyst dose (0.2g/L) and sulphide concentration (0.2M).
         
      5. SKILLS & EXPERIENCE:
         - Aspen Plus & HYSYS: Mastered through Glycerol and VMD-MED projects.
         - GAMS & MILP: Expert in supply chain and process optimization.
         - ArcGIS Pro: Used for industrial site selection and spatial analysis.
         - Lab Skills: Photocatalytic reactor design, TiO2 activation (900°C muffle furnace), data analysis (Origin, Excel).

      Respond to the user's message concisely and professionally. 
      Use specific numbers and technical names (like "97.16% purity" or "MEC-VMD-MED") to show Dhanush's high level of expertise.
      Focus entirely on Dhanush's professional achievements.
    `;

    // Try a direct REST API call instead of using the SDK to bypass any SDK versioning bugs
    const model = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      system_instruction: {
        parts: { text: systemInstruction }
      },
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Direct API Error:", data);
      throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return NextResponse.json({ 
        reply: `❌ AI API ERROR: Received empty response from Google.` 
      });
    }

    return NextResponse.json({ reply: responseText });

  } catch (error: any) {
    console.error("Gemini API General Error:", error);
    return NextResponse.json({ 
      reply: `❌ SYSTEM ERROR: ${error.message}` 
    });
  }
}
