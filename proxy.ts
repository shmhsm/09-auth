import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const privateRoutes = ['/profile', '/notes'];
  const authRoutes = ['/sign-in', '/sign-up'];

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPrivateRoute || isAuthRoute) {
    try {
      const response = await checkSession(); 
      
      if (isPrivateRoute && response.status !== 200) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
      if (isAuthRoute && response.status === 200) {
        return NextResponse.redirect(new URL('/profile', request.url));
      }

      const nextResponse = NextResponse.next();
      
      const setCookie = response.headers['set-cookie'];
      if (setCookie) {
        nextResponse.headers.set('set-cookie', setCookie.join(', '));
      }
      
      return nextResponse;
    } catch {
      if (isPrivateRoute) return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up'
  ],
};