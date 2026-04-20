import { useCallback, type DragEvent } from 'react';
import { useReactFlow } from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';
import type { NodeType } from '../types/nodes';

export function useDragAndDrop() {
  const reactFlowInstance = useReactFlow();
  const addNode = useWorkflowStore((s) => s.addNode);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow-type') as NodeType;
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [reactFlowInstance, addNode]
  );

  return { onDragOver, onDrop };
}
