// registry/performance.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

const hasEntry = (t) =>
  typeof PerformanceObserver !== "undefined" &&
  Array.isArray(PerformanceObserver.supportedEntryTypes) &&
  PerformanceObserver.supportedEntryTypes.includes(t);

export const category = {
  id: "performance",
  label: "Performance",
  icon: "⚡",
  checks: [
    {
      id: "perf-observer",
      label: "PerformanceObserver",
      description: "Observe performance entries asynchronously.",
      mdnUrl: mdn("Web/API/PerformanceObserver"),
      tags: ["perf"],
      detect: () => ({ supported: typeof PerformanceObserver !== "undefined" }),
    },
    {
      id: "perf-mark-measure",
      label: "performance.mark / measure",
      description: "Custom performance timestamps.",
      mdnUrl: mdn("Web/API/Performance/mark"),
      tags: ["perf"],
      detect: () => ({
        supported:
          typeof performance.mark === "function" &&
          typeof performance.measure === "function",
      }),
    },
    {
      id: "perf-memory",
      label: "performance.memory",
      description: "Heap usage info (Chrome-only).",
      mdnUrl: mdn("Web/API/Performance/memory"),
      tags: ["perf", "memory"],
      detect: () => {
        const m = performance.memory;
        if (!m) return { supported: false };
        const mb = (n) => (n ? `${Math.round(n / (1024 * 1024))} MB` : "?");
        return {
          supported: true,
          value: `heap ${mb(m.usedJSHeapSize)} / ${mb(m.jsHeapSizeLimit)}`,
        };
      },
    },
    {
      id: "perf-navigation",
      label: "Navigation Timing",
      description: "performance.getEntriesByType('navigation').",
      mdnUrl: mdn("Web/API/PerformanceNavigationTiming"),
      tags: ["perf"],
      detect: () => ({ supported: hasEntry("navigation") }),
    },
    {
      id: "perf-resource",
      label: "Resource Timing",
      description: "Per-resource timing entries.",
      mdnUrl: mdn("Web/API/PerformanceResourceTiming"),
      tags: ["perf"],
      detect: () => ({ supported: hasEntry("resource") }),
    },
    {
      id: "perf-longtasks",
      label: "Long Tasks API",
      description: "Entries for tasks ≥50ms.",
      mdnUrl: mdn("Web/API/Long_Tasks_API"),
      tags: ["perf"],
      detect: () => ({ supported: hasEntry("longtask") }),
    },
    {
      id: "perf-layout-shift",
      label: "Layout Instability API (CLS)",
      description: "layout-shift entries.",
      mdnUrl: mdn("Web/API/LayoutShift"),
      tags: ["perf", "cls"],
      detect: () => ({ supported: hasEntry("layout-shift") }),
    },
    {
      id: "perf-requestidlecallback",
      label: "requestIdleCallback",
      description: "Schedule work for idle time.",
      mdnUrl: mdn("Web/API/Window/requestIdleCallback"),
      tags: ["perf"],
      detect: () => ({ supported: typeof requestIdleCallback === "function" }),
    },
    {
      id: "perf-scheduler",
      label: "scheduler.postTask()",
      description: "Prioritized task scheduling.",
      mdnUrl: mdn("Web/API/Scheduler/postTask"),
      tags: ["perf"],
      detect: () => ({
        supported: !!(
          globalThis.scheduler && typeof scheduler.postTask === "function"
        ),
      }),
    },
  ],
};
