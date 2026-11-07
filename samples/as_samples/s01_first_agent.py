"""Chapter 01: the smallest Agent, with a fake model by default."""

from __future__ import annotations

import asyncio

from agentscope.agent import Agent
from agentscope.message import UserMsg
from agentscope.tool import Toolkit

from .common import get_model


async def main() -> None:
    agent = Agent(
        name="Friday",
        system_prompt="You are a helpful assistant named Friday.",
        model=get_model(),
        toolkit=Toolkit(),
    )
    msg = await agent.reply(UserMsg(name="user", content="用三句话解释什么是 ReAct。"))
    print(msg.get_text_content())


if __name__ == "__main__":
    asyncio.run(main())
