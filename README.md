# 🏅 HPCL Sports Meet CRM — 19th All India Annual Sports Meet 2024-25

> Official on-ground Track & Field CRM for **Hindustan Petroleum Corporation Limited (HPCL)** digitising the physical paper registers: **Official Record Sheets (Heats)**, **Results Sheets**, and the **Cash Card Control Sheet (Format 3)**.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Next.js 16 (App Router, Turbopack, TypeScript), Tailwind CSS v4, Lucide React, Recharts, React Hook Form, Zod, next-themes.
- **Backend & Database**: **Supabase** (PostgreSQL 15+), Row Level Security (RLS), Supabase Auth, Storage Buckets, Realtime WebSocket Broadcasts.
- **Data Access Layer**: Clean, isomorphic typed repository (`/lib/data/*.ts`) wired directly to Supabase with automated fallback to mock data for offline resiliency.

---

## 🎨 Brand & Design System (Hindustan Petroleum)
Taken directly from the iconic Hindustan Petroleum emblem:
- **`--hp-navy`** (`#1F2E8C`): Primary headers, active sidebars, buttons, and badges.
- **`--hp-navy-dark`** (`#141F63`): Split-screen login panel, top banner backgrounds, sidebar.
- **`--hp-red`** (`#E4202B`): Accent badges, active highlights, alerts, and primary CTAs.
- **`--hp-white`** (`#FFFFFF`): Surface cards and clean tables.
- **`--hp-mist`** (`#F3F5FB`): Clean neutral page background.
- **`--hp-ink`** (`#0F1535`): High-contrast typography.
- **Podium Accents**:
  - 🥇 **Winner (Pos I)**: Gold (`#D4AF37` / `#F59E0B`)
  - 🥈 **Runner-up (Pos II)**: Silver (`#A8A9AD` / `#94A3B8`)
  - 🥉 **1st Runner-up (Pos III)**: Bronze (`#CD7F32`)
- **Typography & Motifs**:
  - Headings: Poppins / bold typography with heavy weights.
  - Body: Inter with `tabular-nums` for all race timings (`sec`) and throw distances (`m`).
  - Red Devanagari Banner: **हिन्दुस्तान पेट्रोलियम**
  - Curved Double-Swoosh SVG divider (`<SwooshDivider />`).
  - SVG Logo Recreation (`<HPLogo />`) with automatic drop-in fallback to `/public/hp-logo.png`.
  - Light mode default + deep navy Dark Mode support via `next-themes`.

---

## 🗄️ Supabase Backend (Prompt 2 Implementation)

### 1. Database Schema (`supabase/migrations/0001_schema.sql`)

```sql
-- Core Enums
create type gender_t as enum ('male', 'female', 'girl', 'boy');
create type position_t as enum ('winner', 'runner_up', 'first_runner_up');
create type metric_t as enum ('time_sec', 'distance_m');
create type role_t as enum ('admin', 'official', 'viewer');

-- Tables
profiles        -- Extends auth.users with full_name and role
units           -- Refineries, Zones, and Corporate Offices (MR, VR, SCZ, NWZ, EZ, PH, MHQ)
athletes        -- Registered athletes with BIB numbers, gender, unit affiliation
events          -- 16 official events with categories, schedule, metric, meet records
heats           -- Heat heats per event
heat_entries    -- Individual lane/heat performances, rank remarks, verification flags
results         -- Top 3 podium finishers per event
prize_scale     -- Format 3 prize amounts: Winner ₹5,000, Runner-up ₹4,000, 1st Runner-up ₹3,000
cash_cards      -- Format 3 Control Sheet rows (1-36) with signature paths and amounts

-- Views
medal_table     -- Aggregates gold, silver, bronze, total medals, and points (Gold*5 + Silver*3 + Bronze*1)
```

### 2. Automated Cash Card Generation (`publish_results(p_event_no)`)
When podium results are published for any of the cash-card events (events 1–12), the PostgreSQL stored procedure `publish_results(p_event_no)` executes automatically:
- Maps position 1 to `winner` (₹5,000)
- Maps position 2 to `runner_up` (₹4,000)
- Maps position 3 to `first_runner_up` (₹3,000)
- Calculates serial number: `(event_no - 1) * 3 + position`
- Upserts the 3 Format 3 rows in `cash_cards` with the athlete reference and prize money.

### 3. Role-Based Access Control & RLS (`0002_rls.sql`)
- **Row Level Security (RLS)** is enabled on all tables.
- **Roles**:
  - `admin`: Full management rights across all entities and users.
  - `official`: Can record heats, publish results, and sign/unsign Format 3 cash cards.
  - `viewer`: Read-only access to all public meet information.
- **Auto-Role Assignment Trigger** (`handle_new_user`):
  - Emails matching `%admin%` (e.g. `admin@hpcl.in`) automatically receive `admin` role.
  - Emails matching `%official%` or `%marshal%` (e.g. `official@hpcl.in`) receive `official` role.
  - All other users receive `viewer` role.

### 4. Storage Bucket for Digital Signatures
- Private bucket: `signatures`
- Signatures captured on the canvas signature pad or uploaded as scans are written to `signatures/card_{serialNo}_{timestamp}.png`.
- The frontend securely generates time-limited Supabase Signed URLs for viewing and printing.

### 5. Live Realtime Subscriptions
- The database is configured with `supabase_realtime` publication for:
  - `results`
  - `cash_cards`
  - `heat_entries`
- `<RealtimeListener />` in the app shell listens over WebSockets and automatically refreshes server components via `router.refresh()` whenever a result is entered, a card signed, or a heat entry verified on another device.
- Topbar includes a real-time status pill indicator (**Live Sync Active**).

---

## 📱 Application Routes & Features

| Route | Name | Role Access | Key Features |
|---|---|---|---|
| `/login` | **Organiser Login** | Public | Supabase Auth sign-in / sign-up, instant one-click demo credentials for Admin, Official, and Viewer |
| `/dashboard` | **Meet Dashboard** | All | KPI stats, Recharts medal standings, schedule, recent podium finishes, Realtime WebSocket sync |
| `/events` | **Events Register** | All | Filterable table by meet day, gender, category, track/field type, and status |
| `/events/[eventNo]` | **Event Detail & Tabs** | All | Dynamic route with 3 tabs: **Heats (Official Records)**, **Final Results (Podium)**, and **Cash Card (Format 3)** |
| `/athletes` | **Athletes Directory** | All | Searchable by BIB # (e.g. `424`), athlete name, or unit delegation |
| `/athletes/[bib]` | **Athlete Profile** | All | BIB badge avatar, affiliated unit, all registered heats, podium finishes, and total prize money |
| `/units` | **Units & Zones** | All | Delegation standings table, gold/silver/bronze tally, total points from `medal_table` view |
| `/heats` | **Official Record Sheets** | All / Official | Digital heats grid with quick numeric entry, auto-sort by performance, auto-ranking |
| `/results` | **Podium & Results** | All / Official | Podium cards, complete standings, and "Record New Result" form wired to `publish_results` |
| `/cash-cards` | **Format 3 Control Sheet** | All / Official | 36 prize rows (events 01–12), signature capture modal (canvas drawing pad), signed URL storage, printable layout, CSV export |
| `/data-quality` | **Data Quality & Audit** | Official / Admin | Reconciles ambiguous handwriting, missing BIBs, and approximate times flagged with `needs_verification = true` |
| `/reports` | **Audit & Reports** | All | Financial disbursement summary, delegation medal distribution chart, printable layout, CSV export |

---

## 🚀 Setup & Execution Guide

### 1. Environment Variables
Copy `.env.example` to `.env.local` and configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hwyzyzehewwwyvfbposd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 2. Database Migrations
Migrations are stored in `/supabase/migrations/`:
1. `0001_schema.sql` — Extensions, enums, tables, views, triggers, and `publish_results` procedure.
2. `0002_rls.sql` — RLS policies, role helper functions, auto-profile trigger, and `signatures` storage bucket.
3. `0003_seed.sql` — Seed data from the physical meet registers (7 units, 16 events, 64 athletes, heats, results, cash cards).

To apply migrations to your remote Supabase project:
```bash
node scripts/apply-migrations.js
```

### 3. Generate TypeScript Types
TypeScript types are kept in sync in `types/database.ts`:
```bash
npx supabase gen types typescript --project-id hwyzyzehewwwyvfbposd > types/database.ts
```

### 4. Development & Build
```bash
# Run local development server
npm run dev

# Run TypeScript typecheck
npx tsc --noEmit

# Run production build
npm run build
npm start
```

---

## 👥 Demo Access Accounts

You can sign in directly on `/login` using the **Instant Ground Access** buttons or standard credentials:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@hpcl.in` | `Password@123` | Full access to all tables, units, athletes, events, and reports |
| **Track Official** | `official@hpcl.in` | `Password@123` | Can record heats, enter results, verify data quality, and sign cash cards |
| **Viewer** | `viewer@hpcl.in` | `Password@123` | Read-only view of schedule, results, medal tally, and cash card status |

---

## 📄 License
Internal use only · **Hindustan Petroleum Corporation Limited (HPCL)** · 19th All India Annual Sports Meet 2024-25.
