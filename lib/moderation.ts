import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Initialize Google Gen AI SDK using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Load local blacklist words/regex from config
function getBlacklist(): string[] {
  try {
    const filePath = path.join(process.cwd(), 'config', 'blacklist.json');
    if (!fs.existsSync(filePath)) return ['spam', 'abuse', 'hate'];
    
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileData);
    // Handles both an array or an object with a .words property
    return Array.isArray(json) ? json : (json.words || ['spam', 'abuse', 'hate']);
  } catch (error) {
    return ['spam', 'abuse', 'hate']; // Default fallback blacklist
  }
}

// Local regex/leetspeak pre-screener for instant detection (supports multiple fields)
export function containsProfanity(...texts: (string | undefined | null)[]): boolean {
  const blacklist = getBlacklist();
  if (blacklist.length === 0) return false;

  for (const text of texts) {
    if (!text) continue;

    // Normalize text to catch simple leetspeak bypasses (e.g., 4 = a, 3 = e, etc.)
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
  }
  return false;
}

// Comprehensive hybrid evaluation function for multiple fields
export async function evaluateSubmission(...texts: (string | undefined | null)[]): Promise<{ status: 'APPROVED' | 'PENDING_REVIEW'; reason?: string }> {
  // Combine all provided texts into a single block for the AI to inspect
  const combinedText = texts.filter(Boolean).join('\n');
  if (!combinedText.trim()) {
    return { status: 'APPROVED' };
  }

  // 1. Instant Local Check across all fields
  if (containsProfanity(...texts)) {
    return { status: 'PENDING_REVIEW', reason: 'Flagged by local blacklist filter' };
  }

  // 2. AI Safety & Content Classification Check
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this student submission for a university campus platform (FAST-NUCES Karachi). Check if it contains any protests, complaints against the university administration, campus negativity, defamation, toxicity, or harsh criticism. If it contains ANY complaints, negative rants, or protests about the university, return {"isClean": false, "reason": "Contains campus complaints or protests"}. Otherwise return {"isClean": true}. Return JSON only.\n\nSubmission content:\n${combinedText}`,
      config: { responseMimeType: 'application/json' }
    });

    const responseText = response.text || '{}';
    const result = JSON.parse(responseText.trim());
    if (result.isClean === false) {
      return { status: 'PENDING_REVIEW', reason: result.reason || 'Flagged by AI safety moderation' };
    }
  } catch (error) {
    console.error('Gemini AI Moderation Error:', error);
    // Fail-safe: allows clean passage if AI errors out, while local blacklist already caught severe words
  }

  return { status: 'APPROVED' };
}