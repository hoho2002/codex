"""Console entry point for running the game1 prototype."""

from __future__ import annotations

from .loop import PrototypeConfig, run_prototype


def main() -> None:
    """Entrypoint used by ``python -m game``."""

    run_prototype(PrototypeConfig())


if __name__ == "__main__":
    main()
