import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { processQuery } from '@/lib/aiRouter';
import connectDB from '@/lib/mongodb';
import History from '@/models/History';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('quico_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await req.json();
    const query: string = body?.query?.trim();

    if (!query) {
      return NextResponse.json({ error: 'Query cannot be empty' }, { status: 400 });
    }

    if (query.length > 5000) {
      return NextResponse.json(
        { error: 'Query is too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    const { result, intent, label, emoji } = await processQuery(query);

    // Save to history
    await connectDB();
    const historyEntry = await History.create({
      userId: decoded.id,
      query,
      result,
      intent,
      label,
      emoji,
    });

    return NextResponse.json({
      result,
      intent,
      label,
      emoji,
      historyId: historyEntry._id,
    });
  } catch (error: unknown) {
    console.error('[AI Route Error]', error);
    const message =
      error instanceof Error ? error.message : 'Failed to process your request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
