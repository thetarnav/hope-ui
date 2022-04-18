const repoRootPath = `<rootDir>`;
const solidjsPath = `${repoRootPath}/node_modules/solid-js`;

module.exports = {
  preset: "ts-jest",

  globals: {
    "ts-jest": {
      tsconfig: `${repoRootPath}/tsconfig.json`,
      babelConfig: {
        presets: ["babel-preset-solid", "@babel/preset-env"],
      },
    },
  },

  testEnvironment: "jsdom",

  setupFilesAfterEnv: [`${repoRootPath}/jest.setup.ts`, "regenerator-runtime"],

  moduleNameMapper: {
    "solid-js": `${solidjsPath}/dist/solid.cjs`,
    "solid-js/web": `${solidjsPath}/web/dist/web.cjs`,
    "solid-js/store": `${solidjsPath}/store/dist/store.cjs`,
  },

  verbose: true,
  testTimeout: 30000,
};