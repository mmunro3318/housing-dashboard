# Halfway Housing Dashboard

## Problem Statement

Managing a network of halfway houses with diverse programs and residents creates complex data challenges. The current workflow relies on chaotic, multi-tabbed Excel files with inconsistent formats, manual entry, and limited reporting, which slows down intake, tracking, and housing coordination.

## Solution

This project delivers a secure, user-friendly dashboard solution. Residents can submit their data and managers can track bed assignments, rent/voucher payments, waitlists, and contacts in a single place. Real-time dashboards, robust reporting, and backup/export features streamline organization, reduce errors, and enable data-driven decisions.

## Tech Stack

- Frontend: React (with RTK-Query/Redux for data management)
- Backend: Node.js (Express)
- Database: Supabase (Postgres)
- Hosting: Vercel (frontend), Supabase cloud (database)
- Version Control: GitHub/GitLab

## Features

- CRUD operations for residents, houses, beds
- Central manager dashboard
- Resident intake form
- Secure role-based access
- Data backup/export (Google Sheets, CSV)
- _Planned_: Rent/payment ledger, program contacts, reporting, automated alerts and reports
- _Planned_: Generate reports and documents grounded in data for grants and non-profit reporting
- _Stretch_: DOC stakeholders can register `.[wa].doc1.gov` addresses to receive monthly reports on available bed spaces

## Roadmap

See [project-roadmap.md](project-roadmap.md) for planned features and milestones.

## Contribution Guidelines

Pull requests, issue reporting, and feedback are welcomed.

## Project Status

**Current Phase:** Phase 2 - Post-Demo Refinement (Database Setup Complete)
**Live URL:** [https://housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app](https://housing-dashboard-5hlowacgt-mmunro3318s-projects.vercel.app)
**Last Updated:** October 28, 2025

✅ **Completed:**
- Requirements gathering and client demo (Phase 1)
- Database schema design (8 tables)
- Supabase database setup with Row Level Security (RLS)
- Database seeded with realistic test data (32 tenants, 49 beds, 5 houses, etc.)
- Test data generators created (see `scripts/`)
- Vercel deployment setup with continuous integration
- Frontend initialization (Vite + React + Tailwind CSS)
- Coming Soon landing page deployed
- Database connection test (frontend → Supabase)

🚧 **In Progress:**
- CI/CD pipeline configuration (GitLab CI)
- Frontend component development (next: Houses List, Tenant Dashboard)

## Directory Structure

```
housing-dashboard/
├── src/                      # Frontend React application
│   ├── components/           # Reusable UI components
│   ├── pages/                # Page-level components
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles (Tailwind)
├── api/                      # Backend serverless functions (Vercel)
│   └── hello.js              # Sample API route
├── public/                   # Static assets
│   └── images/               # Image files
├── docs/                     # Project documentation
│   ├── schemas/              # Database schemas and field mappings
│   ├── deployment/           # Deployment guides (Vercel, etc.)
│   └── planning/             # Project planning docs
├── prototype/                # Static HTML prototype (Phase 1)
├── convo-history/            # Development session logs
├── package.json              # Node.js dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vercel.json               # Vercel routing configuration
└── index.html                # HTML entry point
```

**Architecture:** Vercel-native monorepo
- Single `package.json` for both frontend and backend
- Frontend builds with Vite to `/dist`
- Backend uses Vercel Serverless Functions (`/api` folder)
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
