# Adding a New Role

The role system is configured in the `ROLE_CONFIG` JavaScript object in `index.html`.

---

## Step-by-Step

### 1. Add to ROLE_CONFIG

```javascript
const ROLE_CONFIG = {
    yourRole: {
        icon: '<span class="si si-icon-name"></span>',
        label: 'Role Display Name',
        heading: 'A short, compelling heading for the dashboard',
        description: 'One sentence about what this role gets.',
        actions: [
            {
                icon: '<span class="si si-icon"></span>',
                panel: 'panel-id',
                title: 'Action card title',
                desc: 'What the user will find.',
                cta: 'Action text'
            },
            // 3 actions total
        ],
        panels: [
            { panel: 'panel-id', title: 'Panel Name', desc: 'Short description' },
            // 6 recommended panels
        ]
    }
};
```

### 2. Add the overlay card

```html
<div class="role-card" onclick="selectRole('yourRole')">
    <span class="role-card-icon"><span class="si si-icon-name"></span></span>
    <div class="role-card-title">Role Display Name</div>
    <div class="role-card-desc">A question this user might ask</div>
</div>
```

### 3. Add translation keys (optional)

Add `data-i18n` keys and corresponding entries in the translation JSON.

---

## Guidelines

- **3 actions** — Pick the 3 most impactful things this role can do
- **6 panels** — Recommend the most relevant panels
- **Heading** — Should be actionable and empowering
- **Description** — One sentence, concrete, mentions tools/data
- **Icon** — Choose from [Sargam Icons](https://sargamicons.com/)
