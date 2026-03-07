import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/about(.*)', '/sign-up(.*)', '/overview(.*)', '/', '/manifest.json(.*)'])
const isAdminRoute = createRouteMatcher(['/dashboard(.*)', '/admin(.*)'])

export default clerkMiddleware(
  async (auth, req) => {
    const { sessionClaims } = await auth();
    const userRole = sessionClaims?.metadata?.role

    // Protect all routes starting with `/admin`
    if (isAdminRoute(req) && !(userRole === 'admin' || userRole === 'moderator')) {
      const url = new URL('/unauthorized', req.url);
      return NextResponse.redirect(url);
    }

    if (!isPublicRoute(req)) {
      await auth.protect()
    }
  }
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}