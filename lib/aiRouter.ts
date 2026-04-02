import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type Intent =
  | 'summarize'
  | 'explain_code'
  | 'generate_email'
  | 'generate_ideas'
  | 'general';

export interface AIResult {
  result: string;
  intent: Intent;
  label: string;
  emoji: string;
}

/* ----------  Intent Detection  ---------- */

export function detectIntent(input: string): Intent {
  const lower = input.toLowerCase().trim();

  const patterns: [Intent, RegExp][] = [
    ['summarize', /\b(summarize|summary|summarise|tldr|tl;dr|brief|shorten|condense)\b/],
    [
      'explain_code',
      /\b(explain|what does|how does|debug|fix|review|refactor|analyse|analyze)\b.*\b(code|function|class|snippet|script|program|bug|error)\b/,
    ],
    ['explain_code', /```[\s\S]+```/],
    ['explain_code', /\b(def |const |let |var |import |function |class )\b/],
    [
      'generate_email',
      /\b(write|generate|draft|compose|create)\b.*\b(email|mail|message|letter)\b/,
    ],
    ['generate_email', /\b(email|formal email|professional email)\b/],
    [
      'generate_ideas',
      /\b(idea|ideas|suggest|brainstorm|startup|project|creative|innovate|give me)\b/,
    ],
  ];

  for (const [intent, pattern] of patterns) {
    if (pattern.test(lower)) return intent;
  }

  return 'general';
}

/* ----------  System Prompts  ---------- */

const systemPrompts: Record<Intent, string> = {
  summarize: `You are a concise, expert summarizer. When given text:
- Start with a 1-2 sentence high-level summary in bold
- Follow with 3-5 bullet points of key takeaways
- End with a "Key Insight:" line
Keep your language clear and jargon-free. Format using markdown.`,

  explain_code: `You are an expert software engineer and teacher. When given code:
- First identify the programming language
- Provide a plain-English explanation of what the code does
- Break down the key logic step by step
- Highlight any potential issues or improvements
- Use code blocks with syntax highlighting when referencing code
Format using clean markdown.`,

  generate_email: `You are a professional communication expert. When asked to write an email:
- Generate a complete, ready-to-send email
- Format as: **Subject:** ... then the full email body
- Adapt tone (formal/casual) based on context
- Keep it concise but complete
- Include a proper greeting and sign-off
Format using markdown.`,

  generate_ideas: `You are a creative strategist and innovation consultant. When asked for ideas:
- Generate 5-7 unique, actionable ideas
- Format as a numbered list
- For each idea: bold title + 1-2 sentence description
- Focus on ideas that are practical and impactful
- End with a "Best Bet:" recommendation
Format using markdown.`,

  general: `You are Quico, a sharp and helpful AI assistant. Provide concise, accurate, and well-formatted responses. Use markdown for structure. Be direct and avoid unnecessary filler.`,
};

/* ----------  Intent Meta  ---------- */

export const intentMeta: Record<Intent, { label: string; emoji: string; color: string }> = {
  summarize: { label: 'Summarize', emoji: '📝', color: 'text-blue-400' },
  explain_code: { label: 'Explain Code', emoji: '💻', color: 'text-green-400' },
  generate_email: { label: 'Generate Email', emoji: '✉️', color: 'text-yellow-400' },
  generate_ideas: { label: 'Generate Ideas', emoji: '💡', color: 'text-orange-400' },
  general: { label: 'General', emoji: '✨', color: 'text-violet-400' },
};

/* ----------  Main Process Function  ---------- */

export async function processQuery(query: string): Promise<AIResult> {
  const intent = detectIntent(query);
  const meta = intentMeta[intent];

  const message = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    messages: [
      {
        role: 'system',
        content: systemPrompts[intent],
      },
      {
        role: 'user',
        content: query,
      },
    ],
  });

  const result = message.choices[0]?.message?.content || '';

  return {
    result,
    intent,
    label: meta.label,
    emoji: meta.emoji,
  };
}
