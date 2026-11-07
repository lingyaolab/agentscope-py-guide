"""Chapter 15: a minimal Agent Service with SQLite and in-process bus.

This builds the FastAPI app. To serve it:
    uvicorn as_samples.s15_service:app --reload
"""

from __future__ import annotations

from agentscope.app import create_app
from agentscope.app.message_bus import InMemoryMessageBus
from agentscope.app.storage import AsyncSQLAlchemyStorage
from agentscope.app.workspace_manager import LocalWorkspaceManager

storage = AsyncSQLAlchemyStorage("sqlite+aiosqlite:///./as_samples.db")
message_bus = InMemoryMessageBus()
workspace_manager = LocalWorkspaceManager(basedir="./as_workspaces", ttl=3600.0)

app = create_app(
    storage=storage,
    message_bus=message_bus,
    workspace_manager=workspace_manager,
)
