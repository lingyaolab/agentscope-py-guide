# 更新记录

站点版本与所讲解的框架版本分开记：框架版本固定在 **AgentScope Python 2.0.11**，站点版本见下。

## v0.23.0 — 2026-11-07

新增第 23 章「生产化」，把上线前的失败模式逐层补齐。

- **超时**：模型 HTTP 超时、工具卸载超时、整次 reply 超时、会话锁租约。
- **重试**：模型层只重试可重试异常，Agent 层捕获全部异常并降级，SDK 自带退避；避免 16/64 次放大。
- **降级**：`ModelConfig.fallback_model` 的适用边界与上下文/工具差异。
- **限流**：无全局限流器，单进程用信号量，多进程用网关或 Redis；429 映射为 `ErrorType.RATE_LIMIT`。
- **会话单飞**：分布式会话锁、`ChatRunRegistry`、`POST /chat` 的 409。
- **预算**：`ReActConfig.max_iters`、`tool_retries_limit`、预算中间件与上下文压缩。
- **优雅关闭**：`AsyncExitStack` 反向拆除，关闭时取消在途 run 并等待释放锁。
- **拓扑**：单进程、多副本、独立索引/渠道/调度 worker 的角色划分。
- **配置与健康检查**：`create_app` 关键参数、`/health` 的 I/O-free 与身份头要求。
- **安全与存储**：替换 `X-User-ID`、共享 `download_secret`、SQL 迁移不在多副本自动跑。
- **容器化**：钉版本、非 root、持久卷、优雅关闭参数。

## v0.22.0 — 2026-11-07

新增第 22 章「测试与评测」，用公开接口搭一套不烧钱的回归集。

- **分层**：单元 / 回放 / 真实模型冒烟 / 裁判与人工，各自的触发时机与成本。
- **假模型**：继承 `ChatModelBase` 实现 `_call_api`，必须设置 `formatter`，脚本耗尽即抛错。
- **确定性断言**：`ToolCallStartEvent`、`ToolResultEndEvent.state`、`ReplyEndEvent.finished_reason`。
- **黄金样本**：只冻结工具名、状态、结束原因，用 `AnyString` / `AnyValue` 处理不稳定字段。
- **工具指标**：选择准确率、参数正确率、执行成功率、任务完成率与额外调用数。
- **检索指标**：`KnowledgeBase.search` 的 `VectorSearchResult`、recall@k、MRR、引用命中。
- **LLM 裁判**：位置 / 长度偏差、同源裁判、抖动与缓存。
- **CI**：PR 只跑 unit + replay，真实调用放夜间或发布前，fork PR 不给密钥。
- **成本**：样本数 × 轮次 × token，`ReActConfig.max_iters`、预算与裁判缓存。

## v0.21.0 — 2026-11-07

新增第 21 章「可观测性」，把追踪、token 与成本串成一条线。

- **追踪**：`TracerProvider` 注册、`TracingMiddleware` 三个 hook、显式短路条件、tracer 名与版本。
- **Span 树**：`invoke_agent` / `chat` / `execute_tool` 三层，conversation id 与 reply id 的分组作用。
- **属性**：GenAI 语义约定、Agent / 模型 / 工具各自记录什么、缓存 token 扩展属性。
- **流式**：`end_on_exit=False`、末 chunk 写响应、HITL 两次调用共享 reply id、外部执行补偿 span。
- **Agent Service**：`extra_agent_middlewares` 工厂，与 ASGI `extra_middlewares` 区分。
- **Token**：`ChatUsage`、`ModelCallEndEvent`、`Msg.usage`、`count_tokens` 只是估算。
- **成本**：无内置价目表，自定义中间件按模型单价累计，缓存 token 单独定价，生产用 `Decimal`。
- **预算**：`ReplyBudgetControlMiddleware` 的加权成本、`HintBlock` 与 `tool_choice=none`、per reply 作用域。
- **隐私与开销**：完整消息与 base64 会进 span、无内建脱敏、采样不省序列化。

## v0.20.0 — 2026-11-07

新增第 20 章「资源与多租户」，把「共享但不泄露」讲清楚。

- **三类资源**：`CREDENTIAL` / `AGENT` / `KNOWLEDGE_BASE`，两级权限 `READ` / `EDIT`。
- **引用**：`ResourceRef` 的四个字段，`EDIT` 隐含 `READ`。
- **策略**：`ResourceAccessPolicyBase` 的 `list_accessible`（必需）与 `can_edit`（可选，默认从引用推导）。
- **默认**：`DenyAllResourceAccessPolicy`，跨用户完全隔离。
- **解析链**：`ResourceAccessService` 的 list / get / 运行时解析 / 编辑前校验。
- **视图**：`editable` 标志、只读修改 403、不可见 404。
- **凭证**：列表与详情永远脱敏，密钥只在运行时解析。
- **Agent**：只共享配置，workspace / MCP / 技能 / 记忆不共享（已知缺口）。
- **知识库**：`READ` 检索，`EDIT` 才能改。

## v0.19.0 — 2026-11-07

新增第 19 章「MCP 与技能中心」，把第三方资源变成用户可自助安装的目录。

- **概念**：Hub / Card / 资源池 / 工作区的分工，安装 ≠ 装配。
- **MCP 中心**：`MCPHubBase` 两个方法、`MCPCard` 字段、`inputs_schema` + `config_template` 占位符。
- **技能中心**：`SkillHubBase` 三个方法、`SkillCard.markdown`、`SkillArchive` 流式下载。
- **内置来源**：`GitHubMCPHub` 与 `ClawSkillHub`，以及注册多个 hub 的 `hub_id` 唯一性。
- **装配**：MCP 进工作区客户端列表，技能解压到 skills 分区；上传限制与重名后缀。
- **自定义**：两个基类的实现要点、游标分页、`KeyError` → 404、复用 HTTP 客户端。
- **安全**：按 `user_id` 过滤必须同时覆盖 `list_*` / `get_*` / `download`，凭证字段必须 `writeOnly`。

## v0.18.0 — 2026-11-07

新增第 18 章「消息渠道」，把 Agent 接进 IM。

- **架构**：`ChannelBase` 适配器 / `ChannelGateway` 无状态编排 / `ChannelLifecycleDispatcher` 实例对齐。
- **基类**：类属性、`Credentials` / `Config`、`start_listening` / `send_response`、`capabilities` 与状态。
- **启用**：`create_app(channels=[...])`，`/channels/types` 暴露凭据 schema。
- **路由**：`match_key` / `match_value` / `agent_id` / `session_scope`，首条命中、兜底最后、三条硬校验。
- **会话划分**：`per_chat` 与 `per_chat_user`，会话 ID 用 uuid5 确定性推导。
- **三个平台**：飞书（app_id/secret）、钉钉（client_id/secret + 卡片模板）、Discord（bot_token/application_id）。
- **自定义**：继承 `ChannelBase`、工具确认回传定位键、`credential_binding` 无状态扫码。
- **部署**：`enable_channel_worker` 单实例、共享 Redis、不适合纯 serverless。

## v0.17.0 — 2026-11-07

新增第 17 章「Agent Team」，讲服务层的多智能体协作。

- **概念**：Team / Leader / Worker / Team Message，成员是独立会话而非协程。
- **五个工具**：`TeamCreate`、`AgentCreate`、`AgentInvite`、`TeamSay`、`TeamDelete`；Worker 只见 `TeamSay`。
- **派生**：`AgentCreate` 的名称、角色、首任务与 `subagent_type`；创建即执行。
- **邀请**：`AgentInvite` 与 `AgentCreate` 的差异，候选池与 `Invitable` / `Invite description`。
- **通信**：`TeamSay` 的投递 + 唤醒链路，以及 `InboxMiddleware` 的注入。
- **模板**：`SubAgentTemplate` 字段、五个占位符、`EXPLORE` 只读角色。
- **HITL**：按 `reply_id` 路由、Leader 等待、子 Agent 卡片投影。
- **生命周期**：两种成员在团队解散后的不同处理，以及成本提醒。
- **核对**：文档写 `sub_agent_templates`，源码参数是 `custom_subagent_templates`，正文按源码写并标注。

## v0.16.0 — 2026-11-07

新增第 16 章「会话与 SSE」，把前后端契约讲完整。

- **建会话**：`POST /sessions` 的最小请求体、`(user, agent, workspace)` 三元组唯一。
- **触发**：`POST /chat` fire-and-forget、五种输入、同会话 409。
- **SSE**：`data: <json>`、30 秒心跳、`Cache-Control` 与 `X-Accel-Buffering`。
- **重放**：先订阅再回放、`after` 游标、`_entry_id` 去重、连接跨多次 run。
- **分页**：`before` 游标、`offset` 废弃、`event_cursor` 只在最新页返回。
- **状态**：`running` / `idle` / `awaiting_permission` / `awaiting_external_result` 与优先级。
- **中断**：202 的异步语义、续接方式。
- **协议**：`ProtocolMiddlewareBase` 与 `AGUIProtocolMiddleware`。
- **前端契约**：`reply_id` / `block_id`、心跳、去重、状态驱动。

## v0.15.0 — 2026-11-07

新增第 15 章「Agent Service」，把 Agent 变成多租户 HTTP 服务。

- **架构**：Storage / MessageBus / WorkspaceManager / ChatService / SessionService / Agent 层中间件。
- **`create_app`**：三个必填组件与常用可选参数，lifespan 的资源顺序。
- **资源模型**：Agent 是模板，Session 承载 `AgentState`；Credential 可跨会话复用。
- **流程**：建 Agent → 建凭证 → 建会话 → `POST /chat` → 订阅 SSE。
- **会话**：同一会话只跑一次（409）、SSE 重放与扇出、`POST /interrupt`。
- **多租户**：`X-User-ID` 是占位，必须替换；默认 `DenyAll` 资源策略。
- **存储与总线**：Redis / SQLAlchemy、Redis / InMemory MessageBus、分布式靠共享 Redis。
- **中间件**：ASGI 层（协议 / CORS / 鉴权）与 Agent 层（Inbox / ToolOffload / StateChange）。
- **部署**：`download_secret`、scheduler / channel worker 单实例、SSE 反代缓冲。

## v0.14.0 — 2026-11-07

新增第 14 章「终端 Console」，补上不启动 Web 的调试入口。

- **`launch_console`**：输入循环、流式渲染、工具确认、`Ctrl+C` 中断，四个参数。
- **`ConsoleRenderer`**：被动渲染事件流，`render()` / `last_msg`，可跨 Agent 复用。
- **详细程度**：`quiet` / `default` / `debug` 三档各显示什么。
- **确认交互**：`y` 允许一次、`a` 接受规则、其他拒绝，`Ctrl+C` 的两种语义。
- **`launch_tui`**：Textual 全屏、Markdown、折叠、键盘确认与 `AskUser` 表单。
- **实时语音**：`launch_realtime_ui` 的借用语义与打断方式。
- **组件嵌入**：`ChatUI` / `MessagesUI` 的 Textual 消息与更新方法。
- **选型**：Console / TUI / Agent Service 的适用边界。

## v0.13.0 — 2026-11-07

新增第 13 章「中断、恢复与状态」，把长任务的暂停与续跑讲完整。

- **状态**：`AgentState` 八组字段，以及只存 `context` 会丢什么。
- **序列化**：`model_dump_json()` / `AgentState.model_validate_json()`，`Agent(state=...)` 恢复。
- **中断**：运行中 `task.cancel()` 与挂起中 `UserInterruptEvent` 的区别。
- **清理**：`_close_unfinished_tool_calls` 如何给每个未完成调用补 `INTERRUPTED` 结果。
- **恢复**：`reply(None)`、三类事件、`reply_id` 对齐。
- **一致性**：什么时候保存、哪些东西不在 `AgentState` 里。
- **存储**：`RedisStorage` / `AsyncSQLAlchemyStorage`、`SessionRecord.state`、`update_session_state` 的 `KeyError`。
- **隔离**：`(user_id, agent_id, session_id)` 三元组。

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
