// registry/css-responsive.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;
const mq = (query, label) => {
  if (!H.mediaSupported(`(${query})`)) return { supported: false };
  const current = (values) =>
    values.find((v) => H.matchMedia(`(${label || query.split(":")[0]}: ${v})`));
  return { supported: true };
};

export const category = {
  id: "css-responsive",
  label: "CSS Responsive & Adaptive",
  icon: "📱",
  checks: [
    {
      id: "css-media-queries",
      label: "@media queries (basic)",
      description: "width/height/orientation media queries.",
      mdnUrl: mdn("Web/CSS/Media_Queries"),
      tags: ["css", "responsive"],
      detect: () => ({ supported: typeof matchMedia === "function" }),
    },
    {
      id: "css-media-hover",
      label: "@media (hover)",
      description: "Detect whether the primary input can hover.",
      mdnUrl: mdn("Web/CSS/@media/hover"),
      tags: ["css", "responsive", "input"],
      detect: () => {
        if (!H.mediaSupported("(hover)")) return { supported: false };
        return {
          supported: true,
          value: H.matchMedia("(hover: hover)") ? "hover" : "none",
        };
      },
    },
    {
      id: "css-media-pointer",
      label: "@media (pointer)",
      description: "Detect pointer precision.",
      mdnUrl: mdn("Web/CSS/@media/pointer"),
      tags: ["css", "responsive", "input"],
      detect: () => {
        if (!H.mediaSupported("(pointer)")) return { supported: false };
        const v = ["fine", "coarse", "none"].find((x) =>
          H.matchMedia(`(pointer: ${x})`)
        );
        return { supported: true, value: v || "unknown" };
      },
    },
    {
      id: "css-prefers-color-scheme",
      label: "prefers-color-scheme",
      description: "Dark/light OS theme preference.",
      mdnUrl: mdn("Web/CSS/@media/prefers-color-scheme"),
      tags: ["css", "theme"],
      detect: () => {
        if (!H.mediaSupported("(prefers-color-scheme)")) return { supported: false };
        const v = H.matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light";
        return { supported: true, value: v };
      },
    },
    {
      id: "css-prefers-contrast",
      label: "prefers-contrast",
      description: "User contrast preference.",
      mdnUrl: mdn("Web/CSS/@media/prefers-contrast"),
      tags: ["css", "a11y"],
      detect: () => {
        if (!H.mediaSupported("(prefers-contrast)")) return { supported: false };
        const v = ["more", "less", "custom", "no-preference"].find((x) =>
          H.matchMedia(`(prefers-contrast: ${x})`)
        );
        return { supported: true, value: v || "unknown" };
      },
    },
    {
      id: "css-forced-colors",
      label: "forced-colors",
      description: "Detect Windows High Contrast / forced colors.",
      mdnUrl: mdn("Web/CSS/@media/forced-colors"),
      tags: ["css", "a11y"],
      detect: () => {
        if (!H.mediaSupported("(forced-colors)")) return { supported: false };
        return {
          supported: true,
          value: H.matchMedia("(forced-colors: active)") ? "active" : "none",
        };
      },
    },
    {
      id: "css-dynamic-range",
      label: "dynamic-range (HDR)",
      description: "Detect HDR-capable display.",
      mdnUrl: mdn("Web/CSS/@media/dynamic-range"),
      tags: ["css", "hdr"],
      detect: () => {
        if (!H.mediaSupported("(dynamic-range)")) return { supported: false };
        return {
          supported: true,
          value: H.matchMedia("(dynamic-range: high)") ? "high" : "standard",
        };
      },
    },
    {
      id: "css-env-safe-area",
      label: "env() / safe-area-inset-*",
      description: "Notch-aware layout values.",
      mdnUrl: mdn("Web/CSS/env"),
      tags: ["css", "safe-area"],
      detect: () => css_env(),
    },
  ],
};

function css_env() {
  try {
    return { supported: CSS.supports("top", "env(safe-area-inset-top)") };
  } catch {
    return { supported: false };
  }
}
