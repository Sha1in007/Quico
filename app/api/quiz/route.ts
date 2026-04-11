import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { groqJSON } from '@/lib/groq';

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const SYSTEM = `You are an expert exam question creator generating MCQ questions for students.
Return ONLY a valid JSON object — no markdown, no extra text:
{"questions": [{"q": "Question text here", "options": ["A. Option1", "B. Option2", "C. Option3", "D. Option4"], "correct": 0, "explanation": "Clear explanation of why the answer is correct"}]}
Rules:
- The "correct" field is the 0-based index of the correct option (0=A, 1=B, 2=C, 3=D)
- Options must start with "A. ", "B. ", "C. ", "D. " 
- Easy: direct recall/definition questions
- Medium: application and understanding questions
- Hard: analysis and comparison questions
- Explanations must be educational and clear`;

export async function POST(req: NextRequest) {
  const token = cookies().get('quico_token')?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const user = verifyToken(token);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { topic, difficulty = 'medium', count = 10 } = await req.json();
    if (!topic?.trim()) return Response.json({ error: 'Topic is required' }, { status: 400 });

    const safeCount = Math.min(Math.max(Number(count) || 10, 5), 20);
    const data = await groqJSON<{ questions: QuizQuestion[] }>(
      `Generate exactly ${safeCount} ${difficulty}-difficulty MCQ questions on: "${topic}". Focus on key concepts, definitions, and real exam-style questions.`,
      SYSTEM,
      3500,
    );

    const questions: QuizQuestion[] = Array.isArray(data?.questions) ? data.questions : [];
    return Response.json({ questions });
  } catch (err) {
    console.error('[Quiz]', err);
    return Response.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
