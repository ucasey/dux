import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
// import json from '@rollup/plugin-json';
import size from 'rollup-plugin-size';
import nodeExternals from 'rollup-plugin-node-externals';
import ttypescript from 'ttypescript';

const onWarn = (warning, warn) => {
  // 忽略循环依赖警告
  if (warning.code === 'CIRCULAR_DEPENDENCY') {
    return;
  }
  // 对于其他警告，保持默认行为
  warn(warning);
};

const plugins = [
  nodeExternals(), // 不编译外部模块

  resolve({ preferBuiltins: true }), // 解析外部模块
  size(), // 输出文件大小提示
  // json(), // 解析 json 文件
  // commonjs(), // 解析 commonjs 模块
];

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib/cjs',
      format: 'cjs',
    },
    plugins: [
      ...plugins,
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            allowJs: true,
            declarationDir: './lib/cjs/types',
          },
        },
        typescript: ttypescript,
        useTsconfigDeclarationDir: true,
      }), // 处理ts
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib/esm',
      format: 'esm',
    },
    plugins: [
      ...plugins,
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            allowJs: true,
            declarationDir: './lib/esm/types',
          },
        },
        // typescript: tts,
        useTsconfigDeclarationDir: true,
      }), // 处理ts
    ],
    onwarn: onWarn,
    // external: EXTERNAL_PACKAGES,
  },
];
