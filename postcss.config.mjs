const config = {
  plugins: {
    "@tailwindcss/postcss": {},
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
