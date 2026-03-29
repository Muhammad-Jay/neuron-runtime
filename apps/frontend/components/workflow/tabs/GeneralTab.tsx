'use client';

import {TabsContent} from "@/components/ui/tabs";
import {CreateWorkflowTabs} from "@/providers/WorkflowProvider";
import {cn} from "@/lib/utils";
import {useWorkflows} from "@/hooks/workflow/useWorkflows";
import FormField from "@/components/FormField";

type Props = {
    handleChange?: (path: string, value: string) => void;
}

export default function GeneralTab({ handleChange }: Props) {
    const { newWorkflow } = useWorkflows();

    return (
        <TabsContent className={"container-full"} value={CreateWorkflowTabs.general}>
            <div className={cn('container-full! flex-col center items-start! justify-start! p-5 gap-1.5')}>
                <FormField
                    label="Name"
                    type="text"
                    path="general.name"
                    value={newWorkflow.general.name}
                    onChange={handleChange}
                    placeholder="Enter workflow name"
                />

                <FormField
                    label="Description"
                    type="textArea"
                    path="general.description"
                    value={newWorkflow.general.description}
                    onChange={handleChange}
                    placeholder="Enter workflow description"
                />

                <FormField
                    label="Default Model"
                    type="select"
                    path="general.category"
                    value={newWorkflow.general.category}
                    onChange={handleChange}
                    options={[
                        { label: "GPT-4o", value: "gpt-4o" },
                        { label: "Claude 3", value: "claude-3" },
                        { label: "Custom Model", value: "custom" },
                    ]}
                />

                <FormField
                    label="Template"
                    description={"Choose a template to get started."}
                    type="card"
                    path="general.template"
                    value={newWorkflow.general.template}
                    onChange={handleChange}
                    options={[
                        { label: "GPT-4o", value: "gpt-4o" },
                        { label: "Claude 3", value: "claude-1" },
                        { label: "Custom Model", value: "gemini-2.0" },
                        { label: "Claude 3", value: "claude-2" },
                        { label: "Custom Model", value: "gemini-2.0-flash" },
                        { label: "Claude 3", value: "claude-3" },
                    ]}
                />

                {/*<FormField*/}
                {/*    label="Enable Memory"*/}
                {/*    type="switch"*/}
                {/*    value={new}*/}
                {/*    onChange={setEnabled}*/}
                {/*    description="Allow the workflow to retain contextual memory."*/}
                {/*/>*/}
            </div>
        </TabsContent>
    )
}