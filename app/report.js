// app/report.js — remote reporting for non-interactive clients (signage, kiosks).
// Activated only when ?report=<url> is present. Posts a snapshot once detections
// finish and optionally re-posts on an interval.

import { snapshot } from "./export.js";

function qp(name) {
  const m = new RegExp(
    "[?&]" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^&#]*)",
  ).exec(location.search);
  return m ? decodeURIComponent(m[1]) : null;
}

function envInfo() {
  const n = navigator;
  const s = screen || {};
  const uaData = n.userAgentData
    ? {
        brands: n.userAgentData.brands,
        mobile: n.userAgentData.mobile,
        platform: n.userAgentData.platform,
      }
    : null;
  let tz = null;
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {}
  return {
    ua: n.userAgent,
    uaData,
    language: n.language,
    languages: n.languages,
    platform: n.platform,
    hardwareConcurrency: n.hardwareConcurrency ?? null,
    deviceMemory: n.deviceMemory ?? null,
    screen: {
      w: s.width,
      h: s.height,
      aw: s.availWidth,
      ah: s.availHeight,
      colorDepth: s.colorDepth,
      dpr: window.devicePixelRatio,
    },
    viewport: { w: innerWidth, h: innerHeight },
    timezone: tz,
    online: n.onLine,
    cookieEnabled: n.cookieEnabled,
    referrer: document.referrer || null,
    href: location.href,
  };
}

async function postReport(url, tag, token) {
  const snap = snapshot();
  const body = {
    ...snap,
    tag: tag || null,
    env: envInfo(),
    reportedAt: new Date().toISOString(),
  };
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = "Bearer " + token;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    mode: "cors",
    credentials: "omit",
    keepalive: true,
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res;
}

export function isReportMode() {
  return !!qp("report");
}

// Returns { enabled, send } — call send() after detections finish.
export function createReporter(toast) {
  const url = qp("report");
  if (!url) return { enabled: false, send: async () => {} };
  const tag = qp("tag");
  const token = qp("token");
  const intervalMin = parseFloat(qp("interval") || "0");
  let timer = null;

  const send = async () => {
    try {
      await postReport(url, tag, token);
      toast && toast(`Reported to ${new URL(url).host}`);
    } catch (err) {
      console.warn("Report failed:", err);
      toast && toast("Report failed: " + (err.message || err));
    }
  };

  if (intervalMin > 0) {
    const ms = Math.max(30_000, intervalMin * 60_000);
    timer = setInterval(send, ms);
  }

  return {
    enabled: true,
    send,
    stop: () => {
      if (timer) clearInterval(timer);
    },
  };
}
