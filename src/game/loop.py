"""Primary loop hooks for the game1 prototype."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PrototypeConfig:
    """Lightweight configuration for the prototype launcher."""

    welcome_message: str = "Launching game1 prototype"  # Future configs hook in here.


def run_prototype(config: PrototypeConfig | None = None) -> str:
    """Run the prototype entry point.

    Returns the message that is emitted so callers (and tests) can inspect it.
    """

    active_config = config or PrototypeConfig()
    message = f"{active_config.welcome_message}..."
    print(message)
    return message
