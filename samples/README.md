# AgentScope Python 2.0.11 配套示例

这些示例与正文对应，版本固定在 **AgentScope Python 2.0.11**。
默认不需要 API Key：没有 `DEEPSEEK_API_KEY` 时使用脚本化 fake model；
设置后走真实 DeepSeek。

## 安装

```bash
cd samples
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -e .
pip install -e ".[service]"
```

## 离线测试

```bash
pytest
```

不访问网络，覆盖 Agent 回复、FunctionTool、中间件、AgentState。

## 逐章运行

```bash
python -m as_samples.s01_first_agent
python -m as_samples.s02_tools
python -m as_samples.s03_events
python -m as_samples.s07_middleware
python -m as_samples.s13_state
```

## Agent Service

```bash
uvicorn as_samples.s15_service:app --reload
curl -H "X-User-ID: alice" http://127.0.0.1:8000/health
```

需要 `agentscope[service,sql]` 与 `aiosqlite`；SQLite 文件与工作区都已被 `.gitignore` 忽略。

## 真实模型

```bash
cp .env.example .env
# 填入 DEEPSEEK_API_KEY
python -m as_samples.s00_live_smoke
```

`common.get_model()` 有 key 时用 `DeepSeekChatModel`，没有时用 fake model。
