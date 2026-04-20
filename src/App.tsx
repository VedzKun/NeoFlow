import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import WorkflowCanvas from './components/Canvas/WorkflowCanvas';
import EditPanel from './components/EditPanel/EditPanel';
import SandboxPanel from './components/Sandbox/SandboxPanel';
import AIGeneratorModal from './components/AIGenerator/AIGeneratorModal';
import AnalyticsPanel from './components/Analytics/AnalyticsPanel';
import WelcomeModal from './components/WelcomeModal';
import { useValidation } from './hooks/useValidation';
import { useWorkflowStore } from './store/workflowStore';
import { simulateWorkflow } from './api/mockApi';
import {
  Play, Activity, Sparkles, Undo, Redo,
  Download, Upload, LayoutPanelLeft, Workflow
} from 'lucide-react';
import dagre from 'dagre';

export default function App() {
  const { validate } = useValidation();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const getSerializedWorkflow = useWorkflowStore((s) => s.getSerializedWorkflow);
  const setSimulationResult = useWorkflowStore((s) => s.setSimulationResult);
  const setIsSimulating = useWorkflowStore((s) => s.setIsSimulating);
  const setSandboxOpen = useWorkflowStore((s) => s.setSandboxOpen);
  const setAiGeneratorOpen = useWorkflowStore((s) => s.setAiGeneratorOpen);
  const setAnalyticsOpen = useWorkflowStore((s) => s.setAnalyticsOpen);
  const setGraph = useWorkflowStore((s) => s.setGraph);

  // Access temporal from the store hook (zundo attaches it to the hook itself)
  const temporalStore = (useWorkflowStore as any).temporal;
  const canUndo = temporalStore ? temporalStore.getState().pastStates.length > 0 : false;
  const canRedo = temporalStore ? temporalStore.getState().futureStates.length > 0 : false;

  // Clear validation toasts after 6 seconds
  useEffect(() => {
    if (validationErrors.length > 0 || validationWarnings.length > 0) {
      const timer = setTimeout(() => {
        setValidationErrors([]);
        setValidationWarnings([]);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [validationErrors, validationWarnings]);

  const handleTestWorkflow = async () => {
    const results = validate();
    const errs = results.filter((r) => r.type === 'error').map((r) => r.message);
    const warns = results.filter((r) => r.type === 'warning').map((r) => r.message);
    setValidationErrors(errs);
    setValidationWarnings(warns);
    if (errs.length > 0) return;

    setSandboxOpen(true);
    setIsSimulating(true);

    try {
      const workflowData = getSerializedWorkflow();
      const result = await simulateWorkflow(workflowData);
      setSimulationResult(result);
    } catch (error) {
      console.error('Simulation failed', error);
      setSimulationResult({
        success: false,
        totalDuration: 0,
        steps: [],
        errors: [(error as Error).message],
        warnings: [],
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleExport = () => {
    const data = getSerializedWorkflow();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re) => {
        try {
          const data = JSON.parse(re.target?.result as string);
          if (data.nodes && data.edges) {
            setGraph(data.nodes, data.edges);
          }
        } catch {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleAutoLayout = () => {
    const { nodes, edges } = getSerializedWorkflow();
    if (nodes.length === 0) return;
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'LR' });
    g.setDefaultEdgeLabel(() => ({}));
    nodes.forEach((node) => g.setNode(node.id, { width: 250, height: 100 }));
    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    dagre.layout(g);
    const layoutedNodes = nodes.map((node) => {
      const np = g.node(node.id);
      return { ...node, position: { x: np.x - 125, y: np.y - 50 } };
    });
    setGraph(layoutedNodes, edges);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* Welcome Modal */}
      <WelcomeModal />

      {/* Header */}
      <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Workflow size={16} />
          </div>
          <div>
            <h1 className="text-sm font-bold m-0 leading-none">NeoFlow</h1>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              HR Studio Pro
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border border-border p-1 rounded-md bg-muted/30">
            <button
              onClick={() => temporalStore?.getState().undo()}
              disabled={!canUndo}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-background transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={14} />
            </button>
            <button
              onClick={() => temporalStore?.getState().redo()}
              disabled={!canRedo}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-background transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="Redo (Ctrl+Y)"
            >
              <Redo size={14} />
            </button>
          </div>

          <div className="h-4 w-px bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoLayout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground font-medium hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <LayoutPanelLeft size={14} /> Auto-Layout
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground font-medium hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <Upload size={14} /> Import
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground font-medium hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <Download size={14} /> Export
            </button>
            <button
              onClick={() => setAiGeneratorOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-purple-600 bg-purple-600/10 font-bold hover:bg-purple-600/20 rounded-md transition-colors"
            >
              <Sparkles size={14} /> Generate with AI
            </button>
          </div>

          <div className="h-4 w-px bg-border" />

          {/* Test & Analytics */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAnalyticsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-border hover:bg-muted text-foreground transition-colors"
            >
              <Activity size={14} className="text-blue-500" /> Analytics
            </button>
            <button
              onClick={handleTestWorkflow}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Play size={14} /> Test Workflow
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 relative">
          <WorkflowCanvas />

          {/* Validation Toasts */}
          {(validationErrors.length > 0 || validationWarnings.length > 0) && (
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
              {validationErrors.map((error: string, i: number) => (
                <div
                  key={`e-${i}`}
                  className="bg-destructive border border-destructive-foreground/20 text-destructive-foreground px-4 py-3 rounded-lg shadow-lg text-xs font-medium"
                >
                  <span className="font-bold mr-2">Error:</span>
                  {error}
                </div>
              ))}
              {validationWarnings.map((warning: string, i: number) => (
                <div
                  key={`w-${i}`}
                  className="bg-amber-500 text-amber-950 px-4 py-3 rounded-lg shadow-lg text-xs font-medium border border-amber-600/20"
                >
                  <span className="font-bold mr-2">Warning:</span>
                  {warning}
                </div>
              ))}
            </div>
          )}
        </main>
        <EditPanel />
      </div>

      <AnalyticsPanel />
      <SandboxPanel />
      <AIGeneratorModal />
    </div>
  );
}
