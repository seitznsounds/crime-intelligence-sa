
import * as fs from 'fs';
import * as path from 'path';

const EXTRACTIONS_DIR = path.join(process.cwd(), 'intelligence', 'extractions');
const KG_PATH = path.join(process.cwd(), 'intelligence', 'corruption_knowledge_graph.json');
const INVESTIGATE_PATH = path.join(process.cwd(), '.research', 'to-ingest', 'INVESTIGATE.md');

interface GraphNode {
    id: string;
    type: string;
    name: string;
    metadata: any;
}

interface GraphEdge {
    source: string;
    target: string;
    relationship: string;
    description: string;
}

interface KnowledgeGraph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function loadKG(): KnowledgeGraph {
    if (fs.existsSync(KG_PATH)) {
        return JSON.parse(fs.readFileSync(KG_PATH, 'utf-8'));
    }
    return { nodes: [], edges: [] };
}

function saveKG(graph: KnowledgeGraph) {
    fs.writeFileSync(KG_PATH, JSON.stringify(graph, null, 2), 'utf-8');
}

function extractEntities(text: string): { name: string, type: 'Person' | 'Organization' | 'Event' }[] {
    const entities: { name: string, type: 'Person' | 'Organization' | 'Event' }[] = [];
    
    // Simple regex for Capitalized Names (2-4 words)
    // Matches "Brown Mogotsi", "Vusimuzi 'Cat' Matlala", etc.
    const nameRegex = /\b([A-Z][a-z]+(?:\s+(?:'[^']+'\s+)?[A-Z][a-z]+){1,3})\b/g;
    let match;
    while ((match = nameRegex.exec(text)) !== null) {
        const name = match[1].trim();
        if (name.length > 50) continue;
        // Filter out some common false positives
        if (!['South Africa', 'North West', 'Madlanga Commission', 'Constitutional Court', 'Supreme Court', 'High Court', 'Johannesburg Magistrate', 'Daily News', 'Independent Newspapers', 'News24', 'Daily Maverick', 'TimesLIVE', 'Sunday Times', 'United Nations', 'International Criminal', 'South African'].includes(name)) {
            entities.push({ name, type: 'Person' });
        }
    }

    // Specific keywords for Orgs
    const orgKeywords = ['Commission', 'Department', 'Agency', 'Corporation', 'Services', 'Trading', 'Suppliers', 'Group', 'Forum', 'Association', 'SAPS', 'NPA', 'Hawks', 'ANC', 'DA', 'EFF', 'ActionSA', 'Medicare 24'];
    orgKeywords.forEach(keyword => {
        // More restrictive Org regex: 1-5 capitalized words before the keyword
        const regex = new RegExp(`\\b((?:[A-Z][\\w-]+\\s+){0,5}${keyword})\\b`, 'g');
        while ((match = regex.exec(text)) !== null) {
            const name = match[1].trim();
            if (name.length > 60 || name.length < 3) continue;
            entities.push({ name, type: 'Organization' });
        }
    });

    // Deduplicate within the same extraction
    return entities.filter((ent, index, self) =>
        index === self.findIndex((t) => t.name === ent.name)
    );
}

function sync() {
    console.log("Starting sync of extractions to Knowledge Graph...");
    const graph = loadKG();
    const existingNodeNames = new Set(graph.nodes.map(n => n.name.toLowerCase()));
    const existingNodeIds = new Set(graph.nodes.map(n => n.id));

    const files = fs.readdirSync(EXTRACTIONS_DIR).filter(f => f.endsWith('.json'));
    
    let totalNewNodes = 0;
    let totalNewEdges = 0;

    for (const file of files) {
        const filePath = path.join(EXTRACTIONS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        let data;
        try {
            data = JSON.parse(content);
        } catch (e) {
            console.warn(`Failed to parse ${file}: ${e}`);
            continue;
        }

        if (!Array.isArray(data)) continue;

        data.forEach((item: any) => {
            const textContent = (item.markdown || item.content || item.description || item.headline || "").toString();
            if (!textContent) return;

            const foundEntities = extractEntities(textContent);
            
            foundEntities.forEach(ent => {
                const id = slugify(ent.name);
                if (!existingNodeIds.has(id) && !existingNodeNames.has(ent.name.toLowerCase())) {
                    graph.nodes.push({
                        id,
                        type: ent.type,
                        name: ent.name,
                        metadata: {
                            description: `Extracted from ${file}`,
                            source_file: file,
                            first_seen: new Date().toISOString()
                        }
                    });
                    existingNodeIds.add(id);
                    existingNodeNames.add(ent.name.toLowerCase());
                    totalNewNodes++;
                } else {
                    // Update metadata if needed
                    const node = graph.nodes.find(n => n.id === id);
                    if (node && !node.metadata.source_files?.includes(file)) {
                        node.metadata.source_files = node.metadata.source_files || [];
                        node.metadata.source_files.push(file);
                        // Append to description if it's generic
                        if (node.metadata.description === `Extracted from ${file}` || node.metadata.description?.startsWith('Extracted from')) {
                             // Keep it as is or add more context
                        }
                    }
                }
            });

            // Very simple relationship extraction
            // Look for sentences containing two entities
            const sentences = textContent.split(/[.!?\n]/);
            sentences.forEach(sentence => {
                const entitiesInSentence = foundEntities.filter(ent => sentence.includes(ent.name));
                if (entitiesInSentence.length >= 2) {
                    for (let i = 0; i < entitiesInSentence.length; i++) {
                        for (let j = i + 1; j < entitiesInSentence.length; j++) {
                            const sourceId = slugify(entitiesInSentence[i].name);
                            const targetId = slugify(entitiesInSentence[j].name);
                            
                            // Avoid self-loops and duplicates
                            if (sourceId === targetId) continue;
                            
                            const edgeExists = graph.edges.some(e => 
                                (e.source === sourceId && e.target === targetId) ||
                                (e.source === targetId && e.target === sourceId)
                            );

                            if (!edgeExists) {
                                let rel = "LinkedTo";
                                if (sentence.toLowerCase().includes("arrested")) rel = "InvestigatedBy";
                                if (sentence.toLowerCase().includes("testified")) rel = "TestifiedIn";
                                if (sentence.toLowerCase().includes("funded")) rel = "Funded";
                                if (sentence.toLowerCase().includes("owner of")) rel = "OwnerOf";
                                if (sentence.toLowerCase().includes("associate of")) rel = "AssociateOf";

                                graph.edges.push({
                                    source: sourceId,
                                    target: targetId,
                                    relationship: rel,
                                    description: sentence.trim().substring(0, 200)
                                });
                                totalNewEdges++;
                            }
                        }
                    }
                }
            });
        });
    }

    console.log(`Sync complete. Added ${totalNewNodes} new nodes and ${totalNewEdges} new edges.`);
    saveKG(graph);

    // Update INVESTIGATE.md
    if (totalNewNodes > 0 || totalNewEdges > 0) {
        let investigateContent = fs.readFileSync(INVESTIGATE_PATH, 'utf-8');
        const updateNote = `\n\n### Update: ${new Date().toISOString().split('T')[0]}\n- Automatically synced ${totalNewNodes} new entities and ${totalNewEdges} relationships from extractions.\n- New entities identified: ${graph.nodes.slice(-5).map(n => n.name).join(', ')}.\n`;
        investigateContent += updateNote;
        fs.writeFileSync(INVESTIGATE_PATH, investigateContent, 'utf-8');
        console.log("Updated INVESTIGATE.md");
    }
}

sync();
