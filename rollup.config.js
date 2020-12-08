import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs", exports: "named", sourcemap: true },
      { file: pkg.module, format: "es", exports: "named", sourcemap: true },
    ],
    external: Object.keys(pkg.devDependencies),
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            declarationDir: "tmp/dts",
          },
        },
      }),
    ],
  },
  {
    input: "tmp/dts/index.d.ts",
    output: { file: "dist/index.d.ts", format: "es" },
    plugins: [dts()],
  },
];
