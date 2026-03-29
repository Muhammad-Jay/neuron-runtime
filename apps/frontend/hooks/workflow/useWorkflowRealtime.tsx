"use client"

import {useEffect} from "react";
import {createClient} from "@/lib/supabase/client";

export function useWorkflowRealtime(runId: string, workflowEditorDispatch: any) {

    useEffect(() => {
        if (!runId) return;

        const supabase = createClient();

        const channel = supabase
            .channel(`workflow_${runId}`)
            .on('broadcast', { event: 'workflow_action' }, ({ payload }) => {
                workflowEditorDispatch({
                    type: payload.type,
                    ...payload // Contains nodeId, edgeId, output, etc.
                });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel).then(r => console.log(r)); };
    }, [runId, workflowEditorDispatch]);
}