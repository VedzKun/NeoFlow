import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { AutomatedStepNodeData } from '../../types/nodes';
import { Zap } from 'lucide-react';

export default function AutomatedStepNode({ data, selected }: NodeProps<AutomatedStepNodeData>) {
  return (
    <div className={`w-[250px] bg-background border-2 rounded-lg shadow-sm transition-all duration-200 ${selected ? 'border-purple-500 shadow-purple-500/20' : 'border-border hover:border-border/80'} ${data.isSimulating ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-background' : ''}`}>
      <div className="p-3 border-b border-border bg-purple-500/10 flex items-center gap-2 rounded-t-md">
        <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-white shrink-0">
          <Zap size={12} fill="currentColor" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-bold text-foreground truncate">{data.title || 'System Action'}</span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Automated</span>
        </div>
      </div>
      
      <div className="p-3 bg-muted/30 rounded-b-md flex flex-col gap-2">
        <div className="text-[10px] flex justify-between items-center">
            <span className="text-muted-foreground">Action:</span>
            {data.actionId ? (
                <span className="font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 truncate max-w-[120px]">{data.actionId}</span>
            ) : (
                <span className="text-destructive font-medium bg-destructive/10 px-1.5 py-0.5 rounded">Unconfigured</span>
            )}
        </div>
        {Object.keys(data.parameters || {}).length > 0 && (
             <div className="text-[10px] flex justify-between items-center">
                <span className="text-muted-foreground">Params:</span>
                <span className="font-mono text-muted-foreground">{Object.keys(data.parameters).length} configured</span>
            </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-background border-2 border-purple-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-background border-2 border-purple-500" />
    </div>
  );
}
