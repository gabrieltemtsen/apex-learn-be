# ApexLearn™ — Backend API

> AI-Native Multi-Tenant Learning Management System  
> Built with **NestJS · PostgreSQL · TypeORM · Gemini AI · Paystack**

---

## 🏗️ Architecture

```
apex-learn-be/
├── src/
│   ├── entities/          # TypeORM database entities (13 tables)
│   ├── auth/              # JWT auth, refresh tokens, RBAC guards
│   ├── users/             # User management
│   ├── tenants/           # Multi-tenant management
│   ├── courses/           # Course CRUD + publishing
│   ├── lessons/           # Lesson management
│   ├── enrollments/       # Student enrollment
│   ├── progress/          # Lesson progress tracking
│   ├── assessments/       # Quizzes + AI generation
│   ├── certificates/      # QR-verified certificates
│   ├── subscriptions/     # Paystack billing
│   ├── leaderboard/       # Points + rankings
│   ├── ai/                # Gemini AI features
│   └── analytics/         # Reporting & insights
├── Dockerfile
└── railway.json
```

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `tenants` | Organizations using the platform (multi-tenant) |
| `users` | All users across all tenants |
| `courses` | Course catalog per tenant |
| `lessons` | Individual lessons within courses |
| `enrollments` | Student ↔ course relationships |
| `progress` | Per-lesson completion tracking |
| `assessments` | Quizzes and exams |
| `assessment_questions` | Individual quiz questions |
| `assessment_attempts` | Student quiz submissions + scores |
| `certificates` | Issued certificates with QR data |
| `subscriptions` | Paystack subscription records |
| `leaderboard_entries` | Points + rankings per tenant |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or Supabase)

### Local Setup

```bash
# Clone
git clone https://github.com/gabrieltemtsen/apex-learn-be.git
cd apex-learn-be

# Install
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start in dev mode (auto-creates tables)
npm run start:dev
```

### Environment Variables

```env
# Database (use Supabase Transaction Pooler URL — port 6543)
DATABASE_URL=postgresql://postgres.xxxx:[password]@aws-0-region.pooler.supabase.com:6543/postgres

# JWT (generate with: openssl rand -hex 64)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-different-from-above

# AI Features
GEMINI_API_KEY=your-gemini-api-key

# Payments (Paystack)
PAYSTACK_SECRET_KEY=sk_live_xxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxx

# CORS
FRONTEND_URL=https://your-apex-learn-fe.vercel.app

# Server
PORT=3001
NODE_ENV=production
```

---

## 📡 API Reference

**Base URL:** `https://your-backend.railway.app`  
**Swagger Docs:** `https://your-backend.railway.app/api/docs`

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Create account | Public |
| `POST` | `/auth/login` | Login → returns JWT | Public |
| `POST` | `/auth/refresh` | Refresh access token | Refresh token |
| `POST` | `/auth/logout` | Invalidate refresh token | Bearer |
| `GET`  | `/auth/me` | Get current user | Bearer |

### Courses

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET`  | `/courses` | List courses (with filters) | Public |
| `GET`  | `/courses/:id` | Get course detail | Public |
| `POST` | `/courses` | Create course | Admin/Facilitator |
| `PATCH`| `/courses/:id` | Update course | Admin/Facilitator |
| `POST` | `/courses/:id/publish` | Publish course | Admin/Facilitator |
| `DELETE`| `/courses/:id` | Delete course | Admin |

### Enrollments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/enrollments` | Enroll in course | Bearer |
| `GET`  | `/enrollments/my` | My enrolled courses | Bearer |
| `DELETE`| `/enrollments/:id` | Drop course | Bearer |

### Progress

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/progress` | Mark lesson complete | Bearer |
| `GET`  | `/progress/course/:courseId` | Course progress % | Bearer |

### Assessments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET`  | `/assessments/course/:courseId` | Course assessments | Bearer |
| `POST` | `/assessments/generate-ai` | AI-generate quiz | Admin/Facilitator |
| `POST` | `/assessments/:id/attempt` | Submit quiz attempt | Bearer |

### AI Features

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/ai/generate-quiz` | `{ topic, numQuestions, difficulty }` | Generate quiz with Gemini |
| `POST` | `/ai/generate-course-outline` | `{ topic, targetAudience, durationHours }` | Generate course structure |
| `POST` | `/ai/adaptive-suggestions` | `{ userId, completedTopics, failedTopics }` | Personalized learning path |

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| `super_admin` | Full platform access, manage tenants |
| `tenant_admin` | Full access within their tenant |
| `admin` | Manage courses, users, content |
| `facilitator` | Create/manage their own courses |
| `learner` | Enroll, learn, take assessments |

---

## 🏢 Multi-Tenancy

Each tenant (organization) has:
- Isolated data (all queries scoped by `tenantId`)
- Custom branding (logo, primary color, background)
- Custom domain support (white-label plan)
- Independent subscription + billing

**Subdomain pattern:** `{tenant-slug}.apexlearn.ng`

---

## 🚢 Deployment

### Railway (Recommended)

1. Push to GitHub
2. New Railway project → Deploy from GitHub → `apex-learn-be`
3. Add PostgreSQL service OR use Supabase `DATABASE_URL`
4. Set all env vars in Railway Variables tab
5. Railway builds Docker image automatically

> ⚠️ **Supabase users:** Use the **Transaction Pooler URL** (port **6543**), NOT the direct connection (port 5432). Direct connection uses IPv6 which Railway doesn't support.

### Health Check
```
GET /api/docs → Swagger UI (confirms server is running)
```

---

## ✅ What Works Now

- [x] Full database schema (13 entities, auto-created via TypeORM sync)
- [x] Multi-tenant architecture
- [x] JWT authentication (access + refresh tokens)
- [x] User registration + login
- [x] Course CRUD with filtering
- [x] Lesson management
- [x] Enrollment system
- [x] Progress tracking with % calculation
- [x] Assessment module structure
- [x] Certificate generation structure
- [x] Leaderboard structure
- [x] Swagger API docs at `/api/docs`
- [x] Deployed on Railway + Supabase

## 🔧 Coming Next

- [ ] File uploads (course thumbnails, lesson videos via S3/Cloudinary)
- [ ] Gemini AI quiz generation (needs `GEMINI_API_KEY`)
- [ ] Paystack subscription webhooks
- [ ] Email verification on register
- [ ] Real-time notifications (WebSockets)
- [ ] Analytics aggregation queries

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 10 |
| Language | TypeScript |
| Database | PostgreSQL 15 |
| ORM | TypeORM |
| Auth | JWT + Passport.js |
| Password | bcryptjs |
| Validation | class-validator |
| Docs | Swagger/OpenAPI |
| AI | Google Gemini Flash |
| Payments | Paystack |
| Deployment | Railway (Docker) |
