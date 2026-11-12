# Domain Documentation Configuration

## Layout: Single-Context

This repository uses a **single-context** domain documentation layout:
- One root `CONTEXT.md` file at the repository root
- Architecture Decision Records (ADRs) in `docs/adr/`

### CONTEXT.md

The `CONTEXT.md` file (at the repo root) contains:
- Project overview and purpose
- High-level architecture and tech stack
- Key concepts and terminology
- How to run, build, and test locally
- Where to find more detailed documentation

**Create or edit `CONTEXT.md` to:**
- Document the problem the project solves
- Explain the overall design and module structure
- Record constraints and assumptions
- Link to ADRs and specialized docs

### Architecture Decision Records (ADRs)

ADRs live in `docs/adr/` as markdown files, one per significant decision.

**Naming convention:** `NNNN-short-title.md` (e.g., `0001-use-react-hooks.md`)

**Template (per ADR000):**
```markdown
# ADR 0001: Use React Hooks Instead of Class Components

## Status
Accepted

## Context
[Why this decision matters; what problem does it solve?]

## Decision
[What did we decide?]

## Consequences
[What changes as a result?]
```

**When to write an ADR:**
- A significant technical choice is made (e.g., framework, architecture pattern)
- A trade-off was evaluated and documented
- Future context matters (e.g., "why didn't we use X?")

### How Skills Use This

Skills like `domain-modeling` and `research` read from:
1. `CONTEXT.md` to understand the project and design philosophy
2. `docs/adr/` to understand past decisions and constraints
3. `CLAUDE.md` (if present) for agent-specific guidance

Before proposing changes, skills refer to domain docs to ensure suggestions align with established patterns.

### Getting Started

If `CONTEXT.md` doesn't exist yet, start with:
- A one-line project description
- Key tech stack items
- How to run locally
- Expand as the project grows

Create `docs/adr/` when you have documented decisions to record.
