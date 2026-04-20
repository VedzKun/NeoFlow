import { useWorkflowStore } from '../../store/workflowStore';
import { useSimulationEngine } from '../../hooks/useSimulationEngine';
import { PlayCircle, Square, X, CheckCircle, AlertTriangle, XCircle, Slash, FlaskConical } from 'lucide-react';

export default function SandboxPanel() {
  const sandboxOpen = useWorkflowStore((s) => s.sandboxOpen);
  const setSandboxOpen = useWorkflowStore((s) => s.setSandboxOpen);
  const simulationResult = useWorkflowStore((s) => s.simulationResult);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);
  
  const { playSimulation, isPlaying, currentStepIndex } = useSimulationEngine();

  if (!sandboxOpen) return null;

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStatusIcon = (status: string) => {
      switch (status) {
          case 'success': return <CheckCircle size={14} className="text-green-500" />;
          case 'warning': return <AlertTriangle size={14} className="text-amber-500" />;
          case 'error': return <XCircle size={14} className="text-red-500" />;
          default: return <Slash size={14} className="text-muted-foreground" />;
      }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-64 bg-card border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] z-30 flex flex-col animate-in slide-in-from-bottom-6 duration-300">
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/10 shrink-0">
        <div className="flex items-center gap-3">
          <FlaskConical size={18} className="text-primary" />
          <h3 className="text-sm font-semibold m-0">Workflow Sandbox</h3>
          {isSimulating && <span className="text-[10px] uppercase tracking-wider font-bold text-blue-500 bg-blue-500/10 px-2 flex items-center justify-center rounded border border-blue-500/20 animate-pulse">Running</span>}
          {!isSimulating && simulationResult && (
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 flex items-center justify-center rounded border ${simulationResult.success ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'}`}>
              {simulationResult.success ? 'Passed' : 'Failed'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
            {simulationResult && !isSimulating && (
                <button 
                  onClick={playSimulation} 
                  disabled={isPlaying}
                  className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
                >
                    {isPlaying ? <Square size={14} className="animate-pulse" /> : <PlayCircle size={14} />}
                    {isPlaying ? 'Playing...' : 'Replay Animation'}
                </button>
            )}
            <button className="text-muted-foreground hover:text-foreground p-1 transition-colors" onClick={() => setSandboxOpen(false)}>
              <X size={16} />
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 min-w-[250px] border-r border-border p-4 overflow-y-auto flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Execution Summary</h4>
          
          {isSimulating ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50 gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="text-xs">Simulating Backend Graph...</div>
            </div>
          ) : !simulationResult ? (
            <div className="text-xs text-muted-foreground/50 text-center py-8">
              No simulation data. Click "Test Workflow".
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted border border-border p-3 rounded-lg flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Status</span>
                  <span className={`text-base font-bold ${simulationResult.success ? 'text-green-500' : 'text-red-500'}`}>
                    {simulationResult.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                <div className="bg-muted border border-border p-3 rounded-lg flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Duration</span>
                  <span className="text-base font-bold font-mono text-foreground">
                    {formatDuration(simulationResult.totalDuration)}
                  </span>
                </div>
              </div>

              {(simulationResult.errors.length > 0 || simulationResult.warnings.length > 0) && (
                <div className="flex flex-col gap-2 mt-2">
                  {simulationResult.errors.map((err, i) => (
                    <div key={`err-${i}`} className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-2 rounded flex gap-2 overflow-hidden items-start align-top">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span className="break-words">{err}</span>
                    </div>
                  ))}
                  {simulationResult.warnings.map((warn, i) => (
                    <div key={`warn-${i}`} className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 p-2 rounded flex gap-2 overflow-hidden items-start align-top">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span className="break-words">{warn}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-muted/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Timeline Log</h4>
          
          <div className="flex flex-col relative pl-4 border-l border-border ml-2 gap-0 pb-4">
            {simulationResult?.steps.map((step, i) => (
              <div
                key={step.nodeId}
                className={`relative pl-6 py-3 border-l-2 transition-all duration-300 ${isPlaying && currentStepIndex === i ? 'bg-primary/5 border-primary -ml-px' : 'border-transparent'}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-background border border-border flex items-center justify-center ${isPlaying && currentStepIndex === i ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex flex-col gap-1 w-full max-w-lg">
                  <div className="flex items-baseline justify-between w-full">
                    <span className="text-xs font-bold text-foreground">{step.nodeTitle}</span>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1 rounded border border-border">+{formatDuration(step.duration)}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground/80 leading-snug">{step.message}</span>
                </div>
              </div>
            ))}
            
            {simulationResult?.steps.length === 0 && !isSimulating && (
                <div className="text-xs text-muted-foreground mt-4 text-center w-full">Waiting for execution run...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
