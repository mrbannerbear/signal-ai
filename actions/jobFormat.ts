"use server";
import { GoogleGenAI } from "@google/genai";
import { Job, jobSchema } from "@/schemas/jobs.schema";

export const formatJobData = async (unstructredText: string): Promise<Job> => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
  });

  const safeInput = unstructredText.slice(0, 20000);
  // date in mm/dd/yyyy format
  const dateToday = new Date().toISOString().split("T")[0];

  const prompt = `You are a high-precision data extractor. Your goal is to transform messy, copy-pasted job descriptions into a clean, structured JSON format.

    ### EXTRACTION RULES:
    1. **Title Cleanup**: Remove suffixes like "(Remote)", "Hiring Now!".
    2. **Location Standardization**: Convert locations to "City, State" format. Use "Remote" if applicable.
    3. **Salary Parsing**: Extract salary as a number. If a range is given, take the average.
    4. **Experience Level**: Normalize to "Entry", "Mid", "Senior", or "Director".
    5. **Skill Deduplication**: If "React" is mentioned 5 times, only include it once.
    6. **Description Cleaning**: Remove any HTML tags, special characters, or irrelevant info.
    7. **JSON Compliance**: Ensure the final output is valid JSON matching the provided schema.
    8. **Date Formatting**: Standardize dates to "YYYY-MM-DD" format. If only month/year is given, use the first day of that month. If it's like 'Posted 10 hours ago',
        use the current date. Today's date: ${dateToday}.

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
