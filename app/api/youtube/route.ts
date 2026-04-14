import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { groqJSON } from '@/lib/groq';
import connectDB from '@/lib/mongodb';
import History from '@/models/History';

export interface VideoResult {
  title: string;
  channel: string;
  url: string;
  duration: string;
  lang: 'hindi' | 'english';
  description: string;
}

const SYSTEM = `You are an educational YouTube video recommender for Indian engineering and science students.
Generate 6-8 realistic YouTube video recommendations for the given study topic.
Return ONLY valid JSON — no markdown, no extra text:
{"videos": [{"title": "...", "channel": "...", "url": "https://www.youtube.com/results?search_query=...", "duration": "X min", "lang": "hindi|english", "description": "..."}]}

Use well-known real Indian education YouTube channels:
English channels: Gate Smashers, Abdul Bari, Neso Academy, Jenny's Lectures, Striver, CodeWithHarry, Apna College, Kunal Kushwaha
Hindi channels: Physics Wallah, Unacademy, College Wallah, CodeWithHarry, Apna College

For "url": construct a YouTube search URL: https://www.youtube.com/results?search_query=CHANNEL+NAME+TOPIC
For "duration": give realistic estimates like "18 min", "45 min", "1 hr 20 min"
Generate a mix of Hindi (3-4) and English (3-4) videos.
Make titles realistic and specific (e.g., "Deadlock in OS | Complete Explanation | Gate Smashers").`;

export async function POST(req: NextRequest) {
  const token = cookies().get('quico_token')?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const user = verifyToken(token);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { topic, lang = 'both' } = await req.json();
    if (!topic?.trim()) return Response.json({ error: 'Topic is required' }, { status: 400 });

    const langHint =
      lang === 'hindi' ? 'Focus on Hindi education channels only.' :
      lang === 'english' ? 'Focus on English education channels only.' :
      'Include both Hindi and English videos.';

    const data = await groqJSON<{ videos: VideoResult[] }>(
      `Recommend the best YouTube study videos for the topic: "${topic}". ${langHint}`,
      SYSTEM,
      2200,
    );

    const videos: VideoResult[] = Array.isArray(data?.videos) ? data.videos : [];

    await connectDB();
    await History.create({
      userId: user.id,
      query: topic,
      result: `Found ${videos.length} videos`,
      intent: 'youtube',
      label: 'YouTube Videos',
      emoji: '▶️',
    });

    return Response.json({ videos });
  } catch (err) {
    console.error('[YouTube]', err);
    return Response.json({ error: 'Failed to find videos' }, { status: 500 });
  }
}
