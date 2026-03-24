# Role-Based Landing Page

JanVayu serves diverse audiences — from parents checking if it's safe for their child to go outside, to researchers accessing datasets, to journalists tracking political accountability. The role-based landing page personalizes the experience for each user.

---

## How It Works

1. **First visit** — A full-screen overlay asks "How can we help you?" with 10 role cards
2. **Role selection** — User picks their role (or skips to see everything)
3. **Personalized dashboard** — Shows role-specific actions and recommended panels
4. **Persistent** — Role saved to `sessionStorage`, restored on return visits
5. **Switchable** — Role switcher icon in the header (rightmost icon) allows changing anytime

---

## 10 Roles

| Role | Icon | Key Question |
|------|------|-------------|
| Parent / Family | `si-home` | Is it safe for my child today? |
| Student | `si-book` | Learn, explore data, do projects |
| Researcher | `si-insights` | Access datasets & analysis |
| Policymaker | `si-building` | Track NCAP, budgets, outcomes |
| Journalist | `si-article` | Get story leads & data briefs |
| Citizen / Activist | `si-flag` | Take action, file RTIs, advocate |
| Doctor / Health Worker | `si-hospital` | Patient advisories & health data |
| Teacher | `si-library` | School safety & teaching resources |
| NGO / CSO | `si-globe` | Data-driven advocacy tools |
| Business Owner | `si-briefcase` | Economic impact & workplace safety |

---

## Role Configuration

Each role is defined in the `ROLE_CONFIG` object in `index.html` with:

```javascript
{
    icon: '<span class="si si-home"></span>',
    label: 'Parent / Family',
    heading: 'Protect your family from air pollution',
    description: 'Real-time safety checks, school closure info...',
    actions: [
        { icon, panel, title, desc, cta }  // 3 action cards
    ],
    panels: [
        { panel, title, desc }  // 6 recommended panels
    ]
}
```

---

## Adding a New Role

See [Adding a New Role](Adding-a-New-Role) for step-by-step instructions.

---

## Technical Details

- **Storage:** `sessionStorage` key `janvayu-role`
- **Overlay:** `#roleOverlay` element, hidden after first selection
- **Switcher:** `#roleSwitcher` in header, dropdown with all roles
- **Dashboard template:** `#tmpl-role-dashboard`
- **Tour:** Triggered after first role selection if tour hasn't been seen
