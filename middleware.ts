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
  '/manifest.json',
  '/images/icons/(.*)', // Ensure icon assets are public
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    try {
      await auth.protect(); // Will throw if user is not authenticated
    } catch (error) {
      // Handle the redirect to /sign-in manually
      console.error(error);
      return Response.redirect('/sign-in');
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/manifest.json',
    '/images/icons/(.*)',
  ],
};
