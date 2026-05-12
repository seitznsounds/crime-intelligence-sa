import os

def distill_whistleblower_regime():
    extracted_path = ".intelligence/extractions/pplaaf/whistleblower_protection_regime_2023.md"
    if not os.path.exists(extracted_path):
        print("Extraction file not found.")
        return

    with open(extracted_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Distillation Logic (Simulated for this script)
    # In a real scenario, I'd use regex or NLP to pull specific sections.
    # Here, I'll structure the findings for our DB.

    distilled_data = {
        "title": "Discussion Document on Proposed Reforms for the Whistleblower Protection Regime in South Africa (2023)",
        "source": "PPLAAF / DOJCD",
        "key_entities": ["DOJCD", "Zondo Commission", "WPU", "NPA", "FIC", "Adv. T Nkabinde"],
        "legislation_mapped": [
            "Constitution of RSA 1996",
            "Protected Disclosures Act 2000 (PDA)",
            "Labour Relations Act 1995 (LRA)",
            "Companies Act 2008",
            "Financial Intelligence Centre Act 2001 (FICA)",
            "National Environmental Management Act 1998 (NEMA)",
            "Witness Protection Act 112 of 1998",
            "Prevention and Combating of Corrupt Activities Act 2004 (PRECCA)"
        ],
        "critical_gaps": [
            "Lack of physical protection for whistleblowers in the PDA.",
            "No incentives or rewards in the general whistleblowing framework (PDA).",
            "Inability of the PDA to protect against detriments outside of formal employment (blacklisting, harassment).",
            "Fragmentation of laws creates confusion and reporting inertia.",
            "Retaliation often goes unpunished despite legal prohibitions."
        ],
        "strategic_insights": [
            "Environmental acts provide a 25% reward from fines; this model could be expanded to high-level corruption.",
            "The Zondo Commission explicitly stated that the PDA is 'deficient in many important respects'.",
            "Witness Protection (WPU) is managed by the NPA but governed by DOJCD, creating potential bureaucratic friction."
        ]
    }

    # Save distilled report
    distilled_path = ".intelligence/distillations/pplaaf/whistleblower_regime_distilled.md"
    os.makedirs(os.path.dirname(distilled_path), exist_ok=True)
    
    with open(distilled_path, "w", encoding="utf-8") as f:
        f.write(f"# Distilled Intelligence: {distilled_data['title']}\n\n")
        f.write(f"**Source**: {distilled_data['source']}\n\n")
        f.write("## 🏛️ Key Entities\n")
        for e in distilled_data['key_entities']:
            f.write(f"- {e}\n")
        f.write("\n## ⚖️ Legislation Mapped\n")
        for l in distilled_data['legislation_mapped']:
            f.write(f"- {l}\n")
        f.write("\n## ⚠️ Critical Gaps Identified\n")
        for g in distilled_data['critical_gaps']:
            f.write(f"- {g}\n")
        f.write("\n## 🧠 Strategic Insights for Manifesto\n")
        for s in distilled_data['strategic_insights']:
            f.write(f"- {s}\n")

    print(f"Successfully distilled to {distilled_path}")

if __name__ == "__main__":
    distill_whistleblower_regime()
