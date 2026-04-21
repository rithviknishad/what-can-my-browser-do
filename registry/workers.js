// registry/workers.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

export const category = {
  id: "workers",
  label: "Workers & Concurrency",
  icon: "🧵",
  checks: [
    {
      id: "workers-web",
      label: "Web Workers",
      description: "Background JS threads.",
      mdnUrl: mdn("Web/API/Web_Workers_API"),
      tags: ["worker"],
      detect: () => ({ supported: typeof Worker !== "undefined" }),
    },
    {
      id: "workers-shared",
      label: "SharedWorker",
      description: "Worker shared across contexts.",
      mdnUrl: mdn("Web/API/SharedWorker"),
      tags: ["worker"],
      detect: () => ({ supported: typeof SharedWorker !== "undefined" }),
    },
    {
      id: "workers-service",
      label: "Service Workers",
      description: "navigator.serviceWorker.",
      mdnUrl: mdn("Web/API/Service_Worker_API"),
      tags: ["worker", "pwa"],
      detect: () => ({ supported: "serviceWorker" in navigator }),
    },
    {
      id: "workers-worklets",
      label: "Worklets (Audio/Paint/Layout)",
      description: "Specialized lightweight workers.",
      mdnUrl: mdn("Web/API/Worklet"),
      tags: ["worker"],
      detect: () => {
        const a = typeof AudioWorklet !== "undefined" ||
          !!(globalThis.audioWorklet) ||
          !!(typeof AudioContext !== "undefined" && AudioContext.prototype.audioWorklet);
        const p = !!(typeof CSS !== "undefined" && CSS.paintWorklet);
        const l = !!(typeof CSS !== "undefined" && CSS.layoutWorklet);
        const count = [a, p, l].filter(Boolean).length;
        return {
          supported: count === 3 ? true : count ? "partial" : false,
          value: `Audio:${a ? "✓" : "✗"} Paint:${p ? "✓" : "✗"} Layout:${l ? "✓" : "✗"}`,
        };
      },
    },
    {
      id: "workers-atomics-sab",
      label: "Atomics / SharedArrayBuffer",
      description: "Requires cross-origin isolation.",
      mdnUrl: mdn("Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer"),
      tags: ["worker", "concurrency"],
      detect: () => {
        const sab = typeof SharedArrayBuffer !== "undefined";
        const at = typeof Atomics !== "undefined";
        const iso = !!self.crossOriginIsolated;
        if (!sab || !at) return { supported: false };
        return {
          supported: iso ? true : "partial",
          note: iso ? undefined : "crossOriginIsolated is false — SAB usage restricted",
        };
      },
    },
  ],
};
