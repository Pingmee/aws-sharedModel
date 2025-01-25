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
}

export interface NodeExecutable {
  execute: () => Promise<NodeExecutionResult>
  nextNodeIds: () => Promise<string[]>
}

export enum WorkflowExecutionStatus {
  idle = 'Idle',
  inProgress = 'In Progress',
  waitingForInput = 'Waiting For Input',
  success = 'Success',
  failure = 'Failure'
}

export type WorkflowExecution = {
  // Schema Keys
  id: string;
  createdAt: number
  associatedTo: string

  // TTL auto-remove
  maxTimeToLive?: number
  expiresAt?: number

  // runningNumber: number
  startTime?: number;
  endTime?: number;
  statusCase: WorkflowExecutionStatus;
  nodes: Record<string, NodeExecutionLog>;
  lastExecutedNodeId?: string
};
