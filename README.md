# NeoFlow ⬡ — HR Workflow Designer (Advanced Edition)

NeoFlow is a modular, scalable React application for visually designing, configuring, and testing internal HR workflows (onboarding, leave approval, document verification, etc.).

This represents the **Advanced Edition**, a production-grade prototype tailored specifically for high-end AI platforms using a minimalist, professional shadcn-inspired aesthetic (Tailwind CSS + Lucide React).

## 🚀 Quick Start

Ensure you have Node.js installed, then run the following in the project root:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🏆 Case Study Requirements Check

All original case study requirements from pages 3-9 have been implemented with 100% fidelity:

- ✅ **Tech Stack:** Vite + React 18 + TypeScript strict mode.
- ✅ **React Flow Setup:** 5 fully customized nodes (Start, Task, Approval, Automated, End).
- ✅ **Layout:** Sidebar palette (drag-and-drop & click-to-add), Center canvas, Dynamic right-side property panel.
- ✅ **Node Form Bindings:** Granular control over Assignees, Due Dates, Role Thresholds, API Endpoints, and dynamic Key-Value arrays.
- ✅ **Mock API Layer:** Fast frontend simulation evaluating step-by-step logic and simulating an automation fetch payload.
- ✅ **Validation Engine:** Rigorous cycle checks, orphan detection, and form completeness validation.
- ✅ **Simulated Output Display:** Chronological timeline showing successful paths and missing configuration errors.

**Additional Bonus Features Included:**
- ✅ Export/Import graph definition to/from JSON.
- ✅ Global Undo/Redo tracking utilizing time-travel stores.
- ✅ Auto-layout functionality via `dagre`.
- ✅ Hover minimaps and visual error highlighting.

---

## ✨ 4 NEW Advanced Features added

Per the brief, 4 advanced features have been incorporated:

1. **AI Workflow Generator (NLP to Graph Parsing)**
   - Click "Generate with AI" in the top navigation.
   - Enter a natural language request (e.g., "Create a fast tracking HR review with an automated email").
   - A mock LLM parsing engine parses keywords and automatically lays out the necessary nodes and edges onto the canvas.

2. **Smart Conditional Branching**
   - Click on an Edge, or select a source Node and view its "Outgoing Branches" in the property panel.
   - Attach logic conditions via a simple builder (`Field == Value`).
   - The simulator evaluates these branch conditions in real-time. Unmet branches gracefully skip execution.

3. **Real-Time Animated Simulation Playback**
   - Hitting "Test Workflow" will validate the graph, run the Mock API execution, and pop up the Sandbox.
   - Watch as execution flows sequentially. Nodes highlight and ring, while the conditional custom edges pulse dynamically down the graph as the timeline step evaluates.

4. **Workflow Analytics Dashboard**
   - A collapsible side-panel detailing comprehensive graph metrics.
   - Runs a heuristic to identify the most likely **Critical Bottleneck** node (measuring inbound convergence or role approvals).
   - Generates Success Probability percentages and Estimated Hours based on Node composition.

---

## 🏗️ Architecture & Decisions

### Tooling choices
- **Zustand + Zundo:** Zustand avoids React context repaints keeping the massive graph state performant. `zundo` was wrapped around the store properties to elegantly implement full undo/redo with zero extra payload.
- **Tailwind CSS:** Rather than huge CSS modules, we moved to a minimalist, utility-first UI echoing `shadcn/ui` standards, using strict CSS variable standardizations (`hsl(...)`) for guaranteed professional contrast and dark mode aesthetics.

### Decoupling 
Custom node components (`TaskNode`, `StartNode`) only handle rendering visually. The `EditPanel` handles form logic. Neither communicates directly; they both read/write to the Zustand singleton, dropping edge-case prop-drilling errors to 0.

### Simulation Engine
The `simulateWorkflow` API builds an adjacency list and triggers a Breadth-First-Search (BFS), evaluating edge conditions to dynamically adjust the traversal queue. 
The UI layer reads this flat list of sequential outcomes, and `useSimulationEngine` incrementally steps through it on a timer, dispatching dynamic CSS variable updates to React Flow nodes/edges to create the live visual playback.

---

## 🔮 What I Would Add With More Time

While this prototype hits the maximum scope asked for, the real-world production version would add:

1. **Persisted File System Layer:** Hooking the Export/Import JSON payloads to a real Postgres database (via Next.js/Prisma) so users can name and store different workspace flows.
2. **True LLM Integation:** Replacing the mocked string-keyword check inside the AI Generator with a real tool-enabled LLM call (e.g. OpenAI function calling that returns the React Flow JSON spec directly).
3. **Multi-player Collaboration:** Integrating `yjs` with Zustand to allow multiple HR admins to drag nodes across the same canvas with real-time cursors.
4. **Interactive Sandbox Overrides:** Allowing a user to "click" an approval node while the animation runs to pause execution and force a rejection state.
