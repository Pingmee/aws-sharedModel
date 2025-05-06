import { Expression, Variable } from './automations'
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
  firstValue?: Variable | Expression;
  comparison: ConditionType;
  secondValue?: any;
}

export interface FireberryWorkflowQuery {
  id: string,
  field: FireberryField,
  value: Variable | FireberrySelectionBoxItem | Expression
}

export enum FireberryAction {
  updateRecord = 'Update Record',
  createIfNoneExist = 'Create If None Exist',

  // addTask = 'Add Task',
  // addComment = 'Add Comment',
  // addRecord = 'Add Record',
  // deleteRecord = 'Delete Record',
  // query = 'Query',
}