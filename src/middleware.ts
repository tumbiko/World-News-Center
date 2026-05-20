import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('wnc_session')?.value;

  // Protected paths
  const isAdminPath = pathname.startsWith('/admin');
  const isUploaderPath = pathname.startsWith('/uploader');
  const isReaderPath = pathname.startsWith('/reader');

  if (isAdminPath || isUploaderPath || isReaderPath) {
    if (!token) {
      // Redirect to login if token is missing
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Decode the JWT payload safely in the edge runtime without verify signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadDecoded = atob(payloadBase64);
      const user = JSON.parse(payloadDecoded);

      // Check role permissions
      if (isAdminPath && user.role !== 'ADMIN') {
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }

      if (isUploaderPath && user.role !== 'UPLOADER' && user.role !== 'ADMIN') {
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }

      // Readers can be READERS, UPLOADERS, or ADMINS
      if (isReaderPath && !['READER', 'UPLOADER', 'ADMIN'].includes(user.role)) {
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    } catch {
      // Token is corrupted or invalid, clear and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('wnc_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/uploader/:path*', '/reader/:path*'],
};
