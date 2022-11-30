import { winPath } from "@umijs/utils/dist/winPath";
import { loadConfig } from "tsconfig-paths";
import * as MappingEntry from "tsconfig-paths/lib/mapping-entry";

/**
 * convert alias from tsconfig paths
 * @export
 * @param {string} cwd
 */
export function convertAliasByTsconfigPaths(cwd: string) {
  const config = loadConfig(cwd);
  const bundle: Record<string, string> = {};
  const bundless: typeof bundle = {};

  if (config.resultType === "success") {
    const { absoluteBaseUrl, paths } = config;

    let absolutePaths = MappingEntry.getAbsoluteMappingEntries(
      absoluteBaseUrl,
      paths,
      true
    );

    absolutePaths.forEach((entry) => {
      if (entry.pattern === "*") return;

      const [physicalPathPattern] = entry.paths;
      const name = entry.pattern.replace(/\/\*$/, "");
      const target = winPath(physicalPathPattern).replace(/\/\*$/, "");

      bundle[name] = target;

      // for bundless, only convert paths which within cwd
      if (target.startsWith(`${winPath(cwd)}/`)) {
        bundless[name] = target;
      }
    });
  }

  return { bundle, bundless };
}

export default convertAliasByTsconfigPaths;
