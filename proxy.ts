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

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if ((isPrivateRoute || isAuthRoute) && !accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      if (sessionResponse.status === 200) {
        const response = isAuthRoute 
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();

        const setCookieHeader = sessionResponse.headers['set-cookie'];
        if (setCookieHeader) {
          setCookieHeader.forEach((cookieString) => {
            const [fullCookie] = cookieString.split(';');
            const [name, value] = fullCookie.split('=');
            response.cookies.set(name.trim(), value.trim(), {
              path: '/',
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
            });
          });
        }
        return response;
      }
    } catch (error) {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
    '/profile/:path*',
    '/notes',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};