import path from "path";
import resolveConfig from "../src";

test("Get correct config", () => {
  expect(
    resolveConfig(path.resolve(__dirname, "./fixtures/xx.config.js")).config
  ).toBe("Hello CJS");

  expect(
    resolveConfig(path.resolve(__dirname, "./fixtures/xx-esm.config.js")).config
  ).toBe("Hello EJS");

  expect(
    resolveConfig(path.resolve(__dirname, "./fixtures/xx.config")).config
  ).toBe("Hello World");
});
