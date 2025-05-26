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
          DEFAULT: { value: { base: "var(--page-background)" } },
          // subtle: { value: { base: "{colors.slate.200}", _dark: "{colors.slate.800}" } },
          // muted: { value: { base: "{colors.slate.300}", _dark: "{colors.slate.700}" } },
          // emphasized: { value: { base: "{colors.slate.400}", _dark: "{colors.slate.600}" } },
          // panel: { value: { base: "{colors.slate.50}", _dark: "{colors.slate.950}" } },
          // inverted: { value: { base: "{colors.slate.900}", _dark: "{colors.slate.100}" } },
        },
        //   border: {
        //     DEFAULT: { value: { base: "{colors.slate.300}", _dark: "{colors.slate.500}" } },
        //     subtle: { value: { base: "{colors.slate.400}", _dark: "{colors.slate.600}" } },
        //     muted: { value: { base: "{colors.slate.500}", _dark: "{colors.slate.800}" } },
        //     emphasized: { value: { base: "{colors.slate.600}", _dark: "{colors.slate.400}" } },
        //   },
        //   text: {
        //     DEFAULT: { value: { base: "{colors.slate.900}", _dark: "{colors.slate.100}" } },
        //     subtle: { value: { base: "{colors.slate.700}", _dark: "{colors.slate.300}" } },
        //     muted: { value: { base: "{colors.slate.600}", _dark: "{colors.slate.400}" } },
        //     emphasized: { value: { base: "{colors.slate.800}", _dark: "{colors.slate.200}" } },
        //     inverted: { value: { base: "{colors.slate.100}", _dark: "{colors.slate.900}" } },
        //   },
        //   slate: {
        //     solid: {
        //       value: {
        //         base: "{colors.slate.900}",
        //         _dark: "{colors.slate.100}",
        //       },
        //     },
        //     contrast: {
        //       value: {
        //         base: "{colors.slate.50}",
        //         _dark: "{colors.slate.900}",
        //       },
        //     },
        //     fg: {
        //       value: {
        //         base: "{colors.slate.900}",
        //         _dark: "{colors.slate.100}",
        //       },
        //     },
        //     muted: {
        //       value: {
        //         base: "{colors.slate.300}",
        //         _dark: "{colors.slate.700}",
        //       },
        //     },
        //     subtle: {
        //       value: {
        //         base: "{colors.slate.200}",
        //         _dark: "{colors.slate.600}",
        //       },
        //     },
        //     emphasized: {
        //       value: {
        //         base: "{colors.slate.700}",
        //         _dark: "{colors.slate.200}",
        //       },
        //     },
        //     focusRing: {
        //       value: {
        //         base: "{colors.slate.400}",
        //         _dark: "{colors.slate.500}",
        //       },
        //     },
        //   },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
