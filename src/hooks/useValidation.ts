import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import type { ValidationError } from '../types/workflow';
import type { WorkflowNodeData } from '../types/nodes';

export function useValidation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const validate = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    // 1. Must have at least one Start node
    const startNodes = nodes.filter((n) => (n.data as WorkflowNodeData).type === 'start');
    if (startNodes.length === 0) {
      errors.push({ type: 'error', message: 'Workflow must have a Start node' });
    }
    if (startNodes.length > 1) {
      errors.push({ type: 'warning', message: 'Workflow has multiple Start nodes — only the first will be used' });
    }

    // 2. Must have at least one End node
    const endNodes = nodes.filter((n) => (n.data as WorkflowNodeData).type === 'end');
    if (endNodes.length === 0) {
      errors.push({ type: 'error', message: 'Workflow must have an End node' });
    }

    // 3. Start node should have no incoming edges
    startNodes.forEach((sn) => {
      const incoming = edges.filter((e) => e.target === sn.id);
      if (incoming.length > 0) {
        errors.push({
          type: 'warning',
          message: 'Start node should not have incoming connections',
          nodeId: sn.id,
        });
      }
    });

    // 4. End node should have no outgoing edges
    endNodes.forEach((en) => {
      const outgoing = edges.filter((e) => e.source === en.id);
      if (outgoing.length > 0) {
        errors.push({
          type: 'warning',
          message: 'End node should not have outgoing connections',
          nodeId: en.id,
        });
      }
    });

    // 5. Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    edges.forEach((e) => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });
    if (nodes.length > 1) {
      nodes.forEach((n) => {
        if (!connectedNodeIds.has(n.id)) {
          errors.push({
            type: 'warning',
            message: `Node "${(n.data as any).title || (n.data as any).endMessage || 'Untitled'}" is disconnected`,
            nodeId: n.id,
          });
        }
      });
    }

    // 6. Cycle detection (DFS)
    const hasCycle = detectCycle(nodes, edges);
    if (hasCycle) {
      errors.push({ type: 'error', message: 'Workflow contains a cycle — remove circular connections' });
    }

    // 7. Check required fields
    nodes.forEach((n) => {
      const data = n.data as WorkflowNodeData;
      if (data.type === 'task' && !data.title) {
        errors.push({
          type: 'error',
          message: 'Task node requires a title',
          nodeId: n.id,
        });
      }
      if (data.type === 'automated' && !data.actionId) {
        errors.push({
          type: 'warning',
          message: `Automated step "${data.title}" has no action selected`,
          nodeId: n.id,
        });
      }
    });

    return errors;
  }, [nodes, edges]);

  return { validate };
}

// ─── Cycle Detection ────────────────────────────────────────────────────────

function detectCycle(
  nodes: { id: string }[],
  edges: { source: string; target: string }[]
): boolean {
  const adjacency = new Map<string, string[]>();
  nodes.forEach((n) => adjacency.set(n.id, []));
  edges.forEach((e) => {
    adjacency.get(e.source)?.push(e.target);
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recStack.add(nodeId);
    const neighbors = adjacency.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }
    recStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}
