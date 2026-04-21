// registry/css-animation.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;
const css = (prop, val) => ({ supported: H.supportsCss(prop, val) });

export const category = {
  id: "css-animation",
  label: "CSS Animation & Motion",
  icon: "🎞️",
  checks: [
    {
      id: "css-animation",
      label: "CSS animation",
      description: "@keyframes and the animation shorthand.",
      mdnUrl: mdn("Web/CSS/animation"),
      tags: ["css", "animation"],
      detect: () => css("animation-name", "x"),
    },
    {
      id: "css-transition",
      label: "CSS transition",
      description: "Animate property changes.",
      mdnUrl: mdn("Web/CSS/transition"),
      tags: ["css", "animation"],
      detect: () => css("transition", "all 1s"),
    },
    {
      id: "css-starting-style",
      label: "@starting-style",
      description: "Animate from the element's initial style.",
      mdnUrl: mdn("Web/CSS/@starting-style"),
      tags: ["css", "animation"],
      detect: () => ({
        supported: typeof CSSStartingStyleRule !== "undefined",
      }),
    },
    {
      id: "css-scroll-timeline",
      label: "scroll-timeline / animation-timeline",
      description: "Drive animations from scroll position.",
      mdnUrl: mdn("Web/CSS/animation-timeline"),
      tags: ["css", "animation", "scroll"],
      detect: () => css("animation-timeline", "scroll()"),
    },
    {
      id: "css-prefers-reduced-motion",
      label: "prefers-reduced-motion",
      description: "Respect the user's motion preference.",
      mdnUrl: mdn("Web/CSS/@media/prefers-reduced-motion"),
      tags: ["css", "a11y", "motion"],
      detect: () => {
        if (!H.mediaSupported("(prefers-reduced-motion)"))
          return { supported: false };
        return {
          supported: true,
          value: H.matchMedia("(prefers-reduced-motion: reduce)")
            ? "reduce"
            : "no-preference",
        };
      },
    },
  ],
};
