import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const MAX_FILE_SIZE_MB = 5;
const MAX_PAGES = 2;
const MAX_TEXT_LENGTH = 20_000;
const PDF_TIMEOUT_MS = 8_000;


const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("PDF processing timed out")), ms)
    ),
  ]);
};

export const generateFileHash = async (file: File): Promise<string> => {
  // Simple client-side hash: Name + Size + LastModified
  // Ideally, use a content hash (SHA-256 of arrayBuffer), but this is faster and sufficient for MVP "same file" check
  return `${file.name}-${file.size}-${file.lastModified}`;
};

const sanitizeText = (text: string) =>
  text
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "") // defensive, in case it’s ever rendered
    .trim()
    .slice(0, MAX_TEXT_LENGTH);

export const openFile = async (): Promise<File | undefined> => {
  const pickerOptions = {
    types: [
      {
        description: "PDF Documents",
        accept: { "application/pdf": [".pdf"] },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [fileHandle] = await (window as any).showOpenFilePicker(pickerOptions);
    const file = await fileHandle.getFile();

    // File size guard
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`PDF exceeds ${MAX_FILE_SIZE_MB}MB size limit`);
    }

    return file;
  } catch (err) {
    console.error("File selection failed:", err);
  }
};

export const extractPdfText = async (file: File): Promise<string> => {
  if (!file) return "";

  return withTimeout(
    (async () => {
      const arrayBuffer = await file.arrayBuffer();

      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Page limit guard
      if (pdfDoc.numPages > MAX_PAGES) {
        throw new Error(
          `PDF has ${pdfDoc.numPages} pages. Max allowed is ${MAX_PAGES}.`
        );
      }

      let fullText = "";

      const pagesToRead = Math.min(pdfDoc.numPages, MAX_PAGES);

      for (let i = 1; i <= pagesToRead; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => item.str)
          .join(" ");

        fullText += pageText + "\n";

        if (fullText.length >= MAX_TEXT_LENGTH) break;
      }

      return sanitizeText(fullText);
    })(),
    PDF_TIMEOUT_MS
  );
};

export const checkIfResume = (text: string): boolean => {
  const resumeKeywords = [
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "work history",
    "professional summary",
    "summary",
    "objective",
    "contact",
  ];

  const lowerText = text.toLowerCase();

  return resumeKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );
};

export const compressResumeText = (text: string): string => {
  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const uniqueLines = Array.from(new Set(lines));

  return uniqueLines.join("\n").slice(0, 15_000);
};

export const buildResumePrompt = (resumeText: string) => `
You are a strict JSON extraction engine.

Extract structured data from the resume below.
Return ONLY valid JSON.
Do NOT include explanations.
Do NOT invent data.
If a field is missing, use an empty string or empty array.

JSON schema:
{
  "first_name": "",
  "last_name": "",
  "headline": "",
  "bio": "",
  "location": "",
  "portfolio_url": "",
  "linkedin_url": "",
  "skills": [],
  "experience": [
    {
      "company": "",
      "role": "",
      "start_date": "",
      "end_date": "",
      "summary": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "start_date": "",
      "end_date": ""
    }
  ]
}

Resume:
"""
${resumeText}
"""
`;


const RESUME_CACHE_KEY = "resume_optimized_v1";

export const getCachedResume = (): string | null => {
  try {
    return localStorage.getItem(RESUME_CACHE_KEY);
  } catch {
    return null;
  }
};

export const setCachedResume = (text: string): void => {
  try {
    localStorage.setItem(RESUME_CACHE_KEY, text);
  } catch {
  }
};

export const clearCachedResume = (): void => {
  try {
    localStorage.removeItem(RESUME_CACHE_KEY);
  } catch {}
};

