// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the authentication token from the user's cookies.
  //    We'll assume your login API sets a cookie named 'auth-token'.
  const token = request.cookies.get('auth-token')?.value;

  // 2. Get the path the user is trying to access.
  const { pathname } = request.nextUrl;

  // 3. Define your routes.
  //    Protected routes require the user to be logged in.
  const protectedRoutes = ['/chat'];
  //    Public routes are for unauthenticated users (e.g., home, login).
  const publicRoutes = ['/'];

  // Check if the current path is one of the protected routes.
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  // Check if the current path is one of the public/auth routes.
  const isPublicRoute = publicRoutes.includes(pathname);

  // 4. Implement the redirection logic.

  // RULE 1: If user is trying to access a protected route WITHOUT a token,
  // redirect them to the login page.
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // RULE 2: If user is LOGGED IN (has a token) and tries to access a public route
  // (like the homepage or login page), redirect them to the chat dashboard.
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  // If none of the above rules match, allow the request to proceed.
  return NextResponse.next();
}

// 5. Configure the matcher to specify which routes the middleware should run on.
// This is a performance optimization.
export const config = {
  matcher: [
    // List of all routes to apply the middleware to.
    '/',
    '/chat/:path*', // Matches /chat and any sub-paths like /chat/123
  ],
};