# 更新记录

站点版本与所讲解的框架版本分开记：框架版本固定在 **AgentScope Python 2.0.11**，站点版本见下。

## v0.12.0 — 2026-11-06

新增第 12 章「工作区与沙箱」，让 Agent 真正读写文件、执行命令。

- **三层**：Workspace（生命周期与资源）/ Backend（执行）/ Tool（模型动作）。
- **LocalWorkspace**：`workdir` 布局、幂等 `initialize`、Windows 用 PowerShell。
- **接入**：`list_tools` / `list_mcps` / `list_skills` / `offloader` 四条线。
- **沙箱**：Docker（挂载）、E2B（沙箱文件系统）、K8s（Pod + PVC）与 Bubblewrap 的网络注意点。
- **生命周期**：`initialize` / `close` / `reset` / `async with` 的区别。
- **资源**：`default_mcps` / `skill_paths` 是种子而非共享实例，按 agent / session 隔离。
- **MCP 网关**：沙箱内 FastAPI + Bearer，主机通过 `exec_shell` 走回环，`list_mcps` 接口不变。
- **选型**：本地 / 容器 / 集群 / 云沙箱 / Bubblewrap 的隔离与持久化对照。

## v0.11.0 — 2026-11-06

新增第 11 章「RAG 与长期记忆」，把「知识」和「记忆」拆成两条独立链路。

- **五模块**：Parser → Section、Chunker → Chunk、Embedding、VectorStore、KnowledgeBase。
- **索引**：解析 → 切分 → 入库，同一文档共享 `document_id`，collection 懒创建。
- **检索**：批量嵌入、并发检索、按 `(document_id, chunk_index)` 去重、分数降序截断。
- **嵌入**：`dimensions` 决定 collection 维度，`supports_multimodal` 决定 DataBlock 是否被丢弃。
- **RAGMiddleware**：`static` 首轮注入、`agentic` 暴露 `search_knowledge`，工具需手动注册。
- **重排**：`rerank_model` + `rerank_candidate_k`，失败回退向量顺序。
- **长期记忆**：Agentic Memory（Markdown）、ReMe（自动抽取）、Mem0（开箱即用）的存储与模式对照。
- **对比**：RAG / 长期记忆 / 上下文压缩三者的数据来源与生命周期。

## v0.10.0 — 2026-11-06

新增第 10 章「计划模式与 SOP」，区分「模型自己管步骤」和「开发者固定步骤」。

- **计划模式**：`TaskCreate` / `TaskGet` / `TaskList` / `TaskUpdate`，状态注入与默认放行。
- **任务模型**：`Task` 字段、`pending → in_progress → completed`、`blocks` / `blocked_by` 双向依赖。
- **删除语义**：`deleted` 是 `TaskUpdate` 的操作，不是存储状态；硬删除会修正依赖边。
- **计划注入**：`task_tool_names` 如何抑制重复注入，压缩后为什么还能记得任务。
- **SOP**：`SOP` / `SOPStep` / `SOPStepBase`，执行者 + 可选验证者，`max_attempts`。
- **SOP 运行**：执行 → 验收 → 交接，`handover` 只传交付不传过程；三种情况都消耗 `max_attempts`。
- **持久化**：`SOPRunState` 可存 JSON，但 Agent 上下文要另存；步骤数变化会抛 `ValueError`。

## v0.9.0 — 2026-11-06

新增第 09 章「流水线」，进入多智能体编排。

- **统一接口**：`PipelineProtocol` 只要求一个 `reply_stream`，Agent 天然满足，可互相替换。
- **GoalPipeline**：执行者 + 验证者，`pass` / `fail` / `impossible` 三种判定，`max_iters` 与 `max_retries` 两套预算。
- **TeamPipeline**：队长 + `TeamMember`，`TeamAssign` 外部工具，成员描述驱动分派。
- **并发边界**：不同成员并发、同一成员串行、结果按调用顺序回传。
- **事件**：单一 `reply_stream` 用 `reply_id` 区分发言者，HITL 按 `reply_id` 路由。
- **选型**：Goal / Team / 单 Agent / SOP / Agent Service 的适用边界。

## v0.8.0 — 2026-11-06

新增第 08 章「权限与 HITL」，把「工具能不能执行」讲成可配置、可暂停、可恢复的流程。

- **五种模式**：`DEFAULT` / `ACCEPT_EDITS` / `EXPLORE` / `BYPASS` / `DONT_ASK` 的边界与适用场景。
- **决策顺序**：deny → ask → 只读 → 工具检查 → allow → 默认 ASK，解释为什么 allow 规则不是最高优先级。
- **规则**：`PermissionRule` 四字段、Bash 前缀通配、文件 glob、规则字典按工具名分组。
- **安全 ASK**：`bypass_immune` 在五种模式下的不同处理，以及 BYPASS 为什么挡不住 `rm -rf /`。
- **HITL**：`RequireUserConfirmEvent` → `ConfirmResult` → `UserConfirmResultEvent` 的完整暂停/恢复。
- **AskUser**：外部执行工具的问题结构、`AskUserMetadata` 回传、最多 4 题 / 每题 2–4 选项。
- **拒绝**：`DENIED` 结果如何回到模型，`stop_on_reject` 的作用。

## v0.7.0 — 2026-11-06

新增第 07 章「中间件」，把横切逻辑从 Agent 源码里搬出来。

- **七个钩子**：`on_reply`、`on_reasoning`、`on_acting`、`on_check_permission`、`on_model_call`、`on_compress_context`、`on_system_prompt`，外加 `list_tools`。
- **顺序**：洋葱式「第一个在最外层」，变换式「从左到右接力」，以及流式事件的内层优先。
- **自定义**：一个同时观察 reply / 模型 / 工具的审计中间件；工具钩子与权限钩子的分工。
- **权限**：`on_check_permission` 拿到的是副本，直接返回会跳过内置引擎。
- **进阶**：吞掉 `ReplyEndEvent` 强制再来一轮，以及必须自己处理的轮次与重试上限。
- **内置**：`TracingMiddleware`、`ReplyBudgetControlMiddleware`、`ModelRouterMiddleware`、`RAGMiddleware`、`TTSMiddleware` 与记忆中间件。
- **状态**：为什么中间件状态要放 `agent.state.middle_context`，而不是实例属性。

## v0.6.0 — 2026-11-06

新增第 06 章「上下文管理」，把 Agent 的工作记忆讲成可调参的三套机制。

- **预算**：`trigger_ratio` / `reserve_ratio` / `context_buffer_ratio` 的含义、65536 示例与两条硬校验。
- **压缩**：图片限制 → 计数 → 判阈值 → 切分（保持工具调用成对）→ 结构化摘要 → 更新状态。
- **失败退路**：系统提示超限、保留量过大、压缩调用超长、摘要失败四种情况的处理。
- **截断**：`tool_result_limit` 与 `<<<TRUNCATED>>>` 标记，挂载 offloader 时附带可回查路径。
- **卸载**：`Offloader` 协议的三个方法、`LocalWorkspace` 目录布局、自定义 Offloader。
- **注入**：时间 / 任务 / 上下文用量 / 工具报错四个维度，以及「用 HintBlock 而不是改系统提示」的原因。
- **修正**：文档只列了两个 offloader 方法，源码协议实际有三个（多一个 `offload_data_block`），正文按源码写。

## v0.5.0 — 2026-11-06

新增第 05 章「工具系统」，把 02 章的 `FunctionTool` 展开到可自己写工具、接 MCP 的程度。

- **分层**：schema（给模型）、permission（给框架）、call（给代码）三层职责。
- **两种写法**：`FunctionTool` 的四种返回形态与三个构造参数；继承 `ToolBase` 的完整示例。
- **schema**：docstring + 类型注解 + Pydantic 三种表达约束的方式。
- **Toolkit**：`basic` 组、`ToolGroup` 按需激活、`ResetTools` 元工具、运行时 `add_tool` / `remove_tool`。
- **并发**：按 `is_concurrency_safe` 连续分批，并发批次失败不互相取消，汇总为 `ExceptionGroup`。
- **错误**：六种失败场景分别转成什么结果，以及为什么「异常文本也是给模型的提示」。
- **MCP**：stdio / HTTP 两种配置、stateful 与 stateless、`mcp__server__tool` 命名规则、权限与容错。
- **内置工具**：Bash / 文件 / 任务 / AskUser 的能力与权限特点。

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
