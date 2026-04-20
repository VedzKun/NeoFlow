import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import type { Connection, EdgeChange, NodeChange, Edge, Node } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import type { WorkflowNodeData, NodeType } from '../types/nodes';
import { createDefaultNodeData } from '../types/nodes';
import type { SimulationResult } from '../types/workflow';

// ─── Store Interface ────────────────────────────────────────────────────────

interface WorkflowStore {
  // ── Flow State ──
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;

  // ── Simulation State ──
  simulationResult: SimulationResult | null;
  isSimulating: boolean;

  // ── UI State ──
  sandboxOpen: boolean;
  aiGeneratorOpen: boolean;
  analyticsOpen: boolean;

  // ── Node Actions ──
  addNode: (type: NodeType, position: { x: number; y: number }, id?: string) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;
  
  // ── Graph Actions ──
  setGraph: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void;
  autoLayout: () => void; // We will implement the actual logic in a hook or separate service

  // ── Flow Actions ──
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // ── Simulation Actions ──
  setSimulationResult: (result: SimulationResult | null) => void;
  setIsSimulating: (isSimulating: boolean) => void;

  // ── UI Actions ──
  setSandboxOpen: (open: boolean) => void;
  setAiGeneratorOpen: (open: boolean) => void;
  setAnalyticsOpen: (open: boolean) => void;

  // ── Serialization ──
  getSerializedWorkflow: () => { nodes: Node<WorkflowNodeData>[]; edges: Edge[] };
}

// ─── Store Implementation ───────────────────────────────────────────────────

export const useWorkflowStore = create<WorkflowStore>()(
  temporal(
    (set, get) => ({
      // ── Initial State ──
      nodes: [],
      edges: [],
      selectedNodeId: null,
      simulationResult: null,
      isSimulating: false,
      sandboxOpen: false,
      aiGeneratorOpen: false,
      analyticsOpen: false,

      // ── Node Actions ──
      addNode: (type, position, id = uuidv4()) => {
        const newNode: Node<WorkflowNodeData> = {
          id,
          type,
          position,
          data: createDefaultNodeData(type),
        };
        set((state) => ({ nodes: [...state.nodes, newNode] }));
      },

      updateNodeData: (nodeId, data) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...data } as WorkflowNodeData }
              : node
          ),
        }));
      },

      deleteNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
          selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
        }));
      },

      setSelectedNode: (nodeId) => {
        set({ selectedNodeId: nodeId });
      },
      
      setGraph: (nodes, edges) => {
        set({ nodes, edges, selectedNodeId: null, simulationResult: null });
      },
      
      autoLayout: () => {
        // Will be implemented externally using dagre since we likely need node dimensions properly.
      },

      // ── Flow Actions ──
      onNodesChange: (changes) => {
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes) as Node<WorkflowNodeData>[],
        }));
      },

      onEdgesChange: (changes) => {
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
        }));
      },

      onConnect: (connection) => {
        set((state) => ({
          edges: addEdge(
            {
              ...connection,
              type: 'custom', // Use custom edge for conditionals
              animated: false,
            },
            state.edges
          ),
        }));
      },

      // ── Simulation Actions ──
      setSimulationResult: (result) => set({ simulationResult: result }),
      setIsSimulating: (isSimulating) => set({ isSimulating }),

      // ── UI Actions ──
      setSandboxOpen: (open) => set({ sandboxOpen: open }),
      setAiGeneratorOpen: (open) => set({ aiGeneratorOpen: open }),
      setAnalyticsOpen: (open) => set({ analyticsOpen: open }),

      // ── Serialization ──
      getSerializedWorkflow: () => {
        const { nodes, edges } = get();
        return { nodes, edges };
      },
    }),
    {
      partialize: (state) => {
        const { nodes, edges } = state;
        return { nodes, edges }; // Only store nodes and edges in undo history history
      },
    }
  )
);
