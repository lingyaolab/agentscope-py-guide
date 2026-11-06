# 部署说明

站点是零构建的纯静态文件，**发布物就是 `agentscope-py-learn/` 这一个目录**，不需要 npm、不需要编译。

## 1. 发布物清单

| 必须发布 | 说明 |
| --- | --- |
| `agentscope-py-learn/index.html` | 站点入口 |
| `agentscope-py-learn/404.html` | 站内 404（自包含样式，任意路径深度可用） |
| `agentscope-py-learn/.nojekyll` | 告诉 GitHub Pages 跳过 Jekyll |
| `agentscope-py-learn/robots.txt` | 允许抓取 |
| `agentscope-py-learn/assets/` | 样式、脚本、搜索索引、favicon |
| `agentscope-py-learn/chapters/`、`appendix/` | 全部正文 |

**不要发布**：

- `agentscope-2.0.11/`（上游源码副本，只在本地核对 `file:line` 用）
- `tools/`（自检脚本，Node 环境使用，不是站点资源）
- 仓库根 `index.html` 只是本地/整仓部署时的跳转入口；用下面的平台配置时不需要它

## 2. 本地预览

```powershell
# 方式一：直接双击（file:// 下全部功能可用）
agentscope-py-learn\index.html

# 方式二：起一个静态服务器，行为与线上一致
python -m http.server 8080
# 打开 http://localhost:8080/agentscope-py-learn/
```

## 3. GitHub Pages（可选，不用工作流）

仓库没有 CI 工作流，Pages 用「分支部署」即可，零构建：

1. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **Deploy from a branch**
2. Branch 选 `main`，目录选 `/ (root)`
3. 保存后访问 `https://<user>.github.io/<repo>/`，根目录的 `index.html` 会跳到 `agentscope-py-learn/`

站点内部全部使用相对链接，部署在子路径下不需要改任何配置。如果以后想改用 Actions 部署，再把工作流加回来即可。

## 4. Vercel / Netlify / Cloudflare Pages

三者配置相同：

| 配置项 | 值 |
| --- | --- |
| Root / Base directory | `agentscope-py-learn` |
| Build command | 留空 |
| Output directory | `.`（或留空，视平台提示） |

`404.html` 会作为站内 404 自动生效。

## 5. 自建服务器（nginx）

```nginx
server {
  listen 80;
  server_name learn.example.com;
  root /srv/agentscope-py-learn;
  index index.html;

  location / {
    try_files $uri $uri/ =404;
  }
  error_page 404 /404.html;

  gzip on;
  gzip_types text/html text/css application/javascript image/svg+xml;
}
```

静态资源可加长缓存，HTML 建议 `no-cache`（内容更新后即时生效）：

```nginx
location ~* \.(css|js|svg)$ { add_header Cache-Control "public, max-age=86400"; }
```

## 6. 自定义域名（GitHub Pages）

1. 在 `agentscope-py-learn/` 新建 `CNAME` 文件，内容为域名（如 `learn.example.com`）
2. DNS 添加 `CNAME` 记录指向 `<user>.github.io`
3. 在仓库 Settings → Pages 填入同一个域名并开启 HTTPS

## 7. 发布前检查清单

```powershell
node tools/build-search-index.cjs   # 正文改过就必须重建
node tools/check-site.cjs           # 链接、锚点、nav 一致性、meta、发布物
node tools/check-sources.cjs        # 每条出处是否都能在 2.0.11 源码里定位（含路径大小写）
```

再手测三件事：

- 手机宽度（390px）下：侧栏抽屉、搜索层、阅读设置、目录抽屉
- 首页进度卡：导出 → 导入 → 清空
- 随便点开一章，确认顶部进度条与底部「标记本章已读完」正常

## 8. 更新流程

1. 改正文（新增章节时同时改 `agentscope-py-learn/assets/nav.js`）
2. `node tools/build-search-index.cjs`
3. `node tools/check-site.cjs`、`node tools/check-sources.cjs`
4. 在 `CHANGELOG.md` 记一笔（站点内首页「更新记录」同步）
5. 提交并 push；如果启用了 Pages 分支部署，会自动更新

## 9. 版本号约定

- `agentscope-py-learn/assets/nav.js` 里的 `version` 是**所讲解的框架版本**（显示在页头，当前 `2.0.11`），不要和站点版本混用
- 站点版本记录在 `CHANGELOG.md` 与首页「更新记录」里
