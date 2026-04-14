import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { groqJSON } from '@/lib/groq';
import connectDB from '@/lib/mongodb';
import History from '@/models/History';

export interface MindNode {
  label: string;
  children: MindNode[];
}

const SYSTEM = `You are an expert at creating educational mind maps for students.
Return ONLY a valid JSON object — no markdown, no extra text:
{"label": "Main Topic", "children": [{"label": "Subtopic 1", "children": [{"label": "Detail A", "children": []}, {"label": "Detail B", "children": []}]}, {"label": "Subtopic 2", "children": []}]}
Rules:
- Maximum 3 levels deep (root → subtopics → details)
- Root: the main topic (1-4 words)
- Level 1: 4-6 major subtopics (2-5 words each)
- Level 2: 2-4 details per subtopic (2-4 words each)
- Labels must be SHORT (max 5 words)
- Cover all important aspects comprehensively`;

export async function POST(req: NextRequest) {
  const token = cookies().get('quico_token')?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const user = verifyToken(token);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { topic } = await req.json();
    if (!topic?.trim()) return Response.json({ error: 'Topic is required' }, { status: 400 });

    const tree = await groqJSON<MindNode>(
      `Create a comprehensive mind map for the academic topic: "${topic}". Include all major subtopics and key concepts that a student needs to know.`,
      SYSTEM,
      2000,
    );

    await connectDB();
    await History.create({
      userId: user.id,
      query: topic,
      result: `Generated mind map`,
      intent: 'mindmap',
      label: 'Mind Map',
      emoji: '🌿',
    });

    return Response.json({ tree });
  } catch (err) {
    console.error('[Mindmap]', err);
    return Response.json({ error: 'Failed to generate mindmap' }, { status: 500 });
  }
}
