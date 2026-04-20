import { useWorkflowStore } from '../../store/workflowStore';
import type { WorkflowNodeData } from '../../types/nodes';
import StartNodeForm from './forms/StartNodeForm';
import TaskNodeForm from './forms/TaskNodeForm';
import ApprovalNodeForm from './forms/ApprovalNodeForm';
import AutomatedStepNodeForm from './forms/AutomatedStepNodeForm';
import EndNodeForm from './forms/EndNodeForm';
import {
  X, Trash2, MousePointer, PlayCircle, ClipboardList,
  CheckCircle2, Zap, CircleStop
} from 'lucide-react';

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string; twClass: string }> = {
  start: { icon: <PlayCircle size={14} />, color: '#22c55e', label: 'Start Node', twClass: 'bg-green-500/20 text-green-500' },
  task: { icon: <ClipboardList size={14} />, color: '#3b82f6', label: 'Task Node', twClass: 'bg-blue-500/20 text-blue-500' },
  approval: { icon: <CheckCircle2 size={14} />, color: '#f59e0b', label: 'Approval Node', twClass: 'bg-amber-500/20 text-amber-500' },
  automated: { icon: <Zap size={14} />, color: '#8b5cf6', label: 'Automated Step', twClass: 'bg-purple-500/20 text-purple-500' },
  end: { icon: <CircleStop size={14} />, color: '#ef4444', label: 'End Node', twClass: 'bg-red-500/20 text-red-500' },
};

export default function EditPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const outgoingEdges = edges.filter((e) => e.source === selectedNodeId);

  const updateEdgeCondition = (edgeId: string, condition: any) => {
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return;
    onEdgesChange([{
      id: edgeId,
      type: 'reset' as const,
      item: { ...edge, data: { ...edge.data, condition: condition || undefined } }
    }]);
  };

  if (!selectedNode) {
    return (
      <aside className="w-80 bg-background border-l border-border flex flex-col shrink-0">
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
          <MousePointer size={32} className="text-muted-foreground/20" />
          <h3 className="text-sm font-semibold text-muted-foreground">No Node Selected</h3>
          <p className="text-xs text-muted-foreground/70 leading-normal">
            Click on a node in the canvas to edit its properties, or drag a new node from the palette.
          </p>
        </div>
      </aside>
    );
  }

  const data = selectedNode.data as WorkflowNodeData;
  const config = TYPE_CONFIG[data.type];

  const handleChange = (updates: Partial<WorkflowNodeData>) => {
    updateNodeData(selectedNode.id, updates);
  };

  const handleDelete = () => {
    deleteNode(selectedNode.id);
  };

  const renderForm = () => {
    switch (data.type) {
      case 'start': return <StartNodeForm data={data} onChange={handleChange} />;
      case 'task': return <TaskNodeForm data={data} onChange={handleChange} />;
      case 'approval': return <ApprovalNodeForm data={data} onChange={handleChange} />;
      case 'automated': return <AutomatedStepNodeForm data={data} onChange={handleChange} />;
      case 'end': return <EndNodeForm data={data} onChange={handleChange} />;
    }
  };

  return (
    <aside className="w-80 bg-background border-l border-border flex flex-col shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${config.twClass}`}>
            {config.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground m-0">{config.label}</h3>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Edit Properties</span>
          </div>
        </div>
        <button
          className="w-7 h-7 rounded-md border border-border bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive hover:border-destructive hover:text-white transition-colors"
          onClick={() => setSelectedNode(null)}
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {renderForm()}

        <div className="h-px bg-border my-4" />

        {/* Conditional Edges Editor */}
        {outgoingEdges.length > 0 && (
          <div className="flex flex-col gap-3 p-3 rounded-lg border border-border bg-muted/30">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Outgoing Branches ({outgoingEdges.length})
            </h4>
            {outgoingEdges.map((edge) => {
              const targetNode = nodes.find(n => n.id === edge.target);
              const tData = targetNode?.data as WorkflowNodeData;
              const cond = edge.data?.condition;

              return (
                <div key={edge.id} className="flex flex-col gap-2 p-2 rounded bg-background border border-border">
                  <div className="text-[11px] font-medium text-foreground flex items-center gap-2">
                    <span className="text-muted-foreground">→</span>
                    {(tData as any)?.title || 'Untitled Node'}
                    <span className="text-[9px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-auto">
                      {tData?.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <div className="flex-1 items-center gap-1 flex">
                      <input
                        type="text"
                        className="w-full bg-muted border border-border rounded px-1.5 py-1"
                        placeholder="Field (e.g. Salary)"
                        value={cond?.field || ''}
                        onChange={(e) => updateEdgeCondition(edge.id, { field: e.target.value, operator: cond?.operator || '==', value: cond?.value || '' })}
                      />
                      <select
                        className="bg-muted border border-border rounded px-1 py-1"
                        value={cond?.operator || '=='}
                        onChange={(e) => updateEdgeCondition(edge.id, { field: cond?.field || '', operator: e.target.value as any, value: cond?.value || '' })}
                      >
                        <option value="==">&equals;&equals;</option>
                        <option value="!=">!=</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value="contains">In</option>
                      </select>
                      <input
                        type="text"
                        className="w-full bg-muted border border-border rounded px-1.5 py-1"
                        placeholder="Value (e.g. 50k)"
                        value={cond?.value || ''}
                        onChange={(e) => updateEdgeCondition(edge.id, { field: cond?.field || '', operator: cond?.operator || '==', value: e.target.value })}
                      />
                    </div>
                    {cond && (
                      <button
                        className="text-destructive hover:bg-destructive/10 p-1 rounded"
                        title="Remove Condition"
                        onClick={() => updateEdgeCondition(edge.id, null)}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="h-px bg-border my-4" />

        <button
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-colors"
          onClick={handleDelete}
        >
          <Trash2 size={14} /> Delete Node
        </button>
      </div>
    </aside>
  );
}
