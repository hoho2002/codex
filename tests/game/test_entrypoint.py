"""Tests for the public entry points into the game package."""

from __future__ import annotations

import pytest

from game.__main__ import main
from game.loop import PrototypeConfig, run_prototype


def test_main_emits_welcome_message(capsys: "pytest.CaptureFixture[str]") -> None:
    main()

    captured = capsys.readouterr()
    assert "Launching game1 prototype..." in captured.out


def test_run_prototype_accepts_custom_config() -> None:
    message = run_prototype(PrototypeConfig(welcome_message="Test Mode"))

    assert message == "Test Mode..."
