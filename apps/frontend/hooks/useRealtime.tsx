"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function useRealtime(userId: string, onChange: (payload?: any) => void) {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel("tasks-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${userId}`,
        },
        onChange
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])
}
