// registry/environment.js
const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

export const category = {
  id: "environment",
  label: "Browser Environment",
  icon: "🧭",
  checks: [
    {
      id: "env-user-agent",
      label: "User Agent",
      description: "navigator.userAgent string.",
      mdnUrl: mdn("Web/API/Navigator/userAgent"),
      tags: ["env"],
      detect: () => ({ supported: true, value: navigator.userAgent }),
    },
    {
      id: "env-ua-data",
      label: "User-Agent Client Hints",
      description: "navigator.userAgentData.",
      mdnUrl: mdn("Web/API/NavigatorUAData"),
      tags: ["env"],
      detect: () => {
        const d = navigator.userAgentData;
        if (!d) return { supported: false };
        const brands = (d.brands || [])
          .map((b) => `${b.brand} ${b.version}`)
          .join(", ");
        return {
          supported: true,
          value: `${d.platform || "?"}${d.mobile ? " · mobile" : ""}${brands ? ` · ${brands}` : ""}`,
        };
      },
    },
    {
      id: "env-language",
      label: "Language / locale",
      description: "navigator.language(s).",
      mdnUrl: mdn("Web/API/Navigator/language"),
      tags: ["env", "i18n"],
      detect: () => ({
        supported: true,
        value: (navigator.languages || [navigator.language]).join(", "),
      }),
    },
    {
      id: "env-online",
      label: "navigator.onLine",
      description: "Online/offline hint (not authoritative).",
      mdnUrl: mdn("Web/API/Navigator/onLine"),
      tags: ["env", "network"],
      detect: () => ({
        supported: true,
        value: navigator.onLine ? "online" : "offline",
      }),
    },
    {
      id: "env-cookies",
      label: "Cookies enabled",
      description: "navigator.cookieEnabled.",
      mdnUrl: mdn("Web/API/Navigator/cookieEnabled"),
      tags: ["env", "cookie"],
      detect: () => ({
        supported: !!navigator.cookieEnabled,
        value: navigator.cookieEnabled ? "enabled" : "disabled",
      }),
    },
    {
      id: "env-cpu-cores",
      label: "CPU cores",
      description: "navigator.hardwareConcurrency.",
      mdnUrl: mdn("Web/API/Navigator/hardwareConcurrency"),
      tags: ["env", "hardware"],
      detect: () => {
        const n = navigator.hardwareConcurrency;
        return n
          ? { supported: true, value: `${n} core${n === 1 ? "" : "s"}` }
          : { supported: false };
      },
    },
    {
      id: "env-device-memory",
      label: "Device memory",
      description: "navigator.deviceMemory (GB bucket).",
      mdnUrl: mdn("Web/API/Navigator/deviceMemory"),
      tags: ["env", "hardware"],
      detect: () => {
        const m = navigator.deviceMemory;
        return m
          ? { supported: true, value: `~${m} GB` }
          : { supported: false };
      },
    },
    {
      id: "env-color-depth",
      label: "screen.colorDepth / pixelDepth",
      description: "Bits per pixel on the display.",
      mdnUrl: mdn("Web/API/Screen/colorDepth"),
      tags: ["env", "display"],
      detect: () => ({
        supported: true,
        value: `color ${screen.colorDepth}bpp / pixel ${screen.pixelDepth}bpp`,
      }),
    },
    {
      id: "env-dpr",
      label: "devicePixelRatio",
      description: "Logical → physical pixel ratio.",
      mdnUrl: mdn("Web/API/Window/devicePixelRatio"),
      tags: ["env", "display"],
      detect: () => ({
        supported: true,
        value: String(window.devicePixelRatio),
      }),
    },
    {
      id: "env-connection",
      label: "Network Information",
      description: "navigator.connection effective type / downlink / RTT.",
      mdnUrl: mdn("Web/API/NetworkInformation"),
      tags: ["env", "network"],
      detect: () => {
        const c =
          navigator.connection ||
          navigator.mozConnection ||
          navigator.webkitConnection;
        if (!c) return { supported: false };
        const parts = [];
        if (c.effectiveType) parts.push(c.effectiveType);
        if (c.downlink != null) parts.push(`${c.downlink} Mb/s`);
        if (c.rtt != null) parts.push(`${c.rtt} ms RTT`);
        if (c.saveData) parts.push("save-data");
        return { supported: true, value: parts.join(" · ") || "available" };
      },
    },
    {
      id: "env-max-touch-points",
      label: "maxTouchPoints",
      description: "navigator.maxTouchPoints.",
      mdnUrl: mdn("Web/API/Navigator/maxTouchPoints"),
      tags: ["env", "input"],
      detect: () => ({
        supported: true,
        value: String(navigator.maxTouchPoints ?? 0),
      }),
    },
    {
      id: "env-timezone",
      label: "Timezone",
      description: "Intl.DateTimeFormat().resolvedOptions().timeZone.",
      mdnUrl: mdn(
        "Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
      ),
      tags: ["env", "i18n"],
      detect: () => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return tz ? { supported: true, value: tz } : { supported: false };
      },
    },
    {
      id: "env-coi",
      label: "crossOriginIsolated",
      description: "window.crossOriginIsolated (required for SAB).",
      mdnUrl: mdn("Web/API/Window/crossOriginIsolated"),
      tags: ["env", "security"],
      detect: () => ({
        supported: !!window.crossOriginIsolated,
        value: window.crossOriginIsolated ? "isolated" : "not isolated",
      }),
    },
  ],
};
