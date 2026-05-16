# Investigation Roadmap: South African Corruption Networks (2025-2026)

Following the analysis of the initial Wikipedia seed data and the enrichment from the Madlanga Commission extractions, the following tracks have been identified for urgent investigation.

## Priority Intelligence Requirements (PIR)

### 1. Identity & Testimony of 'Witness H'
*   **Objective:** Identify the individual providing in-camera evidence to the Madlanga Commission.
*   **Focus:** Allegations of political interference in senior judicial and police appointments.
*   **Source Track:** `investigations/witness-h.md`

### 2. The Port Shepstone Cocaine Trail
*   **Objective:** Track the R200 million cocaine cache stolen from Hawks storage.
*   **Focus:** Links between the 'Big Five Cartel', international syndicates, and internal Hawks/SAPS collaborators.
*   **Source Track:** `investigations/cocaine-trail.md`

### 3. ANC Funding Audit (Mogotsi/Matlala)
*   **Objective:** Map the flow of cartel funds into political events.
*   **Focus:** Specific ANC branches or events funded by Brown Mogotsi using Medicare 24 or Cat VIP Protection proceeds.
*   **Source Track:** `investigations/anc-political-funding.md`

### 4. Judicial & JSC Interference
*   **Objective:** Expose links between the cartel and the judiciary.
*   **Focus:** Influence on bail rulings (e.g., Katiso Molefe's R2.5m bribe allegation) and connections to JSC members.
*   **Source Track:** `investigations/judicial-interference.md`

### 5. Madlanga Commission Referrals & NPA Status
*   **Objective:** Monitor the progress of criminal cases referred by the commission.
*   **Focus:** Prosecutions of Fannie Masemola, Shadrack Sibiya, and others. Identify any "internal sabotage" within the NPA.
*   **Source Track:** `investigations/npa-prosecution-status.md`

### 6. Street-Prison Syndicate Linkages (Number Gangs)
*   **Objective:** Map the evolution of Number gangs (26s, 27s, 28s) into street-level supergangs.
*   **Focus:** Investigate the specific links between prison generals and street leaders of 'The Americans' (26s) and 'The Firm' (28s). Identify the 'blood line' recruitment patterns on the Cape Flats.
*   **Source Track:** `investigations/street-prison-nexus.md`

### 7. Transnational Syndicate Hubs (Triads & Sicilian Mafia)
*   **Objective:** Map the cooperation between Cape supergangs (Hard Livings, The Americans) and international syndicates.
*   **Focus:** Abalone poaching pipelines to Hong Kong (Sun Yee On, Wo Shing Wo) and illegal diamond/cannabis smuggling with the Sicilian Mafia.
*   **Source Track:** `investigations/transnational-gang-links.md`

### 8. Political Patronage & Construction Mafia (Delangokubona)
*   **Objective:** Expose the link between the Durban Business Forums and high-level political figures.
*   **Focus:** Systematic extortion of construction sites in KZN and the political protection afforded by 'RET' faction figures (Jacob Zuma, Zandile Gumede).
*   **Source Track:** `investigations/durban-business-forums.md`

### 9. Strategic Transport Sabotage (Taxi Wars & Rail Arson)
*   **Objective:** Investigate the systematic destruction of public rail infrastructure to benefit the taxi industry.
*   **Focus:** Links between taxi associations (CATA, CODETA) and organized train arson in the Western Cape. Identify the hitmen/operatives used for "route clearance".
- **Source Track:** `investigations/transport-sabotage.md`

### 10. Gangland Succession & State Infiltration (2025-2026)
*   **Objective:** Map the power vacuum and succession wars following the assassinations of major gang leaders (Solomon, Staggie, Stevens, Davids, Periasamy).
*   **Focus:** 
    *   **The 28s Consolidation:** Ralph Stanfield’s role in the '28s Alliance' and the absorption of 'Terrible Josters' territory.
    *   **The Americans Power Vacuum:** Succession after Igsaan 'Sanie American' Davids and the rise of Sadia Madatt in Rocklands.
    *   **KZN Drug Cartels:** The expansion of the 'Bloods Gang' (Periasamy) and the 'Tatu Gang' (Gounden) in Phoenix/Verulam.
    *   **State Collusion:** Allegations of SAPS collusion at Athlone and Sophiatown stations with the 'Varados' and 'Fast Guns'.
*   **Source Track:** `investigations/gangland-succession.md`

## Hubs for Deep Scaping
Use `.actors/news-scraper` and `.actors/deep-research-web-browser` on:
- **Companies:** Falcon Cat Trading, Lux South African Investments, Cor Kabeng Trading, Black AK Trading.
- **Individuals:** Julius Mkhwanazi (EMPD), Lesetja Senona (Hawks), Brown Mogotsi, Ralph Stanfield, Sadia Madatt, Horatio 'Voudie' Solomon, Anthony Gounden, Yusuf Bohardien, Andre Naude, Kalvin Periasamy, Kevin Periasamy, Igsaan 'Sanie American' Davids, Rashied Staggie, Ernie 'Lastig' Solomon, William 'Red' Stevens, Brian Wainstein, Mark Lifman, Jerome 'Donkie' Booysen, Nafiz Modack, Colin Booysen.
- **Locations:** Viscount Street (Mitchells Plain), Saulsville Hostel (Pretoria), Gateway Mall Parking (uMhlanga), BP Garage Sibaya, Kalksteenfontein, Salt River (Tennyson Street), Boksburg, Nyanga Terminus.
- **Entities:** Tatu Gang, Fancy Boys, Americans Gang, Nice Time Kids (NTK), Junior Mafias, Bloods Gang, Hard Livings, Terrible Josters, Dixie Boys, Skombizos, Pitfits, Varados, Fast Guns, CATA, CODETA.

## Intelligence Gaps (Missing Deep Intel)
A gap analysis reveals that hundreds of entities listed in our database currently lack detailed dossiers in our `corruption_knowledge_graph.json`. This means the frontend UI cannot provide operational narratives or deep connection matrices for these individuals. 

### Action Plan for Gaps:
1. **Batch Ingestion:** We need to run the `.actors/deep-research-web-browser` iteratively over the list of unmapped individuals.
2. **Priority Targets:** Filter the missing intel list by `risk_score` > 80 or `pep_tier` 1/2 to focus scraping resources on the highest-value targets first.
3. **Entity Verification:** Some names in the database appear to be noise (e.g., international sports figures or generic names captured during broad automated extraction). We must implement a "South African Corruption" relevance filter in the Apify actor to discard non-relevant entries.

---

## Phase 4 Execution Strategy: Beginning Investigations

With our UI/UX capable of displaying deep narrative intelligence and our Apify pipeline fully deployed, we must now transition from passive mapping to active investigation.

### Step 1: Automated Triage (Week 1)
- **Objective:** Systematically fill the intelligence gaps for all High-Risk (Score > 80) and Tier 1/2 PEPs.
- **Method:** 
  1. Export the list of priority missing targets generated by `scratch/find_missing_intel.ts`.
  2. Batch-feed these targets into the `.actors/deep-research-web-browser` via an automated script in `scratch/`.
  3. Validate the returned JSON against our established schema to ensure data hygiene.
  4. Auto-merge validated findings into `intelligence/corruption_knowledge_graph.json`.

### Step 2: Targeted Human-in-the-Loop Scraping (Week 2-3)
- **Objective:** Develop deep narratives on the five established PIRs (e.g., The Cocaine Trail, Witness H).
- **Method:**
  1. Trigger the `.actors/news-scraper` on a daily cron job to pull the latest reports on these specific keywords from News24, Daily Maverick, and TimesLIVE.
  2. Direct the `.actors/deep-research-web-browser` to perform deep network searches on specific front companies (e.g., Falcon Cat Trading, Black AK Trading) to identify true beneficial owners.
  3. Flag any new, high-confidence connections to the core 'Big Five' hubs for immediate UI update.

### Step 3: Synthesis & Exposure (Week 4)
- **Objective:** Finalize dossiers and publish findings.
- **Method:**
  1. Consolidate the intelligence gathered into the dedicated track files (`.research/investigations/*.md`).
  2. Run the `getDeepIntel` pipeline to push these detailed narratives to the live frontend dossier views.
  3. Publish a comprehensive "State of Corruption" report based on the updated Knowledge Graph.



### Update: 2026-05-16
- Automatically synced 443 new entities and 594 relationships from extractions.
- New entities identified: General Busisiwe Temba are facing criminal charges related to a R360 million SAPS, Burger said it was encouraging that the country was seeing a high number of investigations by the special investigating team and NPA, R200 million from the Hawks, Other officers suspended and being investigated in connection to the Medicare 24, Public Finance Management Act in relation to the Medicare 24.
