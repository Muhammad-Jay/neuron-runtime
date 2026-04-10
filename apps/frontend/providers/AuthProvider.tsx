'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithGithub: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        // Listen to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // Refresh the page on specific events to sync Server Components
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                router.refresh();
            }
        });

        return () => subscription.unsubscribe();
    }, [router, supabase]);

    const signInWithGoogle = async () => {
        setLoading(true);
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Use window.location.origin to keep it dynamic
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    const signInWithGithub = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setLoading(false);
            console.error("Auth Error:", error.message);
        }
        // Note: OAuth redirects happen automatically via the browser,
        // no need for manual 'redirect(data.url)' here.
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/sign-in');
        router.refresh();
    };

    return (
        <AuthContext.Provider
            value={{
                session,
                user,
                loading,
                signInWithGoogle,
                signInWithGithub,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}