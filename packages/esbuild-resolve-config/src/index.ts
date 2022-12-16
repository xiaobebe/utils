import esbuild from "esbuild";
import path from "path";
import fs from "fs";
import merge from "lodash/merge";
import * as register from "./register";
import { EXTS } from "./constants";

export function getCorrectConfigFile(filePath: string): string | null {
  const fileExt = path.extname(filePath);
  for (const ext of EXTS) {
    if (fileExt === ext && fs.existsSync(filePath)) {
      return filePath;
    }

    const file = `${filePath}${ext}`;

    if (fs.existsSync(file)) {
      return file;
    }
  }
  return null;
}

/**
 * @param configFile xx.config -> xx.config.ts, xx.config.js, xx.config.mjs
 */
export function resolveConfig<T extends Record<string, any>>(
  configFile: string,
  options?: { defaultConfig?: T }
) {
  let resolvedPath = getCorrectConfigFile(configFile);
  if (!resolvedPath) {
    return null;
  }
  resolvedPath = path.resolve(process.cwd(), resolvedPath);
  register.register({
    implementor: esbuild,
  });
  register.clearFiles();
  let config: T = options?.defaultConfig || ({} as T);
  try {
    const resolved = require(resolvedPath);
    config = merge(config, resolved.default ?? resolved);
  } catch (e) {
    // @ts-ignore
    throw new Error(`Parse config file failed: [${resolvedPath}], ${e.message}`, {
      cause: e,
    });
  }
  for (const file of register.getFiles()) {
    delete require.cache[file];
  }
  // includes the config File
  register.restore();

  return config;
}

export default resolveConfig;
