/* eslint-disable */
const plugin = require("tailwindcss/plugin");

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = {
  plugins: [
    plugin(
      function () {
        return;
      },
      {
        theme: {
          colors: {
            primary: {
              50: withOpacityValue("--hope-colors-primary-50"),
              100: withOpacityValue("--hope-colors-primary-100"),
              200: withOpacityValue("--hope-colors-primary-200"),
              300: withOpacityValue("--hope-colors-primary-300"),
              400: withOpacityValue("--hope-colors-primary-400"),
              500: withOpacityValue("--hope-colors-primary-500"),
              600: withOpacityValue("--hope-colors-primary-600"),
              700: withOpacityValue("--hope-colors-primary-700"),
              800: withOpacityValue("--hope-colors-primary-800"),
              900: withOpacityValue("--hope-colors-primary-900"),
            },
            accent: {
              50: withOpacityValue("--hope-colors-accent-50"),
              100: withOpacityValue("--hope-colors-accent-100"),
              200: withOpacityValue("--hope-colors-accent-200"),
              300: withOpacityValue("--hope-colors-accent-300"),
              400: withOpacityValue("--hope-colors-accent-400"),
              500: withOpacityValue("--hope-colors-accent-500"),
              600: withOpacityValue("--hope-colors-accent-600"),
              700: withOpacityValue("--hope-colors-accent-700"),
              800: withOpacityValue("--hope-colors-accent-800"),
              900: withOpacityValue("--hope-colors-accent-900"),
            },
            dark: {
              50: withOpacityValue("--hope-colors-dark-50"),
              100: withOpacityValue("--hope-colors-dark-100"),
              200: withOpacityValue("--hope-colors-dark-200"),
              300: withOpacityValue("--hope-colors-dark-300"),
              400: withOpacityValue("--hope-colors-dark-400"),
              500: withOpacityValue("--hope-colors-dark-500"),
              600: withOpacityValue("--hope-colors-dark-600"),
              700: withOpacityValue("--hope-colors-dark-700"),
              800: withOpacityValue("--hope-colors-dark-800"),
              900: withOpacityValue("--hope-colors-dark-900"),
            },
            neutral: {
              50: withOpacityValue("--hope-colors-neutral-50"),
              100: withOpacityValue("--hope-colors-neutral-100"),
              200: withOpacityValue("--hope-colors-neutral-200"),
              300: withOpacityValue("--hope-colors-neutral-300"),
              400: withOpacityValue("--hope-colors-neutral-400"),
              500: withOpacityValue("--hope-colors-neutral-500"),
              600: withOpacityValue("--hope-colors-neutral-600"),
              700: withOpacityValue("--hope-colors-neutral-700"),
              800: withOpacityValue("--hope-colors-neutral-800"),
              900: withOpacityValue("--hope-colors-neutral-900"),
            },
            success: {
              50: withOpacityValue("--hope-colors-success-50"),
              100: withOpacityValue("--hope-colors-success-100"),
              200: withOpacityValue("--hope-colors-success-200"),
              300: withOpacityValue("--hope-colors-success-300"),
              400: withOpacityValue("--hope-colors-success-400"),
              500: withOpacityValue("--hope-colors-success-500"),
              600: withOpacityValue("--hope-colors-success-600"),
              700: withOpacityValue("--hope-colors-success-700"),
              800: withOpacityValue("--hope-colors-success-800"),
              900: withOpacityValue("--hope-colors-success-900"),
            },
            info: {
              50: withOpacityValue("--hope-colors-info-50"),
              100: withOpacityValue("--hope-colors-info-100"),
              200: withOpacityValue("--hope-colors-info-200"),
              300: withOpacityValue("--hope-colors-info-300"),
              400: withOpacityValue("--hope-colors-info-400"),
              500: withOpacityValue("--hope-colors-info-500"),
              600: withOpacityValue("--hope-colors-info-600"),
              700: withOpacityValue("--hope-colors-info-700"),
              800: withOpacityValue("--hope-colors-info-800"),
              900: withOpacityValue("--hope-colors-info-900"),
            },
            warning: {
              50: withOpacityValue("--hope-colors-warning-50"),
              100: withOpacityValue("--hope-colors-warning-100"),
              200: withOpacityValue("--hope-colors-warning-200"),
              300: withOpacityValue("--hope-colors-warning-300"),
              400: withOpacityValue("--hope-colors-warning-400"),
              500: withOpacityValue("--hope-colors-warning-500"),
              600: withOpacityValue("--hope-colors-warning-600"),
              700: withOpacityValue("--hope-colors-warning-700"),
              800: withOpacityValue("--hope-colors-warning-800"),
              900: withOpacityValue("--hope-colors-warning-900"),
            },
            danger: {
              50: withOpacityValue("--hope-colors-danger-50"),
              100: withOpacityValue("--hope-colors-danger-100"),
              200: withOpacityValue("--hope-colors-danger-200"),
              300: withOpacityValue("--hope-colors-danger-300"),
              400: withOpacityValue("--hope-colors-danger-400"),
              500: withOpacityValue("--hope-colors-danger-500"),
              600: withOpacityValue("--hope-colors-danger-600"),
              700: withOpacityValue("--hope-colors-danger-700"),
              800: withOpacityValue("--hope-colors-danger-800"),
              900: withOpacityValue("--hope-colors-danger-900"),
            },
          },
        },
      }
    ),
  ],
};