// registry/security.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

export const category = {
  id: "security",
  label: "Security & Identity",
  icon: "🔐",
  checks: [
    {
      id: "sec-webcrypto",
      label: "Web Crypto API",
      description: "crypto.subtle for hashing, signing, encryption.",
      mdnUrl: mdn("Web/API/Web_Crypto_API"),
      tags: ["security", "crypto"],
      detect: () => ({ supported: !!(globalThis.crypto && crypto.subtle) }),
    },
    {
      id: "sec-webauthn",
      label: "Web Authentication (WebAuthn)",
      description: "navigator.credentials.create()/.get() with publicKey.",
      mdnUrl: mdn("Web/API/Web_Authentication_API"),
      tags: ["security", "auth"],
      detect: () => ({
        supported:
          !!(navigator.credentials && typeof PublicKeyCredential !== "undefined"),
      }),
    },
    {
      id: "sec-permissions",
      label: "Permissions API",
      description: "navigator.permissions.query().",
      mdnUrl: mdn("Web/API/Permissions_API"),
      tags: ["security"],
      detect: () => ({
        supported:
          !!(navigator.permissions && typeof navigator.permissions.query === "function"),
      }),
    },
    {
      id: "sec-trusted-types",
      label: "Trusted Types",
      description: "window.trustedTypes.",
      mdnUrl: mdn("Web/API/Trusted_Types_API"),
      tags: ["security"],
      detect: () => ({ supported: typeof window.trustedTypes !== "undefined" }),
    },
    {
      id: "sec-sri",
      label: "Subresource Integrity",
      description: "<script integrity=…> attribute support.",
      mdnUrl: mdn("Web/Security/Subresource_Integrity"),
      tags: ["security"],
      detect: () => ({
        supported: "integrity" in document.createElement("script"),
      }),
    },
    {
      id: "sec-secure-context",
      label: "isSecureContext",
      description: "Running in a secure (HTTPS/localhost) context.",
      mdnUrl: mdn("Web/API/Window/isSecureContext"),
      tags: ["security"],
      detect: () => ({
        supported: !!window.isSecureContext,
        value: window.isSecureContext ? "secure" : "insecure",
      }),
    },
  ],
};
