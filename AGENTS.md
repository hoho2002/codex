# Repository Guidelines

This repository hosts the `game1` prototype. Use this guide to keep contributions consistent while the structure is still taking shape.

## Project Structure & Module Organization
- `src/` holds gameplay modules. Group code by domain (for example, `src/core`, `src/systems`, `src/ui`) and keep entry points under `src/game/__main__.py`.
- `assets/` stores non-code resources. Use `assets/images`, `assets/audio`, and `assets/data`, and reference them via relative paths so the build can package them.
- `tests/` should mirror the `src/` layout one-for-one. Prefer smaller, focused test modules such as `tests/systems/test_combat.py`.
- `docs/` is the index for design notes, prototype diaries, and AGENTS.md. Summarize high-level decisions here.
- Utility scripts (profilers, data generators) belong in `tools/` with executable permissions and docstrings.

## Build, Test, and Development Commands
- `python -m pip install -r requirements.txt` – Sync the virtual environment; regenerate `requirements.txt` after dependency bumps.
- `python -m pytest` – Run the automated test suite; keep slow tests behind markers so `pytest -m "not slow"` remains fast.
- `python -m game` – Launch the playable build from `src/game/__main__.py` during local iteration.
- `ruff check src tests` and `ruff format src tests` – Lint and auto-format before opening a PR. Configure `pyproject.toml` to keep shared settings.

## Coding Style & Naming Conventions
Use Python 3.11+, 4-space indentation, and type hints on all public functions. Modules and packages stay `snake_case`, classes `PascalCase`, and constants `UPPER_SNAKE`. Favor dataclasses or pydantic models for structured data. Keep functions under 40 lines; break stateful flows into small, pure helpers.

## Testing Guidelines
Adopt `pytest` fixtures for map data and battle states. Name files `test_<feature>.py` and mark scenario-level tests with `@pytest.mark.slow`. Maintain ≥85% statement coverage; update `tests/__init__.py` with shared factories when adding systems. Snapshot or golden-data assets live under `tests/assets/`.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `refactor:`). Keep commits scoped to a single concern and run lint/tests before pushing. PRs must include a short summary, testing notes, linked issues, and screenshots or GIFs for user-facing changes. Request review once checks pass and assign a maintainer as reviewer.
