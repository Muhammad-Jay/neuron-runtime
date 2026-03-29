"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {CreateWorkflowTabs} from "@/providers/WorkflowProvider";
import GeneralTab from "@/components/workflow/tabs/GeneralTab";
import {useWorkflows} from "@/hooks/workflow/useWorkflows";
import {Separator} from "@/components/ui/separator";

export function WorkflowConfigurationTabs() {
    const { setNewWorkflow } = useWorkflows();

    const handleFieldChange = (path: string, value: any) => {
        setNewWorkflow(prev => {
            const keys = path.split(".");

            const updated = { ...prev };
            let current: any = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;

            console.log(updated)
            return updated;
        });
    };

    return (
        <Tabs defaultValue={CreateWorkflowTabs.general} className="container-full flex- flex-col justify-start gap-2">
            <TabsList>
                <TabsTrigger value={CreateWorkflowTabs.general}>General</TabsTrigger>
                <TabsTrigger value={CreateWorkflowTabs.execution}>Execution</TabsTrigger>
                <TabsTrigger value={CreateWorkflowTabs.runtime}>Runtime</TabsTrigger>
                <TabsTrigger value={CreateWorkflowTabs.advanceSetting}>Advance Settings</TabsTrigger>
            </TabsList>
            <Separator className={'w-full'}/>

            <GeneralTab handleChange={handleFieldChange}/>
            <TabsContent value={CreateWorkflowTabs.execution}>
                <Card>
                    <CardHeader>
                        <CardTitle>Analytics</CardTitle>
                        <CardDescription>
                            Track performance and user engagement metrics. Monitor trends and
                            identify growth opportunities.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">
                        Page views are up 25% compared to last month.
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value={CreateWorkflowTabs.runtime}>
                <Card>
                    <CardHeader>
                        <CardTitle>Reports</CardTitle>
                        <CardDescription>
                            Generate and download your detailed reports. Export data in
                            multiple formats for analysis.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">
                        You have 5 reports ready and available to export.
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value={CreateWorkflowTabs.advanceSetting}>
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>
                            Manage your account preferences and options. Customize your
                            experience to fit your needs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">
                        Configure notifications, security, and themes.
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
