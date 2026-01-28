"use server";
import { Job, jobSchema } from "@/schemas/jobs.schema";
import { GoogleGenAI } from "@google/genai";

const minimalTextFromHtml = (html: string): string => {
  return html
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
    .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20000);
};

export const fetchJobTextFromURL = async (url: string): Promise<Job> => {
  try {
    new URL(url);
  } catch {
    throw new Error("Invalid URL provided");
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  const html = await response.text();

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }

  const cleanText = minimalTextFromHtml(html);

  const ai = new GoogleGenAI({});

  const prompt = `You are an expert technical recruiter and data analyst.
    Your task is to extract structured job information from raw text.

    ### STRATEGY:
    1. **Deduction**: If the "Employment Type" isn't explicitly stated but the text mentions "annual salary," assume "Full-time". 
    2. **Contextual Skills**: Distinguish between "Nice to have" and "Requirements". Focus on the core tech stack.
    3. **Cleaning**: Remove any SEO keywords, "Equal Opportunity Employer" boilerplate, or social media links.
    4. **Dates**: If no 'Posted Date' is found, leave it null. Do not guess the current date.

    ### FORMATTING RULES:
    - **Title**: Clean the title.
    - **Skills**: Extract technologies as individual strings.

    Now please analyze and extract the job data from the following source material wrapped in XML tags: 
    
    <source_material>
    ${cleanText}
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
