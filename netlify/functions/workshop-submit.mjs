// Netlify Function: Workshop & walkthrough submission handler
//
// Receives POST submissions from the two forms on the Workshops panel,
// emails them to contribute@janvayu.in via Resend, and stores a durable
// copy in the "janvayu-feeds" Netlify Blobs store under "workshops/".
//
// Forms:
//   - form-name = "workshop-request"      → request a workshop with Sharath / UrbanEmissions
//   - form-name = "walkthrough-booking"   → book a 1-hour JanVayu walkthrough
//
// Body: JSON OR x-www-form-urlencoded. Both are accepted. Netlify Forms is
// not used; the form submits to /.netlify/functions/workshop-submit.

import { Resend } from "resend";
import { getStore } from "@netlify/blobs";

const TO_EMAIL = process.env.WORKSHOP_INBOX_EMAIL || "contribute@janvayu.in";
const FROM_EMAIL = process.env.RESEND_FROM || "JanVayu <alerts@janvayu.in>";

function getBlobStore(name) {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.BLOB_TOKEN;
  if (siteID && token) return getStore({ name, siteID, token, consistency: "strong" });
  return getStore({ name, consistency: "strong" });
}

const FIELD_LABELS = {
  // workshop-request fields
  name: "Name",
  email: "Email",
  organisation: "Organisation / school",
  audience: "Audience",
  "group-size": "Group size",
  format: "Preferred format",
  city: "City",
  "preferred-dates": "Preferred dates",
  notes: "Notes",
  // walkthrough-booking fields
  "group-context": "Group context",
  attendees: "Approx. attendees",
  "slot-1": "Slot 1",
  "slot-2": "Slot 2",
  "slot-3": "Slot 3",
  language: "Language preference",
  goals: "Learning goals",
};

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function buildEmail(formName, fields) {
  const isWorkshop = formName === "workshop-request";
  const heading = isWorkshop ? "New workshop request — UrbanEmissions" : "New JanVayu walkthrough booking";

  const subjectBits = [];
  if (fields.name) subjectBits.push(fields.name.trim());
  if (fields.organisation) subjectBits.push(fields.organisation.trim());
  if (fields["group-size"]) subjectBits.push(fields["group-size"].trim());
  if (fields.attendees) subjectBits.push(fields.attendees.trim() + " attendees");
  if (fields.city) subjectBits.push(fields.city.trim());
  const subject = (isWorkshop ? "Workshop request" : "Walkthrough booking") +
    (subjectBits.length ? ` — ${subjectBits.slice(0, 2).join(", ")}` : "");

  const rows = Object.entries(fields)
    .filter(([k, v]) => k !== "form-name" && k !== "bot-field" && v && String(v).trim() !== "")
    .map(([k, v]) => `
      <tr>
        <td style="padding: 6px 12px 6px 0; color: #475569; font-size: 13px; vertical-align: top; white-space: nowrap;">${escapeHtml(FIELD_LABELS[k] || k)}</td>
        <td style="padding: 6px 0; font-size: 14px; color: #0F172A;">${escapeHtml(v).replace(/\n/g, "<br>")}</td>
      </tr>`).join("");

  const html = `<!DOCTYPE html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #F8FAFC; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden;">
    <div style="padding: 18px 22px; background: #1B6B4A; color: #fff;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.85;">JanVayu — AirQuality for Janhit</div>
      <div style="font-size: 18px; font-weight: 600; margin-top: 4px;">${escapeHtml(heading)}</div>
    </div>
    <div style="padding: 22px;">
      <table style="border-collapse: collapse; width: 100%;">${rows}</table>
      <div style="margin-top: 22px; padding: 12px; background: #F8FAFC; border-left: 3px solid #1B6B4A; font-size: 13px; color: #475569; line-height: 1.5;">
        ${isWorkshop
          ? "Triage and forward to Sharath (UrbanEmissions). Aim to acknowledge within 3 working days."
          : "Confirm one of the three preferred slots and reply with a Google Meet link. Aim to confirm within 2 working days."}
      </div>
      <div style="margin-top: 18px; font-size: 12px; color: #94A3B8;">
        Submitted via <a href="https://www.janvayu.in/#workshops" style="color: #1B6B4A;">www.janvayu.in/#workshops</a> at ${new Date().toUTCString()}.
        Reply to this email and the recipient will see your message in their inbox alongside the form data.
      </div>
    </div>
  </div>
</body></html>`;

  // Plain-text fallback
  const text = Object.entries(fields)
    .filter(([k, v]) => k !== "form-name" && k !== "bot-field" && v && String(v).trim() !== "")
    .map(([k, v]) => `${FIELD_LABELS[k] || k}: ${v}`).join("\n");

  return { subject, html, text };
}

async function parseBody(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await req.json();
  }
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const obj = {};
    for (const [k, v] of formData.entries()) obj[k] = typeof v === "string" ? v : "";
    return obj;
  }
  // Best-effort: try JSON
  try { return JSON.parse(await req.text()); } catch { return {}; }
}

export default async function handler(req) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response("", { status: 204, headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "POST required" }), { status: 405, headers });

  const fields = await parseBody(req);
  const formName = fields["form-name"] || fields.form;

  // Honeypot — if the bot-field is populated, silently accept and discard.
  if (fields["bot-field"]) {
    return new Response(JSON.stringify({ ok: true, dropped: "honeypot" }), { status: 200, headers });
  }

  if (formName !== "workshop-request" && formName !== "walkthrough-booking") {
    return new Response(JSON.stringify({ error: "unknown form-name" }), { status: 400, headers });
  }
  if (!fields.name || !fields.email) {
    return new Response(JSON.stringify({ error: "name and email are required" }), { status: 400, headers });
  }

  // Durable record in Blobs (best-effort, non-blocking)
  try {
    const store = getBlobStore("janvayu-feeds");
    const key = `workshops/${formName}/${new Date().toISOString().replace(/[:.]/g, "-")}-${(fields.email || "anon").replace(/[^a-z0-9]/gi, "_")}.json`;
    await store.setJSON(key, { ...fields, _received_at: new Date().toISOString() });
  } catch (e) { console.log("Blobs write failed:", e.message); }

  // Email via Resend
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not set — submission stored only.");
    return new Response(JSON.stringify({ ok: true, stored: true, emailed: false }), { status: 200, headers });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { subject, html, text } = buildEmail(formName, fields);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: fields.email,
      subject,
      html,
      text,
    });
    return new Response(JSON.stringify({ ok: true, stored: true, emailed: true }), { status: 200, headers });
  } catch (e) {
    console.log("Resend error:", e.message);
    // Submission is durable in Blobs even if email fails. Return ok so the
    // user sees the success state; the team can audit Blobs if needed.
    return new Response(JSON.stringify({ ok: true, stored: true, emailed: false, error: e.message }), { status: 200, headers });
  }
}
