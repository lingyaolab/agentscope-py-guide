"""Optional live smoke test. Requires DEEPSEEK_API_KEY in samples/.env."""

from __future__ import annotations

import asyncio

from dotenv import load_dotenv

from agentscope.agent import Agent
from agentscope.message import UserMsg
from agentscope.tool import Toolkit

from .common import get_model, has_api_key


async def main() -> None:
    load_dotenv()
    if not has_api_key():
        raise SystemExit("DEEPSEEK_API_KEY is not set; copy .env.example to .env first.")

    agent = Agent(
        name="LiveSmoke",
        system_prompt="Answer in one short sentence.",
        model=get_model(),
        toolkit=Toolkit(),
    )
    msg = await agent.reply(UserMsg(name="user", content="用一句话解释 AgentScope 的 Agent。"))
    print(msg.get_text_content())


if __name__ == "__main__":
    asyncio.run(main())
