# VitePluginChunkName

## 创建项目

### 使用 Pnpm + Lerna 初始化Monorepo项目

1. 安装Lerna和Pnpm

```bash
npm install -g lerna pnpm
```

2. 创建一个新的项目目录

```bash
mkdir vite-plugin-chunk-name
cd vite-plugin-chunk-name
```

3. 初始化Lerna项目

```bash
lerna init
```

4. 准备结合pnpm，将基于npm下载的依赖文件node_modules删除

```bash
# 递归删除node_modules目录（慎用）
rm -rf node_modules package.json
# or
lerna clean
```

5. 新建pnpm-workspace.yaml文件

```bash
echo "workspaces:
  - 'packages/*'" > pnpm-workspace.yaml
```
添加如下内容：

```yaml
# pnpm-workspace.yaml
workspaces:
  - 'packages/*'
```

6. 删除 package.json 和 lerna.json 中的workspace、packages字段

```json
// package.json
{
  "workspaces": ["packages/*"]
}
```

```json
// lerna.json
{
  "packages": ["packages/*"]
}
```

7. 使用pnpm重新安装依赖

```bash
pnpm install
```

详细使用方法请参考[Pnpm与Lerna一起使用](https://lerna.nodejs.cn/docs/recipes/using-pnpm-with-lerna)

## 初始化目录结构

```bash
mkdir packages
cd packages
mkdir plugin-chunk-name
mkdir demo
```

```
vite-plugin-chunk-name
├── packages
│   ├── plugin-chunk-name
│   ├── demo
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── lerna.json
├── package.json
```

## 初始化plugin-chunk-name项目

```bash
cd plugin-chunk-name
pnpm init
pnpm install typescript @types/node --save-dev
```

## 项目打包

这里使用Rollup打包项目。

安装Rollup

```bash
pnpm install rollup @rollup/plugin-node-resolve @rollup/plugin-typescript typescript --save-dev
```

创建Rollup配置文件rollup.config.ts，并写入以下内容：

```ts
import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [
    resolve(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
  ],
};
```


## 参考资料

- [Lerna](https://lerna.js.org/docs/getting-started)
- [pnpm](https://pnpm.io/zh/)
- [Rollup](https://rollupjs.org/guide/en/)

- [vite-plugin-chunk-name](https://github.com/zhengyuxiang/vite-plugin-chunk-name)

2025年9月20日16:07:51

```bash
npm init -y
pnpm i typescript -D -w
npx tsc --init
```

## npm 发包

1. 换npm官方镜像源

```bash
npm config set registry https://registry.npmjs.org/
```
注意：在项目新建.npmrc文件，配置镜像源不管用，登录还是原来的镜像源。

2. 登录npm账号

```bash
npm login
```

等待npm login命令相应，回车打开浏览器登录npm账号。


3. 发布npm包

注意：发布前需要修改package.json中的version等字段，每次发布都需要递增。

```bash
npm 
npm publish
```

4. 取消发布

```bash
npm unpublish --force
```

5. 自动化发包

利用Github Actions实现CI/CD自动化NPM发包，可参考[官方文档](https://docs.npmjs.com/generating-provenance-statements#example-github-actions-workflow)或者[使用 Github Actions 自动发布包到 NPM 官网上](https://blog.csdn.net/biao_feng/article/details/136657070)。


## 其他

### 修改npm包版本号

修改package.json中的version，会生成tags，但不发布。

```bash
npm version patch
npm version minor
npm version major
```
可通过发布所有tags
```bash
git push origin --tags
```