import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Sparkles, Loader2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { NodeType } from '../../types/nodes';

export default function AIGeneratorModal() {
  const { aiGeneratorOpen, setAiGeneratorOpen, setGraph } = useWorkflowStore();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!aiGeneratorOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple mock parser: generates a basic linear workflow based on keywords
    const newNodes = [];
    const newEdges = [];
    
    let y = 100;
    const addNode = (type: NodeType, title: string) => {
      const id = uuidv4();
      newNodes.push({
        id,
        type,
        position: { x: window.innerWidth / 2 - 100, y },
        data: { type, title, metadata: [], customFields: [], params: {} } // Mock base
      });
      if (newNodes.length > 1) {
        newEdges.push({
          id: uuidv4(),
          source: newNodes[newNodes.length - 2].id,
          target: id,
          type: 'custom',
          animated: false
        });
      }
      y += 150;
      return id;
    };

    addNode('start', `${prompt.split(' ')[0]} Request Initialized`);
    
    if (prompt.toLowerCase().includes('document') || prompt.toLowerCase().includes('form')) {
      addNode('task', 'Collect Documents');
    }
    
    if (prompt.toLowerCase().includes('approval') || prompt.toLowerCase().includes('manager')) {
      addNode('approval', 'Manager Approval');
    }
    
    if (prompt.toLowerCase().includes('email') || prompt.toLowerCase().includes('notify')) {
      addNode('automated', 'Send Notification');
      // Mock setting an automated prop
      newNodes[newNodes.length - 1].data = {
          type: 'automated',
          title: 'Send Notification',
          actionId: 'send_email',
          parameters: { to: 'employee@company.com', subject: 'Workflow Update' }
      };
    }
    
    if (newNodes.length === 1) {
       addNode('task', 'Review Request'); // Fallback if no keywords matched
    }
    
    addNode('end', 'Process Completed');

    setGraph(newNodes as any, newEdges as any);
    setIsGenerating(false);
    setAiGeneratorOpen(false);
    setPrompt('');
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Sparkles size={18} className="text-purple-500" />
            AI Workflow Generator
          </div>
          <button 
            onClick={() => setAiGeneratorOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Describe the workflow you want to build in natural language, and our AI will instantly generate the structure, nodes, and connections for you.
          </p>
          <textarea
            className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-muted-foreground text-sm"
            placeholder="e.g. Create an employee offboarding workflow. Start by generating the leaver document. Ask HR to approve it. Finally, send a summary email."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            autoFocus
          />
        </div>
        
        <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-3">
          <button
            onClick={() => setAiGeneratorOpen(false)}
            className="px-4 py-2 rounded-md text-sm font-medium text-foreground bg-transparent hover:bg-muted transition-colors disabled:opacity-50"
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Workflow
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
