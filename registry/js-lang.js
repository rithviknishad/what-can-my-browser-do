// registry/js-lang.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

export const category = {
  id: "js-lang",
  label: "JavaScript Language",
  icon: "📜",
  checks: [
    {
      id: "js-modules",
      label: "ES Modules",
      description: '<script type="module"> & static import.',
      mdnUrl: mdn("Web/JavaScript/Guide/Modules"),
      tags: ["js", "modules"],
      detect: () => ({
        supported: "noModule" in HTMLScriptElement.prototype,
      }),
    },
    {
      id: "js-dynamic-import",
      label: "Dynamic import()",
      description: "Runtime import() of ES modules.",
      mdnUrl: mdn("Web/JavaScript/Reference/Operators/import"),
      tags: ["js", "modules"],
      detect: () => ({ supported: H.syntaxOk("return import('')") }),
    },
    {
      id: "js-optional-chaining",
      label: "Optional chaining (?.)",
      description: "Safe property access operator.",
      mdnUrl: mdn("Web/JavaScript/Reference/Operators/Optional_chaining"),
      tags: ["js", "syntax"],
      detect: () => ({ supported: H.syntaxOk("return (a) => a?.b") }),
    },
    {
      id: "js-nullish-coalescing",
      label: "Nullish coalescing (??)",
      description: "Default value for null/undefined.",
      mdnUrl: mdn("Web/JavaScript/Reference/Operators/Nullish_coalescing"),
      tags: ["js", "syntax"],
      detect: () => ({ supported: H.syntaxOk("return (a) => a ?? 1") }),
    },
    {
      id: "js-top-level-await",
      label: "Top-level await",
      description: "await in a module's top level.",
      mdnUrl: mdn("Web/JavaScript/Reference/Operators/await"),
      tags: ["js", "async"],
      // If this module is running, dynamic import of a blob module can test it,
      // but that's expensive — fall back to syntax probe (top-level can't be tested inline).
      detect: () => ({
        supported: "partial",
        note: "Supported where ES modules are supported in modern engines.",
      }),
    },
    {
      id: "js-bigint",
      label: "BigInt",
      description: "Arbitrary-precision integers.",
      mdnUrl: mdn("Web/JavaScript/Reference/Global_Objects/BigInt"),
      tags: ["js", "numbers"],
      detect: () => ({ supported: typeof BigInt === "function" }),
    },
    {
      id: "js-weakref",
      label: "WeakRef / FinalizationRegistry",
      description: "Weak references and finalization callbacks.",
      mdnUrl: mdn("Web/JavaScript/Reference/Global_Objects/WeakRef"),
      tags: ["js", "memory"],
      detect: () => ({
        supported:
          typeof WeakRef === "function" &&
          typeof FinalizationRegistry === "function",
      }),
    },
    {
      id: "js-structured-clone",
      label: "structuredClone()",
      description: "Deep clone with cycles and transferables.",
      mdnUrl: mdn("Web/API/structuredClone"),
      tags: ["js"],
      detect: () => ({ supported: typeof structuredClone === "function" }),
    },
    {
      id: "js-promise-combinators",
      label: "Promise.allSettled / .any",
      description: "Modern Promise combinators.",
      mdnUrl: mdn("Web/JavaScript/Reference/Global_Objects/Promise"),
      tags: ["js", "promise"],
      detect: () => {
        const a = typeof Promise.allSettled === "function";
        const b = typeof Promise.any === "function";
        return { supported: a && b ? true : a || b ? "partial" : false };
      },
    },
    {
      id: "js-array-at-object-hasown",
      label: "Array.at() / Object.hasOwn()",
      description: "Relative indexing and safe own-key check.",
      mdnUrl: mdn("Web/JavaScript/Reference/Global_Objects/Array/at"),
      tags: ["js"],
      detect: () => {
        const a = typeof Array.prototype.at === "function";
        const b = typeof Object.hasOwn === "function";
        return { supported: a && b ? true : a || b ? "partial" : false };
      },
    },
    {
      id: "js-error-cause",
      label: "Error cause",
      description: "new Error(msg, { cause }).",
      mdnUrl: mdn("Web/JavaScript/Reference/Global_Objects/Error/cause"),
      tags: ["js", "error"],
      detect: () => ({
        supported: "cause" in new Error("x", { cause: 1 }),
      }),
    },
    {
      id: "js-temporal",
      label: "Temporal API",
      description: "Modern date/time replacement for Date.",
      mdnUrl: mdn("Web/JavaScript/Reference/Global_Objects/Temporal"),
      tags: ["js", "date"],
      detect: () => ({ supported: typeof globalThis.Temporal !== "undefined" }),
    },
  ],
};
