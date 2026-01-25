"use server";
import { GoogleGenAI } from "@google/genai";
import { Job, jobSchema } from "../schemas/jobs.schema";

export const formatJobData = async (unstructredText: string): Promise<Job> => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
  });

  const safeInput = unstructredText.slice(0, 20000);

  const prompt = `You are a high-precision data extractor. Your goal is to transform messy, copy-pasted job descriptions into a clean, structured JSON format.

    ### EXTRACTION RULES:
    1. **Title Cleanup**: Remove suffixes like "(Remote)", "Hiring Now!".
    // ...existing code...
    5. **Skill Deduplication**: If "React" is mentioned 5 times, only include it once.

    I am pasting a job description below wrapped in XML tags.
    
    <source_material>
    ${safeInput}
    </source_material>
    `;

  const aiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: jobSchema.toJSONSchema(),
    },
  });

  if (!aiResponse.text) {
    throw new Error("AI response is empty");
  }

  const jobData = jobSchema.parse(JSON.parse(aiResponse.text || "{}"));

  return jobData;
};
