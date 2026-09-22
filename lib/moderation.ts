import blacklist from '@/config/blacklist.json';

// 1. The Normalization Helper Function
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/1|!/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4|@/g, 'a')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/[^a-z]/g, ''); // Removes spaces, punctuation, and symbols
}

// 2. The Main Profanity Checker Function (Exported for your API routes)
export function containsProfanity(inputText: string): boolean {
  // Layer 1: Check exact words
  const words = inputText.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (blacklist.forbiddenWords.includes(word)) {
      return true;
    }
  }

  // Layer 2: Check normalized text for hidden slurs
  const cleanedText = normalizeText(inputText);
  for (const badWord of blacklist.forbiddenWords) {
    const normalizedBadWord = normalizeText(badWord);
    if (cleanedText.includes(normalizedBadWord)) {
      return true;
    }
  }

  return false;
}