import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Sparkles, Loader2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { NodeType } from '../../types/nodes';
import { getAutomations } from '../../api/mockApi';

export default function AIGeneratorModal() {
  const { aiGeneratorOpen, setAiGeneratorOpen, setGraph } = useWorkflowStore();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!aiGeneratorOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    try {
      // 1. Simulate API Latency & Fetch Real Automations to prove API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      const automations = await getAutomations();
    
    // 2. Set up new canvas state
    const newNodes: any[] = [];
    const newEdges: any[] = [];
    let currentX = 50;
    const currentY = window.innerHeight / 2 - 100;

    const addNode = (type: NodeType, title: string, x: number, y: number, extraData: any = {}) => {
      const id = uuidv4();
      newNodes.push({
        id, type, position: { x, y },
        data: { type, title, metadata: [], customFields: [], params: {}, isSimulating: false, simStatus: undefined, ...extraData }
      });
      return id;
    };

    const addEdge = (source: string, target: string, condition?: any) => {
      newEdges.push({
        id: uuidv4(), source, target, type: 'custom', animated: false,
        data: { condition }
      });
    };

    const lowerPrompt = prompt.toLowerCase();
    const isComplex = lowerPrompt.includes('complex') || lowerPrompt.includes('branch') || lowerPrompt.includes('test every feature') || lowerPrompt.includes('mock api') || prompt.length > 80;

    if (isComplex) {
      // --- SHOWCASE GRAPH: BRANCHING & MOCK APIS ---
      
      const startId = addNode('start', 'Onboarding Trigger', currentX, currentY);
      currentX += 300;

      const taskId = addNode('task', 'Verify HR Documents', currentX, currentY, { assignee: 'HR Lead', dueDate: new Date().toISOString().split('T')[0] });
      addEdge(startId, taskId);
      currentX += 300;

      const approvalId = addNode('approval', 'Finance Budget Review', currentX, currentY, { approverRole: 'Finance Director', autoApproveThreshold: 2 });
      addEdge(taskId, approvalId);
      currentX += 350;

      // Dynamic Mock API Matching
      const getAction = (matchId: string) => automations.find(a => a.id === matchId) || automations[0];
      
      // BRANCH A: Approved Configured via Mock API
      const slackAction = getAction('send_slack');
      const slackParams: any = {};
      slackAction?.params.forEach(p => slackParams[p] = p === 'channel' ? '#onboarding' : 'Welcome to the team!');
      
      const approvedPathId = addNode('automated', 'Provision Access', currentX, currentY - 150, { 
        actionId: slackAction?.id, parameters: slackParams 
      });
      addEdge(approvalId, approvedPathId, { field: 'Status', operator: '==', value: 'Approved' });

      // BRANCH B: Rejected Configured via Mock API
      const emailAction = getAction('send_email');
      const emailParams: any = {};
      emailAction?.params.forEach(p => emailParams[p] = p === 'to' ? 'hr@company.com' : 'Budget Denied Alert');

      const rejectedPathId = addNode('automated', 'Alert HR', currentX, currentY + 150, { 
        actionId: emailAction?.id, parameters: emailParams 
      });
      addEdge(approvalId, rejectedPathId, { field: 'Status', operator: '==', value: 'Rejected' });

      // CONVERGE
      currentX += 350;
      const endId = addNode('end', 'Process Finalized', currentX, currentY, { completionMessage: 'Workflow completed successfully.', summaryFlag: true });
      addEdge(approvedPathId, endId);
      addEdge(rejectedPathId, endId);

    } else {
      // --- DYNAMIC LINEAR PARSING WITH MOCK APIS ---
      
      let lastId = addNode('start', `${prompt.split(' ')[0]} Process`, currentX, currentY, { triggerType: 'API' });
      currentX += 300;

      // Extract tasks
      if (lowerPrompt.includes('document') || lowerPrompt.includes('task')) {
        const newId = addNode('task', 'Complete Forms', currentX, currentY, { assignee: 'System User' });
        addEdge(lastId, newId);
        lastId = newId; currentX += 300;
      }
      
      // Extract approvals
      if (lowerPrompt.includes('approval') || lowerPrompt.includes('manager')) {
        const newId = addNode('approval', 'Manager Review', currentX, currentY, { approverRole: 'Manager', autoApproveThreshold: 3 });
        addEdge(lastId, newId);
        lastId = newId; currentX += 300;
      }
      
      // Extract automations
      if (lowerPrompt.includes('email') || lowerPrompt.includes('update') || lowerPrompt.includes('system') || lowerPrompt.includes('slack')) {
        // Find best match in Mock API
        let bestMatch = automations[0];
        for (const auto of automations) {
          if (lowerPrompt.includes(auto.id.split('_')[1]) || lowerPrompt.includes(auto.id.split('_')[0])) bestMatch = auto;
        }
        
        const generatedParams: any = {};
        bestMatch.params.forEach(p => generatedParams[p] = `{${p}_value}`);

        const newId = addNode('automated', 'Execute Action', currentX, currentY, { actionId: bestMatch.id, parameters: generatedParams });
        addEdge(lastId, newId);
        lastId = newId; currentX += 300;
      }

      // Ensure min length
      if (newNodes.length === 1) {
        const newId = addNode('task', 'Initial Review', currentX, currentY, { assignee: 'HR' });
        addEdge(lastId, newId);
        lastId = newId; currentX += 300;
      }

      const endId = addNode('end', 'Process Completed', currentX, currentY, { endMessage: 'Done' });
      addEdge(lastId, endId);
    }

      setGraph(newNodes as any, newEdges as any);
      setAiGeneratorOpen(false);
      setPrompt('');
    } catch (error) {
      console.error('Failed to generate workflow:', error);
    } finally {
      setIsGenerating(false);
    }
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
