"""Chapter 22: save and restore AgentState as JSON."""

from __future__ import annotations

import asyncio
from pathlib import Path

from agentscope.agent import Agent
from agentscope.message import UserMsg
from agentscope.state import AgentState
from agentscope.tool import Toolkit

from .common import get_model


async def main() -> None:
    agent = Agent(
        name="StateAgent",
        system_prompt="Answer briefly.",
        model=get_model(),
        toolkit=Toolkit(),
    )
    await agent.reply(UserMsg(name="user", content="记住：我叫 Alice。"))

    path = Path("agent_state.json")
    path.write_text(agent.state.model_dump_json(), encoding="utf-8")

    state = AgentState.model_validate_json(path.read_text(encoding="utf-8"))
    restored = Agent(
        name="StateAgent",
        system_prompt="Answer briefly.",
        model=get_model(),
        toolkit=Toolkit(),
        state=state,
    )
    print("restored messages:", len(restored.state.context))


if __name__ == "__main__":
    asyncio.run(main())
