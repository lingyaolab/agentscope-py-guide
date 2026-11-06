# 更新记录

站点版本与所讲解的框架版本分开记：框架版本固定在 **AgentScope Python 2.0.11**，站点版本见下。

## v0.4.0 — 2026-11-06

新增第 04 章「模型接入」，并把 01、02 章的示例模型名修正到当前活跃版本。

- **凭证**：`CredentialBase`、各家 `type` 判别值、`SecretStr`、`get_chat_model_class()` 的绑定关系。
- **工厂**：`CredentialFactory.from_dict` / `register_credential` / `list_schemas`。
- **模型**：`ChatModelBase.__call__` 的两种返回、重试预算、取消返回 `interrupted`、流式最终聚合块。
- **参数**：`stream=True`、`max_retries=3`（总尝试 4 次）、固定 `retry_delay`、`context_size` 的真实含义。
- **响应**：`ChatResponse`、`ChatUsage`，以及模型层 `FinishedReason` 与回复层 `ReplyFinishedReason` 的区别。
- **重试**：DeepSeek 的四类可重试异常，401 / 400 直接抛。
- **模型卡片**：`ModelCard` 字段、`_models/*.yaml` 扫描、`list_models()` 用法。
- **修正**：`deepseek-chat` / `deepseek-reasoner` 在 2.0.11 已标记 `sunset`（2026-07-24），
  01、02 章示例统一改为 `deepseek-v4-flash`，01 章速查表同步更新。
- **串联**：01→02→03→04 的「下一步」互链补齐，不再出现「尚未发布」的旧提示。

## v0.3.0 — 2026-11-06

新增第 03 章「消息与事件」，把 02 章的事件流拆到可自己实现前端/持久化的程度。

- **Msg**：三个必填字段、控制字段、角色与内容块的硬校验关系。
- **内容块**：Text / Thinking / Hint / ToolCall / ToolResult / Data 六种，附两个状态枚举。
- **事件**：`EventType` 全景，按回复、模型调用、内容块、工具、交互五组归类。
- **拼装**：`Msg.append_event()` 的完整映射表，以及 `reply_id` / `block_id` 不匹配时的静默丢弃规则。
- **契约**：SSE 帧格式、30 秒心跳、重放与按 `reply_id` 去重、`?after=` 游标。
- **序列化**：`model_dump(mode="json")` 的注意事项与事件日志 + 最终 Msg 的双份持久化。

## v0.2.1 — 2026-11-06

去掉 GitHub Actions 部署工作流，改为纯本地校验 + 可选的分支部署。

- **删除**：`.github/workflows/deploy-pages.yml`。原因是 Pages 未启用，每次 push 都会让工作流失败；
  静态站本身零构建，没必要为此维护 CI。
- **同步**：`tools/check-site.cjs` 不再要求工作流文件存在；`DEPLOY.md` 的 Pages 章节改为
  「Settings → Pages → Deploy from a branch」的分支部署说明。
- **保留**：`build-search-index`、`check-site`、`check-sources` 三个脚本仍作为提交前的本地自检。

## v0.2.0 — 2026-11-06

新增第 02 章「第一个 Agent」，把 01 章的「一次模型调用」推进到完整的 ReAct 循环。

- **工具**：用 `FunctionTool` 包装 `get_weather`，讲清 name / description / input_schema 的自动推导来源。
- **权限**：说明 `FunctionTool` 默认 ASK，以及 `is_read_only=True` 与 `permission=` 两种放行方式。
- **循环**：拆解 `_next_action()` 的 Reasoning / Acting / Exit 三种动作，以及 `cur_iter` 的累加时机。
- **终止**：`completed` / `exceed_max_iters` / `interrupted` / `error` 四种结局，含达到上限后的强制收尾调用。
- **状态**：`AgentState` 的字段分工与「Agent 无状态」的真实含义。
- **流式**：`reply_stream()` 的事件顺序与 `yield_final_msg=True` 的用法。
- **核对**：第 02 章新增 29 条 `file:line` 出处，全部通过脚本校验。

## v0.1.1 — 2026-11-06

换掉从 Spring AI 站继承的绿色，给 Python 站一套独立配色与图标。

- **主色**：亮色主题 `#6d28d9`，暗色主题 `#a78bfa`，对应 `--brand` / `--brand-soft`；
  与 AgentScope Java 站的蓝 `#0064fd`、Spring AI 站的绿 `#3f7d20` 明确区分。
- **图标**：violet 底色的三节点网络图，保留「Agent 连接」语义，形状与 Java 站的菱形、Spring 站的叶子均不同。
- **同步范围**：`base.css` 主题变量、根跳转页、404 页（含暗色下的链接与强调色）、favicon。
- **验证**：浏览器实测亮/暗两套主题的 `--brand`、`--brand-soft` 计算值正确，控制台无报错。

## v0.1.0 — 2026-11-06

新站骨架落地，先把「能读、能搜、能发布」这三件事做通。

- **站点结构**：首页、404、导航、搜索索引、阅读设置、进度卡全部复用现有两站的零构建方案。
- **导航**：规划 27 章 + 附录 A–F 的完整依赖顺序，写入 `agentscope-py-learn/assets/nav.js`。
- **正文**：第 00 章「学习地图」与第 01 章「环境与依赖」可读，其余章节标记为「下一轮」。
- **工具链**：`check-site.cjs`、`check-sources.cjs`、`build-search-index.cjs` 已改为指向 `agentscope-py-learn/`
  与 `agentscope-2.0.11/`，并把源码上下文启发式从 Java 关键字换成 Python 关键字。
- **本地化**：`localStorage` 前缀改为 `asp-learn-*`，避免三个站同源预览时进度互相覆盖。
- **上游源码**：`agentscope-2.0.11/`（tag `v2.0.11`）已放入本地并加入 `.gitignore`。
- **发布**：GitHub Pages 工作流已指向 `agentscope-py-learn/`。
