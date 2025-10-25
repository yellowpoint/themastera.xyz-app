// hero.ts
import { heroui } from "@heroui/react";
// Tailwind v4 no longer reads tailwind.config.js by default. Changes must be made in the CSS configuration or the plugin entry point (in this case, hero.ts).

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
