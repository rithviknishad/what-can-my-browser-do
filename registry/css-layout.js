// registry/css-layout.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;
const css = (prop, val) => ({ supported: H.supportsCss(prop, val) });

export const category = {
  id: "css-layout",
  label: "CSS Layout",
  icon: "📐",
  checks: [
    {
      id: "css-flexbox",
      label: "Flexbox",
      description: "display: flex / inline-flex.",
      mdnUrl: mdn("Web/CSS/CSS_flexible_box_layout"),
      tags: ["css", "layout", "flex"],
      detect: () => css("display", "flex"),
    },
    {
      id: "css-grid",
      label: "Grid",
      description: "display: grid / inline-grid.",
      mdnUrl: mdn("Web/CSS/CSS_grid_layout"),
      tags: ["css", "layout", "grid"],
      detect: () => css("display", "grid"),
    },
    {
      id: "css-subgrid",
      label: "Subgrid",
      description: "grid-template-columns: subgrid.",
      mdnUrl: mdn("Web/CSS/CSS_grid_layout/Subgrid"),
      tags: ["css", "layout", "grid", "subgrid"],
      detect: () => css("grid-template-columns", "subgrid"),
    },
    {
      id: "css-multicolumn",
      label: "CSS Multi-column",
      description: "column-count / columns.",
      mdnUrl: mdn("Web/CSS/CSS_multicol_layout"),
      tags: ["css", "layout", "columns"],
      detect: () => css("column-count", "2"),
    },
    {
      id: "css-masonry",
      label: "Masonry layout",
      description: "grid-template-rows: masonry.",
      mdnUrl: mdn("Web/CSS/CSS_grid_layout/Masonry_layout"),
      tags: ["css", "layout", "experimental"],
      detect: () => css("grid-template-rows", "masonry"),
    },
    {
      id: "css-sticky",
      label: "Sticky positioning",
      description: "position: sticky.",
      mdnUrl: mdn("Web/CSS/position"),
      tags: ["css", "layout", "position"],
      detect: () => css("position", "sticky"),
    },
    {
      id: "css-aspect-ratio",
      label: "aspect-ratio",
      description: "Set an element's preferred width:height ratio.",
      mdnUrl: mdn("Web/CSS/aspect-ratio"),
      tags: ["css", "layout"],
      detect: () => css("aspect-ratio", "1 / 1"),
    },
    {
      id: "css-container-queries",
      label: "Container queries",
      description: "@container size queries and container-type.",
      mdnUrl: mdn("Web/CSS/CSS_containment/Container_queries"),
      tags: ["css", "layout", "responsive"],
      detect: () => css("container-type", "inline-size"),
    },
    {
      id: "css-cascade-layers",
      label: "Cascade layers",
      description: "@layer ordering of the cascade.",
      mdnUrl: mdn("Web/CSS/@layer"),
      tags: ["css", "cascade"],
      detect: () => ({ supported: typeof CSSLayerBlockRule !== "undefined" }),
    },
  ],
};
