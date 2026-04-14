import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { groqJSON } from '@/lib/groq';
import connectDB from '@/lib/mongodb';
import History from '@/models/History';

interface Flashcard {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const SYSTEM = `You are an expert study materials creator generating exam-focused flashcards.
Return ONLY a valid JSON object — no markdown, no extra text, no explanation:
{"cards": [{"question": "...", "answer": "...", "difficulty": "easy|medium|hard"}]}
Rules:
- Questions should be specific and testable (definitions, differences, examples)
- Answers: 1-3 concise sentences
- Mix difficulties: ~30% easy, 50% medium, 20% hard
- Cover all major subtopics of the subject`;

export async function POST(req: NextRequest) {
  const token = cookies().get('quico_token')?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const user = verifyToken(token);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { topic, count = 10 } = await req.json();
    if (!topic?.trim()) return Response.json({ error: 'Topic is required' }, { status: 400 });

    const safeCount = Math.min(Math.max(Number(count) || 10, 5), 20);
    const data = await groqJSON<{ cards: Flashcard[] }>(
      `Generate exactly ${safeCount} exam flashcards on: "${topic}". Cover key definitions, concepts, differences, and applications.`,
      SYSTEM,
      2800,
    );

    const cards: Flashcard[] = Array.isArray(data?.cards) ? data.cards : [];

    await connectDB();
    await History.create({
      userId: user.id,
      query: topic,
      result: `Generated ${cards.length} flashcards`,
      intent: 'flashcards',
      label: 'Flashcards',
      emoji: '📇',
    });

    return Response.json({ cards });
  } catch (err) {
    console.error('[Flashcards]', err);
    return Response.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}
