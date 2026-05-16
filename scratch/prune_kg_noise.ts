import fs from 'fs';
import path from 'path';

const KG_PATH = path.join(process.cwd(), 'intelligence', 'corruption_knowledge_graph.json');

function cleanKG() {
    if (!fs.existsSync(KG_PATH)) return;

    const kg = JSON.parse(fs.readFileSync(KG_PATH, 'utf-8'));
    console.log(`Initial KG state: ${kg.nodes.length} nodes, ${kg.edges.length} edges.`);

    // 1. Identify "Noise" Patterns
    // - Very long names (often partial sentences)
    // - Generic nouns (e.g. "The Country", "Investigations")
    // - Nodes with no name
    
    const noiseKeywords = [
        "investigations", "high number", "facing criminal charges", "other officers",
        "public finance management act", "relation to", "in connection to", "leaked",
        "deep investigative research", "identify", "trace", "audit", "current status",
        "saps", "anc" // These specific ones if they are just the acronym without context
    ];

    const cleanedNodes = kg.nodes.filter((node: any) => {
        if (!node.name || node.name.trim() === "") return false;
        if (node.name.length > 60) return false; // Likely a sentence fragment
        
        const lowerName = node.name.toLowerCase();
        
        // Remove if name is just a noise keyword
        if (noiseKeywords.includes(lowerName)) return false;
        
        // Remove if it's a generic prompt-like sentence
        if (lowerName.includes("identify") || lowerName.includes("trace the") || lowerName.includes("investigate")) return false;

        return true;
    });

    const validNodeIds = new Set(cleanedNodes.map((n: any) => n.id));

    const cleanedEdges = kg.edges.filter((edge: any) => {
        return validNodeIds.has(edge.source) && validNodeIds.has(edge.target);
    });

    console.log(`Cleaned KG state: ${cleanedNodes.length} nodes, ${cleanedEdges.length} edges.`);
    
    kg.nodes = cleanedNodes;
    kg.edges = cleanedEdges;

    fs.writeFileSync(KG_PATH, JSON.stringify(kg, null, 2));
    console.log("Knowledge Graph noise pruning complete.");
}

cleanKG();
