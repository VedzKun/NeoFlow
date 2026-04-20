const fs = require('fs');
const path = require('path');

const nodesDir = 'c:\\Users\\HP\\NeoFlow\\src\\components\\nodes';
const files = fs.readdirSync(nodesDir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const fullPath = path.join(nodesDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix NodeProps
    if (content.includes('NodeProps')) {
      content = content.replace(/import\s*\{([^}]*)NodeProps([^}]*)\}\s*from\s*'reactflow';/, "import {$1$2} from 'reactflow';\nimport type { NodeProps } from 'reactflow';");
      content = content.replace(/import\s*\{\s*,\s*/g, 'import { ').replace(/,\s*\}/g, ' }').replace(/import\s*\{\s*\}\s*from\s*'reactflow';\n/, '');
    }
    
    // Fix NodeData
    content = content.replace(/import\s*\{\s*([a-zA-Z]+NodeData)\s*\}\s*from\s*'\.\.\/\.\.\/types\/nodes';/, "import type { $1 } from '../../types/nodes';");
    
    fs.writeFileSync(fullPath, content);
  }
});

const edgePath = 'c:\\Users\\HP\\NeoFlow\\src\\components\\Canvas\\CustomEdge.tsx';
if (fs.existsSync(edgePath)) {
  let content = fs.readFileSync(edgePath, 'utf8');
  content = content.replace(/import\s*\{\s*EdgeProps\s*,([^}]*)\}\s*from\s*'reactflow';/, "import {$1} from 'reactflow';\nimport type { EdgeProps } from 'reactflow';");
  content = content.replace(/import\s*\{\s*EdgeCondition\s*\}\s*from\s*'\.\.\/\.\.\/types\/workflow';/, "import type { EdgeCondition } from '../../types/workflow';");
  fs.writeFileSync(edgePath, content);
}
