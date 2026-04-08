"use client";

import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    getExecutionMetricsRequest,
    getRecentExecutionsRequest,
} from "@/lib/api-client/dashboard.client";
import {Execution, ExecutionLog, RuntimeActionType} from "@/types";
import {getExecutionsLogsRequest} from "@/lib/api-client/client";

interface DashboardContextType {
    metrics: any;
    executions: Execution[];
    loading: boolean;
    isLogsLoading: boolean;
    refresh: () => Promise<void>;
    currentExecId: string;
    logs: Record<string, ExecutionLog>;
    getExecutionLogs: (executionId: string) => Promise<Record<string, ExecutionLog>>;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [metrics, setMetrics] = useState<any>(null);
    const [executions, setExecutions] = useState<Execution[]>([]);
    const [currentExecId, setCurrentExecId] = useState("");
    const [logs, setLogs] = useState<Record<string, ExecutionLog>>({});
    const [loading, setLoading] = useState(true);
    const [isLogsLoading, setIsLogsLoading] = useState(false);

    const supabase = useMemo(() => createClient(), []);

    const getToken = useCallback(async () => {
        const { data } = await supabase.auth.getSession();

        if (!data.session) throw new Error("No session");

        return data.session.access_token;

    }, [supabase]);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);

            const token = await getToken();

            const [metricsRes, executionsRes] = await Promise.all([
                getExecutionMetricsRequest(token),
                getRecentExecutionsRequest(token, 20),
            ]);

            setMetrics(metricsRes);
            setExecutions(executionsRes);

            if(executionsRes){
                const lastExecId = executionsRes[0]?.id ?? null;

                if (lastExecId) {
                    await getExecutionLogs(lastExecId);
                }
            }
        } catch (error) {
            console.error("Dashboard Intelligence Sync Failed:", error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    const getExecutionLogs = useCallback(async (executionId: string) => {
        try{
            setIsLogsLoading(true);

            setCurrentExecId(executionId);
            const token = await getToken();

            const data = await getExecutionsLogsRequest(executionId, token)

            if (data) {
                const logsRecord: Record<string, ExecutionLog> = {}

                data.map((e: ExecutionLog) => logsRecord[e.id] = e);

                setLogs(logsRecord);

                return logsRecord;
            }

            return {}
        }catch (e) {
            console.log(e.message);
        }finally {
            setIsLogsLoading(false);
        }
    }, [logs, setLogs])


    // Initial Sync
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Background Refresh every 60 seconds for "Live" feel
    useEffect(() => {
        const interval = setInterval(fetchDashboardData, 60000);
        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    const value = useMemo(() => ({
        metrics,
        executions,
        logs,
        loading,
        isLogsLoading,
        refresh: fetchDashboardData,
        getExecutionLogs,
        currentExecId,
    }), [
        metrics,
        executions,
        logs,
        loading,
        isLogsLoading,
        fetchDashboardData,
        getExecutionLogs,
        currentExecId
    ]);

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}