import { defineConfig } from "rollup";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

/**
 * @type {import('rollup').RollupOptions}
 */
export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      exports: "auto",
      sourcemap: false
    },
    {
      file: "dist/index.mjs",
      format: "esm",
      exports: "auto",
      sourcemap: false
    },
  ],
  external: ["rollup", "vite", "path"],
  plugins: [terser(), typescript()]
});
