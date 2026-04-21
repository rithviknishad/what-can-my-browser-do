// registry/payments.js
const mdn = (slug) => `https://developer.mozilla.org/docs/${slug}`;

export const category = {
  id: "payments",
  label: "Payments & Commerce",
  icon: "💳",
  checks: [
    {
      id: "pay-request",
      label: "Payment Request API",
      description: "Native payment UI via PaymentRequest.",
      mdnUrl: mdn("Web/API/Payment_Request_API"),
      tags: ["payment"],
      detect: () => ({ supported: typeof PaymentRequest !== "undefined" }),
    },
    {
      id: "pay-digital-goods",
      label: "Digital Goods API",
      description: "getDigitalGoodsService() for in-app purchases.",
      mdnUrl: mdn("Web/API/Digital_Goods_API"),
      tags: ["payment"],
      detect: () => ({
        supported: typeof window.getDigitalGoodsService === "function",
      }),
    },
  ],
};
