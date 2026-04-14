import {NextRequest, NextResponse} from 'next/server';
import {updateSession} from '@/lib/supabase/proxy';
import {createSupabaseServerClient} from "@/lib/supabase/server";

export async function proxy(request: NextRequest) {
    const supabase = await createSupabaseServerClient();
    // IMPORTANT: Use getUser() to verify the session server-side
    const { data: { user } } = await supabase.auth.getUser();

    const url = request.nextUrl.clone();

    // 1. If not logged in and trying to access protected routes
    // if (!user && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/editor'))) {
    //     url.pathname = '/sign-in';
    //     return NextResponse.redirect(url);
    // }
    //
    // // 2. If logged in and trying to access auth pages (Sign-in/Sign-up)
    // if (user && (url.pathname === '/sign-in' || url.pathname === '/sign-up' || url.pathname === '/')) {
    //     url.pathname = '/dashboard';
    //     // We must pass the existing supabaseResponse's cookies to the new redirect
    //     return NextResponse.redirect(url);
    // }

  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
