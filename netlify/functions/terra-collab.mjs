// Netlify Function: Terra.Do × JanVayu collaborator workspace state
//
// Backs the editable tracker on /TerraStudioCollab/. Stores task statuses,
// notes, deliverable submissions, and an activity log in Netlify Blobs.
//
// Auth: every request must carry X-Collab-Secret matching env
// TERRA_COLLAB_SECRET (which is the same string as the page-unlock password).
// If the env var is unset, the function returns 503 with a clear message —
// nothing else hits the blob store.
//
// Endpoints (single function, dispatched by method + body.action):
//   GET                                  → return full state
//   POST { action: "task", taskId, status, note?, by? }
//   POST { action: "deliverable", sow, phase, title, url?, notes?, by? }
//
// State shape:
//   { tasks: { [id]: { status, note, by, at } },
//     deliverables: [ { sow, phase, title, url, notes, by, at } ],
//     log: [ { type, ..., at } ] }   // capped at 200

import { Resend } from "resend";
import { getStore } from "@netlify/blobs";

const SECRET = process.env.TERRA_COLLAB_SECRET || "";
const STORE_NAME = "janvayu-feeds";
const STATE_KEY = "terra-collab/state.json";
const TO_EMAIL = process.env.WORKSHOP_INBOX_EMAIL || "contribute@janvayu.in";
const FROM_EMAIL = process.env.RESEND_FROM || "JanVayu <alerts@janvayu.in>";

// 8 weeks × 2 SOWs = 16 trackable cells. Labels mirror the Gantt on the page.
const TASKS = {
  s1w1: { sow: 1, week: 1, label: "Try it, find where it breaks" },
  s1w2: { sow: 1, week: 2, label: "Pick test questions" },
  s1w3: { sow: 1, week: 3, label: "List sources to look up" },
  s1w4: { sow: 1, week: 4, label: "Sketch how it should look things up" },
  s1w5: { sow: 1, week: 5, label: "Refusals: medical & political" },
  s1w6: { sow: 1, week: 6, label: "Refusals: numbers & framing" },
  s1w7: { sow: 1, week: 7, label: "Re-test" },
  s1w8: { sow: 1, week: 8, label: "Blog post" },
  s2w1: { sow: 2, week: 1, label: "Get ward maps + station list" },
  s2w2: { sow: 2, week: 2, label: "Map gaps in coverage" },
  s2w3: { sow: 2, week: 3, label: "Fill gaps (simple way)" },
  s2w4: { sow: 2, week: 4, label: "Fill gaps (better way) + sanity check" },
  s2w5: { sow: 2, week: 5, label: "Write the report template" },
  s2w6: { sow: 2, week: 6, label: "First 5 sample reports" },
  s2w7: { sow: 2, week: 7, label: "Publish 8-10 wards" },
  s2w8: { sow: 2, week: 8, label: "Blog post" },
};
const STATUSES = new Set(["todo", "wip", "done"]);

function getBlobStore() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name: STORE_NAME, siteID, token, consistency: "strong" });
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

async function loadState() {
  try {
    const store = getBlobStore();
    const s = await store.get(STATE_KEY, { type: "json" });
    if (s && typeof s === "object") return s;
  } catch (e) { console.log("loadState fallback:", e.message); }
  return { tasks: {}, deliverables: [], log: [] };
}

async function saveState(state) {
  const store = getBlobStore();
  await store.setJSON(STATE_KEY, state);
}

function authed(req) {
  if (!SECRET) return false;
  const provided = req.headers.get("x-collab-secret") || "";
  // Constant-time compare for short strings.
  if (provided.length !== SECRET.length) return false;
  let diff = 0;
  for (let i = 0; i < SECRET.length; i++) diff |= provided.charCodeAt(i) ^ SECRET.charCodeAt(i);
  return diff === 0;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function clean(s, max = 2000) {
  return String(s ?? "").trim().slice(0, max);
}

async function emailDeliverable(entry) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const subject = `Terra.Do collab — SOW ${entry.sow} / Phase ${entry.phase}: ${entry.title}`.slice(0, 200);
    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 560px;">
        <h2 style="font-size: 16px; margin: 0 0 12px;">${escapeHtml(subject)}</h2>
        <table style="font-size: 13px; border-collapse: collapse;">
          <tr><td style="padding: 4px 12px 4px 0; color: #475569;">From</td><td>${escapeHtml(entry.by || "anonymous")}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #475569;">SOW / Phase</td><td>SOW ${entry.sow} &middot; Phase ${entry.phase}</td></tr>
          ${entry.url ? `<tr><td style="padding: 4px 12px 4px 0; color: #475569;">Link</td><td><a href="${escapeHtml(entry.url)}">${escapeHtml(entry.url)}</a></td></tr>` : ""}
          ${entry.notes ? `<tr><td style="padding: 4px 12px 4px 0; color: #475569; vertical-align: top;">Notes</td><td>${escapeHtml(entry.notes).replace(/\n/g, "<br>")}</td></tr>` : ""}
        </table>
        <p style="margin: 18px 0 0; font-size: 12px; color: #64748B;">
          <a href="https://www.janvayu.in/TerraStudioCollab/">Open workspace</a> &middot; submitted ${entry.at}
        </p>
      </div>`;
    const text = `SOW ${entry.sow} / Phase ${entry.phase}: ${entry.title}
From: ${entry.by || "anonymous"}
${entry.url ? `Link: ${entry.url}\n` : ""}${entry.notes ? `Notes: ${entry.notes}\n` : ""}
https://www.janvayu.in/TerraStudioCollab/`;
    await resend.emails.send({ from: FROM_EMAIL, to: TO_EMAIL, subject, html, text });
  } catch (e) { console.log("Resend error:", e.message); }
}

export default async function handler(req) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Collab-Secret",
    "Content-Type": "application/json",
  };
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers });

  if (!SECRET) {
    return new Response(JSON.stringify({
      error: "TERRA_COLLAB_SECRET env var not set on Netlify. Configure it (same value as the page-unlock password) to enable the tracker."
    }), { status: 503, headers });
  }
  if (!authed(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
  }

  if (req.method === "GET") {
    const state = await loadState();
    return new Response(JSON.stringify(state), { status: 200, headers });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "invalid JSON" }), { status: 400, headers }); }
    const state = await loadState();
    const at = new Date().toISOString();

    if (body.action === "task") {
      const taskId = String(body.taskId || "");
      const status = String(body.status || "");
      if (!TASKS[taskId]) return new Response(JSON.stringify({ error: "unknown taskId" }), { status: 400, headers });
      if (!STATUSES.has(status)) return new Response(JSON.stringify({ error: "invalid status" }), { status: 400, headers });
      const note = clean(body.note, 500);
      const by = clean(body.by, 60);
      state.tasks[taskId] = { status, note, by, at };
      state.log.unshift({ type: "task", taskId, label: TASKS[taskId].label, status, by, at });
      state.log = state.log.slice(0, 200);
      await saveState(state);
      return new Response(JSON.stringify({ ok: true, state }), { status: 200, headers });
    }

    if (body.action === "deliverable") {
      const sow = Number(body.sow);
      const phase = Number(body.phase);
      const title = clean(body.title, 200);
      if (!(sow === 1 || sow === 2)) return new Response(JSON.stringify({ error: "sow must be 1 or 2" }), { status: 400, headers });
      if (!(phase >= 1 && phase <= 4)) return new Response(JSON.stringify({ error: "phase must be 1-4" }), { status: 400, headers });
      if (!title) return new Response(JSON.stringify({ error: "title required" }), { status: 400, headers });
      const entry = {
        sow, phase, title,
        url: clean(body.url, 1000),
        notes: clean(body.notes, 2000),
        by: clean(body.by, 60),
        at,
      };
      state.deliverables.unshift(entry);
      state.deliverables = state.deliverables.slice(0, 100);
      state.log.unshift({ type: "deliverable", sow, phase, title: entry.title, by: entry.by, at });
      state.log = state.log.slice(0, 200);
      await saveState(state);
      // Email is best-effort, non-blocking on the response semantics.
      await emailDeliverable(entry);
      return new Response(JSON.stringify({ ok: true, state }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: "unknown action" }), { status: 400, headers });
  }

  return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405, headers });
}
