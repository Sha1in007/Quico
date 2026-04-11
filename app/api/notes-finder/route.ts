import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { groqJSON } from '@/lib/groq';

export interface NoteResult {
  title: string;
  source: string;
  type: 'drive' | 'pdf' | 'notes' | 'topper';
  url: string;
  description: string;
}

const SYSTEM = `You are a study resource curator helping students find handwritten notes and study materials.
Generate 8-10 realistic search result cards for the given topic.
Return ONLY valid JSON — no markdown, no extra text:
{"results": [{"title": "...", "source": "Google Drive|Scribd|Academia.edu|StudyLib|SlideShare", "type": "drive|pdf|notes|topper", "url": "https://...", "description": "..."}]}

For URLs, use real working search URLs:
- Google Drive search: https://drive.google.com/drive/search?q=TOPIC+handwritten+notes+pdf
- Google site search: https://www.google.com/search?q=site:drive.google.com+TOPIC+notes+filetype:pdf
- Scribd: https://www.scribd.com/search?query=TOPIC+notes
- Academia: https://www.academia.edu/search?q=TOPIC
- SlideShare: https://www.slideshare.net/search/slideshow?searchfrom=header&q=TOPIC+notes

Replace TOPIC with the actual URL-encoded topic words.
Vary the types: include 3-4 drive links, 2-3 PDF search links, 1-2 topper notes.
Make titles realistic (e.g., "DBMS Normalization Handwritten Notes - B.Tech CSE").`;

export async function POST(req: NextRequest) {
  const token = cookies().get('quico_token')?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const user = verifyToken(token);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { topic } = await req.json();
    if (!topic?.trim()) return Response.json({ error: 'Topic is required' }, { status: 400 });

    const data = await groqJSON<{ results: NoteResult[] }>(
      `Find handwritten notes, PDF study materials, topper notes, and short revision notes for the topic: "${topic}". Include varied sources.`,
      SYSTEM,
      2200,
    );

    const results: NoteResult[] = Array.isArray(data?.results) ? data.results : [];
    return Response.json({ results });
  } catch (err) {
    console.error('[NotesFinder]', err);
    return Response.json({ error: 'Failed to find notes' }, { status: 500 });
  }
}
