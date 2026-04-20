import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { ApprovalNodeData } from '../../types/nodes';
import { UserCheck } from 'lucide-react';

export default function ApprovalNode({ data, selected }: NodeProps<ApprovalNodeData>) {
  return (
    <div className={`w-[250px] bg-background border-2 rounded-lg shadow-sm transition-all duration-200 ${selected ? 'border-amber-500 shadow-amber-500/20' : 'border-border hover:border-border/80'} ${data.isSimulating ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-background' : ''}`}>
      <div className="p-3 border-b border-border bg-amber-500/10 flex items-center gap-2 rounded-t-md">
        <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center text-white shrink-0">
          <UserCheck size={12} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-bold text-foreground truncate">{data.title || 'Approval'}</span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Approval Gateway</span>
        </div>
      </div>
      
      <div className="p-3 bg-muted/30 rounded-b-md flex flex-col gap-2">
        <div className="text-[10px] flex justify-between items-center">
            <span className="text-muted-foreground">Role:</span>
            <span className="font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded truncate max-w-[120px]">{data.approverRole || 'Any'}</span>
        </div>
        <div className="text-[10px] flex justify-between items-center">
            <span className="text-muted-foreground">Threshold:</span>
            <span className="font-mono text-muted-foreground">{data.autoApproveThreshold} days</span>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-background border-2 border-amber-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-background border-2 border-amber-500" />
    </div>
  );
}
