import { NodeType } from './Nodes'

export type NodeExecutionLog = {
  type: NodeType;
  status: WorkflowExecutionStatus;
  startTime?: number;
  endTime?: number;
  output?: any;
  error?: string
};

export type NodeExecutionResult = {
  output: any;
  waitForResponse: boolean
  waitForSubflow?: boolean
}

export interface NodeExecutable {
  execute: () => Promise<NodeExecutionResult>
  nextNodeIds: () => Promise<string[]>
}

export enum WorkflowExecutionStatus {
  idle = 'Idle',
  inProgress = 'In Progress',
  waitingForInput = 'Waiting For Input',
  waitingForSubWorkflow = 'Waiting For Sub Workflow',
  success = 'Success',
  failure = 'Failure',
  expired = 'Expired'
}

export type WorkflowExecution = {
  // Schema Keys
  id: string;
  customerPhoneNumberId: string;
  associatedToWorkflowId: string;
  createdAt: number
  associatedTo: string
  participantsIdentifiers: string

  ignoreAfterTimestamp?: number

  // TTL auto-remove
  expiresAt?: number

  runningNumber: number
  startTime?: number;
  endTime?: number;
  statusCase: WorkflowExecutionStatus;
  nodes: Record<string, NodeExecutionLog>;
  lastExecutedNodeId?: string
};
