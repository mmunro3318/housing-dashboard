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
