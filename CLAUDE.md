
## TOP RULES

- Always use MAXIMUM thinking effort
- Always use Opus for all agents and subagents
- Keep code minimum, viable simple but clean. YAGNI, DRY, KISS, do not overcomplicate modules with convoluted classes.
- Always run slash command `/simplify` at the end of every extensive refactor or new feature phase, before any commit
- Use chrome devtools mcp server to verify all UI related changes work as expected
- Always update ALL RELEVANT DOCUMENTATION MARKDOWNS in the repo when you have made a new change anywhere or after implementing new features or changing current features
- Do not commit anything until verification of work is done
- Always fix all existing issues even if they are not from your changes

## The #1 Rule of E2E Tests

- A test MUST fail when the feature it tests is broken. No exceptions. If a real user would see something broken, the test must fail. No "fixing the app inside the test". A passing test that hides a broken feature is worse than no test at all.

## MORE RULES

- Browser-test UI changes before reporting them complete.
- Don't commit until lint, tests and build pass.
- Tests must catch breakage. Never weaken them just to make them pass.

## Agent skills

### Issue tracker

GitHub Issues for this repo. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: root `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.