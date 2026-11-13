# Visual Code Review Skill - Creation Summary

**Date Created:** 2026-11-12  
**Status:** ✅ Complete and Tested

## Skill Overview

The `visual-code-review` skill automates visual verification of web app UI changes by loading the app in Chrome, running browser diagnostics, and generating comprehensive reports.

## Location

**Skill files:**

- `.claude/skills/visual-code-review/SKILL.md` — Main skill instructions
- `.claude/skills/visual-code-review/README.md` — Usage documentation
- `docs/agents/skills.md` — Project documentation

## How to Use

### Method 1: With GitHub Issue URL

```
Use the visual-code-review skill to review the app at http://127.0.0.1:5173/
with GitHub issue: https://github.com/stcomiin/expense-tracker-workshop-starter/issues/2
```

### Method 2: With Local Test Instructions

```
Use the visual-code-review skill to review the app at http://127.0.0.1:5173/
with test instructions: path/to/test-instructions.md
```

### Method 3: Custom App URL

```
Use the visual-code-review skill to review the app at http://localhost:3000
with GitHub issue: https://github.com/owner/repo/issues/123
```

## What It Does

1. **Opens Chrome** — Loads the app in a browser via Chrome DevTools MCP
2. **Desktop Check** — Captures 1280x1024 screenshot, runs Lighthouse audit
3. **Mobile Check** — Captures 375x667 screenshot, verifies responsive design
4. **Console Audit** — Checks for errors, warnings, and performance issues
5. **Generates Report** — Creates markdown report with findings and recommendations
6. **Saves Artifacts** — Stores all files in `verification-report/run-{timestamp}/`

## Test Results

### Test 1: App Homepage Review ✅

- **Report:** `verification-report/run-2026-11-12-17-50-55/`
- **Findings:**
  - Accessibility: 100/100
  - Best Practices: 100/100
  - SEO: 80/100
  - No console errors
  - Responsive design verified

### Test 2: Budget Feature Review ✅

- **Findings:**
  - Budget form fully functional
  - Progress bar tracking working correctly
  - Mobile viewport renders properly (375x667)
  - All accessibility standards met

## Output Structure

Each review generates a timestamped folder:

```
verification-report/run-2026-11-12-17-50-55/
├── report.md          # Comprehensive markdown report
├── desktop.png        # 1280x1024 screenshot
├── mobile.png         # 375x667 screenshot (if captured)
├── audit.json         # Lighthouse audit data
└── console.json       # Console messages
```

## Report Contents

- **Summary** — Overview of findings
- **Desktop Audit** — Lighthouse scores, issues, screenshot
- **Mobile Audit** — Responsive design check, screenshot
- **Console Messages** — Errors, warnings, info logs
- **Functional Verification** — Checklist of UI elements
- **Recommendation** — Pass / Request Changes / Needs Testing

## Features

✅ GitHub issue URL parsing  
✅ Local file path support  
✅ Lighthouse accessibility audits  
✅ SEO and best practices audits  
✅ Responsive design validation (desktop + mobile)  
✅ Console error/warning detection  
✅ Full-page screenshot capture  
✅ Timestamped report organization  
✅ JSON data export (audit + console)  
✅ Markdown report generation

## Constraints

- ⚠️ **Observation-only** — Does not modify code or tests
- ⚠️ **No Git operations** — No commits, pushes, or branches
- ⚠️ **Assumes running app** — Does not start dev server
- ⚠️ **Mobile screenshots** — May timeout in some environments (noted in report)

## Documentation

- **Skill instructions:** `.claude/skills/visual-code-review/SKILL.md`
- **Usage guide:** `.claude/skills/visual-code-review/README.md`
- **Project docs:** `docs/agents/skills.md`
- **Example reports:** `verification-report/run-*`

## Next Steps

The skill is ready to use immediately. To use it:

1. Ensure the app is running: `npm run dev`
2. Ask Claude to use the skill with a GitHub issue URL or test instructions
3. Review the generated report in `verification-report/`

## Example Workflow

```bash
# 1. Start the app
npm run dev

# 2. In Claude Code, ask:
# "Use the visual-code-review skill to review the budget feature"
# "GitHub issue: https://github.com/stcomiin/expense-tracker-workshop-starter/issues/2"

# 3. Claude generates report in:
# verification-report/run-2026-11-12-HH-MM-SS/report.md

# 4. Review findings and adjust code if needed
```

## Configuration

The skill uses Chrome DevTools MCP, which is already configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "node",
      "args": ["..."]
    }
  }
}
```

No additional setup required.

---

**Created with:** Claude Code + Skill Creator  
**Framework:** Chrome DevTools MCP  
**Status:** Production Ready ✅
