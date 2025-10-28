# Session 4 -- Vercel and Supabase Setup

## User

Okay -- let's get Vercel setup first. Walk me through the process. Perform any web searches you need to in order to have the most up-to-date information. _Also_ you could supply me with the prompt(s) to feed into my Perplexity Browser Agent to help/perform setup.

## Claude

[starting writing files by hand for basic Vite + React app]

## User

Hold up -- rather than creating files from scratch, perhaps we initialize our repo structure now. I'm thinking we use an `./app/frontend` and `./app/backend` structure unless you object.

## Claude

● Perfect! Let me explain my recommendation and reasoning:

Recommended Structure: Vercel-Native Monorepo

Given that we're deploying to Vercel and you want to minimize files, I recommend a Vercel-native structure with a single package.json:

```shell
housing-dashboard/
├── src/ # Frontend React code
│ ├── components/
│ ├── pages/
│ ├── App.jsx
│ └── main.jsx
├── api/ # Backend API routes (Vercel Serverless Functions)
│ ├── houses.js
│ ├── tenants.js
│ └── beds.js
├── public/ # Static assets
│ └── images/
├── docs/ # Documentation (existing)
├── package.json # Single package.json for both frontend and backend
├── vite.config.js # Vite config
├── vercel.json # Vercel routing config
└── index.html # Entry point
```

Why This Structure?

1. Minimizes Files ✅

- Single package.json (not 2-3 separate ones)
- Single build configuration
- No monorepo workspace complexity

2. Vercel-Native Pattern ✅

- Vercel automatically detects /api folder as serverless functions
- Frontend in /src builds with Vite as usual
- One deployment, one project in Vercel dashboard

3. Perfect for Your Project Size ✅

- Simple CRUD API (houses, beds, tenants, forms)
- Supabase handles database (so backend is just API routes)
- No need for complex Express server with middleware

4. Easy Development ✅

- Run npm run dev → Vite dev server (frontend) on port 3000
- Vercel automatically proxies /api requests in dev mode
- No need to run separate frontend/backend servers

How Backend Works with Serverless Functions

Each file in /api becomes an endpoint:

```js
// api/tenants.js
export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch tenants from Supabase
    const { data } = await supabase.from("tenants").select("*");
    res.status(200).json(data);
  }

  if (req.method === "POST") {
    // Create new tenant
    const { data } = await supabase.from("tenants").insert(req.body);
    res.status(201).json(data);
  }
}
```

This becomes: https://housing-dashboard.vercel.app/api/tenants

Alternative (If You Prefer Separation)

If you'd rather have clear frontend/backend separation, I can do:

/frontend (separate package.json)
/backend (separate package.json)

But this adds complexity with:

- 2 package.json files
- 2 separate deployments OR monorepo workspace setup
- CORS configuration between frontend and backend

My recommendation: Start with the single-repo Vercel-native structure. If we outgrow it (need long-running processes, complex backend logic), we can refactor later.

Should I proceed with this structure? If yes, I'll:

1. Clean up the root files I just created
2. Initialize proper /src and /api folders
3. Create a minimal "Coming Soon" page
4. Walk you through Vercel deployment

Todos
☐ Initialize Vite + React frontend application
☐ Create Vercel account and link GitHub
☐ Configure Vercel project settings
☐ Add environment variables to Vercel (placeholders for now)
☐ Deploy initial version to production
☐ Enable preview deployments for all branches
☐ Test production URL and share with client

## User

Proceed with your serverless Vercel structure.

## Claude

● Excellent! ✅ Committed and pushed to both GitLab and GitHub

---

Now Let's Set Up Vercel

I'll guide you through this step-by-step. Since this requires browser interaction, I'll give you clear instructions and a Perplexity prompt you can use.

Step 1: Create Vercel Account

Open your browser and navigate to: https://vercel.com

Follow these steps:

1. Click "Sign Up"
2. Choose "Continue with GitHub" (easiest integration)
3. Authorize Vercel to access your GitHub account
4. Select "Hobby" plan (free tier - perfect for this project)

---

Step 2: Import Your Project

Once you're in the Vercel dashboard:

1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find your repository: housing-dashboard

   - If you don't see it, click "Configure GitHub App" and grant Vercel access to the repository

4. Click "Import"

---

Step 3: Configure Project Settings ⚠️ STOP HERE - DON'T DEPLOY YET!

Vercel should auto-detect your settings, but verify:

Framework Preset: Vite ✅ (should auto-detect)

Build & Output Settings:

- Build Command: npm run build ✅
- Output Directory: dist ✅
- Install Command: npm install ✅

Root Directory: . (leave as default) ✅

❌ DO NOT CLICK "DEPLOY" YET - We need to add environment variables first (even if just placeholders)

---

Step 4: Add Environment Variables (Placeholders)

Before deploying, let's add placeholder environment variables so the structure is ready:

1. In Vercel project settings, go to "Settings" → "Environment Variables"
2. Add these placeholder variables (we'll update them when we set up Supabase):

Add each of these:

```md
| Name                   | Value                                            | Environment                            |
| ---------------------- | ------------------------------------------------ | -------------------------------------- |
| VITE_SUPABASE_URL      | https://placeholder.supabase.co                  | All (Production, Preview, Development) |
| VITE_SUPABASE_ANON_KEY | placeholder_key_will_update_after_supabase_setup | All                                    |
```

Click "Add" after each one.

---

Step 5: Deploy!

Now click "Deploy" 🚀

Vercel will:

- Clone your GitHub repository
- Run npm install
- Run npm run build
- Deploy to production

This takes ~2-3 minutes. Watch the build logs if you're curious!

---

Step 6: Get Your Production URL

Once deployed, you'll see:

- Production URL: Something like https://housing-dashboard-xyz.vercel.app
- Deployment Status: ✅ Ready

Copy this URL - this is your live application!

---

Step 7: Enable Preview Deployments

Preview deployments should be enabled by default, but let's verify:

1. Go to "Settings" → "Git"
2. Ensure "Automatically create Preview Deployments" is enabled ✅
3. Select "All branches"

Now every time you push to GitHub, Vercel will create a unique preview URL for that commit!

---

📋 Perplexity Browser Agent Prompts

If you want to use Perplexity to help with the setup, here are the prompts:

Prompt 1: Account Setup

I need to deploy a Vite + React application to Vercel. Walk me through:

1. Creating a free Vercel account linked to my GitHub account
2. Importing my GitHub repository "housing-dashboard" into Vercel
3. Verifying that Vercel auto-detects the Vite framework preset
4. What settings I should verify before deploying

Provide step-by-step instructions with screenshots references if possible.

Prompt 2: Environment Variables

I'm deploying a Vite + React app to Vercel that will eventually connect to Supabase.
How do I:

1. Add placeholder environment variables in Vercel (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
2. Ensure these variables are available in Production, Preview, and Development environments
3. Understand why Vite variables need the VITE\_ prefix

Walk me through the Vercel dashboard navigation for adding environment variables.

Prompt 3: Preview Deployments

I want to enable Vercel preview deployments so every git push creates a unique URL I can share with my client for feedback.

How do I:

1. Enable automatic preview deployments for all branches in Vercel
2. Find the preview URL after pushing a commit
3. Share preview URLs with non-technical clients
4. Understand the difference between production and preview deployments

Provide step-by-step instructions.

---

Once You're Done

Let me know when you've completed these steps and share:

1. ✅ Your production URL (e.g., https://housing-dashboard-xyz.vercel.app)
2. ✅ Whether the build succeeded or if you encountered any errors

Then we can:

- Test the deployment by visiting the URL
- Set up Supabase next
- Update the environment variables with real Supabase credentials

Any questions before you start? I'm here to help troubleshoot if anything goes wrong!

Todos
☒ Set up Vercel-native monorepo structure
☒ Create minimal frontend with Coming Soon page
☒ Install dependencies and test local build
☒ Commit frontend initialization
☐ Create Vercel account and link GitHub
☐ Configure Vercel project settings
☐ Add environment variables to Vercel
☐ Deploy initial version to production
☐ Test production URL and share with client

## User

Success! Vercel deployment is complete with placeholder environment variables. Client has been emailed the preview link: housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app

## Claude

● Excellent work! 🎉 That's a huge milestone! Your client now has a live URL they can visit, and every time you push code to GitHub, they'll automatically see the updates. This continuous feedback loop is
going to be invaluable.

● Perfect! 🚀 Vercel setup complete! All tasks finished successfully.

What You've Accomplished

✅ Vercel-native monorepo structure - Frontend (/src) + Backend (/api) in single project✅ Live production URL - housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app✅ Automatic deployments - Every  
 push to main updates production✅ Preview deployments enabled - Every branch gets a unique URL✅ Client has visibility - They can watch progress in real-time✅ Purple/pink themed landing page - Matches
client's color preference✅ Placeholder environment variables - Ready for Supabase integration

Important note about the URL: That's your preview/production URL. Vercel typically assigns a cleaner domain alias like housing-dashboard.vercel.app - you can find this in your Vercel dashboard under
"Domains". Both URLs work, but the shorter one is easier to share.

---

What Happens Next

Every time you:

- Push to main → Vercel auto-deploys to production (your current URL)
- Push to a feature branch → Vercel creates a preview URL (e.g., housing-dashboard-git-feature-xyz.vercel.app)
- Create a Pull Request → Vercel bot comments with the preview URL

Your client can bookmark the production URL and see updates within minutes of you pushing code!

---

Next Steps: Supabase Setup

Now we need to set up Supabase (PostgreSQL database) so we can:

1. Create the 8 database tables (houses, beds, tenants, etc.)
2. Get real API keys to replace the placeholders in Vercel
3. Enable Row Level Security (RLS) for authentication
4. Set up Supabase Storage for profile pictures

Do you want to proceed with Supabase setup now? I can walk you through it step-by-step just like we did with Vercel. It will take about 15-20 minutes.

Or would you prefer to:

- Take a break and tackle Supabase later
- Work on something else first
- Update the project roadmap to mark Vercel deployment complete

Let me know what you'd like to do!

## User

Perfect! I'll collapse context before we proceed to Supabase setup. But I also want to build out a CI/CD pipeline after Supabase setup so we ensure we never push breaking code. You have some context left, so go ahead and update documentation with progress and a note on current directory structure. Consider all documents that need to be update.

## Claude

● Excellent! ✅ All documentation updated and pushed to both remotes.

---

📋 Documentation Updates Summary

1. README.md - Complete Overhaul

- ✅ Added "Project Status" section with live Vercel URL and current phase
- ✅ Added directory structure diagram showing /src, /api, /docs organization
- ✅ Documented Vercel-native monorepo architecture
- ✅ Replaced prototype instructions with development setup guide (install, run, build)
- ✅ Added prerequisites (Node.js, Vercel, Supabase accounts)
- ✅ Clarified that prototype is archived (Phase 1 only)

2. project-roadmap.md - Progress Tracking

- ✅ Checked off all Vercel deployment sub-tasks (4 items)
- ✅ Added 3 new completed tasks:
  - Initialize Vite + React frontend with Tailwind CSS
  - Set up Vercel-native monorepo structure
  - Create Coming Soon landing page
- ✅ Updated Technical Planning to mention 8-table schema explicitly
- ✅ Added CI/CD pipeline task for automated testing

3. docs/deployment/vercel-setup.md - Deployment Status

- ✅ Added "Deployment Status" section at top with:
  - Production URL (live link)
  - Vercel account status
  - Environment variables status (placeholders)
  - Preview deployments enabled
  - Client notification timestamp
- ✅ Marked guide as COMPLETED with success date

4. docs/architecture/directory-structure.md - NEW FILE

- ✅ Created comprehensive 30+ section architecture guide:
  - Root directory layout with explanations
  - Frontend structure (/src organization)
  - Backend structure (/api serverless functions)
  - Static assets (/public)
  - Documentation organization (/docs)
  - Configuration files explained (vite.config.js, tailwind.config.js, vercel.json)
  - Build output structure
  - File naming conventions (PascalCase, camelCase, kebab-case)
  - Environment variable patterns (VITE\_ prefix explained)
  - Deployment workflow (dev vs production)
  - Future enhancement notes

---

🎯 Current State

Phase: Phase 2 - Post-Demo Refinement
Live URL: https://housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app
Last Commit: e14f478 - Documentation updates

✅ Completed This Session

1. Initialized Vite + React + Tailwind CSS frontend
2. Set up Vercel-native monorepo structure (/src + /api)
3. Created Coming Soon landing page (purple/pink theme)
4. Deployed to Vercel with auto-deployments enabled
5. Shared live URL with client
6. Updated all documentation (README, roadmap, architecture guide)
7. Committed and pushed to both GitLab and GitHub

🚧 Next Steps

1. Supabase Setup (15-20 minutes)

   - Create Supabase project

🚧 Next Steps

1. Supabase Setup (15-20 minutes)

   - Create Supabase project
   - Implement 8-table database schema
   - Set up Row Level Security (RLS)
   - Configure Supabase Storage for profile pictures
   - Update Vercel environment variables with real credentials

2. CI/CD Pipeline (Your request)

   - Set up GitLab CI for automated testing
   - Configure build checks to prevent breaking code
   - Add linting and code quality checks
   - Set up automated deployment workflows

---

📊 Context Status

Your context usage is at 54% (109k/200k tokens) - plenty of room to continue with Supabase setup and CI/CD pipeline planning.

Ready to proceed? Let me know if you want to:

- A) Start Supabase setup now (I'll walk you through it)
- B) Plan the CI/CD pipeline first (discuss GitLab CI configuration)
- C) Take a break and tackle these in the next session

What would you like to do?

## User

Perfect! Stand by for context collapse (I prefer each stage get it's own context in case you have to explain and sidetrack for education purposes), and we'll get Supabase setup.

## Claude

● Perfect! That's a smart approach - starting fresh with each major phase ensures I explain everything from scratch rather than assuming knowledge from earlier in the conversation. This maximizes the educational value.

I'm standing by for your context collapse. Once you're ready, we'll dive into Supabase setup where I'll walk you through:

1. Creating a Supabase project and understanding the dashboard
2. Writing SQL migration scripts for the 8-table schema
3. Understanding PostgreSQL data types and why we chose them
4. Setting up Row Level Security (RLS) and what it protects
5. Configuring Supabase Storage for profile pictures
6. Getting API keys and updating Vercel environment variables
7. Testing the database connection from your local frontend

I'll make sure to explain:

- What Supabase actually is (PostgreSQL + auth + storage + real-time)
- Why we're using it over alternatives
- How the API keys work (anon key vs service role key)
- What RLS policies do and why they matter for security
- Best practices for database migrations

Ready when you are! 🚀

## User

[/compact]

Okay -- walk me through the Supabase setup. I already have an account setup.

## Claude

● Great! Let's walk through setting up Supabase for the Housing Dashboard. Since you already have an account, we can jump right into creating the project and database.

Let me first check what schema documentation we have to ensure I'm implementing the correct structure:

● Search(pattern: "\**/*schema\*.md")
⎿ Found 2 files (ctrl+o to expand)

● Search(pattern: "\*\*/field-mapping.md")
⎿ Found 1 file (ctrl+o to expand)

● Read(docs\schemas\field-mapping.md)
⎿ Read 586 lines

● Read(docs\planning\SCHEMA_FOR_MANAGER.md)
⎿ Read 178 lines

● Read(docs\planning\SCHEMA_UPDATES.md)
⎿ Read 352 lines

● Perfect! I've reviewed the schema documentation and can see we have a comprehensive 8-table database to set up:

Core Tables:

1. houses - Properties
2. beds - Bed inventory
3. tenants - Resident core info

Extended Tables:

4. tenant_profiles - Recovery, legal, employment details
5. emergency_contacts - Contact information
6. form_submissions - Application/Intake form tracking
7. policy_agreements - 10 policy section signatures
8. system_settings - Configurable rates (voucher, TeleCare, Section 8)

---

My Supabase Setup Plan

Here's what I'll walk you through today:

Part 1: Create Supabase Project (5 minutes)

- Create new project in your existing account
- Choose database region and password
- Wait for provisioning

Part 2: Create Database Schema (20-30 minutes)

- Write SQL migration scripts for all 8 tables
- Set up foreign key relationships
- Add constraints and indexes
- Explain each table's purpose as we go

Part 3: Row Level Security (RLS) (10-15 minutes)

- Explain what RLS is and why it matters
- Set up policies for manager vs. tenant access
- Secure API endpoints

Part 4: Supabase Storage (5 minutes)

- Create bucket for tenant profile pictures
- Configure upload permissions

Part 5: Get API Keys & Update Vercel (5 minutes)

- Get Supabase URL and anon key
- Update Vercel environment variables with real credentials
- Test connection

---

What is Supabase? (Educational Sidebar)

Since you have some exposure but aren't deeply familiar, here's the quick version:

Supabase = Open-Source Firebase Alternative

It gives you:

- PostgreSQL database (industry-standard SQL database)
- Auto-generated REST API (no need to write API endpoints for basic CRUD)
- Real-time subscriptions (get notified when data changes)

It gives you:

- PostgreSQL database (industry-standard SQL database)
- Auto-generated REST API (no need to write API endpoints for basic CRUD)
- Real-time subscriptions (get notified when data changes)
- Built-in authentication (login, signup, sessions)
- File storage (for profile pictures, documents, etc.)
- Row Level Security (database-level access control)

Why we chose it over plain PostgreSQL:

- Free tier is generous (500MB database, 1GB file storage)
- Auto-generates API endpoints (saves us from writing tons of boilerplate)
- Built-in auth system (no need to code JWT tokens manually)
- Works perfectly with Vercel deployments
- RLS means security at the database level (even if someone steals your API key, they can't access restricted data)

---

Before We Start

Question for you: Do you want me to:

1. Walk you through creating the project yourself (I guide, you click), OR
2. Give you step-by-step instructions to follow while I prepare the SQL scripts?

Also, do you have any preference for database region? (Choose closest to your users for best performance - probably US West Coast for Washington state clients)

Let me know and we'll get started!

## User

No preference on region during development, but we're located in Washington when we shift to production.

A quick question -- should implement all the tables now, or just focus on the core tables? I trust your judgement. If it's easy for us to setup, then let's do it all. If it's difficult to new tables and relationships later, then we definitely should set them all up now. When we get some more user feedback, is it easy to pivot and incorporate new data and requests?

Answer those questions, then give me the steps to setup the Supabase project. After that, I'll prompt you to generate the migration scripts, and we'll walk through them together.

## Claude

● Excellent questions! Let me answer them clearly:

---

Should We Implement All 8 Tables Now?

My Recommendation: YES, implement all 8 tables now

Why?

1. It's the same effort - Writing 8 CREATE TABLE statements vs 3 takes maybe 10 extra minutes. SQL is SQL.
2. Adding tables later is VERY EASY - But adding them NOW avoids migration complexity:
   -- Adding a new table later = trivial
   `CREATE TABLE new_table (...);`
   -- Adding columns later = easy (if nullable or has default)
   `ALTER TABLE tenants ADD COLUMN new_field TEXT;`

3. Your schema is already designed - The field-mapping.md is thorough. We'd just be delaying the inevitable.
4. Intake forms need them - When Sprint 3 comes and we build the intake form, we'll NEED tenant_profiles, emergency_contacts, and policy_agreements. If we don't create them now, we'll be scrambling to add them later.
5. Empty tables are harmless - We can create all 8 tables today, but only populate houses, beds, tenants in Sprint 1. The other tables sit empty until we need them.

---

Is It Easy to Pivot Based on User Feedback?

YES - Supabase/PostgreSQL is very flexible for pivoting:

✅ EASY Changes (Can do anytime):

- Adding new tables - Just run CREATE TABLE
- Adding new columns - ALTER TABLE ADD COLUMN (if nullable or has default)
- Adding indexes - CREATE INDEX for performance
- Creating new relationships - Add foreign keys to existing tables
- Adding constraints - CHECK constraints, UNIQUE constraints

⚠️ MEDIUM Changes (Need care):

- Modifying column types - Requires data migration (e.g., VARCHAR(32) → VARCHAR(64))
- Adding NOT NULL constraints - Must backfill data first
- Renaming columns - Must update application code referencing old names

❌ HARD Changes (Avoid if possible):

- Removing columns with data - Risk of data loss
- Changing primary keys - Breaks all foreign key relationships
- Major schema restructuring - Requires complex migrations

Example from your SCHEMA_UPDATES.md:

The updates you documented (county field, base_rent, tenant_types array) are all EASY additions:
ALTER TABLE houses ADD COLUMN county VARCHAR(64) DEFAULT 'King County';
ALTER TABLE beds ADD COLUMN base_rent NUMERIC(8,2) DEFAULT 0.00;
ALTER TABLE tenants ADD COLUMN tenant_types TEXT[] DEFAULT ARRAY[]::TEXT[];

These can be added in 30 seconds after user feedback.

---

My Approach: Create All 8 Tables, Populate Incrementally

Today (Sprint 1):

- Create all 8 tables with relationships
- Populate only: houses, beds, tenants (core data migration)
- Other tables remain empty

Sprint 3 (Intake Forms):

- Populate: tenant_profiles, emergency_contacts, form_submissions, policy_agreements

Future (Settings Page):

- Populate: system_settings

This way:

- Schema is complete and ready
- We avoid migration headaches
- We populate data only when features are built
- User feedback can still add/modify fields easily

---

Supabase Project Setup Steps

Follow these steps in your Supabase Dashboard:

Step 1: Create New Project

1. Go to https://supabase.com/dashboard
2. Click "New Project" button (green button, top right)
3. Select your Organization (or create one if first time)

---

Step 2: Configure Project

Project Name:
housing-dashboard

Database Password:

- Generate a strong password (click the "Generate a password" button)
- CRITICAL: Copy this password immediately and save it somewhere secure!
- You'll need this for direct database access
- Suggestion: Use a password manager or save to a local .env file (NOT committed to git)

Region:

- For development: Choose any region (doesn't matter)
- Recommendation: "West US (North California)" - Closest to Washington state
- You can't change region later, but for development it's fine

Pricing Plan:

- Select "Free" tier (should be pre-selected)
- Free tier includes:
  - 500 MB database storage
  - 1 GB file storage
  - 2 GB bandwidth/month
  - More than enough for development and small production

---

Step 3: Wait for Provisioning

- Click "Create new project"
- Supabase will provision your database (takes ~2 minutes)
- You'll see a progress screen: "Setting up project..."
- ☕ Grab coffee while it initializes

---

Step 4: Get Your Project URL & API Keys

Once provisioning completes, you'll see the project dashboard.

Find your credentials:

1. Click "Settings" (gear icon in sidebar)
2. Click "API" tab
3. You'll see:

Project URL: https://xxxxx.supabase.co

API Keys (two types):

- anon (public) key: eyJhbGciOi... (safe to use in frontend)
- service_role (secret) key: eyJhbGciOi... (⚠️ NEVER expose to frontend)

For now, just note where these are. We'll copy them to Vercel later.

---

Step 5: Open SQL Editor

1. In the left sidebar, click "SQL Editor" icon (looks like </>)
2. This is where we'll run our migration scripts

You should see a blank SQL editor with a "New query" button.

---

✅ You're Ready!

Once you complete these 5 steps, come back and let me know:

Tell me:

1. ✅ "Project created and provisioned"
2. Your Project URL (the https://xxxxx.supabase.co part - this is safe to share)

Then I'll generate the migration scripts and walk you through running them.

---

Questions before you start?

## User

Remember, that during development we're using test data we generate ourselves. So if the Client requests anything that requires restructuring or hard data migration, we can simply delete all the old data and upload new test data. We don't have to worry about preserving Client data right now. But let's implement all 8 tables now, since you feel confident.

Standby while I follow your instructions.

## Claude

● Perfect point! You're absolutely right - during development with test/fake data, we have total freedom to experiment:

- Break something? → Drop table, recreate, re-seed
- Need to restructure? → Delete all data, rebuild schema, upload new test data
- Client wants major changes? → Nuke everything, start fresh

This is why the prototype/test data phase is so valuable - we can iterate fearlessly.

Once we migrate real client data (Phase 3), THEN we need careful migrations. But that's months away.

---

Let me create a todo list to track our Supabase setup progress:

● ---
👍 Standing By

I'm ready! Take your time with the setup steps. When you're done, just let me know:

1. ✅ Project provisioned
2. Your Project URL (the https://xxxxx.supabase.co part)

Then I'll generate the complete SQL migration script for all 8 tables and walk you through it table-by-table so you understand what each one does.

No rush - Supabase provisioning takes ~2 minutes, so grab a coffee if needed! ☕

Todos
☐ Create Supabase project and get credentials
☐ Write and run SQL migration scripts for 8 tables
☐ Set up Row Level Security (RLS) policies
☐ Create Supabase Storage bucket for profile pictures
☐ Update Vercel environment variables with Supabase credentials
☐ Test database connection from frontend

## User

Okay -- success! Supabase URL: https://tmdnfwbiputrylayovjl.supabase.co, and I have the two API keys.

## Claude

● Perfect! I've created a comprehensive SQL migration script. Before you run it, let me walk you through what we're creating:

---

📋 Schema Overview

Table 1: houses (Properties)

Purpose: Stores your halfway house locations

Key Fields:

- house_id (UUID) - Auto-generated unique ID
- address - Full street address (UNIQUE)
- county - Supports multi-county expansion
- total_beds - How many beds this property has

Why UUID? Supabase best practice. UUIDs are globally unique, can be generated client-side, and prevent ID guessing attacks.

---

Table 2: beds (Bed Inventory)

Purpose: Individual bed/room tracking

Key Fields:

- bed_id (UUID)
- house_id (FK → houses) - Which property this bed belongs to
- room_number - "Room 2A", "Bed 5", etc.
- base_rent - What this bed is worth per month ($700, $800, etc.)
- status - 'Available', 'Occupied', 'Pending', 'Hold'
- tenant_id (FK → tenants) - Current occupant (NULL if empty)

Key Design: UNIQUE(house_id, room_number) - Can't have duplicate room numbers in same house

ON DELETE CASCADE: If house deleted, all its beds are auto-deleted

---

Table 3: tenants (Residents Core Info)

Purpose: Main resident information

Key Fields:

- full_name, dob, phone, email, gender
- tenant_types (TEXT ARRAY) - Can be multiple: ['DOC', 'TeleCare']
- doc_number, telecare_id
- is_erd, erd_date - Estimated Release Date tracking
- cco_name, cco_phone - Community Corrections Officer
- payment_type - 'Voucher', 'Private Pay', etc.
- actual_rent - What they actually pay (may differ from bed's base_rent)
- application_status - 'Pending', 'Approved', 'Rejected', 'Waitlist'
- bed_id (FK → beds) - Current bed assignment

Why actual_rent AND bed.base_rent?

- Bed might be worth $800/month (base_rent)
- But voucher only pays $700/month (actual_rent)
- This tracks revenue variance

---

Table 4: tenant_profiles (Extended Info)

Purpose: Recovery, legal, employment details (keeps tenants table clean)

Key Fields:

- tenant_id (FK → tenants) - UNIQUE enforces 1:1 relationship
- Recovery: is_in_recovery, drug_of_choice, sober_date, recovery_program
- Legal: is_on_probation, is_on_parole, criminal_history
- Sex Offender: is_registered_sex_offender, sex_offense_details
- Employment: employment_status, employment_details
- Veteran: is_veteran

Why separate table? Not all queries need this data. Separating keeps queries fast.

---

Table 5: emergency_contacts

Purpose: 1-3 emergency contacts per tenant

Key Fields:

- tenant_id (FK → tenants)
- first_name, last_name, phone, email
- relationship - "Mother", "Brother", "Friend"
- is_primary - Marks the primary contact

One-to-Many: One tenant can have multiple contacts

---

Table 6: form_submissions

Purpose: Tracks Application and Intake form submissions

Key Fields:

- tenant_id (FK → tenants)
- form_type - 'Application' or 'Intake'
- form_data (JSONB) - Complete form stored as JSON
- status - 'Pending', 'Approved', 'Rejected'
- pdf_url - Link to generated PDF (Google Drive)

Why JSONB? Flexible schema - if form fields change, we don't need to alter table structure. Can query JSON fields directly in PostgreSQL.

---

Table 7: policy_agreements

Purpose: 10 individual policy section signatures (Intake form)

Key Fields:

- tenant_id (FK → tenants)
- form_submission_id (FK → form_submissions)
- policy_section - One of 10: 'Substance Use', 'Recovery', 'Guest', etc.
- agreed (BOOLEAN) - Must be TRUE
- signature_data (TEXT) - Base64 PNG signature image
- signed_at (TIMESTAMP)

Unique Constraint: (tenant_id, form_submission_id, policy_section) - Can't sign same section twice

Why separate rows? Each policy section has its own signature and timestamp. Easier to validate "all 10 signed" than parsing JSON.

---

Table 8: system_settings

Purpose: Configurable rates (voucher, TeleCare, Section 8)

Pre-seeded with:
voucher_rate: $700.00
telecare_rate: $750.00
section8_rate: $800.00

Why? Manager can update rates via dashboard UI instead of hard-coding in application.

---

🔗 Key Relationships

houses (1) ──→ (many) beds
beds (1) ──→ (1) tenant [current occupant]
tenants (1) ──→ (1) tenant_profiles [extended info]
tenants (1) ──→ (many) emergency_contacts
tenants (1) ──→ (many) form_submissions
form_submissions (1) ──→ (many) policy_agreements

---

🚀 Ready to Run?

Here's what to do next:

1. In Supabase Dashboard:

   - Click "SQL Editor" in left sidebar
   - Click "New Query"

2. Copy/Paste:

   - Open docs/schemas/supabase-migration.sql (I just created it)
   - Copy the ENTIRE file contents
   - Paste into Supabase SQL Editor

3. Run Script:

   - Click "Run" button (bottom right)
   - Should see: "Success. No rows returned"

4. Verify:

   - Click "Table Editor" in left sidebar
   - You should see all 8 tables listed!

---

Any questions before you run it? Or should I clarify any design decisions?

Todos
☒ Create Supabase project and get credentials
☐ Write and run SQL migration scripts for 8 tables
☐ Set up Row Level Security (RLS) policies
☐ Create Supabase Storage bucket for profile pictures
☐ Update Vercel environment variables with Supabase credentials
☐ Test database connection from frontend

## User

I have a few thoughts/questions on the current schema structure. For the `tenant` table, now that we have a `tenant_profile` table, should we extricate all fields from `tenant` that may not be present for all tenants? Like DOC number and cco information?

## Claude

● EXCELLENT question! This is exactly the kind of architectural thinking we should do NOW, before we have real data. Let me break down the tradeoffs:

---

Current Structure Analysis

tenants table currently has:

- Universal fields: name, DOB, phone, email, gender, entry/exit dates
- Conditional fields (your concern):
  - doc_number - Only for DOC tenants
  - telecare_id - Only for TeleCare tenants
  - cco_name, cco_phone - Only for DOC tenants
  - is_erd, erd_date - Only for pending DOC inmates
- Payment fields:
  - payment_type, actual_rent, voucher_start, voucher_end, rent_due, rent_paid

tenant_profiles table has:

- Recovery info (conditional on is_in_recovery)
- Legal/probation info (conditional on is_on_probation/parole)
- Employment, veteran status, food allergies

---

Option 1: Keep Current Structure

Keep DOC/CCO/TeleCare in tenants table

Pros:

- ✅ Fast queries - SELECT \* FROM tenants WHERE doc_number = 'DOC123' (single table, indexed)
- ✅ Manager searches by DOC# frequently - Very common workflow
- ✅ Filtering by program type (telecare_id, tenant_types) is fast
- ✅ No JOINs needed for common dashboard queries

Cons:

- ❌ Lots of NULL values for non-DOC tenants
- ❌ Conceptually unclear: "Is DOC# core tenant data or profile data?"

---

Option 2: Move Conditional Fields to tenant_profiles

Move DOC/CCO/TeleCare/ERD to tenant_profiles

Pros:

- ✅ Cleaner separation - tenants only has universal fields
- ✅ Better normalization - Conditional data lives in profiles
- ✅ Conceptually clearer - "DOC# is program-specific, not universal"

Cons:

- ❌ Performance hit - Common queries need JOINs:
  -- Before (current)
  SELECT \* FROM tenants WHERE doc_number = 'DOC123';

-- After (if moved to profiles)
SELECT t.\* FROM tenants t
JOIN tenant_profiles tp ON t.tenant_id = tp.tenant_id
WHERE tp.doc_number = 'DOC123';

- ❌ More complex queries - Every DOC search requires JOIN
- ❌ Indexing less effective - JOIN overhead even with indexes

---

Option 3: Hybrid Approach (My Recommendation)

Keep in tenants (frequently queried):

- doc_number - Searched often
- telecare_id - Filtered often
- is_erd, erd_date - Dashboard alerts
- ALL payment fields (payment_type, actual_rent, voucher dates, rent tracking)

Move to tenant_profiles (reference data):

- cco_name, cco_phone - Rarely searched, just displayed

Reasoning:

- DOC# is like a "secondary ID" - searched constantly
- Payment info is CORE to housing management (universal concern)
- CCO info is reference data - looked up occasionally, not searched

---

What About Payment Fields?

Should payment fields stay in tenants?

I strongly recommend YES:

Why payment fields belong in tenants:

1. Universal concern - ALL tenants have payment obligations
2. Dashboard queries - "Show tenants with overdue rent" (no JOIN needed)
3. Alerts - "Voucher expiring in 30 days" (frequent query)
4. Core business logic - Rent tracking is fundamental, not "profile detail"
5. Performance - Payment queries are constant

Payment fields are NOT conditional - even if a tenant pays $0, they still have payment_type = 'Voucher' and actual_rent = 0.00. This is different from DOC# (which is NULL for non-DOC tenants).

---

PostgreSQL NULL Handling (Educational Note)

Modern databases handle NULLs efficiently:

- NULLable columns don't waste space (NULLs stored as single bit in row header)
- Sparse data (lots of NULLs) is fine performance-wise
- Indexes on NULLable columns work great

So having conditional fields like doc_number in tenants is NOT a problem from storage/performance perspective. The question is purely about:

1. Query performance (avoid JOINs)
2. Conceptual clarity (what IS a tenant?)
3. Code maintainability (simpler queries)

---

My Recommendation

Modified Schema:

tenants table - Keep these:

- Universal fields: name, DOB, phone, email, gender
- Housing: entry/exit dates, bed assignment
- Search/filter fields: doc_number, telecare_id, tenant_types, is_erd, erd_date
- ALL payment fields: payment_type, actual_rent, voucher dates, rent tracking

tenant_profiles - Move these:

- cco_name, cco_phone (rarely searched)
- All existing profile fields (recovery, legal, employment, veteran)

Why this works:

- Fast queries for common searches (DOC#, TeleCare, ERD)
- Payment tracking stays simple (no JOINs)
- CCO info still accessible (just one JOIN when displaying tenant details)

---

Your Call

What do you think? Do you want to:

1. Keep current structure (DOC/CCO in tenants for performance)
2. Move all conditional fields to tenant_profiles (cleaner, but slower queries)
3. Hybrid approach (my recommendation - move only CCO fields)

Remember: We're using test data, so we can change this anytime. But I'd rather get it right now than restructure later.

What's your preference?

## User

Actually, searching by DOC isn't a common search. And there isn't enough traffic or enough tenants/properties to see a performance hit (imo). If the platform grew to include multiple clients that each managed a dozen properties, perhaps we'd need to refactor. But for this single use case, I'm thinking it makes more sense to separate concerns. But with this context, we'll follow whatever route you choose.

However, the Client likely does search frequently by payment type. Again -- there's not a ton of properies (5-10). But she could grow to 30+ next year. So I think you're right -- keep in `tenants`.

## Claude

● Perfect! ✅ Schema updated with cleaner separation of concerns.

---

What Changed

Moved FROM tenants TO tenant_profiles:

- doc_number (DOC program ID)
- telecare_id (TeleCare program ID)
- cco_name, cco_phone (Community Corrections Officer)
- is_erd, erd_date (Estimated Release Date)

Kept in tenants (frequently searched):

- ALL payment fields (payment_type, actual_rent, voucher dates, rent tracking)
- tenant_types array (for filtering/grouping)

Added indexes:

- tenant_profiles.doc_number - For occasional DOC# searches
- tenant_profiles.telecare_id - For TeleCare filtering
- tenants.payment_type - For frequent payment filtering

---

Updated Mental Model

tenants (Core Table)
├── Identity: name, DOB, contact info
├── Housing: entry/exit dates, bed assignment
├── Payment: ALL rent/voucher tracking
├── Classification: tenant_types (DOC/TeleCare/Private)
└── Status: application_status

tenant_profiles (Extended Table - 1:1)
├── Program IDs: doc_number, telecare_id
├── DOC Info: CCO contact, ERD tracking
├── Recovery: drug of choice, sober date, program
├── Legal: probation, parole, criminal history
├── Employment: status, details, allergies
└── Other: veteran status

---

Example Queries (Educational)

Common query - Payment filtering (single table, fast):
-- Show tenants with vouchers expiring in 30 days
SELECT full_name, voucher_end, payment_type
FROM tenants
WHERE voucher_end BETWEEN NOW() AND NOW() + INTERVAL '30 days';
-- No JOIN needed ✅

Less common - DOC# lookup (needs JOIN, but still fast at your scale):
-- Find tenant by DOC number
SELECT t.full_name, t.phone, tp.doc_number, tp.cco_name
FROM tenants t
JOIN tenant_profiles tp ON t.tenant_id = tp.tenant_id
WHERE tp.doc_number = 'DOC123456';
-- With 200 rows, JOIN completes in <1ms

---

🚀 Ready to Run!

The migration script is now complete and updated at:
docs/schemas/supabase-migration.sql

Next Steps:

1. In Supabase Dashboard:

   - SQL Editor → New Query
   - Copy the ENTIRE supabase-migration.sql file
   - Paste into editor
   - Click "Run"

2. Expected Result:

   - "Success. No rows returned"
   - Check "Table Editor" - you should see all 8 tables!

3. If you want to review the script first:

   - It's only ~350 lines with lots of comments
   - Feel free to read through or ask questions

Should I walk through the script section-by-section, or are you ready to run it?

## User

`Success. No rows returned`! I see 8 tables with the expected fields. Let's now setup RLS before I collapse context.

## Claude

● Perfect! I've created a comprehensive RLS policy script. Let me explain what we're doing:

---

What We're Implementing

Development Policies (What we're using now):

For Authenticated Users (using anon key with Supabase Auth):

- ✅ Full CRUD access to all tables
- Allows you to test the app without restrictions during development

For Public (unauthenticated):

- ✅ Can INSERT into form_submissions and policy_agreements (intake forms)
- ✅ Can SELECT from system_settings (display voucher rates)
- ❌ Cannot access any other tables

---

Key RLS Concepts (Educational)

1. Two User Types in Supabase:

- anon (public/unauthenticated) - Anyone visiting your site
- authenticated - Logged-in users

2. Policy Types:

- FOR SELECT - Who can read data
- FOR INSERT - Who can create new rows
- FOR UPDATE - Who can modify existing rows
- FOR DELETE - Who can delete rows

3. Policy Clauses:

- USING (condition) - Determines which rows the user can see/modify
- WITH CHECK (condition) - Validates new/updated rows
- true = Allow all rows

Example:
-- Anyone authenticated can read all houses
CREATE POLICY "houses_select_authenticated" ON houses
FOR SELECT
TO authenticated
USING (true); -- true = allow all rows

---

Why Development Policies Are Permissive

Current setup: USING (true) = Allow everything

Why?

- You haven't set up authentication yet (no user accounts)
- During development, you need to test all features
- Once you add auth, we'll tighten these policies

Production policies will check:
-- Only managers can see all tenants
USING (is_manager())

-- Tenants can only see their own record
USING (auth.uid() = user_id)

---

🚀 Run the RLS Script

In Supabase SQL Editor:

1. New Query (or clear existing editor)
2. Copy entire script from docs/schemas/supabase-rls-policies.sql
3. Paste and Run
4. Should see: "Success. No rows returned"

---

✅ Verify RLS is Enabled

After running, check:

1. In Supabase Dashboard → "Authentication" → "Policies"
2. You should see all 8 tables listed
3. Each table should show "X policies" (multiple policies per table)

Or verify in SQL Editor:
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- All should show rowsecurity = true

---

Run the script and let me know if it succeeds! After this, we'll create the Storage bucket for profile pictures, then update Vercel with the real API keys.

Todos
☒ Create Supabase project and get credentials
☒ Write and run SQL migration scripts for 8 tables
☐ Set up Row Level Security (RLS) policies
☐ Create Supabase Storage bucket for profile pictures
☐ Update Vercel environment variables with Supabase credentials
☐ Test database connection from frontend

## user

`Success. No rows returned`! RLS policies added. I see each table has X policies now.

## Claude

● 🎉 Excellent! RLS is now protecting your database!

● ---
🔒 What RLS Does For You Now

Your database is now secure:

- ✅ Public users can ONLY submit intake forms and read system settings
- ✅ Authenticated users (using anon key) can access all data during development
- ✅ Even if someone steals your anon API key, they can't bypass these rules
- ✅ The service_role key bypasses RLS (never expose this to frontend!)

---

Next: Create Storage Bucket for Profile Pictures

What is Supabase Storage?

- Like AWS S3, but integrated with Supabase
- Stores files (images, PDFs, documents)
- Has its own RLS policies for upload/download permissions
- Automatically generates URLs for uploaded files

We need it for:

- Tenant profile pictures (uploaded during application form)
- Generated PDFs of signed intake forms (later)

---

📸 Storage Bucket Setup Steps

In Supabase Dashboard:

Step 1: Navigate to Storage

1. Click "Storage" in left sidebar
2. Click "Create a new bucket" (green button)

Step 2: Configure Bucket

Bucket Name:
tenant-profile-pictures

Public bucket: ❌ NO (keep it private)

- We'll control access via RLS policies
- Only authenticated users should see profile pictures

File size limit: Leave default (50 MB is fine)

Allowed MIME types: Leave empty (we'll validate on frontend)

Click "Create bucket"

---

Step 3: Set Storage Policies

After creating the bucket, you need to add policies for who can upload/download.

Click on the bucket name → "Policies" tab → "New Policy"

We'll create 2 policies:

Policy 1: Authenticated Users Can Upload

Click "New Policy" → Select "For full customization"

Policy Name:
Authenticated users can upload profile pictures

Allowed operation: SELECT ☑ INSERT

Target roles: authenticated

USING expression:
true

WITH CHECK expression:
(bucket_id = 'tenant-profile-pictures'::text)

Click "Review" → "Save policy"

---

Policy 2: Authenticated Users Can Read

Click "New Policy" again → "For full customization"

Policy Name:
Authenticated users can view profile pictures

Allowed operation: SELECT ☑ SELECT

Target roles: authenticated

USING expression:
(bucket_id = 'tenant-profile-pictures'::text)

Click "Review" → "Save policy"

---

Step 4: (Optional) Public Users Can Upload

If you want unauthenticated users to upload profile pictures during intake form (before they have an account):

Policy Name:
Public can upload profile pictures

Allowed operation: SELECT ☑ INSERT

Target roles: anon

USING expression:
true

WITH CHECK expression:
(bucket_id = 'tenant-profile-pictures'::text)

---

🎯 Faster Alternative: Use SQL

If the UI is confusing, you can run this SQL instead:

-- Enable storage for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('tenant-profile-pictures', 'tenant-profile-pictures', false);

-- Policy: Authenticated users can upload
CREATE POLICY "Authenticated users can upload profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tenant-profile-pictures');

-- Policy: Authenticated users can read
CREATE POLICY "Authenticated users can view profile pictures"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'tenant-profile-pictures');

-- Policy: Public can upload (optional - for intake forms)
CREATE POLICY "Public can upload profile pictures"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'tenant-profile-pictures');

---

Which approach do you prefer?

1. Dashboard UI (I guide you through clicks)
2. SQL Script (faster, just copy/paste into SQL Editor)

Let me know and we'll get the storage bucket set up!

Todos
☒ Create Supabase project and get credentials
☒ Write and run SQL migration scripts for 8 tables
☒ Set up Row Level Security (RLS) policies
☐ Create Supabase Storage bucket for profile pictures
☐ Update Vercel environment variables with Supabase credentials
☐ Test database connection from frontend

## User

Okay -- storage bucket added with the two policies.

## Claude

● 🎉 Perfect! Storage is now configured!

● ---
✅ Supabase Setup Complete!

What we've built:

- ✅ 8-table database schema
- ✅ Row Level Security policies on all tables
- ✅ Storage bucket for profile pictures with upload/download policies
- ✅ System settings pre-seeded with voucher rates

---

Next: Update Vercel with Real Supabase Credentials

Remember, you currently have placeholder environment variables in Vercel. Now we need to replace them with your real Supabase credentials.

---

🔑 Get Your Supabase API Keys

In Supabase Dashboard:

1. Click "Settings" (gear icon in sidebar)
2. Click "API" tab
3. You'll see:

Project URL:
https://tmdnfwbiputrylayovjl.supabase.co

API Keys:

- anon (public) - Safe to use in frontend (starts with eyJhbG...)
- service_role (secret) - ⚠️ NEVER expose to frontend (also starts with eyJhbG...)

Copy both keys to a temporary notepad - we'll need them in a moment.

---

📝 Update Vercel Environment Variables

In Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Click on your housing-dashboard project
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar

---

Update These Variables:

1. VITE_SUPABASE_URL

- Value: https://tmdnfwbiputrylayovjl.supabase.co
- Environments: ☑ Production ☑ Preview ☑ Development
- Click "Save"

2. VITE_SUPABASE_ANON_KEY

- Value: (paste your anon key from Supabase)
- Environments: ☑ Production ☑ Preview ☑ Development
- Click "Save"

3. SUPABASE_SERVICE_ROLE_KEY (For backend/serverless functions)

- Click "Add New"
- Name: SUPABASE_SERVICE_ROLE_KEY
- Value: (paste your service_role key from Supabase)
- Environments: ☑ Production ☑ Preview ☑ Development
- Click "Save"

---

🔄 Redeploy to Apply Changes

Environment variables only take effect after redeployment:

1. Go to "Deployments" tab
2. Find your latest deployment
3. Click "..." menu → "Redeploy"
4. Confirm redeploy

Vercel will rebuild your app with the new environment variables (~1-2 minutes).

---

📋 Quick Checklist

Before you start, confirm you have these ready:

- Project URL: https://tmdnfwbiputrylayovjl.supabase.co
- anon key copied
- service_role key copied

Once you have those, go ahead and update Vercel!

Let me know when the redeploy completes, and we'll test the database connection from the frontend.

Todos
☒ Create Supabase project and get credentials
☒ Write and run SQL migration scripts for 8 tables
☒ Set up Row Level Security (RLS) policies
☒ Create Supabase Storage bucket for profile pictures
☐ Update Vercel environment variables with Supabase credentials
☐ Test database connection from frontend

## User

Okay -- keys added, and I've reployed on Vercel. I noticed the deployment environment defaulted to "Production" -- should I change it to "Development"?

## Claude

● Great question! No, keep it as Production - here's why:

---

Vercel Environment Types (Educational)

Vercel has 3 environment types, but they're NOT what you might think:

1. Production

- Deployments from your main branch
- Gets your production URL: housing-dashboard-5hlowacgt...vercel.app
- This is what you want right now!

2. Preview

- Deployments from ANY other branch (feature branches)
- Gets unique URLs like: housing-dashboard-git-feature-xyz.vercel.app
- Used for testing features before merging to main

3. Development

- Only for local development using vercel dev command
- Not used for deployments to Vercel servers

---

Why "Production" is Correct

You're deploying from main branch, so Vercel treats it as "Production" deployment.

But you're still in development phase! The confusion is:

- Vercel "Production" = Deployments from main branch
- Your development phase = Building features with test data

These are different concepts!

---

The Workflow

Current (what you're doing):
main branch → Production deployment → Client sees live updates

Later (when using feature branches):
feature/intake-form branch → Preview deployment → You test first
↓ (after testing)
Merge to main → Production deployment → Client sees it

---

Environment Variables Scope

When you set env vars to Production + Preview + Development, you're saying:

- ✅ Use these vars for main branch deployments (Production)
- ✅ Use these vars for feature branch deployments (Preview)
- ✅ Use these vars for local development (Development)

This is correct! You want the same Supabase credentials everywhere during development.

---

Summary

Keep "Production" deployment - it's correct!

You're in "development phase" (building features, using test data), but Vercel calls main branch deployments "Production" deployments. That's fine.

Later, when you launch with real client data, you'll still use "Production" deployments from main, but you'll be more careful about testing on feature branches first.

---

Your setup is perfect! Ready to test the database connection?

## User

Yes, let's proceed with testing the DB connection.

## Claude

● Perfect! Let's test the database connection. I'll create a Supabase client and add a simple test to your app.

● ---
Step 1: Install Supabase Client Library

First, we need to install the Supabase JavaScript client:

● Bash(cd /c/Users/mmunr/OneDrive/Desktop/Projects/housing-dashboard && npm install @supabase/supabase-js)
⎿ Interrupted · What should Claude do instead?

## User

Hold on -- chart out all of your steps first so we have the full picture.

## claude

● Smart! Let me outline the complete testing plan first:

---

🗺️ Database Connection Test - Full Plan

Step 1: Install Supabase Client Library

What: Add @supabase/supabase-js package
Why: Provides JavaScript API to connect to Supabase
Command: npm install @supabase/supabase-js
Time: ~30 seconds

---

Step 2: Create Supabase Client Utility

What: Create src/utils/supabase.js
Why: Initializes Supabase connection once, reused everywhere
Code:

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Why this pattern: Vite requires `import.meta.env (not process.env)`

---

Step 3: Update App.jsx with Connection Test

What: Add a test component that queries system_settings table
Why: Verifies:

- ✅ Environment variables loaded correctly
- ✅ Supabase client initialized
- ✅ RLS policies allow reading system_settings
- ✅ Database returns data

Visual result: Show voucher rates on the Coming Soon page

Code snippet:

```js
const [settings, setSettings] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
  async function testConnection() {
    const { data, error } = await supabase.from("system_settings").select("*");

    if (error) setError(error.message);
    else setSettings(data);
  }
  testConnection();
}, []);
```

---

Step 4: Test Locally

What: Run npm run dev and check http://localhost:3000
Why: Test connection before deploying
Expected result:

- Should see "Connection successful!" message
- Should display 3 system settings (voucher_rate, telecare_rate, section8_rate)
- Console should show no errors

---

Step 5: Commit and Push

What: Commit changes to git, push to both remotes
Why: Trigger automatic Vercel deployment with new code
Files changed:

- package.json (new dependency)
- package-lock.json (auto-updated)
- src/utils/supabase.js (new file)
- src/App.jsx (updated with test)

---

Step 6: Verify on Vercel

What: Check deployed app at housing-dashboard-5hlowacgt...vercel.app
Why: Confirm environment variables work in production
Expected result: Same as local - connection success, data displayed

---

Step 7: (Optional) Add Local .env for Development

What: Create .env file locally with Supabase credentials
Why: So you can run npm run dev locally without always deploying to Vercel
File: .env (already in .gitignore)
VITE_SUPABASE_URL=https://tmdnfwbiputrylayovjl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

---

📋 Summary of Changes

Files to create:

1. src/utils/supabase.js - Supabase client initialization

Files to modify: 2. package.json - Add @supabase/supabase-js dependency 3. src/App.jsx - Add connection test UI

Files to create (optional): 4. .env - Local environment variables (NOT committed to git)

---

🎯 Success Criteria

Test passes if:

- ✅ No console errors
- ✅ App displays: "Database connected!"
- ✅ Shows 3 settings: voucher_rate ($700), telecare_rate ($750), section8_rate ($800)
- ✅ Works both locally AND on Vercel deployment

Test fails if:

- ❌ Error message about missing environment variables
- ❌ Error about RLS policies blocking access
- ❌ Network error connecting to Supabase
- ❌ No data returned from database

---

⏱️ Estimated Time

- Steps 1-3: ~5 minutes (install + write code)
- Step 4: ~2 minutes (local test)
- Step 5: ~1 minute (commit/push)
- Step 6: ~3 minutes (wait for Vercel deployment + verify)

Total: ~10-15 minutes

---

Does this plan look good? Any questions before we proceed?

Once you approve, I'll execute steps 1-3 (install package, create files, update App.jsx).

## User

Okay -- I approve of this plan. Proceed!

## Claude

● 🎉 Dev server is running!

---

🌐 Test in Your Browser

Open your browser and go to: http://localhost:3000

What you should see:

1. Coming Soon page (existing content)
2. Below that: A new "🔌 Database Connection Test" section

Expected results:

✅ Success:

- Green success box appears
- Shows "Connected to Supabase!"
- Displays 3 system settings:
  - Standard monthly voucher payment amount: $700.00
  - Standard TeleCare monthly payment: $750.00
  - Standard Section 8 voucher rate: $800.00

❌ Failure (if you see red error box):

- Check browser console (F12) for error details
- Verify .env file has correct anon key
- Restart dev server

---

📱 What to Check

Open browser and tell me:

1. Do you see the green success box or red error box?
2. Can you see the 3 system settings displayed?
3. Any errors in browser console (F12 → Console tab)?

Don't close the dev server yet - once we confirm it works locally, we'll commit and push to test on Vercel!

### User

It works! I've put a screenshot of the current landing page so you can get a visual idea of what we've got so far: `./screenshot.png`. Were there any other Supabase tasks we needed to do, or are we ready to set up the CI/CD pipeline next? Dev server is still running. If we're ready, commit all changes and push, and then stand by for context collapse.

### Claude

● 🎉 Pushed to both GitLab and GitHub successfully!

Vercel should now auto-deploy with the database connection test. In a few minutes, your live site will show the green "Connected to Supabase!" message.

---

📋 Session Summary - Supabase Setup Complete

✅ What We Accomplished:

1. Created Supabase Project


    - Database: PostgreSQL on Supabase Cloud
    - Region: US West
    - Got API keys (anon + service_role)

2. Built 8-Table Database Schema


    - Fixed circular reference issue (beds ↔ tenants)
    - Separated concerns (payment in tenants, program data in tenant_profiles)
    - Pre-seeded system_settings with voucher rates

3. Secured with Row Level Security


    - Development policies (permissive for testing)
    - Public can submit intake forms
    - Production policies documented for tightening later

4. Created Storage Bucket


    - For tenant profile pictures
    - Upload/download policies configured

5. Integrated Frontend with Database


    - Installed @supabase/supabase-js
    - Created Supabase client utility
    - Added connection test to landing page
    - ✅ Working locally and deploying to Vercel now!

---

🔜 Next Session: CI/CD Pipeline Setup

Standing by for context collapse! 🚀
