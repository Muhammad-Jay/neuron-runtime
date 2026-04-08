import {Activity, Database, History, Variable} from "lucide-react";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { PanelWrapper } from "@/components/workflow/editor/Panel/PanelWrapper";
import {TooltipButton} from "@/components/workflow/ToolTipButton";
import {useValidation} from "@/hooks/useValidation";
import {useMemo} from "react";

export function EditorRightMenu() {
    const {
        setIsExecutionsSheetOpen,
        setIsGlobalVariableSheetOpen,
        isWorkflowInspectorOpen,
        setIsWorkflowInspectorOpen,
    } = useWorkflowEditor();

    const { isValid, errors } = useValidation();
    const errorCount = useMemo(() => Object.keys(errors).length, [errors]);

    return (
        <PanelWrapper position="top-right" width="w-auto" className="mt-24 mr-2!">
            <div className="flex flex-col gap-2 bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
                <TooltipButton
                    icon={Database}
                    label="Live Insights"
                    side={"left"}
                    onClick={() => {/* Implement Trace logic */}}
                />
                <TooltipButton
                    icon={History}
                    label="Execution History"
                    side={"left"}
                    onClick={() => setIsExecutionsSheetOpen(true)}
                />
                <TooltipButton
                    icon={Variable}
                    label="Global Variables"
                    side={"left"}
                    onClick={() => setIsGlobalVariableSheetOpen(true)}
                />

                {!isValid && (
                    <div className="relative">
                        <TooltipButton
                            icon={(Activity)}
                            label={`Workflow Editor Errors`}
                            side={"left"}
                            className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 border-amber-500/20"
                            onClick={() => setIsWorkflowInspectorOpen(!isWorkflowInspectorOpen)}
                        />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse pointer-events-none" />
                    </div>
                )}
            </div>
        </PanelWrapper>
    );
}