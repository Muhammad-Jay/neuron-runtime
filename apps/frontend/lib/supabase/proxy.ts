import {NextRequest, NextResponse} from "next/server";
import {getSupabaseEnvironmentVariables} from "@/lib/utils";
import {createServerClient} from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
    // 1. Create an initial response
    const supabaseResponse = NextResponse.next({
        request,
    })

    const { supabaseUrl, supabaseAnonKey } = getSupabaseEnvironmentVariables();

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Update request cookies so subsequent server code sees them
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

                    // IMPORTANT: Only update the response object,
                    // do not re-initialize NextResponse.next() here.
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 2. Refresh the session
    const { data: { user } } = await supabase.auth.getUser()

    // 3. Handle Redirects
    const url = request.nextUrl.clone()

    // if ((!user && url.pathname.startsWith('/dashboard')) || (!user && url.pathname.startsWith('/editor'))) {
    //     url.pathname = '/sign-in'
    //     const redirectResponse = NextResponse.redirect(url)
    //     cookiesToSetInRedirect(supabaseResponse, redirectResponse)
    //     return redirectResponse
    // }
    //
    // if (user && (url.pathname === '/sign-in' || url.pathname === '/sign-up')) {
    //     url.pathname = '/dashboard'
    //     const redirectResponse = NextResponse.redirect(url)
    //     cookiesToSetInRedirect(supabaseResponse, redirectResponse)
    //     return redirectResponse
    // }

    return supabaseResponse || url.pathname === "/"
}

// Helper to ensure cookies move from the supabaseResponse to the redirect
function cookiesToSetInRedirect(src: NextResponse, dest: NextResponse) {
    src.cookies.getAll().forEach((cookie) => {
        dest.cookies.set(cookie.name, cookie.value)
    })
}