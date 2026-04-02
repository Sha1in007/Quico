import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/register'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('quico_token')?.value;
  const { pathname } = req.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (authRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
