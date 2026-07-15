import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check for the better-auth session cookie
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
    loginUrl.searchParams.set('callbackURL', path);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if logged-in user tries to access login/register
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Match all paths except api, next static files, images, and favicon
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
