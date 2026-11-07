"""Shared helpers for the AgentScope Python 2.0.11 samples."""

from __future__ import annotations

import os

from agentscope.credential import DeepSeekCredential
from agentscope.model import DeepSeekChatModel

from .fake import text_model


def has_api_key() -> bool:
    return bool(os.getenv("DEEPSEEK_API_KEY"))


def get_model():
    if has_api_key():
        return DeepSeekChatModel(
            credential=DeepSeekCredential(api_key=os.environ["DEEPSEEK_API_KEY"]),
            model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
        )
    return text_model("这是离线假模型的固定回答。")
