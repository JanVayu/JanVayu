# Adding a New Panel

JanVayu uses HTML `<template>` elements for panel content. Each panel is loaded on demand when the user navigates to it.

---

## Step-by-Step

### 1. Create the template

Add a new `<template>` element in `index.html`:

```html
<template id="tmpl-your-panel">
    <div class="section-intro">
        <h2><span class="si si-your-icon"></span> Panel Title</h2>
        <p data-simple="Plain language description.">
            Technical description of this panel.
        </p>
    </div>
    <!-- Your content here -->
</template>
```

### 2. Add navigation link

In `<nav class="section-nav">`, add under the appropriate dropdown:

```html
<button class="nav-dropdown-link" data-panel="your-panel">Your Panel</button>
```

### 3. Add mobile navigation link

```html
<button class="mobile-nav-item" data-panel="your-panel">Your Panel</button>
```

### 4. Add simple language text

Add `data-simple="..."` to all `<p>` tags with technical content.

### 5. Add to role configs (optional)

```javascript
parent: {
    panels: [
        { panel: 'your-panel', title: 'Panel Title', desc: 'Short description' },
    ]
}
```

---

## Common Patterns

### Stat Strip
```html
<div class="stat-strip">
    <div class="stat-strip-item">
        <div class="number-callout" style="color: #EF4444;">169K</div>
        <div class="stat-label">Description</div>
    </div>
</div>
```

### Card
```html
<div class="card mb-2">
    <div class="card-header"><span class="card-title">Title</span></div>
    <div class="card-body">Content</div>
    <div class="card-footer">Source: ...</div>
</div>
```

### Info Box
```html
<div class="info-box" style="border-left: 3px solid var(--accent);">
    <h4>Heading</h4>
    <p>Content</p>
</div>
```

---

## Icons

JanVayu uses [Sargam Icons](https://sargamicons.com/) v1.6.7. Use `<span class="si si-icon-name"></span>`.
