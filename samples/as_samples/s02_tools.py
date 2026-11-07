"""Chapter 02: a FunctionTool with an explicit ALLOW permission."""

from __future__ import annotations

import asyncio

from agentscope.agent import Agent
from agentscope.message import UserMsg
from agentscope.permission import PermissionBehavior, PermissionDecision
from agentscope.tool import FunctionTool, Toolkit

from .common import get_model


def get_weather(city: str) -> str:
    """Query the current weather for a city.

    Args:
        city: City name, for example Beijing.
    """
    return f"{city}: 18C, sunny"


tool = FunctionTool(
    get_weather,
    is_read_only=True,
    permission=PermissionDecision(
        behavior=PermissionBehavior.ALLOW,
        message="read-only weather query",
    ),
)


async def main() -> None:
    toolkit = Toolkit(tools=[tool])
    schemas = await toolkit.get_tool_schemas()
    print("tool schemas:", [s["function"]["name"] for s in schemas])

    agent = Agent(
        name="WeatherAgent",
        system_prompt="You can call the weather tool when needed.",
        model=get_model(),
        toolkit=toolkit,
    )
    msg = await agent.reply(UserMsg(name="user", content="北京天气如何？"))
    print(msg.get_text_content())


if __name__ == "__main__":
    asyncio.run(main())
