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

  // 1. Быстрая проверка прав доступа
  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Логика обновления сессии
  if ((isPrivateRoute || isAuthRoute) && !accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      if (sessionResponse.status === 200) {
        const response = isAuthRoute 
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();

        // --- ИСПРАВЛЕНИЯ ПО ЗАМЕЧАНИЯМ МЕНТОРА ---
        
        const setCookieHeader = sessionResponse.headers['set-cookie'];

        if (setCookieHeader) {
          // А) Нормализация: превращаем в массив, если пришла строка
          const cookiesToProcess = Array.isArray(setCookieHeader) 
            ? setCookieHeader 
            : [setCookieHeader];

          cookiesToProcess.forEach((cookieString) => {
            // Б) Надежный парсинг (обрабатываем случай, если в значении есть "=")
            // Берем всё до первой точки с запятой
            const firstPart = cookieString.split(';')[0];
            // Находим индекс ПЕРВОГО вхождения "=", чтобы не сломать значение куки
            const firstEqualIndex = firstPart.indexOf('=');
            
            if (firstEqualIndex !== -1) {
              const name = firstPart.substring(0, firstEqualIndex).trim();
              const value = firstPart.substring(firstEqualIndex + 1).trim();

              response.cookies.set(name, value, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
              });
            }
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