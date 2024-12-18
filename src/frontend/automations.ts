export type Workflow = {
  id: string
  name: string
  created: number
  lastModified: number,
  isActive: boolean,
  folderId: string,

  executionCount?: number;      // Number of times the workflow was executed
  successCount?: number;        // Number of successful executions
  failureCount?: number;        // Number of failed executions
  lastExecution?: number;       // Timestamp of the last execution
  messageReadCount?: number;    // How many people read the message
  buttonClicks?: Record<string, number>; // Tracks button clicks by button ID/name
  conversionRate?: number;     // Percentage of users who completed the workflow's intended outcome
  notes?: string;              // Any manual notes or descriptions for the workflow

  data: any

  // GUI
  selected?: boolean
}

export type WorkflowFolder = {
  id: string,
  name: string,
  created: number
  lastModified: number,
  workflows: Workflow[]

  // GUI
  selected?: boolean
}

export interface AutomationsDataSource {
  flow?: { [key: string]: any }
  theme: "dark" | "light"
}

export interface AutomationsDataExport {
  displayedFlow: () => { [key: string]: any }
  onAnyChange: () => void
}