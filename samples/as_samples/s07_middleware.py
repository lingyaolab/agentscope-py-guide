"""Chapter 07: an audit middleware around model calls."""

from __future__ import annotations

import asyncio

from agentscope.agent import Agent
from agentscope.message import UserMsg
from agentscope.middleware import MiddlewareBase
from agentscope.tool import Toolkit

from .common import get_model


class ModelAuditMiddleware(MiddlewareBase):
    async def on_model_call(self, agent, input_kwargs, next_handler):
        messages = input_kwargs.get("messages", [])
        print(f"[model] agent={agent.name} messages={len(messages)}")
        return await next_handler(**input_kwargs)


async def main() -> None:
    agent = Agent(
        name="AuditedAgent",
        system_prompt="Answer briefly.",
        model=get_model(),
        toolkit=Toolkit(),
        middlewares=[ModelAuditMiddleware()],
    )
    msg = await agent.reply(UserMsg(name="user", content="你好"))
    print(msg.get_text_content())


if __name__ == "__main__":
    asyncio.run(main())
