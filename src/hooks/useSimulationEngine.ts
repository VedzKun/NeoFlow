import { useState, useCallback, useRef } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export function useSimulationEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const stopRef = useRef(false);

  const getSerializedWorkflow = useWorkflowStore(s => s.getSerializedWorkflow);
  const { simulationResult, updateNodeData } = useWorkflowStore();

  const playSimulation = useCallback(async () => {
    if (!simulationResult || simulationResult.steps.length === 0) return;

    stopRef.current = false;
    setIsPlaying(true);
    setCurrentStepIndex(-1);

    // Reset all node sim states first
    const { nodes } = getSerializedWorkflow();
    nodes.forEach(n => {
      updateNodeData(n.id, { isSimulating: false, simStatus: undefined } as any);
    });

    for (let i = 0; i < simulationResult.steps.length; i++) {
      if (stopRef.current) break;

      setCurrentStepIndex(i);
      const step = simulationResult.steps[i];

      // Highlight current node
      updateNodeData(step.nodeId, { isSimulating: true, simStatus: step.status } as any);

      const delay = Math.min(step.duration, 1200);
      await new Promise(r => setTimeout(r, delay));

      // Remove highlight
      updateNodeData(step.nodeId, { isSimulating: false, simStatus: undefined } as any);
    }

    setIsPlaying(false);
    setCurrentStepIndex(-1);
  }, [simulationResult, getSerializedWorkflow, updateNodeData]);

  const stopSimulation = useCallback(() => {
    stopRef.current = true;
    setIsPlaying(false);
  }, []);

  return { playSimulation, stopSimulation, isPlaying, currentStepIndex };
}
