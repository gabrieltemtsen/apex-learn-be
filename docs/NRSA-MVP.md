# NRSA LXP — MVP Traceability Matrix (Release Gate)

This document maps the NRSA LXP MVP requirements to concrete backend + frontend implementation targets.

Scope: **single-tenant** (NRSA) for MVP. Multi-tenant tables may remain, but the system defaults all users/content into the NRSA tenant.

## Core Flow (Release Gate)
A user logs in → learns → is assessed → earns points → is ranked → qualifies for certification.

---

## Auth & Identity

### Requirements
- Google/email login ("SSO-like" per MVP)
- On login, user profile must contain: **IR Number**, name, department, role/grade, reporting line, location

### Backend
- `users` table: add NRSA profile fields
- Auth: support Google OAuth + existing email/password
- Single-tenant default assignment (`DEFAULT_TENANT_ID`)

### Frontend
- Login/Register: add **Continue with Google** button
- Callback handler route stores `{accessToken, refreshToken, user}` and redirects to dashboard

---

## Content Model

### Requirements
- Program → Course → Module → Lesson
- Lesson types: Text, Video, Audio
- Extra: Video library + Podcast library (points)

### Backend
- Add entities: `programs`, `modules` (+ ordering), update `lessons` to link to `moduleId`
- Add content assets table for video/audio URLs + downloadable flag

### Frontend
- Dashboard shows Programs → Courses → Modules
- Course player uses module sidebar

---

## Progress Tracking

### Requirements
- Track lesson/module/course/program completion
- Display progress bars
- Sync offline progress when online

### Backend
- Extend progress model to support module/course/program rollups

### Frontend
- PWA offline queue (IndexedDB) for progress events

---

## Assessments

### Requirements
- Module quizzes + course exams
- Attempts: max 3
- Best score counts
- Points awarded only on pass

### Backend
- Enforce attempt limits and best-score logic server-side
- Points awarding via points ledger

### Frontend
- Quiz runner respects attempt limits and shows best score

---

## Program Final Exam (Critical)

### Requirements
- Unlocked after completing full program
- 100 questions, 90 minutes
- 4 phases
- Progress bar
- Auto-submit on time expiry
- Integrity (MVP): random webcam image capture; detect tab switching/multiple windows (flagging)

### Backend
- Add `exam_sessions` (server authoritative timer)
- Add `proctoring_events` + `proctoring_snapshots`

### Frontend
- Exam runner UI with phases + timer
- Webcam snapshot capture + upload
- Tab focus/visibility change events submitted

---

## Gamification & Points

### Requirements
- Points for completion + assessments + optional engagement
- Real-time updates

### Backend
- Prefer `points_ledger` table; user.points becomes cached total
- Award rules: lesson/module/course/program completion + assessment outcomes

### Frontend
- Display points and recent point events
- Poll for updates (MVP "real-time")

---

## Leaderboards

### Requirements
- Views: global, department, group/team, direct reports (manager view), location (city/branch/outstation)
- Filterable, shows user's position

### Backend
- Ranking queries by dimension using user profile fields + optional team table

### Frontend
- Leaderboard UI with filters + user position

---

## Analytics & Admin Dashboard

### Requirements
- Track: time spent/user, peak usage hour/day, usage by department/age/location, engagement/completion, avg usage time
- Display: totals, averages, behavioral insights

### Backend
- Event ingestion: session start/stop, lesson start/complete, assessment start/submit
- Aggregations endpoints

### Frontend
- Admin analytics pages

---

## Admin Content Workflow

### Requirements
- Upload → Review → Approve → Publish
- Only super admins can publish
- Bulk allocation of users to programs/courses

### Backend
- Add content status fields + approval endpoints + RBAC

### Frontend
- Admin workflow UI

---

## Markdown Content Import

### Requirements
- Upload structured Markdown to create courses/modules/lessons

### Backend
- Markdown importer endpoint with validation + dry-run

### Frontend
- Admin import UI

---

## Offline (MVP recommendation)

- Implement PWA caching for metadata + text lessons
- Offline queue for progress + events
- Optional: audio downloads first; video download only if strictly required

---

## Documentation Deliverables
- Architecture doc
- Super Admin guide
- Admin guide
- Faculty guide
- Learner onboarding
- API docs (Swagger already exists)

---

## Domain / Nameserver
- Provide name servers + transfer hosting for `www.nrsacademy.gov.ng`
- White-label DNS plan (FE + BE + asset domains)
