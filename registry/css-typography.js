// registry/css-typography.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;
const css = (prop, val) => ({ supported: H.supportsCss(prop, val) });

export const category = {
  id: "css-typography",
  label: "CSS Typography",
  icon: "✍️",
  checks: [
    {
      id: "css-variable-fonts",
      label: "Variable fonts",
      description: "font-variation-settings.",
      mdnUrl: mdn("Web/CSS/font-variation-settings"),
      tags: ["css", "font"],
      detect: () => css("font-variation-settings", "'wght' 400"),
    },
    {
      id: "css-font-display",
      label: "font-display",
      description: "Control font-face swap behavior.",
      mdnUrl: mdn("Web/CSS/@font-face/font-display"),
      tags: ["css", "font"],
      detect: () => css("font-display", "swap"),
    },
    {
      id: "css-font-palette",
      label: "font-palette",
      description: "Choose a palette from a color font.",
      mdnUrl: mdn("Web/CSS/font-palette"),
      tags: ["css", "font", "color"],
      detect: () => css("font-palette", "normal"),
    },
    {
      id: "css-initial-letter",
      label: "initial-letter",
      description: "Drop caps.",
      mdnUrl: mdn("Web/CSS/initial-letter"),
      tags: ["css", "font"],
      detect: () => css("initial-letter", "2"),
    },
    {
      id: "css-text-wrap-balance",
      label: "text-wrap: balance",
      description: "Evenly wrap short texts like headlines.",
      mdnUrl: mdn("Web/CSS/text-wrap"),
      tags: ["css", "font"],
      detect: () => css("text-wrap", "balance"),
    },
    {
      id: "css-hyphenate-character",
      label: "hyphenate-character",
      description: "Customize the hyphenation character.",
      mdnUrl: mdn("Web/CSS/hyphenate-character"),
      tags: ["css", "font"],
      detect: () => css("hyphenate-character", "'-'"),
    },
  ],
};
