import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for the better-auth session cookie
  // Better Auth uses 'better-auth.session_token' or '__Secure-better-auth.session_token'
  const hasSession = 
    request.cookies.has("better-auth.session_token") || 
    request.cookies.has("__Secure-better-auth.session_token");
    
  const path = request.nextUrl.pathname;
  
  // List of routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/bookings",
    "/wishlist",
    "/items"
  ];
  
  // Check if the current path starts with any of the protected routes
  const isProtected = protectedRoutes.some(route => path.startsWith(route));
  
  // Redirect to login if user tries to access a protected route without a session
  if (isProtected && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    // Optionally preserve the original URL they were trying to access
    loginUrl.searchParams.set('callbackURL', path);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  // Match all paths except api, next static files, images, and favicon
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
