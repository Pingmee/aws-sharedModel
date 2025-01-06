import { Variable } from './automations'
import { ConditionType, GeneralNodeData, NodeType } from './Nodes'

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
  data: GeneralNodeData;
  connections: Record<string, string[]>;
  subNodes?: WorkflowNode[]
};

export type SubNode = {
  label: string;
  editable: boolean;
  index: number
}

export interface SubNodeConfigType {
  subNodeType: NodeType;
  defaultNodes?: SubNode[];
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