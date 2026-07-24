import ai from "../config/gemini.js";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const SENTENCE_END_REGEX = /[.!?\u0964\u0965]/g;
const COMPLETE_END_REGEX = /[.!?\u0964\u0965]["')\]]*$/;
const MIN_WORD_COUNT = 30;
const MAX_WORD_COUNT = 50;
const MIN_SENTENCE_COUNT = 3;
const GEMINI_QUOTA_MESSAGE =
  "Gemini quota exceeded. Try again later or use another Gemini API key.";

const normalizeRoast = (text) =>
  text
    .replace(/\s+/g, " ")
    .replace(/\s+([.!?\u0964\u0965])/g, "$1")
    .trim();

const getSentenceCount = (text) =>
  (text.match(SENTENCE_END_REGEX) || []).length;

const getWordCount = (text) =>
  normalizeRoast(text).split(/\s+/).filter(Boolean).length;

const getCompletePrefix = (text) => {
  const normalizedText = normalizeRoast(text);
  const sentenceEnds = [...normalizedText.matchAll(SENTENCE_END_REGEX)];

  if (!sentenceEnds.length) {
    return "";
  }

  const lastSentenceEnd = sentenceEnds[sentenceEnds.length - 1].index;

  return normalizedText.slice(0, lastSentenceEnd + 1).trim();
};

const getBetterCompleteRoast = (current, candidate) => {
  if (!candidate) {
    return current;
  }

  if (!current) {
    return candidate;
  }

  const currentSentenceCount = getSentenceCount(current);
  const candidateSentenceCount = getSentenceCount(candidate);

  if (candidateSentenceCount > currentSentenceCount) {
    return candidate;
  }

  if (
    candidateSentenceCount === currentSentenceCount &&
    candidate.length > current.length
  ) {
    return candidate;
  }

  return current;
};

const isCompleteRoast = (text) => {
  const trimmedText = normalizeRoast(text);

  return (
    COMPLETE_END_REGEX.test(trimmedText) &&
    getSentenceCount(trimmedText) >= 2
  );
};

const isPreferredRoast = (text) => {
  const wordCount = getWordCount(text);

  return (
    isCompleteRoast(text) &&
    getSentenceCount(text) >= MIN_SENTENCE_COUNT &&
    wordCount >= MIN_WORD_COUNT &&
    wordCount <= MAX_WORD_COUNT
  );
};

const createGeminiError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const askGemini = async (prompt, options = {}) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: options.temperature ?? 0.9,
        maxOutputTokens: options.maxOutputTokens ?? 700,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw createGeminiError("Gemini returned an empty response.");
    }

    return normalizeRoast(text);
  } catch (error) {
    console.error("Gemini Error:", error);

    if (error.status === 429 || error.statusCode === 429) {
      throw createGeminiError(GEMINI_QUOTA_MESSAGE, 429);
    }

    if (error.statusCode) {
      throw error;
    }

    throw createGeminiError("Failed to generate AI response.");
  }
};

export const generateRoast = async (prompt) => {
  let bestCompleteRoast = "";
  let lastRoast = "";

  const roast = await askGemini(prompt, {
    temperature: 1,
    maxOutputTokens: 700,
  });
  lastRoast = roast;
  const completeRoast = getCompletePrefix(roast);

  bestCompleteRoast = getBetterCompleteRoast(
    bestCompleteRoast,
    completeRoast
  );

  if (isPreferredRoast(completeRoast)) {
    return completeRoast;
  }

  const repairPrompt = bestCompleteRoast
    ? `${prompt}

Previous invalid response:
${bestCompleteRoast}

Rewrite the previous response into a fresh complete roast. It must be 30 to 50 words and 3 to 5 short complete sentences. Do not stop mid-sentence. End the final sentence with proper punctuation.`
    : `${prompt}

Important: the previous response was incomplete. Return a fresh complete roast between 30 and 50 words. Write 3 to 5 short complete sentences. Do not stop mid-sentence. End the final sentence with proper punctuation.`;

  let repairedRoast = "";

  try {
    repairedRoast = await askGemini(repairPrompt, {
      temperature: 0.8,
      maxOutputTokens: 700,
    });
  } catch (error) {
    if (error.statusCode === 429 && bestCompleteRoast) {
      return bestCompleteRoast;
    }

    throw error;
  }

  lastRoast = repairedRoast;
  const repairedCompleteRoast = getCompletePrefix(repairedRoast);

  bestCompleteRoast = getBetterCompleteRoast(
    bestCompleteRoast,
    repairedCompleteRoast
  );

  if (
    isPreferredRoast(repairedCompleteRoast) ||
    isCompleteRoast(repairedCompleteRoast)
  ) {
    return repairedCompleteRoast;
  }

  if (bestCompleteRoast) {
    return bestCompleteRoast;
  }

  return `${normalizeRoast(lastRoast).replace(/[.!?\u0964\u0965]*$/, "")}.`;
};
