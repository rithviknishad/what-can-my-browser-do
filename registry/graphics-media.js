// registry/graphics-media.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

function glContext(kind) {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext(kind);
    if (!gl) return { supported: false };
    const dbg = gl.getExtension && gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : null;
    try {
      const lose = gl.getExtension("WEBGL_lose_context");
      lose && lose.loseContext();
    } catch {}
    return { supported: true, value: renderer || undefined };
  } catch {
    return { supported: false };
  }
}

function canPlayCodec(mime) {
  try {
    const v = document.createElement("video");
    const r = v.canPlayType(mime);
    if (r === "probably") return { supported: true, value: "probably" };
    if (r === "maybe") return { supported: "partial", value: "maybe" };
    return { supported: false };
  } catch {
    return { supported: false };
  }
}

// Tiny base64 test images for decode-sniff
const PROBE_IMG = {
  webp:
    "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
  avif:
    // 1x1 AVIF
    "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFtaWFmQXZpdmF2aWYAAADybWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAACRpbG9jAAAAAERAAAEAAQAAAAABGgABAAAAAAAAABgAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABNjb2xybmNseAACAAIABoAAAAAMYXYxQ4EADAAAAAAUaXNwZQAAAAAAAAABAAAAAQAAABBwaXhpAAAAAAMICAgAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACxtZGF0EgAKBxgADlAgMgkQAAAAAAAASABoipih4AAAABzMdOQDQw==",
  jxl:
    "data:image/jxl;base64,/woAEBAJCAQALiABwSDEBABe",
};
async function decodableImage(src) {
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    await img.decode();
    return true;
  } catch {
    return false;
  }
}

export const category = {
  id: "graphics-media",
  label: "Graphics & Media",
  icon: "🖼️",
  checks: [
    {
      id: "gfx-canvas2d",
      label: "Canvas 2D",
      description: "Immediate-mode 2D drawing.",
      mdnUrl: mdn("Web/API/Canvas_API"),
      tags: ["graphics"],
      detect: () => ({
        supported: !!document.createElement("canvas").getContext("2d"),
      }),
    },
    {
      id: "gfx-webgl",
      label: "WebGL",
      description: "GPU-accelerated 3D graphics.",
      mdnUrl: mdn("Web/API/WebGL_API"),
      tags: ["graphics", "gpu"],
      detect: () => glContext("webgl"),
    },
    {
      id: "gfx-webgl2",
      label: "WebGL2",
      description: "Next-generation WebGL.",
      mdnUrl: mdn("Web/API/WebGL2RenderingContext"),
      tags: ["graphics", "gpu"],
      detect: () => glContext("webgl2"),
    },
    {
      id: "gfx-webgpu",
      label: "WebGPU",
      description: "Modern low-level GPU API.",
      mdnUrl: mdn("Web/API/WebGPU_API"),
      tags: ["graphics", "gpu"],
      detect: async () => {
        if (!navigator.gpu) return { supported: false };
        const adapter = await H.withTimeout(
          navigator.gpu.requestAdapter(),
          1500,
          null
        );
        if (!adapter) {
          return {
            supported: "partial",
            note: "navigator.gpu present but no adapter (timeout or not available)",
          };
        }
        const info = adapter.info || {};
        const v = [info.vendor, info.architecture, info.device]
          .filter(Boolean)
          .join(" / ") || undefined;
        return { supported: true, value: v };
      },
    },
    {
      id: "gfx-offscreen-canvas",
      label: "OffscreenCanvas",
      description: "Canvas usable from Workers.",
      mdnUrl: mdn("Web/API/OffscreenCanvas"),
      tags: ["graphics", "worker"],
      detect: () => ({ supported: typeof OffscreenCanvas !== "undefined" }),
    },
    {
      id: "media-video-av1",
      label: "AV1 video",
      description: "video/mp4; codecs=\"av01.0.05M.08\".",
      mdnUrl: mdn("Web/Media/Formats/Video_codecs"),
      tags: ["media", "codec"],
      detect: () => canPlayCodec('video/mp4; codecs="av01.0.05M.08"'),
    },
    {
      id: "media-video-hevc",
      label: "HEVC / H.265 video",
      description: "video/mp4; codecs=\"hvc1\".",
      mdnUrl: mdn("Web/Media/Formats/Video_codecs"),
      tags: ["media", "codec"],
      detect: () => canPlayCodec('video/mp4; codecs="hvc1.1.6.L93.B0"'),
    },
    {
      id: "media-video-vp9",
      label: "VP9 video",
      description: "video/webm; codecs=\"vp9\".",
      mdnUrl: mdn("Web/Media/Formats/Video_codecs"),
      tags: ["media", "codec"],
      detect: () => canPlayCodec('video/webm; codecs="vp9"'),
    },
    {
      id: "media-image-webp",
      label: "WebP images",
      description: "Modern efficient lossy/lossless format.",
      mdnUrl: mdn("Web/Media/Formats/Image_types"),
      tags: ["media", "image"],
      detect: async () => ({ supported: await decodableImage(PROBE_IMG.webp) }),
    },
    {
      id: "media-image-avif",
      label: "AVIF images",
      description: "AV1-based image format.",
      mdnUrl: mdn("Web/Media/Formats/Image_types"),
      tags: ["media", "image"],
      detect: async () => ({ supported: await decodableImage(PROBE_IMG.avif) }),
    },
    {
      id: "media-image-jxl",
      label: "JPEG XL images",
      description: "Next-gen still image format.",
      mdnUrl: mdn("Web/Media/Formats/Image_types"),
      tags: ["media", "image"],
      detect: async () => ({ supported: await decodableImage(PROBE_IMG.jxl) }),
    },
    {
      id: "media-webcodecs",
      label: "WebCodecs API",
      description: "Low-level access to video/audio codecs.",
      mdnUrl: mdn("Web/API/WebCodecs_API"),
      tags: ["media", "codec"],
      detect: () => ({
        supported:
          typeof VideoEncoder !== "undefined" && typeof VideoDecoder !== "undefined",
      }),
    },
  ],
};
