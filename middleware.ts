import { NextResponse } from 'next/server';

export async function middleware() {
	// Middleware disabled - using client-side auth checks in dashboard layout
	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*'], // Specify the routes the middleware applies to
};
