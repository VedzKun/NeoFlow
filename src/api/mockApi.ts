import type { AutomationAction, SimulationResult, SimulationStep, SerializedWorkflow, EdgeCondition } from '../types/workflow';
import type { WorkflowNodeData } from '../types/nodes';

// ─── Mock Automation Actions ────────────────────────────────────────────────

const AUTOMATION_ACTIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
  { id: 'send_slack', label: 'Send Slack Notification', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create Support Ticket', params: ['title', 'priority'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'duration'] },
  { id: 'run_background_check', label: 'Run Background Check', params: ['candidateId'] },
  { id: 'provision_access', label: 'Provision System Access', params: ['system', 'role'] },
];

// ─── GET /automations ───────────────────────────────────────────────────────

export async function getAutomations(): Promise<AutomationAction[]> {
  // Simulate network delay
  await delay(300);
  return [...AUTOMATION_ACTIONS];
}

// ─── POST /simulate ─────────────────────────────────────────────────────────

function evaluateCondition(condition?: EdgeCondition): boolean {
  if (!condition) return true;
  // Mock logic: we randomly fulfill condition 70% of the time to mimic a sandbox evaluation
  // In a real app, this would use actual node data.
  const isMet = Math.random() > 0.3;
  return isMet;
}

export async function simulateWorkflow(workflow: SerializedWorkflow): Promise<SimulationResult> {
  await delay(800);

  const { nodes, edges } = workflow;
  const steps: SimulationStep[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Build adjacency map capturing edges
  const adjacencyMap = new Map<string, typeof edges>();
  edges.forEach((edge) => {
    const sources = adjacencyMap.get(edge.source) || [];
    sources.push(edge);
    adjacencyMap.set(edge.source, sources);
  });

  const startNode = nodes.find((n) => (n.data as WorkflowNodeData).type === 'start');
  if (!startNode) {
    return {
      success: false,
      totalDuration: 0,
      steps: [],
      errors: ['No Start node found in workflow'],
      warnings: [],
    };
  }

  const visited = new Set<string>();
  const queue: string[] = [startNode.id];
  let stepIndex = 0;
  let totalDuration = 0;

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodes.find((n) => n.id === currentId);
    if (!node) continue;

    const data = node.data as WorkflowNodeData;
    const stepDuration = getStepDuration(data.type);
    totalDuration += stepDuration;

    await delay(50); // fast loop just for calculating. Use real delays during live animation in useSimulationEngine

    const step: SimulationStep = {
      stepIndex: stepIndex++,
      nodeId: node.id,
      nodeTitle: getNodeTitle(data),
      nodeType: data.type,
      status: 'success',
      message: getStepMessage(data),
      timestamp: new Date(Date.now() + totalDuration).toISOString(),
      duration: stepDuration,
    };

    if (data.type === 'task' && !(data as any).assignee) {
      step.status = 'warning';
      step.message = `Task "${data.title}" has no assignee — auto-assigning to HR Admin`;
      warnings.push(`Task "${data.title}" missing assignee`);
    }

    if (data.type === 'automated') {
      const autoData = data as any;
      if (!autoData.actionId) {
        step.status = 'error';
        step.message = `Automated step "${data.title}" has no action configured`;
        errors.push(`Automated step "${data.title}" missing action`);
      }
    }

    steps.push(step);

    const outEdges = adjacencyMap.get(currentId) || [];
    if (outEdges.length === 0 && data.type !== 'end') {
      warnings.push(`Node "${getNodeTitle(data)}" has no outgoing connections`);
    }
    
    // Evaluate conditions to queue next nodes
    for (const edge of outEdges) {
       const isMet = evaluateCondition(edge.data?.condition);
       if (isMet) queue.push(edge.target);
       else warnings.push(`Condition ${edge.data?.condition?.field} ${edge.data?.condition?.operator} ${edge.data?.condition?.value} was not met. Branch skipped.`);
    }
  }

  const unvisited = nodes.filter((n) => !visited.has(n.id));
  if (unvisited.length > 0) {
    warnings.push(`${unvisited.length} node(s) were never evaluated (conditional skips or disconnected)`);
  }

  return {
    success: errors.length === 0,
    totalDuration,
    steps,
    errors,
    warnings,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getNodeTitle(data: WorkflowNodeData): string {
  if ('title' in data && data.title) return data.title;
  if (data.type === 'end') return data.endMessage || 'End';
  return 'Untitled';
}

function getStepDuration(type: string): number {
  const durations: Record<string, number> = {
    start: 50,
    task: 2400,
    approval: 1800,
    automated: 600,
    end: 100,
  };
  return durations[type] || 500;
}

function getStepMessage(data: WorkflowNodeData): string {
  switch (data.type) {
    case 'start':
      return `Workflow started: "${data.title}"`;
    case 'task':
      return `Task "${data.title}" assigned to ${data.assignee || 'unassigned'}${data.dueDate ? ` — due ${data.dueDate}` : ''}`;
    case 'approval':
      return `Approval requested from ${data.approverRole} for "${data.title}"`;
    case 'automated': {
      const action = AUTOMATION_ACTIONS.find((a) => a.id === data.actionId);
      return `Executing "${action?.label || data.actionId || 'unknown action'}" for "${data.title}"`;
    }
    case 'end':
      return `Workflow completed: ${data.endMessage}${data.summaryFlag ? ' (summary generated)' : ''}`;
  }
}
