import { NextRequest, NextResponse } from 'next/server';

export const HOME_PATH = '/ranking';

export async function middleware(request: NextRequest) {
  const pathname = decodeURIComponent(request.nextUrl.pathname);

  if (pathname === '/') {
    return NextResponse.redirect(new URL(HOME_PATH as string, request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)'],
};
