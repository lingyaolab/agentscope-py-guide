"""Deterministic chat model for offline AgentScope samples."""

from __future__ import annotations

from collections import deque

from pydantic import BaseModel

from agentscope.credential import CredentialBase
from agentscope.formatter import OpenAIChatFormatter
from agentscope.message import Msg, TextBlock
from agentscope.model import ChatModelBase, ChatResponse
from agentscope.tool import ToolChoice


class ScriptedCredential(CredentialBase):
    @classmethod
    def get_chat_model_class(cls):
        return ScriptedChatModel


class ScriptedChatModel(ChatModelBase):
    """Return preset ChatResponses in order; never touches the network."""

    class Parameters(BaseModel):
        pass

    def __init__(self, responses: list[ChatResponse]) -> None:
        super().__init__(
            credential=ScriptedCredential(),
            model="scripted",
            parameters=self.Parameters(),
            stream=False,
        )
        self.formatter = OpenAIChatFormatter()
        self._responses = deque(responses)

    async def _call_api(
        self,
        model_name: str,
        messages: list[Msg],
        tools: list[dict] | None = None,
        tool_choice: ToolChoice | None = None,
        **kwargs,
    ) -> ChatResponse:
        if not self._responses:
            raise AssertionError("scripted model is empty; add another ChatResponse")
        return self._responses.popleft()


def text_model(text: str) -> ScriptedChatModel:
    return ScriptedChatModel(
        [ChatResponse(content=[TextBlock(text=text)], is_last=True)]
    )
