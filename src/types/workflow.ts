import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData } from './nodes';

// ─── Workflow Graph ─────────────────────────────────────────────────────────

export type WorkflowNode = Node<WorkflowNodeData>;

export interface EdgeCondition {
  field: string;
  operator: '==' | '!=' | '>' | '<' | 'contains';
  value: string;
}

export type WorkflowEdge = Edge<{
  condition?: EdgeCondition;
  isSimulating?: boolean;
  simStatus?: 'success' | 'warning' | 'error';
}>;

export interface SerializedWorkflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// ─── Mock API Types ─────────────────────────────────────────────────────────

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  stepIndex: number;
  nodeId: string;
  nodeTitle: string;
  nodeType: string;
  status: 'success' | 'warning' | 'error' | 'skipped';
  message: string;
  timestamp: string;
  duration: number; // ms
}

export interface SimulationResult {
  success: boolean;
  totalDuration: number;
  steps: SimulationStep[];
  errors: string[];
  warnings: string[];
}

// ─── Validation Types ───────────────────────────────────────────────────────

export interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  nodeId?: string;
}
