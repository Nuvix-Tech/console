import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        slate: {
          DEFAULT: { value: "#6D748A" },
          "100": { value: "#040816" },
          "200": { value: "#0F152B" },
          "300": { value: "#393F55" },
          "400": { value: "#52586F" },
          "500": { value: "#6D748A" },
          "600": { value: "#8E94AA" },
          "700": { value: "#ACB2C8" },
          "800": { value: "#CCD2E8" },
          "900": { value: "#DAE0F6" },
          "1000": { value: "#E9EDFE" },
          "1100": { value: "#F1F3FD" },
          "1200": { value: "#F8F9FD" },
        }
      }
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { base: '{colors.slate.800}', _dark: '{colors.slate.300}' } },
          subtle: { value: { base: '{colors.slate.900}', _dark: '{colors.slate.100}' } },
          muted: { value: { base: '{colors.slate.700}', _dark: '{colors.slate.200}' } },
          emphasized: { value: { base: '{colors.slate.1000}', _dark: '{colors.slate.400}' } },
          inverted: { value: { base: '{colors.slate.300}', _dark: '{white}' } }
        },
        border: {
          DEFAULT: { value: { base: '{colors.slate.800}', _dark: '{colors.slate.400}' } },
          subtle: { value: { base: '{colors.slate.900}', _dark: '{colors.slate.300}' } },
          muted: { value: { base: '{colors.slate.1000}', _dark: '{colors.slate.200}' } },
        }
      }
    }
  }
})

export const system = createSystem(defaultConfig, config);
