/* ──────────────────────────────────────────────────────────────────────────
   Shared chrome for the standalone pages.

   index.html is a single-page app: it owns styles.css, the bar, the role and
   language popovers, and the filterable site index, and every one of those is
   wired to functions that live in app.js. The other eighteen documents on this
   site are ordinary pages. Until now each carried its own inline <style> block
   and loaded no shared stylesheet at all, so they shared no tokens with the
   redesign: changing --bg or --ink-red reached exactly one page.

   This file is the part of the chrome that can work without app.js. It does
   three things and deliberately no more:

     1. Theme.  The site had no theme persistence at all -- toggleTheme() set
        an attribute and the choice died on the next navigation. That was
        survivable while one page had a toggle. With a toggle on nineteen, a
        reader who picks dark and clicks through to /pm25/ would land in light
        again, so the choice is stored here and read back by every page.
     2. The bar.  A cut-down version of index.html's: the mark, a theme
        toggle, and a link into the site index. It deliberately omits the role,
        language and simple-mode controls, because each of those needs app.js
        and a bar advertising a control that does nothing is worse than a bar
        without it.
     3. The stuck hairline, matching index.html's markStuckBar().

   A page opts in with data-jv-chrome on <body>. Embeds do not opt in: they are
   iframed into other people's pages, where our bar would be an intrusion.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
    'use strict';

    var KEY = 'janvayu-theme';

    function read() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    }

    /* Exported because app.js's toggleTheme() calls it. Storage can throw in a
       private window or with site data blocked, and a theme toggle that throws
       is worse than one that forgets, so the write is guarded and the visual
       change happens first regardless. */
    function setTheme(theme) {
        apply(theme);
        try { localStorage.setItem(KEY, theme === 'dark' ? 'dark' : 'light'); } catch (e) {}
    }

    function toggleTheme() {
        setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }

    window.JV_setTheme = setTheme;
    window.JV_toggleTheme = toggleTheme;

    /* The inline snippet in each page's <head> applies the stored theme before
       first paint, so this is only a safety net for a page that forgot it. */
    if (read() === 'dark') apply('dark');

    function buildBar() {
        var body = document.body;
        if (!body || !body.hasAttribute('data-jv-chrome')) return;
        if (document.querySelector('.bar')) return;   /* page has its own */

        var bar = document.createElement('header');
        bar.className = 'bar container';

        var mark = document.createElement('a');
        mark.className = 'mark';
        mark.href = '/';
        mark.appendChild(document.createTextNode('Jan'));
        var span = document.createElement('span');
        span.textContent = 'Vayu';
        mark.appendChild(span);
        bar.appendChild(mark);

        var right = document.createElement('div');
        right.className = 'right';

        var theme = document.createElement('button');
        theme.type = 'button';
        theme.className = 'ctl';
        theme.id = 'ctlTheme';
        theme.setAttribute('aria-label', 'Switch between light and dark');
        theme.textContent = 'Theme';
        theme.addEventListener('click', toggleTheme);
        right.appendChild(theme);

        /* index.html builds the site index from its own markup and opens it
           through app.js, so a standalone page cannot show it in place. The
           link carries #index and app.js opens the index on arrival. */
        var index = document.createElement('a');
        index.className = 'ctl';
        index.href = '/#index';
        index.textContent = 'Index';
        right.appendChild(index);

        bar.appendChild(right);
        body.insertBefore(bar, body.firstChild);

        /* Same contract as markStuckBar() in app.js: the hairline appears only
           once the bar has something scrolled underneath it. */
        var mark_ = function () { bar.classList.toggle('is-stuck', window.scrollY > 4); };
        mark_();
        window.addEventListener('scroll', mark_, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildBar);
    } else {
        buildBar();
    }
})();
