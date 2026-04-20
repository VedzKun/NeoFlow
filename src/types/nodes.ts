// ─── Node Data Interfaces ───────────────────────────────────────────────────

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface BaseNodeData {
  title?: string;
  isSimulating?: boolean;
  simStatus?: 'success' | 'warning' | 'error';
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
  title: string;
  triggerType?: string;
  customFields?: KeyValuePair[];
  metadata: KeyValuePair[];
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
}

export type ApproverRole = 'Manager' | 'HRBP' | 'Director';

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  title: string;
  approverRole: ApproverRole;
  autoApproveThreshold: number;
}

export interface AutomatedStepNodeData extends BaseNodeData {
  type: 'automated';
  title: string;
  actionId: string;
  parameters: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  title?: string;
  completionMessage?: string;
  endMessage: string;
  summaryFlag: boolean;
}

// ─── Union Type ─────────────────────────────────────────────────────────────

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

// ─── Node Type Constants ────────────────────────────────────────────────────

export const NODE_TYPES = {
  START: 'start',
  TASK: 'task',
  APPROVAL: 'approval',
  AUTOMATED: 'automated',
  END: 'end',
} as const;

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

// ─── Sidebar Palette Item ───────────────────────────────────────────────────

export interface PaletteItem {
  type: NodeType;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: 'start',
    label: 'Start Node',
    icon: '▶',
    description: 'Workflow entry point',
    color: '#22c55e',
  },
  {
    type: 'task',
    label: 'Task Node',
    icon: '📋',
    description: 'Human task (collect docs, etc.)',
    color: '#3b82f6',
  },
  {
    type: 'approval',
    label: 'Approval Node',
    icon: '✅',
    description: 'Manager/HR approval step',
    color: '#f59e0b',
  },
  {
    type: 'automated',
    label: 'Automated Step',
    icon: '⚡',
    description: 'System action (email, PDF)',
    color: '#8b5cf6',
  },
  {
    type: 'end',
    label: 'End Node',
    icon: '⏹',
    description: 'Workflow completion',
    color: '#ef4444',
  },
];

// ─── Default Data Factories ─────────────────────────────────────────────────

export function createDefaultNodeData(type: NodeType): WorkflowNodeData {
  switch (type) {
    case 'start':
      return { type: 'start', title: 'Start', metadata: [] };
    case 'task':
      return {
        type: 'task',
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      };
    case 'approval':
      return {
        type: 'approval',
        title: 'Approval',
        approverRole: 'Manager',
        autoApproveThreshold: 0,
      };
    case 'automated':
      return {
        type: 'automated',
        title: 'Automated Step',
        actionId: '',
        parameters: {},
      };
    case 'end':
      return { type: 'end', endMessage: 'Workflow Complete', summaryFlag: false };
  }
}
