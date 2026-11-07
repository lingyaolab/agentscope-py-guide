"""Offline tests for the AgentScope Python samples."""

from __future__ import annotations

import asyncio

from agentscope.agent import Agent
from agentscope.message import UserMsg
from agentscope.tool import Toolkit

from as_samples.common import get_model
from as_samples.fake import text_model
from as_samples.s02_tools import tool


def test_fake_model_reply():
    async def run():
        agent = Agent(
            name="T",
            system_prompt="Answer briefly.",
            model=text_model("fixed"),
            toolkit=Toolkit(),
        )
        msg = await agent.reply(UserMsg(name="user", content="hi"))
        return msg.get_text_content()

    assert asyncio.run(run()) == "fixed"


def test_tool_schema():
    async def run():
        toolkit = Toolkit(tools=[tool])
        schemas = await toolkit.get_tool_schemas()
        return [s["function"]["name"] for s in schemas]

    names = asyncio.run(run())
    assert "get_weather" in names
