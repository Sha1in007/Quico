import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { groqText } from '@/lib/groq';
import connectDB from '@/lib/mongodb';
import History from '@/models/History';

const SYSTEM: Record<string, string> = {
  short: `You are a friendly student study assistant. Answer in 2-4 sentences using simple, clear language a student can immediately understand. Be direct — no fluff.`,
  long: `You are an expert academic tutor. Provide a comprehensive answer suitable for a 10-mark exam question. Use markdown formatting with: **Definition**, then numbered key points, then a real example, then a brief conclusion. Be thorough but clear.`,
  viva: `You are conducting a viva-voce exam. Give a precise, confident oral-exam-style answer in 40-60 words. Start with the direct definition or answer, then add 1 key supporting point. Technical and concise.`,
};

export async function POST(req: NextRequest) {
  const token = cookies().get('quico_token')?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const user = verifyToken(token);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { query, mode = 'short' } = await req.json();
    if (!query?.trim()) return Response.json({ error: 'Query is required' }, { status: 400 });

    const systemPrompt = SYSTEM[mode] ?? SYSTEM.short;
    const answer = await groqText(query, systemPrompt, 1200);

    await connectDB();
    await History.create({
      userId: user.id,
      query: query,
      result: answer.substring(0, 100) + (answer.length > 100 ? '...' : ''),
      intent: 'qa',
      label: 'Q&A Revision',
      emoji: '💭',
    });

    return Response.json({ answer });
  } catch (err) {
    console.error('[QA]', err);
    return Response.json({ error: 'Failed to generate answer' }, { status: 500 });
  }
}
