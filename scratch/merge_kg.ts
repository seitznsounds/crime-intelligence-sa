
import fs from 'fs';
import path from 'path';

const kg1Path = 'intelligence/kg_part_1.json';
const kg2aPath = 'intelligence/kg_part_2a.json';
const kg2bPath = 'intelligence/kg_part_2b.json';
const outputPath = 'intelligence/corruption_knowledge_graph.json';

const kg1 = JSON.parse(fs.readFileSync(kg1Path, 'utf8'));
const kg2a = JSON.parse(fs.readFileSync(kg2aPath, 'utf8'));
const kg2b = JSON.parse(fs.readFileSync(kg2bPath, 'utf8'));

// Normalize IDs
const idMapping: { [key: string]: string } = {
  'constitutional-court-sa': 'constitutional-court',
  'supreme-court-appeal-sa': 'supreme-court-of-appeal',
};

const allNodes = [...kg1.nodes, ...kg2a.nodes, ...kg2b.nodes];
const allEdges = [...kg1.edges, ...kg2a.edges, ...kg2b.edges];

const nodesMap: { [id: string]: any } = {};

allNodes.forEach(node => {
  const id = idMapping[node.id] || node.id;
  if (!nodesMap[id]) {
    nodesMap[id] = { ...node, id };
  } else {
    // Merge metadata
    nodesMap[id].metadata = { ...nodesMap[id].metadata, ...node.metadata };
    // Update description to be more comprehensive if possible
    if (node.metadata.description && node.metadata.description.length > nodesMap[id].metadata.description.length) {
        nodesMap[id].metadata.description = node.metadata.description;
    }
  }
});

const finalEdges: any[] = [];
const edgeKeys = new Set<string>();

allEdges.forEach(edge => {
  const source = idMapping[edge.source] || edge.source;
  const target = idMapping[edge.target] || edge.target;
  const key = `${source}|${target}|${edge.relationship}`;
  
  if (!edgeKeys.has(key)) {
    edgeKeys.add(key);
    finalEdges.push({ ...edge, source, target });
  }
});

// Validate edge sources and targets
const nodeIds = new Set(Object.keys(nodesMap));
const validatedEdges = finalEdges.filter(edge => {
  const sourceExists = nodeIds.has(edge.source);
  const targetExists = nodeIds.has(edge.target);
  if (!sourceExists) console.warn(`Warning: Source node ${edge.source} not found for edge ${edge.relationship}`);
  if (!targetExists) console.warn(`Warning: Target node ${edge.target} not found for edge ${edge.relationship}`);
  return sourceExists && targetExists;
});

const finalNodes = Object.values(nodesMap);

const result = {
  nodes: finalNodes,
  edges: validatedEdges
};

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`Merged ${finalNodes.length} nodes and ${validatedEdges.length} edges.`);

// Hub analysis
const connectivity: { [id: string]: number } = {};
finalNodes.forEach(n => connectivity[n.id] = 0);
validatedEdges.forEach(e => {
  connectivity[e.source]++;
  connectivity[e.target]++;
});

const sortedHubs = Object.entries(connectivity)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 10);

console.log('Top Hubs:');
sortedHubs.forEach(([id, count]) => {
  const node = nodesMap[id];
  console.log(`- ${node.name} (${id}): ${count} connections`);
});

// Suggestions for scraping
console.log('\nSuggested for further scraping:');
const suggestions = sortedHubs.filter(([id]) => {
    const node = nodesMap[id];
    // Prioritize high-connectivity entities that are likely to have more news/info
    return node.type === 'Person' || node.type === 'Organization' || node.type === 'Event';
}).slice(0, 5);

suggestions.forEach(([id]) => {
    const node = nodesMap[id];
    console.log(`- ${node.name} (${id}): High connectivity suggests central role in corruption networks or legal responses.`);
});
