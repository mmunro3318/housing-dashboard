# Housing Dashboard - HTML Prototype

This is a clickable HTML prototype for the Halfway Housing Management Dashboard.

## Purpose

This prototype demonstrates the future workflow and user interface for the housing manager. It uses **fake data only** - no real tenant information is included.

## How to View

Simply open `index.html` in your web browser. No server required!

**Recommended**: Use Chrome, Firefox, or Edge for best experience.

## Pages Included

1. **Dashboard (index.html)** - Main overview with metrics, property summary, and alerts
2. **Properties (properties.html)** - View all properties with bed-by-bed status
3. **Tenants (tenants.html)** - Searchable/filterable list of all tenants
4. **Intake Form (intake-form.html)** - Mobile-friendly self-service form for new tenants

## Key Features Demonstrated

### Dashboard
- Real-time metrics (total beds, occupancy rate, available beds)
- Properties overview table
- Upcoming voucher expirations (alert system)
- Available beds quick-view

### Properties Page
- Property cards with occupancy stats
- Color-coded bed status visualization
  - **Green**: Available
  - **Gray**: Occupied
  - **Yellow**: Pending
  - **Red**: On Hold
- Click beds to view tenant details

### Tenants Page
- Search by name or DOC number
- Filter by payment type
- Filter by status (current/all/exited)
- Shows bed assignment and balance owed

### Intake Form
- Mobile-responsive design
- Conditional fields (voucher dates only show if voucher selected)
- Form validation
- Success confirmation

## Data

All data is stored in `js/data.js` and includes:
- 4 fake properties (Seattle addresses)
- 40 fake beds across all properties
- 25 current fake tenants
- Realistic payment types, dates, and amounts

## Technologies Used

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- No backend required (static prototype)

## Notes for Sunday Demo

### What to Show
1. **Start with Dashboard** - Explain the high-level metrics
2. **Click into Properties** - Show bed-by-bed visualization
3. **Open Tenants page** - Demonstrate search and filtering
4. **Show Intake Form on phone** - Demonstrate mobile responsiveness

### Questions to Ask Manager
1. Does this layout make sense?
2. What information is missing from the views?
3. Is the bed status system clear?
4. Would the intake form work for your tenants?
5. What other reports would you need?

### What This Prototype Doesn't Do (Yet)
- No actual data editing (buttons are placeholders)
- No real authentication
- No database connection
- No automated email notifications
- No PDF report generation

These features will be built in the actual development phase!

## Next Steps After Demo

1. Gather feedback from manager
2. Refine requirements and priorities
3. Build real backend with database
4. Implement full CRUD functionality
5. Add real authentication
6. Deploy to production

---

**Created**: October 17, 2025
**For**: Sunday demo with housing manager
