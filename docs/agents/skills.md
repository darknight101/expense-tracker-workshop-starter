# Available Skills

Custom Claude skills for this project that extend capabilities beyond standard tools.

## visual-code-review

**Location:** `.claude/skills/visual-code-review/SKILL.md`

**Purpose:** Automated visual code review of UI changes using browser diagnostics.

**When to use:**

- After implementing a UI feature, verify it displays and works correctly
- After a bug fix, visually confirm the fix is applied
- Check responsive design across desktop (1280x1024) and mobile (375x667) viewports
- Validate accessibility and performance (Lighthouse audits)
- Create a visual record before committing
- Audit console warnings, errors, or performance issues

**Inputs:**

- `ticket_url` — GitHub issue URL or local file path to test instructions
- `app_url` (optional) — App URL to review (defaults to http://127.0.0.1:5173/)

**Output:**

- Timestamped report folder in `verification-report/run-{timestamp}/` containing:
  - `report.md` — Markdown summary with findings and screenshots
  - `desktop.png` — Full-page screenshot at 1280x1024
  - `mobile.png` — Full-page screenshot at 375x667 (if captured)
  - `audit.json` — Lighthouse audit data
  - `console.json` — Console messages

**Example usage:**

```
Use the visual-code-review skill to review the app at http://127.0.0.1:5173/
with GitHub issue: https://github.com/stcomiin/expense-tracker-workshop-starter/issues/2
```

**How it works:**

1. Parses GitHub issue or local test instructions
2. Captures desktop viewport (1280x1024) screenshot and runs Lighthouse audit
3. Captures mobile viewport (375x667) screenshot
4. Checks console for errors/warnings
5. Generates comprehensive markdown report with findings
6. Saves all artifacts to `verification-report/` with ISO timestamp

**Requirements:**

- Chrome DevTools MCP configured in `.mcp.json`
- App running at specified URL
- No code modifications or Git operations performed

---

For more information, see:

- Skill implementation: `.claude/skills/visual-code-review/`
- Skill documentation: `.claude/skills/visual-code-review/README.md`
- Generated reports: `verification-report/`
