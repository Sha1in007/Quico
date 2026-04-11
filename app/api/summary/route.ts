import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { groqText } from '@/lib/groq';

const SYSTEMS: Record<string, string> = {
  short: `Summarize the given text/topic in a concise 3-5 sentence paragraph. Use plain, student-friendly language. Capture the most important ideas only.`,

  exam: `Create an exam-focused summary using markdown:
**Definition:** 1 sentence defining the core concept
**Key Concepts:** 4-6 bullet points of essential points
**Important Facts for Exam:** numbered list of 5-7 must-remember facts
**Likely Exam Questions:** 2-3 typical exam questions with brief hints
Be specific, accurate, and exam-oriented.`,

  lastday: `You are helping a student study the night before an exam. Create an ultra-condensed cheatsheet using markdown:
## Key Terms (5-8 must-know definitions)
## Core Concepts (5 most important points, 1 line each)  
## Formulas / Rules (if applicable)
## Remember These (5 quick exam tips)
Keep it scannable. Bold all key terms. No fluff.`,

  bullets: `Convert the given text/topic into a clean hierarchical bullet-point summary using markdown:
- Top-level bullet for each main concept
  - Sub-bullets for details, examples, or sub-concepts
  - **Bold** key terminology
  - Include any numbers, dates, formulas, or comparisons
Make it comprehensive but scannable.`,
};

export async function POST(req: NextRequest) {
  const token = cookies().get('quico_token')?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const user = verifyToken(token);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { text, mode = 'short' } = await req.json();
    if (!text?.trim()) return Response.json({ error: 'Text is required' }, { status: 400 });

    const system = SYSTEMS[mode] ?? SYSTEMS.short;
    const summary = await groqText(text, system, 1600);
    return Response.json({ summary });
  } catch (err) {
    console.error('[Summary]', err);
    return Response.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
