// registry/input.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

function supportsInputType(t) {
  const i = document.createElement("input");
  try {
    i.setAttribute("type", t);
    return i.type === t;
  } catch {
    return false;
  }
}

export const category = {
  id: "input",
  label: "Input & Interaction",
  icon: "🖱️",
  checks: [
    {
      id: "input-pointer-events",
      label: "Pointer Events",
      description: "Unified mouse/touch/pen events.",
      mdnUrl: mdn("Web/API/Pointer_events"),
      tags: ["input"],
      detect: () => ({ supported: typeof PointerEvent !== "undefined" }),
    },
    {
      id: "input-touch-events",
      label: "Touch Events",
      description: "Legacy touch event model.",
      mdnUrl: mdn("Web/API/Touch_events"),
      tags: ["input", "touch"],
      detect: () => ({ supported: "ontouchstart" in window }),
    },
    {
      id: "input-gamepad",
      label: "Gamepad API",
      description: "navigator.getGamepads().",
      mdnUrl: mdn("Web/API/Gamepad_API"),
      tags: ["input", "hardware"],
      detect: () => ({ supported: typeof navigator.getGamepads === "function" }),
    },
    {
      id: "input-speech-recognition",
      label: "Speech Recognition",
      description: "SpeechRecognition (or webkit prefixed).",
      mdnUrl: mdn("Web/API/SpeechRecognition"),
      tags: ["input", "speech"],
      detect: () => ({
        supported:
          typeof window.SpeechRecognition !== "undefined" ||
          typeof window.webkitSpeechRecognition !== "undefined",
      }),
    },
    {
      id: "input-speech-synthesis",
      label: "Speech Synthesis",
      description: "Text-to-speech via speechSynthesis.",
      mdnUrl: mdn("Web/API/SpeechSynthesis"),
      tags: ["input", "speech"],
      detect: () => ({ supported: typeof speechSynthesis !== "undefined" }),
    },
    {
      id: "input-clipboard",
      label: "Clipboard API",
      description: "navigator.clipboard read/write.",
      mdnUrl: mdn("Web/API/Clipboard_API"),
      tags: ["input"],
      detect: () => {
        const c = navigator.clipboard;
        if (!c) return { supported: false };
        const r = typeof c.readText === "function";
        const w = typeof c.writeText === "function";
        return { supported: r && w ? true : r || w ? "partial" : false };
      },
    },
    {
      id: "input-drag-drop",
      label: "Drag and Drop API",
      description: "HTML5 drag/drop.",
      mdnUrl: mdn("Web/API/HTML_Drag_and_Drop_API"),
      tags: ["input"],
      detect: () => ({
        supported: "draggable" in document.createElement("div"),
      }),
    },
    {
      id: "input-eyedropper",
      label: "EyeDropper API",
      description: "Pick colors from anywhere on screen.",
      mdnUrl: mdn("Web/API/EyeDropper"),
      tags: ["input", "color"],
      detect: () => ({ supported: typeof window.EyeDropper !== "undefined" }),
    },
    {
      id: "input-input-types",
      label: "Input types (date, color, range…)",
      description: "Native input widgets.",
      mdnUrl: mdn("Web/HTML/Element/input"),
      tags: ["input", "forms"],
      detect: () => {
        const types = ["date", "color", "range", "number", "email", "url", "time", "datetime-local"];
        const ok = types.filter(supportsInputType);
        return {
          supported: ok.length === types.length ? true : ok.length ? "partial" : false,
          value: `${ok.length}/${types.length} (${ok.join(", ")})`,
        };
      },
    },
  ],
};
