// registry/device.js
import { H } from "../app/detect.js";

const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

export const category = {
  id: "device",
  label: "Device & Hardware",
  icon: "📟",
  checks: [
    {
      id: "dev-geolocation",
      label: "Geolocation",
      description: "navigator.geolocation (passive presence check).",
      mdnUrl: mdn("Web/API/Geolocation_API"),
      tags: ["device", "location"],
      detect: () => ({ supported: "geolocation" in navigator }),
    },
    {
      id: "dev-orientation",
      label: "DeviceOrientation / DeviceMotion",
      description: "Gyroscope & accelerometer events.",
      mdnUrl: mdn("Web/API/Device_orientation_events"),
      tags: ["device", "sensor"],
      detect: () => {
        const o = "DeviceOrientationEvent" in window;
        const m = "DeviceMotionEvent" in window;
        return { supported: o && m ? true : o || m ? "partial" : false };
      },
    },
    {
      id: "dev-battery",
      label: "Battery Status API",
      description: "navigator.getBattery().",
      mdnUrl: mdn("Web/API/Battery_Status_API"),
      tags: ["device", "battery"],
      detect: () => ({ supported: typeof navigator.getBattery === "function" }),
    },
    {
      id: "dev-vibration",
      label: "Vibration API",
      description: "navigator.vibrate().",
      mdnUrl: mdn("Web/API/Navigator/vibrate"),
      tags: ["device"],
      detect: () => ({ supported: typeof navigator.vibrate === "function" }),
    },
    {
      id: "dev-bluetooth",
      label: "Web Bluetooth",
      description: "navigator.bluetooth.",
      mdnUrl: mdn("Web/API/Web_Bluetooth_API"),
      tags: ["device", "hardware"],
      detect: () => ({ supported: typeof navigator.bluetooth !== "undefined" }),
    },
    {
      id: "dev-usb",
      label: "WebUSB",
      description: "navigator.usb.",
      mdnUrl: mdn("Web/API/WebUSB_API"),
      tags: ["device", "hardware"],
      detect: () => ({ supported: typeof navigator.usb !== "undefined" }),
    },
    {
      id: "dev-serial",
      label: "Web Serial",
      description: "navigator.serial.",
      mdnUrl: mdn("Web/API/Web_Serial_API"),
      tags: ["device", "hardware"],
      detect: () => ({ supported: typeof navigator.serial !== "undefined" }),
    },
    {
      id: "dev-nfc",
      label: "Web NFC",
      description: "NDEFReader.",
      mdnUrl: mdn("Web/API/Web_NFC_API"),
      tags: ["device", "hardware"],
      detect: () => ({ supported: typeof window.NDEFReader !== "undefined" }),
    },
    {
      id: "dev-wake-lock",
      label: "Screen Wake Lock",
      description: "navigator.wakeLock.request().",
      mdnUrl: mdn("Web/API/Screen_Wake_Lock_API"),
      tags: ["device"],
      detect: () => ({
        supported: !!(navigator.wakeLock && navigator.wakeLock.request),
      }),
    },
    {
      id: "dev-ambient-light",
      label: "Ambient Light Sensor",
      description: "AmbientLightSensor.",
      mdnUrl: mdn("Web/API/AmbientLightSensor"),
      tags: ["device", "sensor"],
      detect: () => ({
        supported: typeof window.AmbientLightSensor !== "undefined",
      }),
    },
    {
      id: "dev-proximity",
      label: "Proximity Sensor",
      description: "ProximitySensor / ondeviceproximity.",
      mdnUrl: mdn("Web/API/Proximity_Events"),
      tags: ["device", "sensor"],
      detect: () => ({
        supported:
          typeof window.ProximitySensor !== "undefined" ||
          "ondeviceproximity" in window,
      }),
    },
  ],
};
