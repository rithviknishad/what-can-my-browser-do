// registry/pwa.js
const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

export const category = {
  id: "pwa",
  label: "Progressive Web App",
  icon: "📲",
  checks: [
    {
      id: "pwa-sw-register",
      label: "Service Worker registration",
      description: "navigator.serviceWorker.register().",
      mdnUrl: mdn("Web/API/ServiceWorkerContainer/register"),
      tags: ["pwa", "sw"],
      detect: () => ({
        supported:
          "serviceWorker" in navigator &&
          typeof navigator.serviceWorker.register === "function",
      }),
    },
    {
      id: "pwa-manifest-link",
      label: "Manifest link support",
      description: "Browser can load <link rel=\"manifest\">.",
      mdnUrl: mdn("Web/Manifest"),
      tags: ["pwa"],
      detect: () => {
        const l = document.createElement("link");
        l.rel = "manifest";
        return { supported: l.relList && l.relList.supports && l.relList.supports("manifest") };
      },
    },
    {
      id: "pwa-install-prompt",
      label: "beforeinstallprompt",
      description: "Installability event (Chromium).",
      mdnUrl: mdn("Web/API/Window/beforeinstallprompt_event"),
      tags: ["pwa"],
      detect: () => ({ supported: "onbeforeinstallprompt" in window }),
    },
    {
      id: "pwa-push",
      label: "Push API",
      description: "PushManager for server-pushed messages.",
      mdnUrl: mdn("Web/API/Push_API"),
      tags: ["pwa", "push"],
      detect: () => ({ supported: typeof PushManager !== "undefined" }),
    },
    {
      id: "pwa-notifications",
      label: "Notifications API",
      description: "window.Notification.",
      mdnUrl: mdn("Web/API/Notifications_API"),
      tags: ["pwa"],
      detect: () => ({ supported: typeof Notification !== "undefined" }),
    },
    {
      id: "pwa-badging",
      label: "Badging API",
      description: "navigator.setAppBadge.",
      mdnUrl: mdn("Web/API/Badging_API"),
      tags: ["pwa"],
      detect: () => ({ supported: typeof navigator.setAppBadge === "function" }),
    },
    {
      id: "pwa-share",
      label: "Web Share API",
      description: "navigator.share().",
      mdnUrl: mdn("Web/API/Navigator/share"),
      tags: ["pwa"],
      detect: () => ({ supported: typeof navigator.share === "function" }),
    },
    {
      id: "pwa-protocol-handler",
      label: "registerProtocolHandler",
      description: "Register as a handler for a URL scheme.",
      mdnUrl: mdn("Web/API/Navigator/registerProtocolHandler"),
      tags: ["pwa"],
      detect: () => ({
        supported: typeof navigator.registerProtocolHandler === "function",
      }),
    },
  ],
};
