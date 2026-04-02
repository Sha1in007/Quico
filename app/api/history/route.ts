import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import History from '@/models/History';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('quico_token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const history = await History.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('query result intent label emoji createdAt');

    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('quico_token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { id, all } = await req.json();

    await connectDB();

    if (all) {
      await History.deleteMany({ userId: decoded.id });
      return NextResponse.json({ message: 'All history cleared' });
    }

    if (id) {
      await History.findOneAndDelete({ _id: id, userId: decoded.id });
      return NextResponse.json({ message: 'Entry deleted' });
    }

    return NextResponse.json({ error: 'No target specified' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
