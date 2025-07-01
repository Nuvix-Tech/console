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
          value: "0.25rem", // Very small rounding, good for tiny elements
        },
        xs: {
          value: "0.5rem", // Standard, clearly rounded for buttons/inputs
        },
        sm: {
          value: "1.175rem", // More pronounced rounded corners for small elements
        },
        md: {
          value: "1.5rem", // Very rounded for most buttons and input fields, almost pill-like for smaller ones
        },

        // --- For larger elements (Cards, Modals, Sections) ---
        lg: {
          value: "1.25rem", // Subtle but noticeable rounding for cards/larger boxes
        },
        xl: {
          value: "1.5rem", // More defined rounding for medium to large containers
        },
        "2xl": {
          value: "2rem", // Pronounced rounding for larger sections, but still elegant
        },
        "3xl": {
          value: "2.5rem", // For significant sections or hero elements that need a soft edge
        },
        "4xl": {
          value: "3rem", // The largest, for very prominent sections with controlled soft edges
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
          DEFAULT: {
            value: {
              _light: "var(--neutral-border-strong)",
              _dark: "var(--neutral-border-medium)",
            },
          },
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
