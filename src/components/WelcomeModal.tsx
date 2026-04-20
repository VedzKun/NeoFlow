import { useState, useEffect } from 'react';
import {
  Workflow, GripVertical, MousePointer, Link2, TestTube2, Sparkles,
  ArrowRight, X, Lightbulb
} from 'lucide-react';

const STORAGE_KEY = 'neoflow-welcome-dismissed';

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setOpen(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  if (!open) return null;

  const steps = [
    {
      icon: <GripVertical size={18} className="text-blue-500" />,
      title: 'Drag & Drop Nodes',
      desc: 'Drag nodes from the left sidebar onto the canvas to build your workflow.',
    },
    {
      icon: <MousePointer size={18} className="text-green-500" />,
      title: 'Click to Configure',
      desc: 'Click any node to open the property panel on the right and edit its settings.',
    },
    {
      icon: <Link2 size={18} className="text-amber-500" />,
      title: 'Connect Nodes',
      desc: 'Drag from a node handle to another to create edges. Add conditions on branches.',
    },
    {
      icon: <TestTube2 size={18} className="text-purple-500" />,
      title: 'Test Your Workflow',
      desc: 'Click "Test Workflow" to validate and simulate execution with animated playback.',
    },
    {
      icon: <Sparkles size={18} className="text-pink-500" />,
      title: 'AI Generator',
      desc: 'Use "Generate with AI" to create workflows from natural language descriptions.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
              <Workflow size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">
                Welcome to NeoFlow
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                HR Workflow Designer — Quick Start Guide
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 pb-2 flex flex-col gap-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/60 hover:bg-muted/60 transition-colors"
            >
              <div className="mt-0.5 shrink-0">{step.icon}</div>
              <div>
                <h4 className="text-sm font-semibold text-foreground leading-tight">
                  {step.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="mx-6 mt-2 mb-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 border border-border/40 rounded-lg px-3 py-2">
          <Lightbulb size={14} className="shrink-0 text-amber-500" />
          <span>
            Use <strong>Undo/Redo</strong>, <strong>Export/Import JSON</strong>, and{' '}
            <strong>Auto-Layout</strong> from the toolbar.
          </span>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
          <button
            onClick={handleDismiss}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
