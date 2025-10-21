"""Shared test fixtures for the game1 prototype test suite."""

from __future__ import annotations

import pytest


@pytest.fixture
def game_state_stub() -> dict[str, str]:
    """Return a lightweight stub that future tests can build upon."""
    return {"status": "placeholder"}
