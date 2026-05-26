#!/usr/bin/env node
// Generates sitemap.xml with accurate lastmod dates from git history.
// Usage: node scripts/build-sitemap.mjs

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SITE = "https://www.janvayu.in";

// Each entry: [urlPath, filePath, changefreq, priority, hreflangAlternates]
const PAGES = [
  {
    url: "/",
    file: "index.html",
    changefreq: "daily",
    priority: "1.0",
    alternates: [
      { lang: "en", href: `${SITE}/` },
      { lang: "hi", href: `${SITE}/?lang=hi` },
      { lang: "ta", href: `${SITE}/?lang=ta` },
      { lang: "mr", href: `${SITE}/?lang=mr` },
      { lang: "bn", href: `${SITE}/?lang=bn` },
      { lang: "x-default", href: `${SITE}/` },
    ],
  },
  { url: "/ask/", file: "ask/index.html", changefreq: "weekly", priority: "0.8" },
  { url: "/blog/", file: "blog/index.html", changefreq: "weekly", priority: "0.7" },
  { url: "/pm25/", file: "pm25/index.html", changefreq: "daily", priority: "0.9" },
  { url: "/pm10/", file: "pm10/index.html", changefreq: "daily", priority: "0.9" },
  { url: "/co/", file: "co/index.html", changefreq: "daily", priority: "0.85" },
  { url: "/no2/", file: "no2/index.html", changefreq: "daily", priority: "0.85" },
  { url: "/so2/", file: "so2/index.html", changefreq: "daily", priority: "0.85" },
  { url: "/o3/", file: "o3/index.html", changefreq: "daily", priority: "0.85" },
];

function getLastModified(filePath) {
  try {
    const result = execSync(
      `git log -1 --format='%aI' -- "${filePath}"`,
      { cwd: ROOT, encoding: "utf-8" }
    ).trim();
    if (result) return result;
  } catch {
    // fall through
  }
  // Fallback: today's date in IST
  return new Date().toISOString().slice(0, 10);
}

function buildSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const page of PAGES) {
    const lastmod = getLastModified(page.file);
    xml += `  <url>\n`;
    xml += `    <loc>${SITE}${page.url}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    if (page.alternates) {
      for (const alt of page.alternates) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />\n`;
      }
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

const sitemap = buildSitemap();
const outPath = resolve(ROOT, "sitemap.xml");
writeFileSync(outPath, sitemap, "utf-8");
console.log(`sitemap.xml written (${PAGES.length} URLs)`);
