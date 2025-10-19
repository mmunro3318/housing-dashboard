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

## Running the Prototype

**Note:** This is a static HTML prototype for requirements gathering and client feedback. The production application will be built with React + Node.js.

To view the prototype locally:

1. Clone this repository
   ```bash
   git clone https://github.com/mmunro3318/housing-dashboard.git
   cd housing-dashboard
   ```

2. Open the prototype in your browser
   ```bash
   cd prototype
   # Then open index.html in your browser:
   # - Windows: start index.html
   # - macOS: open index.html
   # - Linux: xdg-open index.html
   ```

3. Navigate between pages:
   - **Dashboard** (`index.html`) - Overview metrics and alerts
   - **Properties** (`properties.html`) - Property and bed management
   - **Tenants** (`tenants.html`) - Searchable tenant list
   - **Intake Form** (`intake-form.html`) - Mobile-responsive tenant intake

The prototype uses fake data loaded from `prototype/js/data.js`.

## Contact

Project Lead: [Michael Munro](m.munro3318@gmail.com)

## License

[MIT License](LICENSE) (or other as appropriate)
