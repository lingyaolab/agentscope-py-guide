# AgentScope Python 2.0.11 学习站 · 仓库入口

这是学习站的源码仓库。站点本体在 [`agentscope-py-learn/`](agentscope-py-learn/)，可以直接当静态网站部署。

- **本地看站**：双击 [`agentscope-py-learn/index.html`](agentscope-py-learn/index.html)，或在仓库根执行 `python -m http.server 8080` 后访问 <http://localhost:8080/agentscope-py-learn/>
- **部署**：见 [DEPLOY.md](DEPLOY.md)（GitHub Pages / Vercel / Netlify / 自建服务器）
- **更新记录**：见 [CHANGELOG.md](CHANGELOG.md)
- **自检**：`node tools/check-site.cjs` 与 `node tools/check-sources.cjs`

## 目录结构

```
agentscope-py-learn/        站点本体（发布时把这个目录作为站点根）
├── index.html              首页（学习进度、章节入口、更新记录）
├── 404.html                站内 404（自包含样式，任意深度可用）
├── robots.txt
├── chapters/               第 00–26 章（当前 00–01 可读，其余规划中）
├── appendix/               附录 A–F（规划中）
└── assets/                 base.css / site.js / nav.js / search-index.js / favicon.svg

tools/                      零依赖 Node 脚本
├── check-site.cjs          静态检查（链接、锚点、nav 一致性、meta、发布物）
├── check-sources.cjs       校验每处 file:line 能否在 2.0.11 源码里定位，并检查路径大小写
└── build-search-index.cjs  从各页正文生成全文搜索索引

agentscope-2.0.11/          上游源码副本（仅本地核对出处用，不入库）
```

## 内容约定

- 全部内容对应 **AgentScope Python 2.0.11**（tag `v2.0.11`），默认模型 **DeepSeek**，Python **3.11+**。
- 页面上的每个数字、默认值、抛错点都带 `file:line` 出处标签。
- 站点零构建、不联网、不依赖 CDN，`file://` 直接打开即可阅读。
- 章节清单一律改 `agentscope-py-learn/assets/nav.js`；正文改动后重跑 `node tools/build-search-index.cjs`。
- 与 [`agentscope-guide`](https://github.com/lingyaolab/agentscope-guide)（AgentScope Java 2.0.4）保持同一套概念，便于双语对照。

## 拉取上游源码（本地核对出处）

推荐直接用 tag：

```powershell
git clone --depth 1 --branch v2.0.11 https://github.com/agentscope-ai/agentscope.git agentscope-2.0.11
```

如果 GitHub 直连超时，也可以下载同版本 tarball 后解压到 `agentscope-2.0.11/`：

```powershell
curl.exe -L -o agentscope-v2.0.11.tar.gz `
  https://github.com/agentscope-ai/agentscope/archive/refs/tags/v2.0.11.tar.gz
tar -xzf agentscope-v2.0.11.tar.gz
```

`agentscope-2.0.11/` 已在 `.gitignore` 中忽略，不要把整份源码提交进本站仓库。

## 来源与许可

教程基于 [agentscope](https://github.com/agentscope-ai/agentscope) 2.0.11 的源码与官方中文文档整理，引用部分遵循上游 Apache-2.0 许可。
