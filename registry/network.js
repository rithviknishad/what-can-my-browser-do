// registry/network.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

export const category = {
  id: "network",
  label: "Network",
  icon: "🌐",
  checks: [
    {
      id: "net-fetch",
      label: "fetch()",
      description: "Modern HTTP fetch API.",
      mdnUrl: mdn("Web/API/Fetch_API"),
      tags: ["network"],
      detect: () => ({ supported: typeof fetch === "function" }),
    },
    {
      id: "net-websocket",
      label: "WebSocket",
      description: "Full-duplex persistent connection.",
      mdnUrl: mdn("Web/API/WebSocket"),
      tags: ["network"],
      detect: () => ({ supported: typeof WebSocket === "function" }),
    },
    {
      id: "net-eventsource",
      label: "Server-Sent Events (EventSource)",
      description: "One-way server push over HTTP.",
      mdnUrl: mdn("Web/API/EventSource"),
      tags: ["network"],
      detect: () => ({ supported: typeof EventSource === "function" }),
    },
    {
      id: "net-webrtc",
      label: "WebRTC",
      description: "RTCPeerConnection for peer-to-peer.",
      mdnUrl: mdn("Web/API/RTCPeerConnection"),
      tags: ["network", "media"],
      detect: () => ({ supported: typeof RTCPeerConnection === "function" }),
    },
    {
      id: "net-beacon",
      label: "Beacon API",
      description: "navigator.sendBeacon().",
      mdnUrl: mdn("Web/API/Navigator/sendBeacon"),
      tags: ["network"],
      detect: () => ({ supported: typeof navigator.sendBeacon === "function" }),
    },
    {
      id: "net-background-sync",
      label: "Background Sync",
      description: "Defer work until connectivity returns.",
      mdnUrl: mdn("Web/API/Background_Synchronization_API"),
      tags: ["network", "sw"],
      detect: () => ({
        supported: H.hasGlobal("ServiceWorkerRegistration.prototype.sync"),
      }),
    },
    {
      id: "net-background-fetch",
      label: "Background Fetch",
      description: "Resumable, long-running fetches.",
      mdnUrl: mdn("Web/API/Background_Fetch_API"),
      tags: ["network", "sw"],
      detect: () => ({ supported: typeof BackgroundFetchManager !== "undefined" }),
    },
  ],
};
