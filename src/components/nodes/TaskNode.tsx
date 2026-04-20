import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { TaskNodeData } from '../../types/nodes';
import { ClipboardList } from 'lucide-react';

export default function TaskNode({ data, selected }: NodeProps<TaskNodeData>) {
  return (
    <div className={`w-[250px] bg-background border-2 rounded-lg shadow-sm transition-all duration-200 ${selected ? 'border-blue-500 shadow-blue-500/20' : 'border-border hover:border-border/80'} ${data.isSimulating ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background' : ''}`}>
      <div className="p-3 border-b border-border bg-blue-500/10 flex items-center gap-2 rounded-t-md">
        <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white shrink-0">
          <ClipboardList size={12} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-bold text-foreground truncate">{data.title || 'Human Task'}</span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Task Node</span>
        </div>
      </div>
      
      <div className="p-3 bg-muted/30 rounded-b-md flex flex-col gap-2">
        <div className="text-[10px] flex justify-between items-center">
            <span className="text-muted-foreground">Assignee:</span>
            {data.assignee ? (
                <span className="font-medium bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded truncate max-w-[120px]">{data.assignee}</span>
            ) : (
                <span className="text-destructive font-medium bg-destructive/10 px-1.5 py-0.5 rounded">Unassigned</span>
            )}
        </div>
        {data.dueDate && (
             <div className="text-[10px] flex justify-between items-center">
                <span className="text-muted-foreground">Due:</span>
                <span className="font-mono text-muted-foreground">{data.dueDate}</span>
            </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-background border-2 border-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-background border-2 border-blue-500" />
    </div>
  );
}
