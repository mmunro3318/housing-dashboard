# Directory Structure

**Last Updated:** October 27, 2025
**Architecture:** Vercel-native Monorepo
**Framework:** Vite + React + Tailwind CSS

---

## Overview

This project uses a **Vercel-native monorepo structure** where the frontend and backend share a single `package.json`. This minimizes configuration complexity while providing the benefits of a full-stack application.

**Key Benefits:**
- Single build configuration
- No CORS issues (frontend and backend share the same domain)
- Automatic serverless function deployment via Vercel
- Simplified dependency management

---

## Root Directory

```
housing-dashboard/
├── src/                      # Frontend React application
├── api/                      # Backend serverless functions
├── public/                   # Static assets
├── docs/                     # Project documentation
├── prototype/                # Static HTML prototype (Phase 1)
├── convo-history/            # Development session logs
├── package.json              # Node.js dependencies (shared)
├── package-lock.json         # Dependency lock file
├── vite.config.js            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── vercel.json               # Vercel deployment configuration
├── index.html                # HTML entry point (Vite)
├── .gitignore                # Git ignore rules
├── README.md                 # Project overview
├── CLAUDE.md                 # AI assistant instructions
├── PRODUCT_SPEC.md           # Product requirements
└── project-roadmap.md        # Development milestones
```

---

## Frontend (`/src`)

React application code. All components, pages, hooks, and utilities.

```
src/
├── components/               # Reusable UI components
│   ├── layout/               # Layout components (Header, Footer, Sidebar)
│   ├── forms/                # Form components (Input, Select, TextArea, etc.)
│   ├── modals/               # Modal dialogs
│   └── ui/                   # Generic UI components (Button, Card, Badge, etc.)
├── pages/                    # Page-level components (route components)
│   ├── Dashboard.jsx         # Main dashboard
│   ├── Properties.jsx        # Property management
│   ├── Tenants.jsx           # Tenant management
│   ├── IntakeForm.jsx        # Resident intake form
│   └── Login.jsx             # Authentication
├── hooks/                    # Custom React hooks
│   ├── useAuth.js            # Authentication hook
│   ├── useSupabase.js        # Supabase client hook
│   └── useForm.js            # Form validation hook
├── utils/                    # Utility functions
│   ├── supabase.js           # Supabase client initialization
│   ├── validators.js         # Form validation helpers
│   └── formatters.js         # Data formatting utilities
├── App.jsx                   # Main app component (routing, providers)
├── main.jsx                  # React entry point (ReactDOM.render)
└── index.css                 # Global styles (Tailwind directives)
```

**File Naming Conventions:**
- Components: PascalCase (e.g., `DashboardCard.jsx`)
- Utilities/hooks: camelCase (e.g., `useAuth.js`, `formatDate.js`)
- Pages: PascalCase (e.g., `Dashboard.jsx`)

---

## Backend (`/api`)

Vercel Serverless Functions. Each file becomes an API endpoint.

```
api/
├── hello.js                  # Sample endpoint (GET /api/hello)
├── houses.js                 # Property CRUD (GET/POST/PUT/DELETE /api/houses)
├── beds.js                   # Bed management (GET/POST/PUT/DELETE /api/beds)
├── tenants.js                # Tenant CRUD (GET/POST/PUT/DELETE /api/tenants)
├── forms.js                  # Form submissions (POST /api/forms)
├── auth.js                   # Authentication helpers (POST /api/auth/login)
└── google-sheets.js          # Google Sheets sync (POST /api/google-sheets)
```

**Endpoint Pattern:**
```javascript
// api/houses.js → https://housing-dashboard.vercel.app/api/houses

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Handle request methods
  if (req.method === 'GET') {
    // Fetch houses from Supabase
    return res.status(200).json({ houses: [] });
  }

  if (req.method === 'POST') {
    // Create new house
    return res.status(201).json({ message: 'House created' });
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
```

**Environment Variables:**
- Frontend vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Backend vars: `GOOGLE_SERVICE_ACCOUNT_JSON`, `SQUARE_ACCESS_TOKEN`

---

## Static Assets (`/public`)

Files served directly without processing.

```
public/
├── images/                   # Image files
│   ├── logo.png              # App logo
│   └── placeholder.png       # Placeholder images
├── favicon.ico               # Browser favicon
└── robots.txt                # SEO robots file
```

**Usage:**
```jsx
// In React components, reference with /
<img src="/images/logo.png" alt="Logo" />
```

---

## Documentation (`/docs`)

All project documentation organized by category.

```
docs/
├── schemas/                  # Database schemas and mappings
│   └── field-mapping.md      # Form field → DB column mapping
├── deployment/               # Deployment guides
│   └── vercel-setup.md       # Vercel deployment instructions
├── architecture/             # Architecture documentation
│   └── directory-structure.md # This file
└── planning/                 # Project planning documents
    └── raw-forms-info.md     # Original form data (archived)
```

---

## Prototype (`/prototype`)

Static HTML/CSS/JS prototype from Phase 1 (requirements gathering).

```
prototype/
├── index.html                # Dashboard page
├── properties.html           # Properties page
├── tenants.html              # Tenants page
├── intake-form.html          # Intake form page
├── css/
│   └── styles.css            # Prototype styles
└── js/
    └── data.js               # Fake data for prototype
```

**Note:** The prototype was used for client demos in Phase 1. The production app is now being built in `/src`.

---

## Configuration Files

### `package.json`
Single package.json for both frontend and backend. Contains all dependencies and scripts.

**Scripts:**
- `npm run dev` - Start Vite dev server (frontend only)
- `npm run build` - Build production bundle (frontend)
- `npm run preview` - Preview production build locally

**Dependencies:**
- `react`, `react-dom` - Frontend framework
- `react-router-dom` - Client-side routing
- `tailwindcss` - CSS framework
- `vite` - Build tool

---

### `vite.config.js`
Vite build configuration.

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

---

### `vercel.json`
Vercel deployment configuration.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Purpose:** Routes all requests to `index.html` for client-side routing (React Router).

---

### `tailwind.config.js`
Tailwind CSS configuration with custom purple/pink theme.

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        purple: { /* custom purple shades */ },
        pink: { /* custom pink shades */ }
      }
    }
  }
}
```

---

## Build Output

### Development
```
npm run dev
→ Vite dev server at http://localhost:3000
→ Hot module replacement (HMR) enabled
→ API routes NOT available locally (only on Vercel)
```

### Production Build
```
npm run build
→ Output: ./dist folder
  ├── index.html            # Entry HTML
  ├── assets/
  │   ├── index-[hash].js   # Bundled JavaScript
  │   └── index-[hash].css  # Bundled CSS
```

**Deployed Structure (Vercel):**
```
https://housing-dashboard.vercel.app/
├── /                       # Frontend (from /dist)
├── /api/hello              # Serverless function (from /api/hello.js)
├── /api/houses             # Serverless function (from /api/houses.js)
└── /api/tenants            # Serverless function (from /api/tenants.js)
```

---

## File Naming Conventions

### React Components
- **PascalCase** for component files: `DashboardCard.jsx`
- **camelCase** for utility files: `formatDate.js`
- **kebab-case** for CSS files: `dashboard-card.css` (if using CSS modules)

### API Routes
- **kebab-case** for multi-word endpoints: `google-sheets.js`
- **camelCase** for single-word endpoints: `tenants.js`

### Documentation
- **kebab-case** for all docs: `field-mapping.md`, `directory-structure.md`

---

## Environment Variables

### Frontend (Client-Side)
**Prefix:** `VITE_` (required by Vite)

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

**Access:**
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

---

### Backend (Server-Side)
**No prefix required** (only accessible in `/api` functions)

```bash
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
SQUARE_ACCESS_TOKEN=EAAAl...
```

**Access:**
```javascript
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
```

---

## Deployment Workflow

### Development
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```
→ Vercel creates preview URL: `https://housing-dashboard-git-feature-new-feature.vercel.app`

### Production
```bash
git checkout main
git merge feature/new-feature
git push origin main
```
→ Vercel deploys to production: `https://housing-dashboard.vercel.app`

---

## Future Enhancements

### Potential Structure Changes
- `/shared` folder for code used by both frontend and backend
- `/tests` folder for unit and integration tests
- `/.github/workflows` for CI/CD pipelines
- `/scripts` for build and deployment scripts

---

## References

- [Vite Documentation](https://vite.dev/)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
