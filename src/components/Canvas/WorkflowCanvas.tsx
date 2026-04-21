import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import AutomatedStepNode from '../nodes/AutomatedStepNode';
import EndNode from '../nodes/EndNode';
import CustomEdge from './CustomEdge';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedStepNode,
  end: EndNode,
};

const edgeTypes = {
  custom: CustomEdge
};

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
  } = useWorkflowStore();

  const { onDragOver, onDrop } = useDragAndDrop();

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes as any}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        className="bg-muted/10 drop-shadow-sm"
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{ type: 'custom' }}
      >
        <Background gap={24} size={2} color="var(--border)" variant={BackgroundVariant.Dots} />
        <Controls className="bg-background border-border shadow-sm fill-foreground rounded" />
        <MiniMap 
            nodeColor={(node: any) => {
                switch (node.type) {
                case 'start': return '#22c55e';
                case 'task': return '#3b82f6';
                case 'approval': return '#f59e0b';
                case 'automated': return '#8b5cf6';
                case 'end': return '#ef4444';
                default: return '#71717a';
                }
            }}
            maskColor="rgba(var(--background), 0.8)"
            className="bg-background border-border shadow-sm rounded-lg overflow-hidden" 
        />
        
        <Panel position="bottom-center" className="bg-background/90 backdrop-blur-sm border border-border shadow-md rounded-full px-4 py-2 flex items-center gap-4 animate-in slide-in-from-bottom-4">
           <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Workspace</span>
           <span className="text-xs font-mono text-foreground font-medium">Auto-saving...</span>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
