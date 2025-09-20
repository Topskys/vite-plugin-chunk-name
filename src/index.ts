import path from 'path';
import type { ManualChunkMeta } from 'rollup';
import { createFilter, type Alias, type Plugin, type UserConfig } from 'vite';
import { Logger } from './utils/logger';
import type { ImportItem, PluginChunkNameOptions } from './utils/types';
import { IMPORT_CHUNK_NAME_REGEX, VITE_PLUGIN_NAME } from './utils/const';

/**
 * Vite插件，用于在构建时为代码块分配自定义名称
 *
 * @param {PluginChunkNameOptions} options - 插件配置选项
 * @returns {Plugin} - 返回一个Vite插件对象
 * @example
 * import(\/\* chunkName: "my-chunk" \*\/ './my-module');
 *
 * import vitePluginChunkName from "vite-plugin-chunk-name";
 * export default {
 *   plugins: [ vitePluginChunkName() ]
 * };
 */
export default function vitePluginChunkName(options: PluginChunkNameOptions = {}): Plugin {
  // 从配置选项中解构出默认值
  const {
    include = ['src/**/*.{js,ts,jsx,tsx,vue}'], // 默认包含的文件类型
    exclude = ['**/node_modules/**'], // 默认排除的文件
    minChunk = false, // 是否启用最小代码块模式
    debug = false,
  } = options;

  let _config: UserConfig; // 存储vite基础配置
  const filter = createFilter(include, exclude); // 创建过滤器
  const modulesChunkNameMap = new Map<string, string>(); // 存储文件路径与chunkName的映射
  const logger = new Logger(debug);

  /**
   * 从代码字符串中查找导入路径和块名称
   *
   * @param {string} code 原代码字符串
   * @returns {ImportItem[]} 包含导入路径和块名称的数组
   */
  function findImports(code: string): ImportItem[] {
    let match: RegExpExecArray | null = null;
    const imports: ImportItem[] = [];
    while ((match = IMPORT_CHUNK_NAME_REGEX.exec(code)) !== null) {
      const chunkName = match[1]?.trim();
      const importPath = match[2]?.trim();
      if (chunkName && importPath) {
        imports.push({ importPath, chunkName });
      }
    }
    return imports;
  }

  /**
   * 手动解析给定导入路径为实际文件路径
   *
   * @param {string} importPath 导入路径
   * @param {string} fileDir 当前文件目录
   * @param {Record<string, string> | readonly Alias[]} alias 路径别名映射
   * @returns {string} 解析后的实际文件路径
   */
  function getResolvedPath(
    importPath: string,
    fileDir: string,
    alias: Record<string, string> | readonly Alias[],
  ): string {
    let resolvedPath = importPath;
    if (importPath.startsWith('.')) {
      // 处理相对路径
      resolvedPath = path.resolve(fileDir, resolvedPath);
    } else {
      // 处理路径别名映射
      if (Array.isArray(alias)) {
        // 处理 readonly Alias[] 类型的别名
        for (const aliasItem of alias) {
          if (resolvedPath.startsWith(aliasItem.find)) {
            const removedAlias = resolvedPath.replace(aliasItem.find, '');
            resolvedPath = path.join(aliasItem.replacement, removedAlias);
            break; // 找到匹配的别名后立即退出循环
          }
        }
      } else {
        // 处理 Record<string, string> 类型的别名
        for (const [aliasKey, aliasValue] of Object.entries(alias)) {
          if (resolvedPath.startsWith(aliasKey)) {
            const removedAlias = resolvedPath.replace(aliasKey, '');
            resolvedPath = path.join(aliasValue, removedAlias);
            break; // 找到匹配的别名后立即退出循环
          }
        }
      }
    }
    return resolvedPath.replace(/\\/g, '/');
  }

  /**
   * 处理文件导入路径和chunkName的映射关系
   *
   * 该函数遍历所有导入项，解析每个导入路径为实际文件路径，
   * 并将解析后的路径与对应的chunkName存储在映射表中。
   *
   * @param {string} id - 当前处理的文件ID
   * @param {ImportItem[]} imports - 导入项数组，包含导入路径和chunkName
   */
  function takeChunkName(id: string, imports: ImportItem[]): void {
    const fileDir = path.dirname(id);
    const alias = _config?.resolve?.alias ?? ({} as Record<string, string> | readonly Alias[]);

    for (const { importPath, chunkName } of imports) {
      try {
        const normalizedPath = getResolvedPath(importPath, fileDir, alias);
        if (normalizedPath) {
          modulesChunkNameMap.set(normalizedPath, chunkName);
        }
      } catch (error) {
        logger.warn(`[${VITE_PLUGIN_NAME}] Failed to resolve path mapping for ${importPath}: ${error}`);
      }
    }
  }

  /**
   * 获取用户原始的 manualChunks 配置
   *
   * @returns {Function | Object | undefined} 返回用户配置的 manualChunks，可能是函数、对象或未定义
   */
  function getOriginalManualChunks() {
    const output = _config?.build?.rollupOptions?.output;
    return Array.isArray(output) ? undefined : output?.manualChunks;
  }

  /**
   * 处理手动分块逻辑，决定每个模块应该属于哪个代码块
   *
   * 该函数按照以下优先级处理模块分块：
   * 1. 检查模块是否在 chunkName 映射表中
   * 2. 应用用户自定义的 manualChunks 配置
   * 3. 处理 node_modules 中的模块
   *
   * @param {string} id - 模块ID
   * @param {ManualChunkMeta} meta - Rollup 提供的元数据
   * @returns {string | null} 返回代码块名称，如果不分块则返回 null
   */
  function handleManualChunks(id: string, meta: ManualChunkMeta) {
    // 规范化路径，统一使用正斜杠
    const normalizedId = id.replace(/\\/g, '/');
    // 获取用户原始manualChunks配置
    const originalManualChunks = getOriginalManualChunks();

    // 优先检查模块映射表
    if (filter(normalizedId)) {
      // 检查规范化后的路径
      if (modulesChunkNameMap.has(normalizedId)) {
        return modulesChunkNameMap.get(normalizedId);
      }
      // 也检查原始路径（为了向后兼容）
      if (modulesChunkNameMap.has(id)) {
        return modulesChunkNameMap.get(id);
      }
      return null;
    }

    // 处理用户自定义的manualChunks
    if (originalManualChunks) {
      if (typeof originalManualChunks === 'function') {
        return originalManualChunks(id, meta);
      }

      if (typeof originalManualChunks === 'object') {
        for (const [chunkName, paths] of Object.entries(originalManualChunks)) {
          if (typeof paths === 'string' && id.includes(paths)) {
            return chunkName;
          } else if (Array.isArray(paths) && paths.some((path) => id.includes(path))) {
            return chunkName;
          }
        }
      }
    }

    // 处理node_modules
    if (normalizedId.includes('node_modules/')) {
      if (minChunk && normalizedId) {
        try {
          const packageName = normalizedId?.split?.('node_modules/')?.[1]?.split('/')?.[0];
          return packageName;
        } catch (e) {
          logger.warn(`Failed to extract package name from ${normalizedId}: ${e}`);
          return 'vendor';
        }
      }
      return 'vendor';
    }

    return null;
  }

  return {
    name: VITE_PLUGIN_NAME,
    apply: 'build',
    enforce: 'pre', // 在rollup的buildStart钩子之前执行，以便在构建开始前处理手动分块逻辑
    config(config) {
      if (!config.build) {
        config.build = {};
      }
      if (!config.build.rollupOptions) {
        config.build.rollupOptions = {};
      }
      if (!config.build.rollupOptions.output) {
        config.build.rollupOptions.output = {};
      }
      _config = config;

      return {
        build: {
          rollupOptions: {
            output: {
              manualChunks: handleManualChunks,
            },
          },
        },
      };
    },
    transform(code, id) {
      if (!filter(id) || id.includes('node_modules')) {
        return null;
      }

      // 提取代码中的动态导入语句和注释中定义的chunkName对象数组
      const imports = findImports(code);
      // 处理文件导入路径和chunkName的映射
      takeChunkName(id, imports);

      return null;
    },
  };
}
