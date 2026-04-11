import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { groqJSON } from '@/lib/groq';

export interface PaperResult {
  title: string;
  university: string;
  subject: string;
  year: string;
  semester: string;
  type: 'pdf' | 'link';
  url: string;
  description: string;
}

const SYSTEM = `You are a university exam paper resource finder helping engineering and science students locate previous year question papers.
Generate 6-8 realistic paper search result cards.
Return ONLY valid JSON — no markdown, no extra text:
{"papers": [{"title": "...", "university": "...", "subject": "...", "year": "...", "semester": "...", "type": "pdf|link", "url": "https://...", "description": "..."}]}

For URLs, use real working search links:
- Mumbai University: https://old.mu.ac.in/question-papers/ or https://www.google.com/search?q=Mumbai+University+SUBJECT+question+paper+YEAR+pdf
- Anna University: https://www.annauniv.edu/downloads/question_papers.php
- VTU: https://vtu.ac.in/en/pages/previous-year-questions.php  
- General Google: https://www.google.com/search?q=UNIVERSITY+SUBJECT+previous+year+question+paper+YEAR+sem+SEMESTER+pdf

Generate results from diverse Indian universities: Mumbai, Anna, VTU, JNTU, Pune, GTU, RGPV, AKTU.
Use realistic years like 2023, 2022, 2021, 2020.`;

export async function POST(req: NextRequest) {
  const token = cookies().get('quico_token')?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const user = verifyToken(token);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { subject, university, year, semester } = await req.json();
    if (!subject?.trim()) return Response.json({ error: 'Subject is required' }, { status: 400 });

    const parts = [
      `Subject: ${subject}`,
      university ? `University preference: ${university}` : 'Any Indian university',
      year ? `Year: ${year}` : 'Recent years (2020-2024)',
      semester ? `Semester: ${semester}` : 'Any semester',
    ];

    const data = await groqJSON<{ papers: PaperResult[] }>(
      `Find previous year university exam question papers for:\n${parts.join('\n')}`,
      SYSTEM,
      2200,
    );

    const papers: PaperResult[] = Array.isArray(data?.papers) ? data.papers : [];
    return Response.json({ papers });
  } catch (err) {
    console.error('[PYQFinder]', err);
    return Response.json({ error: 'Failed to find papers' }, { status: 500 });
  }
}
