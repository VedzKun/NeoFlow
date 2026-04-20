import type { DragEvent } from 'react';
import { PALETTE_ITEMS } from '../../types/nodes';
import { useWorkflowStore } from '../../store/workflowStore';
import {
  PlayCircle, ClipboardList, CheckCircle2, Zap, CircleStop,
  Blocks
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  start: <PlayCircle size={16} />,
  task: <ClipboardList size={16} />,
  approval: <CheckCircle2 size={16} />,
  automated: <Zap size={16} />,
  end: <CircleStop size={16} />,
};

export default function Sidebar() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const addNode = useWorkflowStore((s) => s.addNode);

  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow-type', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col shrink-0 overflow-y-auto">
      <div className="p-5 border-b border-border bg-muted/10">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-1">
          <Blocks size={16} className="text-primary" /> Component Library
        </h2>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Drag nodes or click to add them to the canvas.
        </p>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-2">
        <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70 mb-1 ml-1 px-1">
          Nodes
        </div>
        {PALETTE_ITEMS.map((item) => (
          <div
            key={item.type}
            className="flex items-center gap-3 p-2 rounded-md border border-transparent hover:border-border hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            onClick={() => {
              const position = {
                x: window.innerWidth / 2 - 100,
                y: window.innerHeight / 2 - 50 + (Math.random() * 40 - 20),
              };
              addNode(item.type, position);
            }}
            title="Drag or click to add"
          >
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 border border-border/50"
              style={{ background: `${item.color}15`, color: item.color }}
            >
              {ICON_MAP[item.type]}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {item.label}
              </span>
              <span className="text-[10px] text-muted-foreground/80 leading-tight">
                {item.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <div className="flex flex-col">
          <span className="uppercase text-[9px] tracking-wider opacity-70">
            Nodes
          </span>
          <span className="font-semibold text-foreground">{nodes.length}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="uppercase text-[9px] tracking-wider opacity-70">
            Edges
          </span>
          <span className="font-semibold text-foreground">{edges.length}</span>
        </div>
      </div>
    </aside>
  );
}
