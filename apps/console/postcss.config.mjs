import { default as c } from "@nuvix/sui/postcss.config";
const config = {
  ...c,
  plugins: {
    ...c.plugins,
    "@csstools/postcss-global-data": {
      files: ["src/ui/styles/breakpoints.scss"],
    },
    "postcss-custom-media": {},
    "postcss-flexbugs-fixes": {},
    "postcss-preset-env": {
      autoprefixer: {
        flexbox: "no-2009",
      },
      stage: 3,
      features: {
        "custom-properties": false,
      },
    },
  },
};

export default config;
