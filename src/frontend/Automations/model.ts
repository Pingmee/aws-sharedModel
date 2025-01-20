import { Variable } from './automations'
import { ConditionType, NodeSpecificData, NodeType, SubNodeData } from './Nodes'

export enum NodeCategory {
  trigger = 'Trigger',
  condition = 'Condition',
  action = 'Action',
  note = 'Note',
  answer = 'Answer'
}

export type WorkflowNode = {
  id: string;
  parentId?: string,
  type: NodeType;
  category: NodeCategory
  title?: string;
  data: NodeSpecificData;
  connections: Record<string, string[]>;
  subNodes?: WorkflowNode[]
};

export interface SubNodeConfigType {
  subNodeType: NodeType;
  defaultNodes?: SubNodeData[];
  editable?: boolean;
  nodesEditable?: boolean;
  subNodesLimit?: number;
}

export interface Condition {
  id: string
  firstValue?: Variable;
  comparison: ConditionType;
  secondValue?: any;
}