'use client';

import { WorkflowLoadingSkeleton } from '@/components/workflow/WorkflowLoadingSkeleton';
import { WorkflowErrorState } from '@/components/workflow/WorkflowErrorState';
import { useWorkflows } from '@/hooks/workflow/useWorkflows';
import { useWorkspaces } from '@/hooks/workspace/useWorkspace'; // New
import { WorkflowsHeader } from '@/components/workflow/WorkflowsHeader';
import { WorkspaceContainer } from '@/components/workflow/workspace/WorkspaceContainer';
import { useRouter } from 'next/navigation';

export default function WorkflowPage() {
    const router = useRouter();
    const { workspaces, isLoading: isWorkspaceLoading } = useWorkspaces();
    const {
        workflows,
        isWorkflowLoading,
        workflowErrors,
        deleteWorkflow,
    } = useWorkflows();

    const isLoading = isWorkflowLoading || isWorkspaceLoading;

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 lg:p-5">
            <WorkflowsHeader />

            {isLoading ? (
                <WorkflowLoadingSkeleton />
            ) : workflowErrors ? (
                <WorkflowErrorState message={workflowErrors} />
            ) : (
                <WorkspaceContainer
                    workflows={workflows}
                    deleteWorkflow={deleteWorkflow}
                    onCardClick={(id) => router.push(`/editor/${id}`)}
                />
            )}
        </div>
    );
}