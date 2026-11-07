"""Chapter 03: event stream order for a single reply."""

from __future__ import annotations

import asyncio

from agentscope.agent import Agent
from agentscope.event import EventType
from agentscope.message import UserMsg
from agentscope.tool import Toolkit

from .common import get_model


async def main() -> None:
    agent = Agent(
        name="EventAgent",
        system_prompt="Answer briefly.",
        model=get_model(),
        toolkit=Toolkit(),
    )

    async for event in agent.reply_stream(
        UserMsg(name="user", content="用一句话说明事件流。")
    ):
        if event.type == EventType.TEXT_BLOCK_DELTA:
            print(event.delta, end="", flush=True)
        elif event.type == EventType.REPLY_END:
            print(f"\n[done] {event.finished_reason}")
        else:
            print(f"[{event.type}]")


if __name__ == "__main__":
    asyncio.run(main())
