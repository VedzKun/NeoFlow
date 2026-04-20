import { getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import type { EdgeProps } from 'reactflow';
import { cn } from '../../lib/utils';
import type { EdgeCondition } from '../../types/workflow';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps<{ condition?: EdgeCondition; isSimulating?: boolean; simStatus?: 'success' | 'warning' | 'error' }>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const condition = data?.condition;
  
  let edgeStyle = { ...style, strokeWidth: 2 };
  let pathClass = 'transition-all duration-300 stroke-border';

  if (data?.isSimulating) {
    if (data.simStatus === 'success') {
      pathClass = 'stroke-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      edgeStyle.strokeWidth = 3;
    } else if (data.simStatus === 'error') {
      pathClass = 'stroke-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      edgeStyle.strokeWidth = 3;
    } else if (data.simStatus === 'warning') {
      pathClass = 'stroke-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      edgeStyle.strokeWidth = 3;
    } else {
      // Actively evaluating
      pathClass = 'stroke-blue-500 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]';
      edgeStyle.strokeWidth = 3;
    }
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} className={pathClass as any} />
      {condition && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan bg-background border border-border text-[10px] px-2 py-0.5 rounded-full text-muted-foreground shadow-sm flex gap-1 font-mono uppercase tracking-wider items-center cursor-pointer hover:border-primary transition-colors duration-200"
          >
            <span className="text-primary font-semibold">{condition.field}</span>
            <span className="opacity-70">{condition.operator}</span>
            <span className="text-primary font-semibold">{condition.value}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
