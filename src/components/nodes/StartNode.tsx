import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { StartNodeData } from '../../types/nodes';
import { Play } from 'lucide-react';

export default function StartNode({ data, selected }: NodeProps<StartNodeData>) {
  return (
    <div className={`w-[250px] bg-background border-2 rounded-lg shadow-sm transition-all duration-200 ${selected ? 'border-green-500 shadow-green-500/20' : 'border-border hover:border-border/80'}`}>
      <div className="p-3 border-b border-border bg-green-500/10 flex items-center gap-2 rounded-t-md">
        <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white shrink-0">
          <Play size={12} fill="currentColor" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-bold text-foreground truncate">{data.title || 'Start Workflow'}</span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Entry Point</span>
        </div>
      </div>
      
      {(data.triggerType !== 'manual' || data.customFields?.length > 0) && (
        <div className="p-3 bg-muted/30 rounded-b-md flex flex-col gap-2">
            {data.triggerType !== 'manual' && (
                <div className="text-[10px] text-muted-foreground flex justify-between">
                    <span>Trigger:</span>
                    <span className="font-mono text-foreground capitalize">{data.triggerType}</span>
                </div>
            )}
            {data.customFields && (data.customFields?.length || 0) > 0 && (
                <div className="text-[10px] text-muted-foreground flex justify-between">
                    <span>Input Fields:</span>
                    <span className="font-mono text-foreground">{(data.customFields?.length || 0)}</span>
                </div>
            )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-background border-2 border-green-500"
      />
    </div>
  );
}
