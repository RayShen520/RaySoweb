# RaySo AI 官方站点（Next.js 版本）

本仓库将原来的单页 `index.html` 升级为基于 **Next.js 14** 的现代化前端项目，并保持了原有的视觉与交互体验（滚动动画、案例轮播、Three.js 互动模型等）。

## 如何本地运行

1. 安装依赖（只需执行一次）：
   ```bash
   npm install
   ```
2. 启动开发环境：
   ```bash
   npm run dev
   ```
   浏览器访问 `http://localhost:3000`
3. 构建生产版本（Netlify 会自动执行）：
   ```bash
   npm run build
   ```

## 部署到 Netlify

1. 将仓库推送到 GitHub。
2. 在 Netlify 选择 “Import from Git”。
3. 运行命令保持默认：
   - Build command: `npm run build`
   - Publish directory: `.next`
4. 如需使用 Netlify Functions / Image 优化，可安装官方插件 `@netlify/plugin-nextjs`（在 Netlify UI 的 Build Plugins 中添加即可）。

## 目录结构

```
.
├── app
│   ├── globals.css      # 全局样式（由原 CSS 分离）
│   ├── layout.tsx       # 页面骨架，包含字体、Meta
│   └── page.tsx         # 首页主体，组件化后的内容
├── public
│   └── favicon.svg
├── next.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## 备用

原始的 `index.html` 仍保留在仓库根目录，方便随时查阅或回滚。若不再需要，可自行删除。

