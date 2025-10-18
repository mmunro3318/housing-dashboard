# Sunday Demo - Quick Start Guide

**Demo Date**: Sunday, October 20, 2025
**Audience**: Housing Manager (Client)
**Goal**: Validate assumptions, gather feedback, refine requirements

---

## Pre-Demo Checklist

### 30 Minutes Before
- [ ] Test all prototype pages in browser
- [ ] Have `SCHEMA_FOR_MANAGER.md` printed or ready to share
- [ ] Prepare notebook for taking feedback notes
- [ ] Charge phone (for mobile intake form demo)
- [ ] Close other browser tabs (clean demo environment)

### Files to Have Open
1. `prototype/index.html` - Start here
2. `SCHEMA_FOR_MANAGER.md` - Review together
3. Notebook/doc for capturing feedback

---

## Demo Script (20 minutes)

### Opening (2 min)

**Say this**:
> "I've created a clickable prototype to show you what the new system could look like. This uses fake data only - none of your real tenant information. Think of this as a preview of the future workflow. I want your honest feedback on what works, what doesn't, and what's missing."

### Dashboard Walkthrough (5 min)

**Open**: `prototype/index.html`

**Point out**:
1. **Top metrics**: "At a glance, you see total beds, how many are occupied, how many are available, and your occupancy rate."
2. **Properties table**: "Quick overview of all your properties with bed counts and occupancy."
3. **Voucher alerts**: "System automatically shows you which vouchers are expiring soon - no more manual tracking."
4. **Available beds**: "See open beds across all properties without searching through Excel."

**Ask**:
- "Does this give you the information you need to start your day?"
- "What's missing from this view?"

### Properties & Beds (5 min)

**Click**: "Properties" in navigation

**Point out**:
1. **Property cards**: "Each property shows its occupancy stats."
2. **Bed grid**: "Color-coded status - green is available, gray is occupied, yellow is pending."
3. **Click a bed**: Click an occupied bed to show tenant details popup

**Ask**:
- "Is this bed visualization clear? Does it make sense?"
- "What would you want to do when you click a bed?"
- "How do you currently track which room is which? Should we change the room numbering?"

### Tenant Management (5 min)

**Click**: "Tenants" in navigation

**Point out**:
1. **Search bar**: Type a name or DOC number
2. **Filters**: Show payment type and status filters
3. **Table data**: Point out bed assignment, payment info, balance

**Ask**:
- "Is this easier than searching through Excel?"
- "What other information do you need to see about each tenant?"
- "How often do you look up tenant information?"

### Intake Form (3 min)

**Click**: "Intake Form" in navigation

**If possible, open on phone**: Show mobile responsiveness

**Point out**:
1. **Simple fields**: "Tenants fill this out themselves"
2. **Payment type selector**: Change it to show voucher fields appearing
3. **Submit**: Fill out and submit to show success message

**Ask**:
- "Would your tenants be able to complete this form?"
- "Do they all have smartphones?"
- "What information is missing from this form?"

---

## Key Questions to Ask

### Data & Fields
1. **Property addresses**: "Your Excel uses numbers (1, 2, 3). Should we use actual street addresses?"
2. **Missing fields**: "Looking at this, what information do you track that isn't shown here?"
3. **Payment types**: "I see Private, Voucher, ERD, Family Support in your Excel. Are there others?"

### Workflow
4. **Daily routine**: "Walk me through your typical day. What do you check first?"
5. **Reports**: "What reports do you create most often? What's in them?"
6. **Contacts**: "Do you need to track case managers, CCOs, counselors, etc.?"

### Priorities
7. **Most important**: "If you could only have 3 features working, what would they be?"
8. **Nice to have**: "What features would be nice but aren't critical?"
9. **Alerts**: "Besides voucher expirations, what else should the system alert you about?"

### Technical
10. **Access**: "Will you only access this from your computer, or do you need it on your phone too?"
11. **Internet**: "Do you always have reliable internet access?"
12. **DOC integration**: "How do you currently find out when someone is being assigned to your properties?"

---

## Taking Notes

### What to Capture

**Positive Feedback**:
- What she likes
- What makes sense
- What would save her time

**Issues/Gaps**:
- Confusing layouts
- Missing information
- Wrong assumptions

**New Requirements**:
- Features she needs that aren't shown
- Different workflows than expected
- Additional data to track

**Priorities**:
- What must be in MVP
- What can wait until later
- What's not needed at all

---

## After the Demo

### Immediate Actions
1. **Thank her**: "This feedback is incredibly valuable."
2. **Set expectations**: "I'll refine the plan based on today and share an updated roadmap with you by [date]."
3. **Ask for Excel access**: "When we're ready to build, I'll need the actual Excel file to migrate the data."

### Monday Tasks
1. Review all feedback notes
2. Update PRODUCT_SPEC.md with:
   - Answers to open questions
   - New requirements discovered
   - Revised priorities
3. Create refined MVP scope
4. Email her a summary of what you heard and next steps

---

## Handling Common Questions

**"How much will this cost?"**
> "Let's first make sure we're building exactly what you need. Once we finalize the requirements, I can give you an accurate estimate."

**"When will it be ready?"**
> "For the basic version with property tracking, tenant management, and the intake form - probably 6-8 weeks of development. But let's confirm the scope first."

**"Can it do [X feature]?"**
> "Absolutely, we can add that. Let me note that down and we'll prioritize it along with the other features."

**"I don't understand the tech stuff"**
> "You don't need to! Your job is to tell me what you need to track and how you work. My job is to build it in a way that makes sense for you."

**"What if I need to change something later?"**
> "The system is flexible. We'll build the core features first, then add and adjust based on how you actually use it."

---

## Demo Tips

### Do
- ✅ Go slow, let her explore
- ✅ Ask open-ended questions
- ✅ Write down everything she says
- ✅ Show enthusiasm for her feedback
- ✅ Acknowledge when you don't know something

### Don't
- ❌ Rush through pages
- ❌ Get defensive about design choices
- ❌ Over-explain the technology
- ❌ Promise features on the spot without thinking
- ❌ Interrupt when she's thinking

---

## Emergency Troubleshooting

**"The prototype won't load"**
- Make sure you're opening `index.html` directly in browser (not trying to load from a server)
- Try a different browser (Chrome recommended)

**"Data looks weird"**
- Remind her it's fake data for demo purposes
- Focus on the layout and workflow, not the specific values

**"I can't click something"**
- Some buttons are placeholders (Edit, Delete, etc.)
- Explain: "In the real app, this would [do X]. For the demo, we focused on the main workflows."

---

## Post-Demo Follow-Up Email Template

```
Subject: Housing Dashboard - Demo Follow-Up

Hi [Manager Name],

Thanks so much for taking the time to review the prototype today! Your feedback was incredibly helpful.

Here's what I heard as your top priorities:
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

And here are the things you'd like to see added/changed:
- [Change 1]
- [Change 2]
- [Change 3]

Next steps:
- I'll refine the requirements based on your feedback
- I'll send you an updated project plan and timeline by [date]
- Once you approve, I'll start building the real system

Please let me know if I missed anything or misunderstood something from our conversation.

Looking forward to building this for you!

Best,
Michael
```

---

## Confidence Boosters

Remember:
- ✅ You've built a comprehensive spec and realistic prototype
- ✅ You've analyzed her data and understand the problem
- ✅ You have a clear development roadmap
- ✅ The prototype demonstrates real value

You're not selling her on an idea - you're showing her a solution to her current pain points.

**You've got this!** 🚀

---

**Good luck on Sunday!**
