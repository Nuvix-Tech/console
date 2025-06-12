import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  preflight: false,
  disableLayers: true,
  cssVarsPrefix: "rl",
  // globalCss: {
  //   html: {
  //     colorPalette: "slate", // Change this to any color palette you prefer
  //   },
  // },
  theme: {
    tokens: {
      // colors: {
      //   slate: {
      //     // DEFAULT: { value: "#6D748A" },
      //     "50": { value: "#f8fafc" },
      //     "100": { value: "#f1f5f9" },
      //     "200": { value: "#e2e8f0" },
      //     "300": { value: "#cbd5e1" },
      //     "400": { value: "#94a3b8" },
      //     "500": { value: "#64748b" },
      //     "600": { value: "#475569" },
      //     "700": { value: "#334155" },
      //     "800": { value: "#1e293b" },
      //     "900": { value: "#0f172a" },
      //     "950": { value: "#020617" },
      //     "1000": { value: "#E9EDFE" },
      //     "1100": { value: "#F1F3FD" },
      //     "1200": { value: "#F8F9FD" },
      //   },
      // },
      radii: {
        "2xs": {
          value: "0.15625rem",
        },
        xs: {
          value: "0.25rem",
        },
        sm: {
          value: "0.375rem",
        },
        md: {
          value: "0.5rem",
        },
        lg: {
          value: "0.6875rem",
        },
        xl: {
          value: "0.9375rem",
        },
        "2xl": {
          value: "1.1875rem",
        },
        "3xl": {
          value: "1.6875rem",
        },
        "4xl": {
          value: "2.1875rem",
        },
      },
      fonts: {
        heading: { value: "var(--font-custom)" },
        body: { value: "var(--font-custom)" },
        code: { value: "var(--font-source-code-pro)" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: "var(--page-background)" },
          subtle: { value: "var(--neutral-background-weak)" },
          muted: { value: "var(--neutral-alpha-weak)" },
          emphasized: { value: "var(--neutral-background-strong)" },
          panel: {
            value: { _light: "var(--page-background)", _dark: "var(--neutral-background-medium)" },
          },
          inverted: {
            value: { _light: "var(--neutral-solid-weak)", _dark: "var(--neutral-solid-strong)" },
          },
        },
        border: {
          DEFAULT: { value: "var(--neutral-border-medium)" },
          subtle: { value: "var(--neutral-border-weak)" },
          muted: { value: "var(--neutral-alpha-medium)" },
          emphasized: { value: "var(--neutral-border-strong)" },
          inverted: {
            value: { _light: "var(--neutral-solid-weak)", _dark: "var(--neutral-solid-strong)" },
          },
        },
        text: {
          DEFAULT: { value: "var(--neutral-on-background-weak)" },
          subtle: { value: "var(--neutral-on-background-weak)" },
          muted: { value: "var(--neutral-on-background-weak)" },
          emphasized: { value: "var(--neutral-on-background-strong)" },
        },
        gray: {
          subtle: { value: "var(--neutral-background-medium)" },
          contrast: {
            value: {
              _light: "var(--brand-on-solid-strong)",
              _dark: "var(--brand-on-background-strong)",
            },
          },
          muted: { value: "var(--neutral-alpha-weak)" },
          emphasized: { value: "var(--neutral-background-strong)" },
          solid: {
            value: { _light: "var(--brand-solid-strong)", _dark: "var(--brand-background-strong)" },
          },
          inverted: {
            value: { _light: "var(--neutral-solid-weak)", _dark: "var(--neutral-solid-strong)" },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
