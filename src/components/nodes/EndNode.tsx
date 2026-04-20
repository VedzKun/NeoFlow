import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { EndNodeData } from '../../types/nodes';
import { CircleStop } from 'lucide-react';

export default function EndNode({ data, selected }: NodeProps<EndNodeData>) {
  return (
    <div className={`w-[250px] bg-background border-2 rounded-lg shadow-sm transition-all duration-200 ${selected ? 'border-red-500 shadow-red-500/20' : 'border-border hover:border-border/80'} ${data.isSimulating ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-background' : ''}`}>
      <div className="p-3 border-b border-border bg-red-500/10 flex items-center gap-2 rounded-t-md">
        <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center text-white shrink-0">
          <CircleStop size={12} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-bold text-foreground truncate">{data.title || data.endMessage || 'End Workflow'}</span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Terminal Point</span>
        </div>
      </div>

      {(data.completionMessage || data.endMessage) && (
        <div className="p-3 bg-muted/30 rounded-b-md">
          <div className="text-[10px] text-muted-foreground italic truncate">
            "{data.completionMessage || data.endMessage}"
          </div>
        </div>
      )}

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-background border-2 border-red-500" />
    </div>
  );
}
