"use server";

import {createSupabaseServerClient as createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export async function signInWithGithub() {
    const supabase = await createClient();
    const { data } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: 'http://localhost:3000/auth/callback',
        },
    })

    if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
    }
}