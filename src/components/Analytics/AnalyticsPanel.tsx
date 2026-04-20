import { useWorkflowStore } from '../../store/workflowStore';
import { X, Activity, Clock, AlertTriangle, Network, TrendingUp } from 'lucide-react';
import type { WorkflowNodeData } from '../../types/nodes';

export default function AnalyticsPanel() {
  const analyticsOpen = useWorkflowStore(s => s.analyticsOpen);
  const setAnalyticsOpen = useWorkflowStore(s => s.setAnalyticsOpen);
  const getSerializedWorkflow = useWorkflowStore(s => s.getSerializedWorkflow);
  
  if (!analyticsOpen) return null;
  
  const { nodes, edges } = getSerializedWorkflow();
  
  // Calculate analytics
  const totalNodes = nodes.length;
  const approvals = nodes.filter(n => n.data.type === 'approval').length;
  const tasks = nodes.filter(n => n.data.type === 'task').length;
  
  // Very rough heuristic for success probability based on complexity
  const successProb = Math.max(0, 100 - (approvals * 5) - (totalNodes * 2));
  
  // Fake estimation for critical path
  const estDuration = (tasks * 2) + (approvals * 24); // tasks take 2h, approvals 24h
  
  // Find bottleneck (node with most incoming edges or an approval)
  let bottleneck = 'None Detected';
  let maxIncoming = 0;
  
  const incomingCounts: Record<string, number> = {};
  edges.forEach(e => {
      incomingCounts[e.target] = (incomingCounts[e.target] || 0) + 1;
  });
  
  Object.entries(incomingCounts).forEach(([nodeId, count]) => {
      if (count > maxIncoming) {
          maxIncoming = count;
          const targetNode = nodes.find(n => n.id === nodeId);
          if (targetNode) bottleneck = (targetNode.data as WorkflowNodeData).title;
      }
  });
  
  // If no convergence, pick the first approval as a natural bottleneck
  if (bottleneck === 'None Detected') {
      const firstApproval = nodes.find(n => n.data.type === 'approval');
      if (firstApproval) bottleneck = (firstApproval.data as WorkflowNodeData).title;
  }
  
  return (
    <div className="fixed top-20 right-4 w-72 bg-card border border-border shadow-xl rounded-xl z-40 overflow-hidden animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Activity size={16} className="text-primary" />
          Workflow Analytics
        </div>
        <button onClick={() => setAnalyticsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X size={16} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted border border-border p-3 rounded-lg flex flex-col gap-1 items-start">
                  <Network size={14} className="text-muted-foreground mb-1" />
                  <span className="text-2xl font-bold">{totalNodes}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Nodes</span>
              </div>
              <div className="bg-muted border border-border p-3 rounded-lg flex flex-col gap-1 items-start">
                  <Clock size={14} className="text-muted-foreground mb-1" />
                  <span className="text-2xl font-bold">{estDuration}<span className="text-sm font-normal text-muted-foreground">hrs</span></span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. Duration</span>
              </div>
          </div>
          
          <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 justify-between">
                  <span>Success Probability</span>
                  <TrendingUp size={12} className="text-green-500" />
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className={`h-full ${successProb > 70 ? 'bg-green-500' : successProb > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${successProb}%` }} />
              </div>
              <div className="text-right text-[10px] font-mono text-muted-foreground">{successProb}%</div>
          </div>
          
          <div className="bg-destructive/5 border border-destructive/20 p-3 rounded-lg flex gap-3 text-destructive">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold leading-tight">Critical Bottleneck</span>
                  <span className="text-[11px] opacity-90 leading-snug">
                    <strong className="underline decoration-destructive/30 decoration-dashed">{bottleneck}</strong> is slowing down this workflow path.
                  </span>
              </div>
          </div>
      </div>
    </div>
  );
}
