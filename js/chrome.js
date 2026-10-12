/* ──────────────────────────────────────────────────────────────────────────
   Shared chrome for the standalone pages.

   index.html is a single-page app: it owns styles.css, the bar, the role and
   language popovers, and the filterable site index, and every one of those is
   wired to functions that live in app.js. The other eighteen documents on this
   site are ordinary pages. Until now each carried its own inline <style> block
   and loaded no shared stylesheet at all, so they shared no tokens with the
   redesign: changing --bg or --ink-red reached exactly one page.

   This file is the part of the chrome that can work without app.js. It does
   four things and deliberately no more:

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
     4. Share bars, wherever a page marks one with [data-share-bar].

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

    /* The bar draws its rule only once it is actually stuck, so a page keeps a
       clean top edge until something scrolls under it. This was markStuckBar()
       in app.js and therefore index.html only; it lives here so it applies to
       whichever bar a page ends up with -- the one injected below, or the one
       try.html brings itself. The test is on the bar's own rect rather than
       scrollY, which is what makes it correct on a page whose bar is not the
       first thing in the document. */
    function wireStuck(bar) {
        var f = function () { bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= 0); };
        f();
        window.addEventListener('scroll', f, { passive: true });
    }

    function buildBar() {
        var body = document.body;
        /* header.bar, not .bar: the walkthrough decks carry a 4px progress
           indicator that was also called .bar, and a bare class selector
           would have wired the stuck-hairline handler to it. */
        var existing = document.querySelector('header.bar');
        if (existing) { wireStuck(existing); return; }   /* page has its own */
        if (!body || !body.hasAttribute('data-jv-chrome')) return;

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
        wireStuck(bar);
    }

    /* 4. Share bars. A page marks where one goes with [data-share-bar]. The
       blog's static post pages write their links into the markup, so they
       work without this file; an empty marker is filled here from the page's
       own canonical URL and og:title, so the link shared is the one that
       previews with the page's card. Either way this adds Copy link, and the
       phone's own share sheet where the browser offers one. */
    function meta(sel, attr) {
        var el = document.querySelector(sel);
        return el ? el.getAttribute(attr) : '';
    }

    function shareLink(label, href) {
        var a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = label;
        return a;
    }

    function buildShareBars() {
        var bars = document.querySelectorAll('[data-share-bar]');
        if (!bars.length) return;
        var url = meta('link[rel="canonical"]', 'href') || location.href.split('#')[0];
        var title = meta('meta[property="og:title"]', 'content') || document.title;
        var e = encodeURIComponent;
        Array.prototype.forEach.call(bars, function (bar) {
            bar.classList.add('jv-share');
            if (!bar.querySelector('a')) {
                var label = document.createElement('span');
                label.className = 'jv-share-label';
                label.textContent = 'Share';
                bar.appendChild(label);
                bar.appendChild(shareLink('WhatsApp', 'https://wa.me/?text=' + e(title + '\n' + url)));
                bar.appendChild(shareLink('X', 'https://twitter.com/intent/tweet?text=' + e(title) + '&url=' + e(url)));
                bar.appendChild(shareLink('LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + e(url)));
                bar.appendChild(shareLink('Telegram', 'https://t.me/share/url?url=' + e(url) + '&text=' + e(title)));
                var mail = shareLink('Email', 'mailto:?subject=' + e(title) + '&body=' + e(url));
                mail.removeAttribute('target');
                bar.appendChild(mail);
            }
            var copy = document.createElement('button');
            copy.type = 'button';
            copy.textContent = 'Copy link';
            copy.addEventListener('click', function () {
                var done = function () { copy.textContent = 'Link copied'; setTimeout(function () { copy.textContent = 'Copy link'; }, 2000); };
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link', url); });
                } else {
                    window.prompt('Copy this link', url);
                }
            });
            bar.appendChild(copy);
            if (navigator.share) {
                var more = document.createElement('button');
                more.type = 'button';
                more.textContent = 'More\u2026';
                more.setAttribute('aria-label', 'Share using another app');
                more.addEventListener('click', function () {
                    navigator.share({ title: title, url: url }).catch(function () {});
                });
                bar.appendChild(more);
            }
        });
    }

    function ready() {
        buildBar();
        buildShareBars();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        ready();
    }
})();
