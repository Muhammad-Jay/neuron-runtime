"use client";

import {
    createContext,
    useEffect,
    useState,
    ReactNode
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {redirect} from "next/navigation";

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

    useEffect(() => {
        const supabase = createClient();
        // Get initial session
         supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        // Listen to auth changes
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInWithGoogle = async () => {
        setLoading(true);

        const supabase = createClient();

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });
    };
    
    const signInWithGithub = async () => {
        setLoading(true);

        const supabase =  createClient();

        const { data } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: 'http://localhost:3000/auth/callback',
            },
        })

        if (data.url) {
            redirect(data.url)
        }
    }

    const signOut = async () => {
        const supabase = createClient();

        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{ session, user, loading, signInWithGoogle, signInWithGithub, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

