# Role-Based Landing Experience

JanVayu's role selector helps visitors find the most relevant data, tools, and actions based on who they are. Instead of presenting the full 36+ panel dashboard to everyone, the platform guides each visitor to a curated subset.

## How It Works

### First Visit

**A first visit shows the air, not a questionnaire.** Until 18 September 2026 a
full-screen overlay opened over the homepage before anything else, so a new
visitor met a twelve-option persona picker between them and the reading they had
come for. It no longer opens by itself. Somebody arriving from a shared link
gets the live PM2.5 figure, and the role stays available as a choice rather than
a toll.

The roles are reachable two ways, both from the header:

- **The role switcher** lists all twelve plus "Show Everything", whether or not
  a role has been set. One tap, no intermediate screen.
- **"What these roles mean"**, the last entry in that switcher, opens the full
  chooser below, which carries a sentence of explanation per role that the
  dropdown has no room for.

A hint points at the switcher once per session for a visitor who has not chosen
a role, which is how an optional feature should announce itself.

The chooser presents twelve role cards:

| Role | Key | Example Action |
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

A "Skip — show me everything" option closes the chooser without setting a role,
and is also the "Show Everything" entry in the header switcher.

### Role Dashboard

After selecting a role, the visitor sees a curated dashboard with:

- **3 action cards** — high-priority tools with direct CTAs (e.g. "Check now →", "Calculate risk →")
- **6 recommended panels** — the most relevant sections from JanVayu's full panel library
- An "Explore everything" button to access the complete dashboard

### Role Switcher (Header)

A role switcher button is always visible in the header, next to the language selector and theme toggle. It shows:

- **Before selection**: A generic "Role" label with a user icon
- **After selection**: The selected role's Sargam icon and short label (e.g. "Parent")

Clicking it opens a dropdown with all 10 roles plus "Show Everything". After first selection, a brief pulse animation and tooltip hint ("Change your role anytime here") draw attention to the switcher.

### Session Persistence

Role selection uses `sessionStorage`, meaning:

- The role persists while navigating within a tab session
- A new browser tab or revisit shows the overlay fresh
- Deep links (e.g. `janvayu.in/#health`) bypass the overlay entirely

## Configuration

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

### Adding a New Role

1. Add a new key to `ROLE_CONFIG` with `icon`, `label`, `heading`, `description`, `actions` (3), and `panels` (6)
2. Add a corresponding `<div class="role-card">` in the `#roleOverlay` HTML
3. Add a `data-i18n` attribute for translation support

### Icons

All role and action icons use [Sargam Icons](https://sargamicons.com/) v1.6.7 via CSS mask-image. Icons render as `<span class="si si-{name}"></span>` and inherit colour from their parent element. Available icons are defined as `.si-*` classes in the `<style>` block.

## Design Decisions

- **Why 10 roles?** Covers the primary audiences identified through user feedback — from concerned parents to policy researchers. Each gets a meaningfully different set of panels and actions.
- **Why sessionStorage over localStorage?** Every new visit is an opportunity to show the value proposition. Returning visitors within a session don't need to re-select.
- **Why not route-based?** JanVayu is a single `index.html` with hash-based navigation. Role selection is a UX layer on top, not a routing concern.
- **Why always show the role switcher?** Users who select "Parent" and then want to explore budget data shouldn't feel trapped. The always-visible switcher makes role changes effortless.
