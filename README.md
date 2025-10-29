# Halfway Housing Dashboard

## Problem Statement

Managing a network of halfway houses with diverse programs and residents creates complex data challenges. The current workflow relies on chaotic, multi-tabbed Excel files with inconsistent formats, manual entry, and limited reporting, which slows down intake, tracking, and housing coordination.

## Solution

This project delivers a secure, user-friendly dashboard solution. Residents can submit their data and managers can track bed assignments, rent/voucher payments, waitlists, and contacts in a single place. Real-time dashboards, robust reporting, and backup/export features streamline organization, reduce errors, and enable data-driven decisions.

## Tech Stack

- Frontend: React with Vite, Tailwind CSS, React Router
- State Management: TanStack React Query (formerly React Query)
- Database: Supabase (PostgreSQL with Row Level Security)
- Hosting: Vercel (frontend), Supabase Cloud (database)
- Version Control: GitHub/GitLab (dual remote strategy)

## Features

### Implemented (Read-Only Phase)
- **Dashboard Page**: Real-time metrics displaying total beds, occupancy rate, available beds
- **Properties Overview**: Detailed view of all houses with bed counts, occupancy, and monthly income calculations
- **Tenants Page**: Searchable and filterable tenant list with status indicators
- **Properties Page**: Full property management with financial tracking (monthly income by house)
- **Voucher Expiration Alerts**: Widget showing tenants with vouchers expiring within 30 days
- **Pending Arrivals**: Tracks tenants scheduled to move in within the next 30 days
- **Available Beds List**: Quick-reference list with clickable links to Properties page

### Planned (Future Phases)
- Full CRUD operations for residents, houses, and beds
- Resident intake form with mobile optimization
- Secure role-based authentication
- Data backup/export (Google Sheets, CSV)
- Rent/payment ledger and transaction history
- Program contacts and counselor management
- Automated alerts and reports
- Grant reporting and document generation
- DOC stakeholder portal for bed availability reports

## Roadmap

See [project-roadmap.md](project-roadmap.md) for planned features and milestones.

## Contribution Guidelines

Pull requests, issue reporting, and feedback are welcomed.

## Project Status

**Current Phase:** Phase 3 - Read-Only Operations (Near Completion)
**Live URL:** [https://housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app](https://housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app)
**Last Updated:** October 29, 2025

✅ **Completed:**
- Requirements gathering and client demo (Phase 1)
- Database schema design (8 tables: houses, beds, tenants, tenant_profiles, emergency_contacts, form_submissions, policy_agreements, system_settings)
- Supabase database setup with Row Level Security (RLS)
- Database seeded with realistic test data (32 tenants, 49 beds, 5 houses, 65 emergency contacts, 63 form submissions, 310 policy agreements)
- Test data generators created (see `scripts/`)
- Vercel deployment setup with continuous integration
- Frontend initialization (Vite + React + Tailwind CSS + React Router)
- Database connection established (frontend → Supabase via @supabase/supabase-js)
- **Dashboard Page**: 4 metric cards + Properties Overview Widget + 3-column widget row (Voucher Expiration, Pending Arrivals, Available Beds)
- **Properties Page**: Comprehensive property list with financial tracking (monthly income calculations)
- **Tenants Page**: Full tenant roster with search, filter by status, and move-in/move-out date display
- Routing infrastructure with Layout component (Header + Sidebar navigation)

🚧 **In Progress:**
- CI/CD pipeline configuration (GitLab CI)
- Preparing for CRUD operations phase (Create/Update/Delete functionality)

## Directory Structure

```
housing-dashboard/
├── src/                              # Frontend React application
│   ├── components/                   # Reusable UI components
│   │   ├── layout/                   # Layout components
│   │   │   ├── Layout.jsx            # Main layout wrapper with sidebar
│   │   │   ├── Header.jsx            # Top navigation header
│   │   │   └── Sidebar.jsx           # Side navigation menu
│   │   └── dashboard/                # Dashboard-specific widgets
│   │       ├── MetricCard.jsx        # Reusable metric card component
│   │       ├── PropertiesOverviewWidget.jsx  # Properties summary table
│   │       ├── AvailableBedsList.jsx         # Available beds widget
│   │       ├── VoucherExpirationWidget.jsx   # Voucher expiration alerts
│   │       └── PendingArrivalsWidget.jsx     # Upcoming tenant arrivals
│   ├── pages/                        # Page-level components
│   │   ├── Dashboard.jsx             # Main dashboard page
│   │   ├── Properties.jsx            # Properties management page
│   │   └── Tenants.jsx               # Tenants roster page
│   ├── utils/                        # Utility functions
│   │   ├── supabase.js               # Supabase client configuration
│   │   └── dateHelpers.js            # Date formatting utilities
│   ├── App.jsx                       # Main app component with routing
│   ├── main.jsx                      # React entry point
│   └── index.css                     # Global styles (Tailwind)
├── api/                              # Backend serverless functions (Vercel)
│   └── hello.js                      # Sample API route (placeholder)
├── public/                           # Static assets
│   └── images/                       # Image files
├── docs/                             # Project documentation
│   ├── schemas/                      # Database schemas and field mappings
│   │   ├── supabase-migration.sql    # Complete table definitions
│   │   ├── supabase-rls-policies.sql # Row Level Security policies
│   │   └── SCHEMA_FOR_MANAGER.md     # Manager-friendly schema overview
│   ├── deployment/                   # Deployment guides
│   │   └── vercel-setup.md           # Vercel deployment instructions
│   ├── planning/                     # Project planning docs
│   ├── screenshots/                  # Application screenshots
│   └── architecture/                 # Architecture documentation
├── scripts/                          # Data generation and migration scripts
├── prototype/                        # Static HTML prototype (Phase 1)
├── convo-history/                    # Development session logs
├── package.json                      # Node.js dependencies
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── vercel.json                       # Vercel routing configuration
├── index.html                        # HTML entry point
├── README.md                         # This file
├── CLAUDE.md                         # Claude Code instructions
└── project-roadmap.md                # Detailed development roadmap
```

**Architecture:** Vercel-native monorepo with client-side data fetching
- Single `package.json` for both frontend and backend
- Frontend builds with Vite to `/dist`
- Data fetching: Direct Supabase client calls via @supabase/supabase-js (no backend API layer yet)
- State management: TanStack React Query for server state caching and synchronization
- Routing: React Router v7 with Layout-based navigation
- Styling: Tailwind CSS with custom purple/pink brand theme
- Backend: Vercel Serverless Functions in `/api` folder (planned for future CRUD operations)
- Automatic deployments on every push to GitHub

See [docs/architecture/directory-structure.md](docs/architecture/directory-structure.md) for detailed structure documentation.

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Vercel account (free tier)
- Supabase account (free tier)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/mmunro3318/housing-dashboard.git
   cd housing-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   # Copy from .env.example (when available)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   # Opens http://localhost:3000
   ```

5. **Build for production**
   ```bash
   npm run build
   # Output: ./dist folder
   ```

### Deployment

The app automatically deploys to Vercel on every push:
- **Production:** Push to `main` branch
- **Preview:** Push to any feature branch

See [docs/deployment/vercel-setup.md](docs/deployment/vercel-setup.md) for detailed deployment instructions.

## Running the Prototype

**Note:** The static HTML prototype (`/prototype` folder) was used for Phase 1 requirements gathering. The production application is now being built with React + Vite.

To view the prototype:
```bash
cd prototype
# Open index.html in your browser
```

## Contact

Project Lead: [Michael Munro](m.munro3318@gmail.com)

## License

[MIT License](LICENSE) (or other as appropriate)
