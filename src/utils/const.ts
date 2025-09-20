export const VITE_PLUGIN_NAME = 'vite-plugin-chunk-name';

/**
 * 匹配动态导入语句的正则表达式，用于提取导入路径和注释中的 chunk 名称。
 * @example
 * import(\/\* viteChunkName: 'A' \*\/ 'path/to/module.js') => ’A‘ 和 'path/to/module.js'
 */
export const IMPORT_CHUNK_NAME_REGEX = /import\s*\(\s*\/\*\s*viteChunkName:\s*['"]([^'"]+)['"]\s*\*\/\s*['"]([^'"]+)['"]\s*\)/g;
