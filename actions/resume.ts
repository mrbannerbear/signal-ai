"use server"

import { ResumeProfile, ResumeProfileSchema } from "@/schemas/resume.schema";
import { GoogleGenAI } from "@google/genai";

import { createClient } from "@/app/lib/supabase/server";

export const formatResumeData = async (
  optimizedResumeText: string,
  fileMeta?: { fileName: string; fileHash: string }
): Promise<ResumeProfile> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 1. CHECKS & CACHING
  if (fileMeta) {
    // Check DB Cache
    const { data: existing } = await supabase
      .from("resumes")
      .select("content")
      .eq("user_id", user.id)
      .eq("file_hash", fileMeta.fileHash)
      .single();

    if (existing) {
      console.log("HIT: Resume found in DB cache.");
      return existing.content as ResumeProfile;
    }

    // Rate Limit: Max 5 parses per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from("resumes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", oneHourAgo);

    if (error) {
      console.error("Rate limit check failed", error);
    } else if (count !== null && count >= 5) {
      throw new Error("Rate limit exceeded: You can only parse 5 resumes per hour.");
    }
  }

  // 2. AI PROCESSING
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
- Use empty strings or empty arrays if data is missing, unless optional in schema
- Normalize job titles (e.g. "Frontend Eng." → "Frontend Engineer")
- Deduplicate skills
- Extract original bullet points for experience, do not summarize them
- Limit to 3-5 most impactful bullet points per role if there are many

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

  // 3. STORAGE
  if (fileMeta) {
    // Upsert to handle race conditions where the file might have been uploaded 
    // by the same user in another tab concurrently.
    await supabase.from("resumes").upsert(
      {
        user_id: user.id,
        file_hash: fileMeta.fileHash,
        file_name: fileMeta.fileName,
        content: validated,
      },
      {
        onConflict: "user_id, file_hash",
        ignoreDuplicates: true, // If it exists, we don't need to overwrite, just ignore
      }
    );
  }

  return validated;
};
