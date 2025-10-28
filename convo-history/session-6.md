# Session 6 -- Basic Frontend Components

## User

Okay, we're ready to build out some basic frontend components.

We discussed possibly implementing TDD at this stage, so let's explore what that looks like. I have some experience using Jest and Vitest for basic unit tests, and even some DB connection/upload tests, but have never written tests for React or frontend components. I'm distantly aware of Playwright for testing frontend, and even using it for giving you, the AI model, visual access to the web page (expanding and leveraging your multi-modal capabilities). I want to minimize dependencies, so we should consider the bare minimum for building testing suites, if we choose to begin TDD now.

In `./docs/screenshots/` you'll find three screenshots of versions of our web page:

1. `prototype-screenshot.png` is a screenshot of the HTML prototype, and got a good response from the Client (but they wanted more purples).
2. `figma-screenshot.png` is a screenshot of the design I mocked up in Figma with more bubbly components and purples -- the Client really liked the aesthetic of this version.
3. `vercel-screenshot.png` is a screenshot of our current app as deployed on Vercel (the working app that the client can access through our url).

I'll continue to provide screenshots for you to review as we progress, unless we find a way to extend your capacity to view the page visually through other tools, libraries or MCP tools.

I'm thinking we'll tackle the first Epic for this sprint.

---

### Theme 1: Core Data Management

_Foundation for tracking properties, beds, and tenants_

#### Epic 1.1: Property & Bed Management

**Description**: Enable managers to track houses and individual bed availability

---

We may want to add some stories, and focus first on viewing the test data we uploaded (viewing and searching properties, tenants, and beds). Then we'll add update features (manager can change status of beds, add notes, vacate beds, etc.). Then we'll add features to create new properties and beds (likely a wizard for property insertion, allowing them to initial with N beds), and the ability to add beds to a current property (she's done this several times). So my current thoughts are to phase by intensive operation (view -> update -> create).

---

### User Stories with CRUD Phases

#### Phase 1: View (Read)

- As a manager, I want to view all properties at a glance so I can see my entire portfolio.
- As a manager, I want to view individual property details, including bed availability and status.
- As a manager, I want to view all tenants across various properties.
- As a manager, I want to search/filter properties, beds, and tenants for quick access.

#### Phase 2: Update

- As a manager, I want to update bed counts and room numbers so the system accurately reflects reality.
- As a manager, I want to change bed status to Available/Occupied/Pending/Hold for current assignment management.
- As a manager, I want to add and update notes on properties and beds for ongoing maintenance and special conditions.
- As a manager, I want to vacate beds when a tenant leaves so beds can be reassigned.

#### Phase 3: Create

- As a manager, I want to create new properties through a guided wizard that allows me to initialize properties with a specific number of beds.
- As a manager, I want to add beds to existing properties to expand capacity when needed.

#### Phase 4: Delete (optional if safe)

- As a manager, I want to delete properties and beds when they are no longer in use, following confirmation to prevent accidental loss.

---

We'll want to likely break these into tasks. The first story, just to view the properties, will require a lot of setup of the frontend components which we'll then iterate upon.
