// registry/index.js — barrel export of all categories in display order.

import { category as cssLayout } from "./css-layout.js";
import { category as cssVisual } from "./css-visual.js";
import { category as cssAnimation } from "./css-animation.js";
import { category as cssResponsive } from "./css-responsive.js";
import { category as cssTypography } from "./css-typography.js";
import { category as jsLang } from "./js-lang.js";
import { category as storage } from "./storage.js";
import { category as network } from "./network.js";
import { category as graphicsMedia } from "./graphics-media.js";
import { category as input } from "./input.js";
import { category as device } from "./device.js";
import { category as performance } from "./performance.js";
import { category as workers } from "./workers.js";
import { category as security } from "./security.js";
import { category as payments } from "./payments.js";
import { category as environment } from "./environment.js";
import { category as pwa } from "./pwa.js";

export const categories = [
  cssLayout,
  cssVisual,
  cssAnimation,
  cssResponsive,
  cssTypography,
  jsLang,
  storage,
  network,
  graphicsMedia,
  input,
  device,
  performance,
  workers,
  security,
  payments,
  environment,
  pwa,
];
