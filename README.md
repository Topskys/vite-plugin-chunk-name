# VitePluginChunkName

A Vite plugin to customize the name of chunk files.


![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/vite-plugin-chunk-name%400.1.0?label=size)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/topskys/vite-plugin-chunk-name)
![NPM Downloads](https://img.shields.io/npm/dw/vite-plugin-chunk-name)


## Install

Using npm:

```bash
npm install vite-plugin-chunk-name -D
```

## Basic Usage

Add the plugin to your `vite.config.ts` file:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vitePluginChunkName from 'vite-plugin-chunk-name';

export default defineConfig({
  plugins: [
    // ...
    vitePluginChunkName()
  ],
})
```
then you can use the `viteChunkName` comment to customize the chunk file name in then import statement:

```ts
import(/* viteChunkName: 'about' */ './pages/about/index.vue')
```

## Options

if you want to customize the plugin's behavior, you can pass an options object:


```ts
import { defineConfig } from 'vite';
import vitePluginChunkName from 'vite-plugin-chunk-name';

export default defineConfig({
  plugins: [
    vue(),
    // default options
    vitePluginChunkName({
      include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
      exclude: ['**/node_modules/**'],
      minChunk: false,
      debug: false,
    })
  ],
})
```

### include

Type: `string | RegExp | (string | RegExp)[]`

Default: `['src/**/*.{js,jsx,ts,tsx,vue}']`

The files to be included in the plugin.

### exclude

Type: `string | RegExp | (string | RegExp)[]`

Default: `['**/node_modules/**']`

The files to be excluded in the plugin.

### minChunk

Type: `boolean`

Default: `false`

Whether to use the minified version of the chunk file name.

### debug

Type: `boolean`

Default: `false`

Whether to print debug information.