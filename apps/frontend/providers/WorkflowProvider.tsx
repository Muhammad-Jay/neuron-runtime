'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import type { NewWorkflowType, WorkflowType } from '@neuron/shared';
import { NewWorkflowGeneralType, WorkflowAction } from '@/types/workflow';
import {
  createWorkflowRequest,
  getWorkflowsRequest,
} from '@/lib/api-client/client';
import { WorkflowActionType } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { toWorkflowTableSchema } from '@/lib/utils';

export const CreateWorkflowTabs = {
  general: 'General',
  execution: 'Execution',
  runtime: 'Runtime',
  advanceSetting: 'AdvanceSetting',
};

type WorkflowContextType = {
  workflows: WorkflowType[];
    workflowsDispatcher: (action: WorkflowAction) => void;
  newWorkflow: INewWorkflow;
  setNewWorkflow: (prev: any) => void; // TODO: FIX Type
  isWorkflowLoading: boolean;
  workflowErrors: string | null;
  refetch: () => Promise<void>;
  createWorkflow: () => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  AddNewWorkflow: (newWorkflow: WorkflowType) => Promise<void>;
};

interface INewWorkflow {
  general: NewWorkflowGeneralType;
}

export const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  const [workflows, workflowsDispatcher] = useReducer(
    workflowsReducer,
    [] as WorkflowType[]
  );
  const [newWorkflow, setNewWorkflow] = useState<INewWorkflow>({
    general: {
      name: '',
      description: '',
      category: '',
      template: 'gpt-4o',
    },
  });
  const [isWorkflowLoading, setIsWorkflowLoading] = useState(true);
  const [workflowErrors, setWorkflowErrors] = useState<string | null>(null);
  const supabase = createClient();

  function workflowsReducer(
    state: WorkflowType[],
    action: WorkflowAction
  ): WorkflowType[] {
    switch (action.type) {
      case WorkflowActionType.SET_WORKFLOWS:
        return action.payload;
      case WorkflowActionType.ADD_WORKFLOW:
        return [action.payload, ...state];
      case WorkflowActionType.UPDATE_WORKFLOW:
        return state.map((w) =>
          w.id === action.id ? { ...w, ...action.payload } : w
        );
      case WorkflowActionType.DELETE_WORKFLOW:
        return state.filter((w) => w.id !== action.id);
      case WorkflowActionType.UPDATE_STATUS:
        return state.map((w) =>
          w.id === action.id ? { ...w, status: action.status } : w
        );
      default:
        return state;
    }
  }

  const fetchWorkflows = useCallback(async () => {
    const supabase = createClient();
    try {
      setIsWorkflowLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('No active session found');
      }

      const token = session.access_token;

      const data = await getWorkflowsRequest(token);

      if (data.success === false) {
        console.log(data.error);
        return;
      }

      workflowsDispatcher({
        type: WorkflowActionType.SET_WORKFLOWS,
        payload: data.data,
      });
    } catch (err: any) {
      setWorkflowErrors(err.message);
    } finally {
      setIsWorkflowLoading(false);
    }
  }, [supabase]);

  const createWorkflow = async () => {
    const supabase = createClient();
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('No active session found');
      }

      const token = session.access_token;

      const data: NewWorkflowType = {
        name: newWorkflow.general.name,
        description: newWorkflow.general.description,
        userId: user.id,
        status: 'active',
        isActive: false,
        runs: 0,
      };

      const convertedData = toWorkflowTableSchema(data);

      const res = await createWorkflowRequest(convertedData, token);

      // workflowsDispatcher({
      //     type: WorkflowActionType.ADD_WORKFLOW,
      //     payload: res.data
      // })

      console.log(res);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const AddNewWorkflow = async (newWorkflow: WorkflowType) => {
    workflowsDispatcher({
      type: WorkflowActionType.ADD_WORKFLOW,
      payload: newWorkflow,
    });
  };

  const deleteWorkflow = async (id: string) => {
    try {
      workflowsDispatcher({
        type: WorkflowActionType.DELETE_WORKFLOW,
        id,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <WorkflowContext.Provider
      value={{
        workflows,
          workflowsDispatcher,
        newWorkflow,
        setNewWorkflow,
        isWorkflowLoading,
        workflowErrors,
        refetch: fetchWorkflows,
        createWorkflow,
        deleteWorkflow,
        AddNewWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}
