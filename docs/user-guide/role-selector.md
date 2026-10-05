# Role-based views

JanVayu's role selector points visitors to the data, tools and actions most relevant to who they are. Instead of showing everyone the full dashboard of about 58 panels, it offers each visitor a smaller, chosen set.

## How it works

### First visit

A first visit shows the air and asks nothing first. Until 18 September 2026 a
full-screen overlay opened over the homepage before anything else, so a new
visitor had to get past a twelve-option picker to reach the reading they had
come for. It no longer opens by itself. Somebody arriving from a shared link
sees the live PM2.5 figure straight away, and choosing a role is optional.

The roles are reachable from the header. The role switcher lists all twelve plus
"Show Everything", whether or not a role has been set. It takes one tap and has
no intermediate screen, and each role has a one-line description beside it. The
old full-screen overlay (`#roleOverlay`) has been removed from the code.

A hint points at the switcher once per session for a visitor who has not chosen
a role.

The twelve roles:

| Role | Key | Example action |
|------|-----|----------------|
| Parent / Family | `parent` | "Should my child go outside?" |
| Student | `student` | "Explore historical AQI trends" |
| Researcher | `researcher` | "Access the data archive" |
| Policymaker | `policymaker` | "Track NCAP mission targets" |
| Journalist | `journalist` | "Generate an accountability brief" |
| Citizen / Activist | `activist` | "File an RTI request" |
| Doctor / Health Worker | `doctor` | "Health risk calculator" |
| Teacher | `teacher` | "Should school close today?" |
| NGO / CSO | `ngo` | "Generate an advocacy brief" |
| Business Owner | `business` | "See the economic impact" |
| Woman / Caregiver | `woman` | "Indoor cooking and maternal exposure" |
| Citizen | `citizen` | "What is my city doing about it?" |

The "Show Everything" entry in the header switcher clears the role and shows
the full dashboard.

### Role dashboard

After choosing a role, the visitor sees a curated dashboard with 3 action cards, which are high-priority tools with direct buttons (for example "Check now" or "Calculate risk"), and 6 recommended panels, the most relevant sections from the full set. An "Explore everything" button opens the complete dashboard.

### Role switcher (header)

A role switcher button is always visible in the header, next to the language selector and theme toggle. Before you choose, it shows a generic "Role" label with a user icon. Afterwards it shows the chosen role's Sargam icon and short label (for example "Parent").

Clicking it opens a dropdown with all 12 roles plus "Show Everything". After your first choice, a brief pulse and a tooltip ("Change your role anytime here") point you to the switcher.

### Remembering your role

Your choice is stored in the browser under the key `janvayu-role` (an older `sessionStorage` value is migrated once). It carries across tabs and return visits, so a returning visitor lands on data and not on a role screen. There is no overlay to show or skip, and deep links (for example `janvayu.in/#health`) go straight to their panel.

## Configuration (for developers)

All role definitions live in the `ROLE_CONFIG` object in `index.html`. Each role has:

```javascript
{
    icon: '<span class="si si-home"></span>',  // Sargam Icon HTML
    label: 'Parent / Family',
    heading: 'Protect your family from air pollution',
    description: 'Real-time safety checks, school closure info...',
    actions: [
        { icon: '...', panel: 'go-outside', title: '...', desc: '...', cta: 'Check now →' },
        // 3 action cards total
    ],
    panels: [
        { panel: 'children', title: "Children's Health", desc: '...' },
        // 6 recommended panels total
    ]
}
```

### Adding a new role

1. Add a new key to `ROLE_CONFIG` with `icon`, `label`, `heading`, `description`, `actions` (3), and `panels` (6)
2. No HTML change is needed: the role switcher is generated from `ROLE_CONFIG` into `#rolePopoverGrid` automatically
3. Add a `data-i18n` attribute so the role can be translated

### Icons

All role and action icons use [Sargam Icons](https://sargamicons.com/) v1.6.7 via CSS mask-image. Icons render as `<span class="si si-{name}"></span>` and inherit colour from their parent element. Available icons are defined as `.si-*` classes in the `<style>` block.

## Design decisions

There are 12 roles because that covers the main audiences identified through user feedback, from concerned parents to policy researchers, and each gets a different set of panels and actions.

The choice is kept in `localStorage` and not `sessionStorage`, because returning visitors should land on data and should not have to pick their role again. An older `sessionStorage` value is migrated once.

Role selection is not a route. JanVayu is a single `index.html` with hash-based routing, so a role is a layer on top and does not change the address.

The switcher is always visible so that someone who chose "Parent" and then wants budget data does not feel stuck.
