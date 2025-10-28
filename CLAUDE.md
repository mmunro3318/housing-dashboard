# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Note:** **Always** check your available context each time I prompt you, and decide if we have enough room to perform the current actions!

## Project Overview

This is a halfway housing management dashboard system designed to replace chaotic Excel-based workflows with a unified, secure dashboard. The system tracks residents, houses, beds, rent/voucher payments, waitlists, and contacts.

**Tech Stack:**

- Frontend: React with RTK-Query/Redux
- Backend: Node.js (Express)
- Database: Supabase (Postgres)
- Hosting: Vercel (frontend), Supabase cloud (database)

**Note** This project uses pure JavaScript -- **_no_** TypeScript!

## Project Context

**Dual Purpose:**

This project serves two goals:

1. **Real-world client project** - Solving an actual business problem for a halfway housing manager
2. **Academic project** - Used for ITAD-300 Software Engineering coursework at Edmonds College

As such, development must balance practical delivery with educational value.

**Repository Hosting:**

This repository is maintained on **both GitLab and GitHub**:

- **GitLab** (`origin`): Primary for CI/CD, Issues/Epics, and class requirements
- **GitHub** (`github`): Portfolio visibility and industry-standard showcase

**IMPORTANT**: Always push commits to both remotes:

```bash
git push origin main && git push github main
```

## Working with This Repository

**Educational Approach:**

When working with the developer (Michael), always:

1. **Explain everything** - Assume limited experience with newer tools/concepts
2. **Outline before implementing** - Present plans and get approval before coding
3. **Walk through your thinking** - Explain why you're choosing specific approaches
4. **Stop and discuss** - For any new dependencies, architectural decisions, or deviations

**Developer Experience Level:**

- **Strong**: MERN stack (MongoDB, Express, React, Node.js)
- **Some exposure**: Supabase, Vercel deployment
- **Limited**: Jest/Vitest testing
- **No experience**: CI/CD pipelines

Adjust explanations accordingly. Don't assume knowledge of advanced patterns or tools.

## Tech Stack Constraints

**CRITICAL**: Never deviate from the established tech stack without explicit discussion.

**Approved Stack:**

- Frontend: React + Vite + Tailwind CSS + RTK Query/Redux
- Backend: Node.js + Express
- Database: Supabase (PostgreSQL)
- Hosting: Vercel (frontend) + Supabase Cloud (database)
- Language: Pure JavaScript (NO TypeScript)

**Before Adding New Dependencies:**

1. **STOP** - Don't install anything immediately
2. **Explain the need** - What problem requires this dependency?
3. **Consider alternatives** - Can we solve this with existing tools?
4. **Evaluate simplicity** - Is there a simpler solution?
5. **Prioritize value** - Does this directly serve client/user needs?

**Guiding Principle**: Keep the stack as simple as possible. Focus on delivering client value, not showcasing technical complexity.

## Skills and Agents

This repository may use Anthropic's **Skills** feature for specialized tasks. See SKILLS.md documentation for implementation details (to be added).

Custom subagents may be configured in `.claude/agents/` for domain-specific tasks like schema design, API development, or testing.

## Current Project State

This project is in **pre-development phase**. The repository contains:

- Project documentation (README.md, project-roadmap.md)
- Source data: Excel file (`2024 Current Client Housing Participants.xlsx`)
- No code has been implemented yet

The development plan follows 5 milestones (see project-roadmap.md):

1. Data Preparation & Migration (ETL from Excel)
2. Backend Setup (Node/Express + Supabase)
3. Frontend MVP (React + basic views)
4. Admin Portal & Intake Form
5. QA, Docs, and Roadmap

## Database Schema

The system is built around three core tables:

**houses**: Stores halfway house locations

- `house_id` (PK): VARCHAR(64), unique identifier
- `address`: VARCHAR(255), full street address
- `total_beds`: INT, total beds in house
- `notes`: TEXT, optional manager notes

**beds**: Tracks individual bed availability

- `bed_id` (PK): VARCHAR(64)
- `house_id` (FK): References houses
- `room_number`: VARCHAR(32)
- `status`: VARCHAR(16), one of: 'Available', 'Occupied', 'Pending', 'Hold'
- `tenant_id` (FK): References current occupant (nullable)
- `notes`: TEXT

**tenants**: Stores resident information

- `tenant_id` (PK): VARCHAR(64)
- `full_name`: VARCHAR(255)
- `dob`, `phone`, `entry_date`, `exit_date`: DATE/VARCHAR fields
- `doc_number`: VARCHAR(64), DOC/agency reference
- `payment_type`: VARCHAR(32), e.g., 'Private', 'Voucher'
- `voucher_start`, `voucher_end`: DATE
- `rent_due`, `rent_paid`: NUMERIC(8,2)
- `notes`: TEXT
- `bed_id` (FK): Current bed assignment

**Relationships:**

- Houses contain multiple Beds (one-to-many)
- Beds reference their House and current Tenant (many-to-one)
- Tenants reference their current Bed (many-to-one)

## ETL Process

When implementing data migration from the Excel file:

1. **Extract**: Parse Excel sheets and map to three entities (Tenants, Houses, Beds)
2. **Transform**:
   - Standardize field names (use snake_case: `house_id`, `tenant_id`, `bed_id`)
   - Normalize date formats
   - Convert text to standard enums for status fields
   - Generate unique IDs for houses, beds, and tenants
3. **Load**: Insert into Supabase Postgres tables in order: houses → beds → tenants

Store unmapped/legacy fields for manual review rather than discarding data.

## Architecture Considerations

**Authentication**: System requires role-based access (manager vs guest/resident). Managers have full CRUD access, while guests have limited intake form access.

**Future Expansion**: The schema is designed to be extended with:

- Rent/ledger table for payment transaction history
- Resources/contacts table for program leads and counselors
- Advanced reporting, notifications, and audit trails

## Key Features

- CRUD operations for residents, houses, beds
- Central manager dashboard with filtering (open beds, search tenants)
- Resident intake form (restricted access)
- Secure role-based authentication
- Data backup/export capabilities (Google Sheets, CSV)

## Development Workflow

Since no code exists yet, when beginning implementation:

1. Start with Milestone 1: Create ETL script to migrate Excel → Supabase
2. Set up Supabase project and create the three tables with proper constraints
3. Initialize Node/Express backend with API endpoints
4. Create React frontend with basic authentication and views
5. Deploy frontend to Vercel for testing

## Contact

Project Lead: Michael Munro (m.munro3318@gmail.com)
