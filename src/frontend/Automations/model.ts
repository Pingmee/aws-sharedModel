import { Variable } from './automations'
import { ConditionType, NodeSpecificData, NodeType, SubNodeData } from './Nodes'
import { FireberryField, FireberrySelectionBoxItem } from "../Campaigns/FireberryModel"

export enum NodeCategory {
  trigger = 'Trigger',
  condition = 'Condition',
  action = 'Action',
  operation = 'Operation',
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
  nodesRemovable?: boolean;
  subNodesLimit?: number;
}

export interface Condition {
  id: string
  firstValue?: Variable;
  comparison: ConditionType;
  secondValue?: any;
}

export interface FireberryWorkflowQuery {
  id: string,
  field: FireberryField,
  value: Variable | FireberrySelectionBoxItem
}

export enum FireberryAction {
  addTask = 'Add Task',
  addComment = 'Add Comment',
  addRecord = 'Add Record',
  deleteRecord = 'Delete Record',
  updateRecord = 'Update Record',
  query = 'Query',
}