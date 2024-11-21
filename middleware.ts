import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/assistant/create',
  '/api/thread',
  '/api/message/create',
  '/api/message/list',
  '/api/run/create',
  '/api/run/retrieve',
  '/api/challenge-user',
  '/api/openai',
  '/manifest.json', // Ensure the manifest is treated as public
  '/images/icons/(.*)', // Ensure icon assets are public
]);
export  default  clerkMiddleware(async (auth, request) => {
  
  // if (!isPublicRoute(request) && request.nextUrl.pathname === '/') {
  //   if ((await auth()).userId) {
  //     return new Response(null, {
  //       status: 307,
  //       headers: { Location: '/profile' },
  //     });
  //   }
  // }
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)",
    // Add matcher to always allow public static files like manifest
    '/manifest.json',
    '/images/icons/(.*)',
  ],
};
