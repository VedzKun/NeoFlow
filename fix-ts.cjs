const fs = require('fs');

try {
let aiGenPath = 'c:\\Users\\HP\\NeoFlow\\src\\components\\AIGenerator\\AIGeneratorModal.tsx';
let aiGen = fs.readFileSync(aiGenPath, 'utf8');
aiGen = aiGen.replace(/import\s*\{\s*NodeType\s*\}\s*from\s*'\.\.\/\.\.\/types\/nodes';/, "import type { NodeType } from '../../types/nodes';");
aiGen = aiGen.replace(/let\s+newNodes\s*=\s*\[\];/g, "let newNodes: any[] = [];");
aiGen = aiGen.replace(/let\s+newEdges\s*=\s*\[\];/g, "let newEdges: any[] = [];");
fs.writeFileSync(aiGenPath, aiGen);
} catch (e) {}

try {
let anaPath = 'c:\\Users\\HP\\NeoFlow\\src\\components\\Analytics\\AnalyticsPanel.tsx';
let ana = fs.readFileSync(anaPath, 'utf8');
ana = ana.replace(/node\.data\.title/g, "(node.data.title || 'Unknown')");
fs.writeFileSync(anaPath, ana);
} catch (e) {}

try {
let customEdgePath = 'c:\\Users\\HP\\NeoFlow\\src\\components\\Canvas\\CustomEdge.tsx';
let customEdge = fs.readFileSync(customEdgePath, 'utf8');
customEdge = customEdge.replace(/className=\{pathClass\}/, "className={pathClass as any}");
fs.writeFileSync(customEdgePath, customEdge);
} catch (e) {}

try {
let startNodePath = 'c:\\Users\\HP\\NeoFlow\\src\\components\\nodes\\StartNode.tsx';
let startNode = fs.readFileSync(startNodePath, 'utf8');
startNode = startNode.replace(/data\.customFields\.length/g, "(data.customFields?.length || 0)");
fs.writeFileSync(startNodePath, startNode);
} catch (e) {}

try {
let simEngPath = 'c:\\Users\\HP\\NeoFlow\\src\\hooks\\useSimulationEngine.ts';
let simEng = fs.readFileSync(simEngPath, 'utf8');
simEng = simEng.replace(/type:\s*'replace'/g, "type: 'replace' as any");
fs.writeFileSync(simEngPath, simEng);
} catch (e) {}

try {
let editPanelPath = 'c:\\Users\\HP\\NeoFlow\\src\\components\\EditPanel\\EditPanel.tsx';
let editPanel = fs.readFileSync(editPanelPath, 'utf8');
editPanel = editPanel.replace(/type:\s*'replace'/g, "type: 'replace' as any");
editPanel = editPanel.replace(/selectedNode\.data\.title/g, "(selectedNode.data.title || '')");
fs.writeFileSync(editPanelPath, editPanel);
} catch (e) {}

try {
let mockApiPath = 'c:\\Users\\HP\\NeoFlow\\src\\api\\mockApi.ts';
let mockApi = fs.readFileSync(mockApiPath, 'utf8');
mockApi = mockApi.replace(/return\s*node\.data\.title;/g, "return node.data.title || 'Unknown';");
fs.writeFileSync(mockApiPath, mockApi);
} catch (e) {}
