# 部署说明

## GitHub Pages 部署步骤

### 当前状态
项目代码已成功推送到 GitHub 仓库：https://github.com/xiezutao-svg/asian-beach-games-staff-platform

### 启用 GitHub Pages

1. 访问仓库设置页面：
   https://github.com/xiezutao-svg/asian-beach-games-staff-platform/settings/pages

2. 在 **Source** 部分选择：
   - Branch: `main`
   - Folder: `/root` （根目录）

3. 点击 **Save** 保存设置

4. 几分钟后访问：
   https://xiezutao-svg.github.io/asian-beach-games-staff-platform/

### 替代方案：本地运行

如果 GitHub Pages 部署遇到问题，可以直接本地运行：

```bash
cd "d:\篮协赛事\亚沙会工作人员平台"
npm run dev
```

然后在浏览器中访问显示的地址（通常是 http://localhost:3000 或类似端口）

### 本地构建预览

```bash
cd "d:\篮协赛事\亚沙会工作人员平台"
npm run build
npm run preview
```

## 注意事项

- 项目使用 Vue 3 + TypeScript + Vite
- 需要安装依赖：`npm install`
- 橙色主题：#FF6B35
- 响应式设计：适配手机和电脑
