import type { FilterPattern, Plugin } from 'vite';

/**
 * 插件主函数
 * 通过特殊注释为动态导入的模块设置自定义chunk名称
 * @param options 插件配置选项
 * @returns Vite插件实例
 */
export default function vitePluginChunkName(options: PluginChunkNameOptions): Plugin;

/**
 * 插件配置选项接口
 */
export type PluginChunkNameOptions = {
  /**
   * 包含的文件路径模式
   * 可以是字符串、字符串数组或null
   */
  include?: FilterPattern;

  /**
   * 排除的文件路径模式
   * 可以是字符串、字符串数组或null
   */
  exclude?: FilterPattern;

  /**
   * 是否最小化chunk
   * 为true时将node_modules中的每个包生成单独的chunk
   * 默认值: false
   */
  minChunk?: boolean;

  /**
   * 是否启用调试日志
   * 默认值: false
   */
  debug?: boolean;
};

/**
 * 导入项接口
 * 用于存储动态导入的文件路径和对应的chunk名称
 */
export type ImportItem = {
  /**
   * 导入的文件路径
   */
  importPath: string;

  /**
   * 自定义的chunk名称
   */
  chunkName: string;
};
