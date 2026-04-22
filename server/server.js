#!/usr/bin/env node
// server/server.js — zero-dep sink + viewer for browser-capability reports.
// Node 18+ (stdlib only).
//
// Endpoints:
//   POST   /api/report         -> store a JSON report (CORS enabled)
//   GET    /api/reports        -> list reports
//   GET    /api/reports/:id    -> fetch single report
//   DELETE /api/reports/:id    -> delete (viewer token required if set)
//   GET    /                   -> index UI
//   GET    /r/:id              -> single-report viewer
//   GET    /app/*, /registry/* -> static files from the parent repo (for viewer imports)
//   GET    /static/*           -> server/public/*
//
// Env:
//   PORT           default 8787
//   REPORT_TOKEN   if set, POST /api/report requires  Authorization: Bearer <token>
//   VIEWER_TOKEN   if set, DELETE + viewer pages require ?t=<token> or bearer
//   DATA_DIR       default ./server/data
//   MAX_BODY_KB    default 512

import http from "node:http";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(__dirname, "public");

const PORT = parseInt(process.env.PORT || "8787", 10);
const DATA_DIR = path.resolve(
  process.env.DATA_DIR || path.join(__dirname, "data"),
);
const REPORT_TOKEN = process.env.REPORT_TOKEN || "";
const VIEWER_TOKEN = process.env.VIEWER_TOKEN || "";
const MAX_BODY = (parseInt(process.env.MAX_BODY_KB || "512", 10)) * 1024;

await fs.mkdir(DATA_DIR, { recursive: true });

// ---- tiny token-bucket rate limiter (per ip) ---------------------------------
const buckets = new Map();
const RATE = { capacity: 30, refillPerSec: 1 };
function allow(ip) {
  const now = Date.now() / 1000;
  let b = buckets.get(ip);
  if (!b) {
    b = { tokens: RATE.capacity, ts: now };
    buckets.set(ip, b);
  }
  const elapsed = now - b.ts;
  b.tokens = Math.min(RATE.capacity, b.tokens + elapsed * RATE.refillPerSec);
  b.ts = now;
  if (b.tokens < 1) return false;
  b.tokens -= 1;
  return true;
}

// ---- helpers -----------------------------------------------------------------
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}
function sendText(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}
function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
}
function bearer(req) {
  const h = req.headers["authorization"] || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1].trim() : "";
}
function slugify(s, max = 40) {
  return (s || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max) || "anon";
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        req.destroy();
        reject(new Error("body too large"));
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
function safeJoin(base, rel) {
  const p = path.normalize(path.join(base, rel));
  if (!p.startsWith(base + path.sep) && p !== base) return null;
  return p;
}
async function streamFile(res, filePath) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return send(res, 404, { error: "not found" });
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control": "no-cache",
    });
    createReadStream(filePath).pipe(res);
  } catch {
    send(res, 404, { error: "not found" });
  }
}

// ---- report storage ----------------------------------------------------------
const ID_RE = /^[a-z0-9][a-z0-9._-]{1,120}\.json$/i;

function summarize(body) {
  let ok = 0, partial = 0, no = 0, total = 0;
  const r = (body && body.results) || {};
  for (const k of Object.keys(r)) {
    total++;
    const v = r[k];
    if (v && v.supported === true) ok++;
    else if (v && v.supported === "partial") partial++;
    else no++;
  }
  return { ok, partial, no, total };
}

async function storeReport(body, clientIp) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const tag = slugify(body.tag || "");
  const ua = body?.env?.ua || body?.ua || "";
  const hash = crypto
    .createHash("sha256")
    .update(ua + "|" + (body.tag || "") + "|" + clientIp)
    .digest("hex")
    .slice(0, 8);
  const id = `${ts}__${tag}__${hash}.json`;
  const stored = {
    ...body,
    _meta: {
      receivedAt: new Date().toISOString(),
      clientIp,
      id,
    },
  };
  const tmp = path.join(DATA_DIR, id + ".tmp");
  const dst = path.join(DATA_DIR, id);
  await fs.writeFile(tmp, JSON.stringify(stored, null, 2));
  await fs.rename(tmp, dst);
  return { id, summary: summarize(stored) };
}

async function listReports() {
  const files = await fs.readdir(DATA_DIR);
  const items = [];
  for (const f of files) {
    if (!ID_RE.test(f)) continue;
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, f), "utf8");
      const j = JSON.parse(raw);
      items.push({
        id: f,
        tag: j.tag || null,
        ua: j?.env?.ua || j.ua || "",
        reportedAt: j.reportedAt || j._meta?.receivedAt || null,
        receivedAt: j._meta?.receivedAt || null,
        summary: summarize(j),
      });
    } catch {
      /* skip corrupt */
    }
  }
  items.sort((a, b) =>
    (b.receivedAt || "").localeCompare(a.receivedAt || ""),
  );
  return items;
}

// ---- routing -----------------------------------------------------------------
async function handle(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return sendText(res, 204, "");

  const url = new URL(req.url, "http://x");
  const p = url.pathname;
  const ip =
    (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown";

  // --- POST /api/report ---
  if (p === "/api/report" && req.method === "POST") {
    if (REPORT_TOKEN && bearer(req) !== REPORT_TOKEN)
      return send(res, 401, { error: "unauthorized" });
    if (!allow(ip)) return send(res, 429, { error: "rate limited" });
    let body;
    try {
      const buf = await readBody(req);
      body = JSON.parse(buf.toString("utf8"));
    } catch (e) {
      return send(res, 400, { error: "invalid body: " + e.message });
    }
    if (!body || typeof body !== "object" || !body.results)
      return send(res, 400, { error: "missing results" });
    try {
      const { id, summary } = await storeReport(body, ip);
      return send(res, 201, { ok: true, id, summary });
    } catch (e) {
      return send(res, 500, { error: "store failed: " + e.message });
    }
  }

  // --- GET /api/reports ---
  if (p === "/api/reports" && req.method === "GET") {
    return send(res, 200, { reports: await listReports() });
  }

  // --- GET/DELETE /api/reports/:id ---
  const mId = /^\/api\/reports\/([^/]+)$/.exec(p);
  if (mId) {
    const id = decodeURIComponent(mId[1]);
    if (!ID_RE.test(id)) return send(res, 400, { error: "bad id" });
    const file = path.join(DATA_DIR, id);
    if (req.method === "GET") {
      try {
        const raw = await fs.readFile(file, "utf8");
        return sendText(res, 200, raw, "application/json; charset=utf-8");
      } catch {
        return send(res, 404, { error: "not found" });
      }
    }
    if (req.method === "DELETE") {
      const t = url.searchParams.get("t") || bearer(req);
      if (VIEWER_TOKEN && t !== VIEWER_TOKEN)
        return send(res, 401, { error: "unauthorized" });
      try {
        await fs.unlink(file);
        return send(res, 200, { ok: true });
      } catch {
        return send(res, 404, { error: "not found" });
      }
    }
  }

  // --- viewer auth gate for HTML pages ---
  const needsViewerAuth = () => {
    if (!VIEWER_TOKEN) return false;
    const t = url.searchParams.get("t") || bearer(req);
    return t !== VIEWER_TOKEN;
  };

  // --- GET / (index) ---
  if (p === "/" && req.method === "GET") {
    if (needsViewerAuth()) return send(res, 401, { error: "unauthorized" });
    return streamFile(res, path.join(PUBLIC_DIR, "index.html"));
  }

  // --- GET /r/:id (single report viewer) ---
  if (p.startsWith("/r/") && req.method === "GET") {
    if (needsViewerAuth()) return send(res, 401, { error: "unauthorized" });
    return streamFile(res, path.join(PUBLIC_DIR, "view.html"));
  }

  // --- static passthrough into the repo for viewer ES imports ---
  for (const prefix of ["/app/", "/registry/"]) {
    if (p.startsWith(prefix) && req.method === "GET") {
      const rel = p.slice(1);
      const full = safeJoin(REPO_ROOT, rel);
      if (!full) return send(res, 400, { error: "bad path" });
      return streamFile(res, full);
    }
  }
  if (p.startsWith("/static/") && req.method === "GET") {
    const full = safeJoin(PUBLIC_DIR, p.slice("/static/".length));
    if (!full) return send(res, 400, { error: "bad path" });
    return streamFile(res, full);
  }
  if (p === "/favicon.ico") return sendText(res, 204, "");

  return send(res, 404, { error: "not found" });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error("handler error:", err);
    try {
      send(res, 500, { error: "server error" });
    } catch {}
  });
});

server.listen(PORT, () => {
  console.log(`wcmbd-sink listening on http://localhost:${PORT}`);
  console.log(`  data dir:      ${DATA_DIR}`);
  console.log(`  report token:  ${REPORT_TOKEN ? "required" : "disabled"}`);
  console.log(`  viewer token:  ${VIEWER_TOKEN ? "required" : "disabled"}`);
});
