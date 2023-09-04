import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  cjsInterop: true,
  clean: true,
  tsconfig: 'tsconfig.json',
  splitting: false,
  silent: true,
})
