import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const MODEL = 'llama-3.3-70b-versatile';

/** Robustly extract JSON from a response that may have markdown fences */
function extractJSON<T>(text: string): T {
  const trimmed = text.trim();
  // Strip possible ```json ... ``` fences
  const cleaned = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
  return JSON.parse(cleaned) as T;
}

/** Groq call expecting a structured JSON response */
export async function groqJSON<T>(
  userPrompt: string,
  systemPrompt: string,
  maxTokens = 2000,
): Promise<T> {
  const res = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  const text = res.choices[0]?.message?.content ?? '{}';
  return extractJSON<T>(text);
}

/** Groq call expecting a plain-text or markdown response */
export async function groqText(
  userPrompt: string,
  systemPrompt: string,
  maxTokens = 1500,
): Promise<string> {
  const res = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  return res.choices[0]?.message?.content ?? '';
}
