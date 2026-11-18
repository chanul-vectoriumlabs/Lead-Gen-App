# UI Flow Documentation

AI Job Intelligence & Recruitment Automation Platform: admin dashboard (Next.js).

Source: project proposal, sections 5-8 and 14 (workflow, modules, dashboard). This document describes **what the user sees and does**, screen by screen. Backend/agent behaviour is mentioned only where it changes the UI.

---

## 1. Principles that shape the UI

1. **Human in control.** AI proposes; the admin decides. Three admin decision points (criteria review, job selection, document approval) are explicit, blocking UI steps. Nothing is submitted without approval.
2. **One administrator.** Everything (CVs, searches, approvals, settings, logs) is reachable from one dashboard without opening other tools.
3. **Long-running, asynchronous work.** Workflows can wait hours or days. Every screen must show run state (Running / Waiting for you / Failed / Done) and survive page reloads.
4. **Transparency.** Every AI output (extracted facts, match scores, drafts) shows its reasoning and source. Unknown CV data is shown as `Unknown`, never guessed.
5. **Compliance visible.** Contact source, lawful basis, and job source are shown on records; unsubscribe/suppression and deletion are supported.

---

## 2. Roles and access

| Role | Can do |
|---|---|
| **Admin** | Everything, including Settings, Users, Logs |
| **Recruiter** | Candidates, results, job selection, approvals |
| **Viewer** | Read-only on all data pages |
| **Candidate** | Own profile and own application drafts/approvals only |

Login via Supabase auth, optional 2FA. Navigation items are hidden for roles without access.

---

## 3. Global layout and navigation

```
+-----------------------------------------------------------+
| Logo        Search            [Alerts bell]   [User menu] |
+-----------+-----------------------------------------------+
| Overview  |                                               |
| Candidates|              Page content                     |
| Jobs      |                                               |
| Recruiter |                                               |
|  leads    |                                               |
| Applica-  |                                               |
|  tions    |                                               |
| Analytics |                                               |
| Settings  |                                               |
| Logs      |                                               |
+-----------+-----------------------------------------------+
```

Sidebar (9 pages from proposal section 8): **Overview, Candidates, Candidate results** (reached from a candidate, not a top-level item), **Jobs, Recruiter leads, Applications, Analytics, Settings, Logs**.

Global elements:
- **Alerts bell**: in-app mirror of Slack/email events (results ready, approval needed, failures).
- **"Needs your action" badge** on Candidates and Applications when a workflow is waiting on the admin.
- Deep links from Slack buttons land directly on the relevant screen (results page, approval page).

---

## 4. Core journey (one candidate)

Mirrors proposal Figure 3 (13 steps, 4 admin decisions). Amber = admin action.

```
Upload CV -> AI extracts profile -> [A] Confirm preferences & edit criteria
   -> Fresh search? -- no --> search job database
                   \- yes -> search platforms -> pre-filter -> save/de-dup
   -> Rank vs CV (top 5-10) -> Find recruiters (top jobs) -> Notify
   -> [B] Select jobs to pursue
   -> Generate resume + cover letter
   -> [C] Approve / Revise / Skip -> Submit or hand-off package -> Track
```

| Step | Screen | Who acts | UI state of candidate |
|---|---|---|---|
| 1 | Candidates > Upload CV | Admin | `Uploading` |
| 2 | (automatic) | AI | `Extracting` |
| 3 | Candidate > Criteria review | **Admin** | `Needs criteria review` |
| 4-9 | (automatic) | AI | `Searching` / `Ranking` / `Finding recruiters` |
| 10 | Slack/email alert, bell | System | `Results ready` |
| 11 | Candidate results | **Admin** | `Needs job selection` |
| 12 | (automatic) | AI | `Drafting` |
| 13 | Applications > Approval | **Admin / Candidate** | `Awaiting approval` |
| 14 | Applications | System | `Submitted` -> tracking |

---

## 5. Screen specifications

### 5.1 Login
- Email + password, optional 2FA code.
- Errors: invalid credentials, locked account. After login, redirect to Overview.

### 5.2 Overview
**Purpose:** at-a-glance health and pending work.

- **Stat tiles:** Candidates in progress, Jobs found, Recruiter leads, Applications awaiting selection, Applications awaiting approval.
- **Action queue** (primary element): list of items waiting on the admin, each with a one-click link (review criteria, select jobs, approve draft).
- **Workflow health:** counts of running / waiting / failed workflows; failed items link to Logs.
- **Recent activity** feed.

States: empty (no candidates yet: CTA "Upload your first CV"), loading skeletons, error banner if data fails.

### 5.3 Candidates (list)
- Table: Name, Target title, Location, Status (see state list in 4), Top jobs count, Last activity.
- Filters: status, needs-action, date. Search by name.
- Primary button: **Upload CV**.
- Row click opens Candidate detail.

### 5.4 Upload CV
- Drag-and-drop / file picker; **PDF or Word** only; size limit shown.
- After upload: progress, then automatic redirect to the candidate page in `Extracting` state.
- Errors: unsupported type, unreadable/scanned file, upload failure (retry).

### 5.5 Candidate detail: profile and criteria review (Decision A)
Two panels.

**Extracted profile (read from CV):** job titles, position level, skills, years of experience, education, certifications. Fields not found display `Unknown` with a "Confirm" input. Admin can edit any field.

**Search criteria and preferences (editable):**
- Keywords (tag input), target titles, position level
- Preferred locations, remote / onsite / hybrid
- Expected salary range
- Work authorization
- Note: preferences are not in a CV, so they start empty/proposed and must be confirmed with the candidate.

**Search mode (choice before running):**
- **Search job database** (default, fast, uses saved open jobs)
- **Fresh search on platforms** (also called Re-run search)

Actions: **Save criteria**, **Run search**. Run is disabled until required fields (titles or keywords, location) are confirmed.

### 5.6 Search in progress
Progress stepper on the candidate page: Searching sources > Pre-filtering > De-duplicating > Ranking > Finding recruiters. Each step shows counts (e.g. "24 found, 6 after filter"). Per-source status with failure indicators; a failed source does not block the rest (shows warning plus "Retry source").

### 5.7 Candidate results: top jobs and recruiters (Decision B)
**Purpose:** review ranked jobs and choose which to pursue.

- Header: candidate summary, "6 ranked from 24 found, 9 recruiter contacts linked", **Re-run search** button.
- **Job cards**, sorted by match score:
  - Title, company, location, remote/onsite, salary (or `Salary not listed` flag), posted date, source, application link
  - **Score (0-100) and reason** (e.g. "strong Python and AWS match; missing 5 yrs management")
  - **Recruiter contacts** list: name, role, validated email status, source and date collected
- Checkbox per card; bulk bar: **Pursue selected** / **Keep in database**.
- Unselected jobs remain in the Jobs database and can be selected later.
- Top-job count (5-10) is configured in Settings.

### 5.8 Jobs (database)
- Table of all jobs; filters: keyword, location, company, experience, salary, source, status (open/closed), date first seen.
- **Job detail drawer/page:** full description, captured fields, linked candidates and their scores, linked recruiters, **change history** (salary edits, closed, reposted), source and first-seen date.
- Closed jobs are visibly marked.

### 5.9 Recruiter leads
- Table: Contact, Role, Company, Industry, Location, linked jobs, email validation status, source, date collected.
- Filters: industry, location, role, hiring activity.
- Contact detail: provenance and lawful basis, suppression/unsubscribe flag, **Delete contact** (deletion-request support), CRM sync status.
- Company profile view: industry, size, location, website, open jobs, contacts.
- Export: Excel, CSV, PDF.

### 5.10 Applications
**List view**: tabs by status: Selected, Drafted, Awaiting approval, Approved, Submitted, Interview, Offer, Rejected. Columns: candidate, job, company, status, last update, follow-up date.

**Drafting:** shown as `Drafting` with spinner until documents exist.

**Approval view (Decision C):**
- Side-by-side: generated **resume** and **cover letter** vs the job description; highlights show which CV facts were used (only verified facts).
- Edit in place. **Editing after approval invalidates it and requires re-approval** (banner explains).
- Actions: **Approve**, **Request revision** (with comment; returns to drafting), **Skip / drop job**.
- Approval is tied to the exact document version (version number shown).
- Approver can be admin and/or candidate (configurable). Pending approver shown.

**Submission:**
- If a permitted integration exists: status moves to `Submitted` automatically after approval.
- Otherwise: **Ready package** screen with downloadable documents and the official application link, plus **Mark as submitted** button.
- Some applications need employer-site steps (logins, screening questions, assessments); these are noted on the package screen.
- **Duplicate block:** applying twice to the same job is prevented; the action is disabled with an explanation.

**Tracking:** status timeline, submission history, follow-up reminders, manual status updates (Interview, Offer, Rejected).

### 5.11 Analytics
Daily / weekly / monthly toggle. Charts: jobs by category, top hiring companies, application outcomes, jobs found over time. **Reports:** Generate on demand, schedule (daily/weekly/monthly), export Excel/CSV/PDF, delivery to Slack/email.

### 5.12 Settings
Tabs:
- **Sources & platforms:** enable/disable approved sources, employer registry (target employers and their ATS boards), sync schedule, source status (needs licence/confirmation flagged).
- **Search & ranking:** number of top jobs (5-10), refresh schedule, default search mode.
- **Notifications:** Slack channels (#new-jobs, #recruiter-leads, #approvals, #system-alerts, per-candidate channels), email recipients, digest frequency.
- **Approvals:** who approves (admin, candidate, or both).
- **Users & roles:** invite, change role, disable, 2FA status.
- **Compliance:** retention limits, suppression list, sender identity.
- **Integrations:** CRM (HubSpot, Zoho, Pipedrive), email provider.

Workflow step order is **not** editable in the UI (changed by developers in code).

### 5.13 Logs
- Table of every agent run: time, candidate, agent, step, result, duration, retries, error.
- Filters: agent, status, candidate, date.
- Detail: input/output summary, error text, AI reasoning for the decision.
- **Re-run** button on a failed step (one click). Link out to Temporal Web UI.

---

## 6. Slack and email touchpoints

| Event | Channel | Action buttons |
|---|---|---|
| Top jobs ready | #new-jobs | **Review and select jobs** (deep link) |
| New recruiter leads | #recruiter-leads | Open leads |
| Approval needed | #approvals | **Approve / Reject** inline, **Open draft** |
| Status change | #approvals / candidate channel | Open application |
| Failure | #system-alerts | Open log entry (step and error shown) |
| Daily/weekly digest | Email + Slack | Open report |

Slack approve/reject resolves the same pending approval as the dashboard; dashboard reflects the result immediately.

---

## 7. State handling (all screens)

- **Loading:** skeletons, not blank pages.
- **Empty:** explanatory text plus next action.
- **Waiting on human:** amber badge "Waiting for you" with link to the decision screen.
- **Failed step:** red badge with error summary, "Retry" and "View log". Other steps continue.
- **Partial results:** show what exists; label missing sources.
- **Stale data:** job rows show last-synced time; closed jobs flagged.
- **Permissions:** unauthorized actions hidden or disabled with tooltip.
- **Real-time:** status updates pushed (polling or Supabase realtime) so the stepper and action queue update without reload.

---

## 8. Suggested route map (Next.js App Router)

```
/login
/                         Overview
/candidates               List
/candidates/new           Upload CV
/candidates/[id]          Profile and criteria
/candidates/[id]/results  Top jobs and recruiters
/jobs                     Database
/jobs/[id]                Detail and history
/leads                    Recruiter leads
/leads/[id]               Contact detail
/applications             List
/applications/[id]        Approval, package, tracking
/analytics
/settings/[tab]
/logs
/logs/[runId]
```

---

## 9. Open questions to confirm with the client

1. Who approves documents: admin, candidate, or both? Does the Candidate role get a login in phase 1?
2. Which job sources and contact providers are licensed (affects Settings > Sources and which badges appear)?
3. Salary and currency handling for multi-region candidates.
4. Which CRM, and whether leads are shown in-app only or synced.
5. Scope of the 14-day pilot UI: likely only Login, Candidates (upload, criteria review), Candidate results, and Slack alert. Other pages follow in later phases.

## 10. Mapping to delivery phases

| Phase | UI delivered |
|---|---|
| 1 Pilot | Login, upload CV, criteria review, results page, Slack alert |
| 2 Foundation | Jobs database page, sources settings, search modes, job history |
| 3 Matching and leads | Scores and reasons, Recruiter leads, CRM connection |
| 4 Applications | Selection, approval queue, Applications tracking |
| 5 Dashboard and launch | Overview, Analytics, reports, Logs, Users and roles, polish |
