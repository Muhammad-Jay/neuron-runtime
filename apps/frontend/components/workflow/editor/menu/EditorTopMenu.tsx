import { Play, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { PanelWrapper } from "@/components/workflow/editor/Panel/PanelWrapper";
import {useValidation} from "@/hooks/useValidation";
import {cn} from "@/lib/utils";

export function EditorTopMenu() {
    const { isValid } = useValidation();
    const {
        editorState,
        handleRunWorkflow,
        isRunning,
        setIsDeployWorkflowDialogOpen
    } = useWorkflowEditor();

    return (
        <PanelWrapper position="top-center" width="w-auto" className="mt-6">
            <div className="flex items-center gap-3 bg-neutral-900/50 backdrop-blur-xl border border-white/5 p-1 rounded-xl shadow-2xl">
                <div className="px-4 border-r border-white/10">
                    <p className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">Sequence</p>
                    <p className="text-xs font-medium text-white">{editorState.workflow?.name || "New Engine"}</p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handleRunWorkflow}
                        disabled={isRunning}
                        variant="ghost"
                        className="h-full px-4 gap-2 text-xs font-semibold text-neutral-300 hover:text-white rounded-xl transition-all"
                    >
                        <Play size={14} className={isRunning ? "animate-pulse" : ""} />
                        Execute
                    </Button>
                    <Button
                        disabled={!isValid}
                        onClick={() => setIsDeployWorkflowDialogOpen(true)}
                        className={cn("h-full px-5 gap-2 text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 rounded-xl shadow-lg transition-transform active:scale-95",
                            !isValid && "opacity-50 grayscale")}
                    >
                        <Rocket size={14} />
                        {isValid ? "Deploy" : "Fix Errors to Deploy"}
                    </Button>
                </div>
            </div>
        </PanelWrapper>
    );
}