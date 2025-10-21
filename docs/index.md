# game1 Prototype Notes

- Entrypoint lives at `src/game/__main__.py`; run with `python -m game`.
- Core loop is encapsulated in `src/game/loop.py` with a configurable dataclass.
- Assets are partitioned under `assets/` with `.gitkeep` placeholders until real data arrives.
- Tests mirror the package layout under `tests/`, seeded with an entrypoint smoke test.
- Tools scripts will live in `tools/`; add executable permissions and docstrings when committing new utilities.
