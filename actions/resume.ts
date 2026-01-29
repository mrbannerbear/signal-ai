"use server"

import { ResumeProfile, ResumeProfileSchema } from "@/schemas/resume.schema";
import { GoogleGenAI } from "@google/genai";

export const formatResumeData = async (
  optimizedResumeText: string
): Promise<ResumeProfile> => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
  });

  const safeInput = optimizedResumeText.slice(0, 15_000);

  const prompt = `
You are a high-precision resume parser.

Extract structured profile data from the resume below.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT include explanations
- Do NOT infer or invent missing data
- Use empty strings or empty arrays if data is missing
- Normalize job titles (e.g. "Frontend Eng." → "Frontend Engineer")
- Deduplicate skills
- Summarize experience bullet points into 2–3 concise sentences

JSON schema:
${JSON.stringify(ResumeProfileSchema.toJSONSchema(), null, 2)}

Resume:
"""
${safeInput}
"""
`;

  const aiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: ResumeProfileSchema.toJSONSchema(),
    },
  });

  if (!aiResponse.text) {
    throw new Error("AI response is empty");
  }

  const parsed = JSON.parse(aiResponse.text);
  const validated = ResumeProfileSchema.parse(parsed);

  return validated;
};
