import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Initialize Google Gen AI SDK using the zero-cost tier / environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Load local blacklist words/regex from config
function getBlacklist(): string[] {
  try {
    const filePath = path.join(process.cwd(), 'config', 'blacklist.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileData);
    return json.words || [];
  } catch (error) {
    return ['spam', 'abuse', 'hate']; // Default fallback blacklist
  }
}

// Local regex/leetspeak pre-screener for instant detection
export function containsProfanity(text: string): boolean {
  const blacklist = getBlacklist();
  if (blacklist.length === 0) return false;

  // Normalize text to catch simple leetspeak bypasses (e.g., 4 = a, 3 = e, 1 = i, 0 = o)
  const normalized = text
    .toLowerCase()
    .replace(/4/g, 'a')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/7/g, 't');

  for (const word of blacklist) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(normalized) || regex.test(text.toLowerCase())) {
      return true;
    }
  }
  return false;
}

// Comprehensive hybrid evaluation function (Local check -> Strict AI check -> Admin Queue Routing)
export async function evaluateSubmission(inputText: string): Promise<{ status: 'APPROVED' | 'PENDING_REVIEW'; reason?: string }> {
  // 1. Instant Local Check
  if (containsProfanity(inputText)) {
    return { status: 'PENDING_REVIEW', reason: 'Flagged by local blacklist filter' };
  }

  // 2. AI Safety & Content Classification Check
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this student submission for a university campus platform (FAST-NUCES Karachi). Check if it contains any protests, complaints against the university administration, campus negativity, defamation, toxicity, or harsh criticism. If it contains ANY complaints, negative rants, or protests about the university, return {"isClean": false, "reason": "Contains campus complaints or protests"}. Otherwise return {"isClean": true}. Return JSON only.`,
      config: { responseMimeType: 'application/json' }
    });

    const result = JSON.parse(response.text || '{}');
    if (result.isClean === false) {
      return { status: 'PENDING_REVIEW', reason: result.reason || 'Flagged by AI safety moderation' };
    }
  } catch (error) {
    console.error('Gemini AI Moderation Error:', error);
    // Fail-safe: if AI fails, allow clean passage or route to pending based on preference (here it defaults to approved if AI fails, while local catches hard words)
  }

  return { status: 'APPROVED' };
}