// registry/storage.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

export const category = {
  id: "storage",
  label: "Storage",
  icon: "💾",
  checks: [
    {
      id: "storage-localstorage",
      label: "localStorage / sessionStorage",
      description: "Synchronous key/value storage.",
      mdnUrl: mdn("Web/API/Window/localStorage"),
      tags: ["storage"],
      detect: () => {
        try {
          const k = "__wcmbd_probe__";
          localStorage.setItem(k, "1");
          localStorage.removeItem(k);
          return { supported: true };
        } catch (e) {
          return { supported: false, note: "blocked or unavailable" };
        }
      },
    },
    {
      id: "storage-indexeddb",
      label: "IndexedDB",
      description: "Asynchronous indexed NoSQL storage.",
      mdnUrl: mdn("Web/API/IndexedDB_API"),
      tags: ["storage", "db"],
      detect: () => ({ supported: typeof indexedDB !== "undefined" }),
    },
    {
      id: "storage-cache-api",
      label: "Cache API",
      description: "Fetch response caching via caches.",
      mdnUrl: mdn("Web/API/CacheStorage"),
      tags: ["storage", "network"],
      detect: () => ({ supported: typeof caches !== "undefined" }),
    },
    {
      id: "storage-fsa",
      label: "File System Access API",
      description: "Read/write user-selected files.",
      mdnUrl: mdn("Web/API/File_System_Access_API"),
      tags: ["storage", "file"],
      detect: () => ({ supported: typeof window.showOpenFilePicker === "function" }),
    },
    {
      id: "storage-manager",
      label: "Storage Manager",
      description: "navigator.storage.estimate() and persist.",
      mdnUrl: mdn("Web/API/StorageManager"),
      tags: ["storage"],
      detect: async () => {
        if (!(navigator.storage && navigator.storage.estimate)) return { supported: false };
        try {
          const est = await navigator.storage.estimate();
          const q = est.quota ? `${Math.round(est.quota / (1024 * 1024))} MB quota` : undefined;
          return { supported: true, value: q };
        } catch {
          return { supported: true };
        }
      },
    },
    {
      id: "storage-cookie-store",
      label: "Cookie Store API",
      description: "Async cookie read/write.",
      mdnUrl: mdn("Web/API/CookieStore"),
      tags: ["storage", "cookie"],
      detect: () => ({ supported: typeof window.cookieStore !== "undefined" }),
    },
    {
      id: "storage-opfs",
      label: "Origin Private File System",
      description: "navigator.storage.getDirectory().",
      mdnUrl: mdn("Web/API/File_System_API/Origin_private_file_system"),
      tags: ["storage", "file"],
      detect: () => ({
        supported:
          !!(navigator.storage && typeof navigator.storage.getDirectory === "function"),
      }),
    },
  ],
};
