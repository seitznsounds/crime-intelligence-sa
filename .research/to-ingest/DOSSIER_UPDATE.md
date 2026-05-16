# Investigation Log: Dossier Visual Enrichment (2026)

## Purpose
Tracking the progress of image scraping, storage in Supabase `entity_images`, and profile linkage for high-risk targets.

## Status: INITIALIZING

## Cumulative Progress
- **Total Entities Targeted:** 10
- **Images Found:** 5
- **Images Uploaded to Supabase:** 2 (Test verification)
- **DB Profiles Linked:** 2

---

## Log Entry: 2026-05-16
- [x] Storage bucket `entity_images` provisioned in Supabase.
- [x] Initialized `DOSSIER_UPDATE.md` for tracking.
- [x] Identification of top 10 priority targets for initial visual enrichment.
- [x] Deployment of `scratch/update_entity_images.ts` for automated processing.
- [x] Verified forensic links for **Falcon Cat Trading** and **Black AK Trading**.

---

## Priority Target List (Initial)
| Entity Name | Status | Image Source | Storage Path | Link Status |
| :--- | :--- | :--- | :--- | :--- |
| **Vusimuzi 'Cat' Matlala** | Found | Sunday World | people/17648316-3943-4468-9c25-c84bcd17d32a.jpg | Linked (Test) |
| **Simon Rudland** | Found | Al Jazeera | people/f725a5f8-0c90-43e6-8cd6-b9b26ddf7c98.jpg | Pending |
| **Kamlesh Pattni** | Found | Al Jazeera | people/d175d9d3-2b2f-4e27-8f03-ab07aa508b52.jpg | Linked (Test) |
| **Ralph Stanfield** | Found | Daily Maverick | people/c912f225-d3fd-475b-8fff-21d96a10385c.jpg | Pending |
| **Anthony Gounden** | Found | The Post | people/ae422a39-a23b-4d24-9cfa-f607d024f4bc.jpg | Pending |
| **Sadia Madatt** | Pending | - | - | - |
| **Horatio 'Voudie' Solomon** | Pending | - | - | - |
| **Rashied Staggie** | Found | News24 | - | - |
| **Igsaan 'Sanie American' Davids** | Found | Daily Voice | - | - |
| **Mark Lifman** | Found | Daily Maverick | - | - |

---

## Notes & Forensic Indicators
- **Naming Convention:** Images should be stored as `[type]/[entity-id].webp` (e.g., `people/ae422a39-a23b-4d24-9cfa-f607d024f4bc.webp`).
- **Format:** Prefer `.webp` or `.jpg` for performance.
- **Verification:** Images must be manually spot-checked or verified via confidence scores from scraping metadata.
