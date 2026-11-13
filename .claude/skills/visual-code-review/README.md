# Visual Code Review Skill

## Overview

The `visual-code-review` skill automates visual verification of web app UI changes by capturing screenshots, running accessibility audits, and checking console health. It's designed to verify features work correctly before committing code.

## Installation

The skill is located at: `.claude/skills/visual-code-review/SKILL.md`

It's ready to use with Claude Code and Claude.ai.

## Quick Start

### Basic Usage

```
Use the visual-code-review skill to review the app at http://127.0.0.1:5173/ 
with GitHub issue: https://github.com/owner/repo/issues/123
```

### With Custom App URL

```
Use the visual-code-review skill to review the app at http://localhost:3000
with GitHub issue: https://github.com/owner/repo/issues/123
```

### With Local Instructions File

```
Use the visual-code-review skill to review the app at http://127.0.0.1:5173/
with test instructions: C:\path\to\test-instructions.md
```

## What It Does

1. **Parses Input** — Extracts issue details from GitHub URL or reads local test instructions
2. **Desktop Check** — Captures 1280x1024 screenshot, runs Lighthouse audit, checks console
3. **Mobile Check** — Captures 375x667 screenshot, verifies responsive design
4. **Generates Report** — Creates markdown report with:
   - Lighthouse scores (Accessibility, SEO, Best Practices)
   - Screenshot comparisons
   - Console health status
   - Detailed findings and recommendations
5. **Saves Artifacts** — Outputs to `verification-report/run-{timestamp}/`

## Output Files

Each review generates:
- `report.md` — Comprehensive markdown report
- `desktop.png` — Full-page desktop screenshot
- `mobile.png` — Full-page mobile screenshot (if captured)
- `audit.json` — Lighthouse audit data
- `console.json` — Console messages

## Tested Scenarios

✅ GitHub issue URL input
✅ Local file path input
✅ Responsive design validation (desktop + mobile)
✅ Lighthouse audits (accessibility, SEO, best practices)
✅ Console error/warning detection
✅ Timestamped report organization

## Requirements

- Chrome DevTools MCP (configured in `.mcp.json`)
- Running app at specified URL (default: http://127.0.0.1:5173/)
- Node.js dev environment with `npm run dev` already started

## Notes

- The skill is **observation-only** — it doesn't modify code or run tests
- No Git operations are performed
- Reports are saved with ISO timestamps (YYYY-MM-DD-HH-MM-SS)
- Mobile screenshot capture may timeout in some environments (noted in report)

## Examples

### Example 1: Review after Feature Implementation

```
ticket_url: https://github.com/stcomiin/expense-tracker-workshop-starter/issues/2
app_url: http://127.0.0.1:5173/
```

Output: `verification-report/run-2026-11-12-17-50-55/report.md`

### Example 2: Review with Local Test Instructions

```
ticket_url: C:\project\visual-code-review-workspace\test-instructions.md
app_url: http://127.0.0.1:5173/
```

## Skill File Location

`.claude/skills/visual-code-review/SKILL.md`

This file contains detailed workflow instructions and best practices for the Chrome DevTools MCP commands used.

## Future Improvements

Potential enhancements:
- Visual regression comparison (before/after screenshots)
- Performance trace analysis
- Video capture of user interactions
- Custom viewport sizes
- Batch processing multiple routes/flows
