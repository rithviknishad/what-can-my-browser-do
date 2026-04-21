// registry/css-visual.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;
const css = (prop, val) => ({ supported: H.supportsCss(prop, val) });

export const category = {
  id: "css-visual",
  label: "CSS Visual & Effects",
  icon: "🎨",
  checks: [
    {
      id: "css-variables",
      label: "CSS custom properties",
      description: "--custom-property variables and var().",
      mdnUrl: mdn("Web/CSS/Using_CSS_custom_properties"),
      tags: ["css", "variables"],
      detect: () => css("--x", "0"),
    },
    {
      id: "css-color-mix",
      label: "color-mix()",
      description: "Mix colors in arbitrary color spaces.",
      mdnUrl: mdn("Web/CSS/color_value/color-mix"),
      tags: ["css", "color"],
      detect: () => css("color", "color-mix(in oklch, red, blue)"),
    },
    {
      id: "css-oklch",
      label: "oklch() / oklab()",
      description: "Perceptually uniform color spaces.",
      mdnUrl: mdn("Web/CSS/color_value/oklch"),
      tags: ["css", "color"],
      detect: () => {
        const a = H.supportsCss("color", "oklch(60% 0.15 30)");
        const b = H.supportsCss("color", "oklab(60% 0.1 0.1)");
        return { supported: a && b ? true : a || b ? "partial" : false };
      },
    },
    {
      id: "css-p3",
      label: "Display-P3 wide gamut",
      description: "color(display-p3 r g b).",
      mdnUrl: mdn("Web/CSS/color_value/color"),
      tags: ["css", "color", "hdr"],
      detect: () => css("color", "color(display-p3 1 0 0)"),
    },
    {
      id: "css-backdrop-filter",
      label: "backdrop-filter",
      description: "Apply filters to area behind an element.",
      mdnUrl: mdn("Web/CSS/backdrop-filter"),
      tags: ["css", "effect"],
      detect: () => css("backdrop-filter", "blur(4px)"),
    },
    {
      id: "css-filter",
      label: "filter",
      description: "Graphical filter effects (blur, grayscale, etc).",
      mdnUrl: mdn("Web/CSS/filter"),
      tags: ["css", "effect"],
      detect: () => css("filter", "blur(1px)"),
    },
    {
      id: "css-mix-blend-mode",
      label: "mix-blend-mode",
      description: "Blend modes between stacked elements.",
      mdnUrl: mdn("Web/CSS/mix-blend-mode"),
      tags: ["css", "effect", "blend"],
      detect: () => css("mix-blend-mode", "multiply"),
    },
    {
      id: "css-clip-path",
      label: "clip-path",
      description: "Clip elements to arbitrary shapes.",
      mdnUrl: mdn("Web/CSS/clip-path"),
      tags: ["css", "effect"],
      detect: () => css("clip-path", "circle(50%)"),
    },
    {
      id: "css-houdini-paint",
      label: "Houdini Paint API",
      description: "CSS.paintWorklet lets authors program paint().",
      mdnUrl: mdn("Web/API/CSS/paintWorklet_static"),
      tags: ["css", "houdini"],
      detect: () => ({
        supported: !!(typeof CSS !== "undefined" && CSS.paintWorklet),
      }),
    },
    {
      id: "css-property",
      label: "@property (typed custom properties)",
      description: "Register typed/animatable custom properties.",
      mdnUrl: mdn("Web/CSS/@property"),
      tags: ["css", "houdini"],
      detect: () => ({
        supported:
          typeof CSS !== "undefined" &&
          typeof CSS.registerProperty === "function",
      }),
    },
  ],
};
