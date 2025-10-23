// hero.ts
import { heroui } from "@heroui/react";
// Tailwind v4 默认不再读取 tailwind.config.js ，改动需要在 CSS 配置或插件入口（这里是 hero.ts ）进行。

export default heroui({
  layout: {
    radius: {},
  },
  themes: {
    light: {
      colors: {
        background: "#ffffff",
        foreground: "#11181C",
        primary: {
          DEFAULT: "#BEF264",
          foreground: "#000000",
        },
        focus: "#BEF264",
      },
    },
    dark: {
      colors: {
        background: "#000000",
        foreground: "#ECEDEE",
        primary: {
          DEFAULT: "#BEF264",
          foreground: "#000000",
        },
        focus: "#BEF264",
      },
    },
  },
});
