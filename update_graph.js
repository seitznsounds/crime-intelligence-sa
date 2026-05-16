
const fs = require("fs");

const filePath = "intelligence/corruption_knowledge_graph.json";
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

const newNodes = [
    {
      "id": "simon-rudland",
      "type": "Person",
      "name": "Simon Rudland",
      "metadata": {
        "description": "Co-founder, Gold Leaf Tobacco Corporation (GLTC). Alleged kingpin/boss of gold smuggling operation. Allegedly bankrolled gold smuggling operations and wields significant influence over Zimbabwean state institutions.",
        "roles": [
          "Co-founder, Gold Leaf Tobacco Corporation (GLTC)",
          "Alleged kingpin/boss of gold smuggling operation"
        ],
        "risk_score": 95,
        "status": "High risk"
      }
    },
    {
      "id": "gltc",
      "type": "Organization",
      "name": "Gold Leaf Tobacco Corporation (GLTC)",
      "metadata": {
        "description": "Tobacco empire whose cash reserves were allegedly used to purchase gold in Zimbabwe and smuggle it to Dubai."
      }
    },
    {
      "id": "kamlesh-pattni",
      "type": "Person",
      "name": "Kamlesh Pattni",
      "metadata": {
        "description": "Businessman and Pastor (known as \"Brother Paul\"). Central figure in the \"Gold Mafia\" investigation and key figure in the Kenyan Goldenberg scandal. Claimed to use political connections to facilitate gold smuggling.",
        "roles": [
          "Businessman",
          "Pastor (known as \"Brother Paul\")",
          "Central figure in the \"Gold Mafia\" investigation",
          "Key figure in the Kenyan Goldenberg scandal"
        ],
        "risk_score": 92,
        "status": "High risk"
      }
    },
    {
      "id": "goldenberg-international",
      "type": "Organization",
      "name": "Goldenberg International",
      "metadata": {
        "description": "Company implicated in the 1990s Goldenberg scandal in Kenya involving alleged smuggling of gold and diamonds."
      }
    },
    {
      "id": "ewan-macmillan",
      "type": "Person",
      "name": "Ewan Macmillan",
      "metadata": {
        "description": "Businessman, convicted gold smuggler, and fixer for money laundering. Offered to \"clean\" dirty cash by buying gold in Zimbabwe and smuggling it to Dubai.",
        "roles": [
          "Businessman",
          "Convicted gold smuggler",
          "Fixer for money laundering"
        ],
        "risk_score": 90,
        "status": "High risk"
      }
    },
    {
      "id": "gold-mafia",
      "type": "Organization",
      "name": "Gold Mafia",
      "metadata": {
        "description": "An alleged gold smuggling and money laundering operation involving buying gold in Zimbabwe and smuggling it to Dubai."
      }
    },
    {
      "id": "emmerson-mnangagwa",
      "type": "Person",
      "name": "Emmerson Mnangagwa",
      "metadata": {
        "description": "President of Zimbabwe."
      }
    }
];

const newEdges = [
    {
      "source": "simon-rudland",
      "target": "gold-mafia",
      "relationship": "Funded",
      "description": "Allegedly bankrolled gold smuggling operations."
    },
    {
      "source": "simon-rudland",
      "target": "gltc",
      "relationship": "AffiliatedWith",
      "description": "Co-founder of Gold Leaf Tobacco Corporation."
    },
    {
      "source": "kamlesh-pattni",
      "target": "gold-mafia",
      "relationship": "AffiliatedWith",
      "description": "Central figure in the \"Gold Mafia\" investigation, moving large amounts of gold and laundering money."
    },
    {
      "source": "kamlesh-pattni",
      "target": "goldenberg-international",
      "relationship": "AffiliatedWith",
      "description": "Key figure in the 1990s Goldenberg scandal through Goldenberg International."
    },
    {
      "source": "ewan-macmillan",
      "target": "gold-mafia",
      "relationship": "AffiliatedWith",
      "description": "Fixer for money laundering and convicted gold smuggler operating in Zimbabwe."
    },
    {
      "source": "ewan-macmillan",
      "target": "emmerson-mnangagwa",
      "relationship": "PartneredWith",
      "description": "Claimed direct access and partnership with President Emmerson Mnangagwa."
    }
];

// Deduplicate existing nodes by id
const existingNodeIds = new Set(data.nodes.map(n => n.id));
for (const n of newNodes) {
    if (!existingNodeIds.has(n.id)) {
        data.nodes.push(n);
    }
}

// Just push edges, could deduplicate but we assume theyre new
data.edges.push(...newEdges);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
console.log("Updated graph successfully.");
