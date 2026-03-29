"use client"

import React, {createContext, useCallback, useEffect, useState} from "react"
import {toast} from "sonner"
import {Secret} from "@/types/workflow";
import {createSecretRequest, deleteSecretRequest, getSecretRequest} from "@/lib/api-client/client";
import {createClient} from "@/lib/supabase/client";

interface VaultContextType {
    secrets: Secret[]
    isLoading: boolean
    refreshSecrets: () => Promise<void>
    addSecret: (name: string, value: string) => Promise<void>
    removeSecret: (id: string) => Promise<void>
}

export const VaultContext = createContext<VaultContextType | undefined>(undefined)

export function VaultProvider({ children }: { children: React.ReactNode }) {
    const [secrets, setSecrets] = useState<Secret[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const getSession = useCallback(async () => {
        const supabase = createClient();

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            throw new Error("No active session found");
        }

        return session.access_token;
    }, [])


    // 1. Load Secrets from Express API
    const refreshSecrets = useCallback(async () => {
        setIsLoading(true)
        try {
            const token = await getSession();

            const response = await getSecretRequest(token);

            console.log(response)
            setSecrets(response)
        } catch (error) {
            console.error("Vault Error:", error)
            toast.error("Could not load secrets from vault")
        } finally {
            setIsLoading(false)
        }
    }, [])

    // 2. Initial Load
    useEffect(() => {
        refreshSecrets()
    }, [refreshSecrets])

    // 3. Create Secret Action
    const addSecret = async (name: string, value: string) => {
        try {
            const token = await getSession();
            await createSecretRequest(name, value, token);
            toast.success("Secret stored securely")
            await refreshSecrets()
        } catch (error) {
            toast.error("Failed to encrypt and store secret")
        }
    }

    // 4. Delete Secret Action
    const removeSecret = async (id: string) => {
        try {
            const token = await getSession();
            await deleteSecretRequest(id, token);
            setSecrets((prev) => prev.filter((s) => s.id !== id))
            toast.success("Secret removed from vault")
        } catch (error) {
            toast.error("Could not delete secret")
        }
    }

    return (
        <VaultContext.Provider value={{ secrets, isLoading, refreshSecrets, addSecret, removeSecret }}>
            {children}
        </VaultContext.Provider>
    )
}