"use client";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {DialogWrapper} from "@/components/DialogWrapper";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useState} from "react";
import {WorkflowType} from "../../../shared/src/types/workflow.types";
import {nanoid} from "nanoid";
import {useWorkflows} from "@/hooks/workflow/useWorkflows";
import {WorkflowConfigurationTabs} from "@/components/workflow/WorkflowConfigurationTabs";

export const WorkflowsHeader = () => {
    const { AddNewWorkflow, createWorkflow } = useWorkflows();
    const [newWorkflow, setNewWorkflow] = useState<WorkflowType>({
        id: nanoid(),
        isActive: false,
        name: "",
        description: "",
        status: "draft",
        runs: 0,
        userId: "ds",
        createdAt: new Date(),
        updatedAt: new Date()
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewWorkflow(prev => ({...prev, title: e.target.value}))
    }

    const handleClick = async () => {
        await AddNewWorkflow(newWorkflow);
        await createWorkflow();
    }

    return (
      <div className={cn('between flex-row p-2.5 gap-2.5 h-fit w-full')}>
          <div className={cn('container-full')}>

          </div>

          <div className={cn('center gap-1.5')}>
              <DialogWrapper
                  triggerButton={(
                      <Button
                          className={cn('h-8 gap-1.5')}
                          variant={'default'}>
                          <PlusIcon size={15}/>
                          New
                      </Button>
                  )}
                  title={"Create New Workflow"}
                  description={""}
                  actionButton={(
                      <Button
                          className={cn('h-7 gap-1.5')}
                          onClick={handleClick}
                          variant={'default'}>
                          <PlusIcon size={15}/>
                          Create
                      </Button>
                  )}
              >
                  <div className={cn('h-100 w-full flex justify-start items-center flex-col')}>
                      <WorkflowConfigurationTabs/>
                  </div>
              </DialogWrapper>
          </div>
      </div>
    );
}