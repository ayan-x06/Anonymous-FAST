import blacklist from '@/config/blacklist.json';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI(); // Uses process.env.GEMINI_API_KEY automatically

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/1|!/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4|@/g, 'a')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/[^a-z]/g, '');
}

export function containsProfanity(inputText: string): boolean {
  const words = inputText.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (blacklist.forbiddenWords.includes(word)) return true;
  }
  const cleanedText = normalizeText(inputText);
  for (const badWord of blacklist.forbiddenWords) {
    if (cleanedText.includes(normalizeText(badWord))) return true;
  }
  return false;
}

// Combined Hybrid Evaluator (Async because of AI check)
export async function evaluateSubmission(inputText: string): Promise<{ status: 'APPROVED' | 'PENDING_REVIEW'; reason?: string }> {
  if (containsProfanity(inputText)) {
    return { status: 'PENDING_REVIEW', reason: 'Flagged by local profanity filter' };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this student submission for a university campus platform. Determine if it contains severe hate speech, doxxing, cyberbullying, or malicious defamation. Return JSON only: {"isClean": true/false, "reason": "short reason if flagged"}`,
      config: { responseMimeType: 'application/json' }
    });

    const result = JSON.parse(response.text || '{}');
    if (result.isClean === false) {
      return { status: 'PENDING_REVIEW', reason: result.reason || 'Flagged by AI safety check' };
    }
  } catch (error) {
    // Fallback gracefully if API key or network has an issue
  }

  return { status: 'APPROVED' };
}