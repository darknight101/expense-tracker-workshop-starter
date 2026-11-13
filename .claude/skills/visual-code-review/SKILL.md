---
name: visual-code-review
description: |
  Perform automated visual code review of a feature or bug fix by loading the app in Chrome, running browser diagnostics, and capturing screenshots. Use this when you need to verify that UI changes work correctly, check responsive design, validate accessibility, or audit visual regressions. Accepts a GitHub issue URL or file path and an optional app URL (defaults to http://127.0.0.1:5173/). Returns a report with Lighthouse scores, screenshots, and findings saved to verification-report/ with timestamp.
compatibility: Chrome DevTools MCP
---

## When to use this skill

- After implementing a UI feature, verify it looks and works correctly
- After a bug fix, visually confirm the fix is applied
- Check responsive design across desktop and mobile viewports
- Validate accessibility and performance metrics
- Create a visual record of work before committing
- Audit console warnings, errors, or Lighthouse issues

## Inputs

- **ticket_url** (required): GitHub issue URL (e.g., `https://github.com/user/repo/issues/123`) or local file path to instructions
- **app_url** (optional): URL to the running app. Defaults to `http://127.0.0.1:5173/`

## Output

Returns the full path to a timestamped report folder in `verification-report/` containing:
- `report.md` — Markdown summary with Lighthouse scores, findings, screenshots
- `desktop.png` — Full-page screenshot at 1280x1024
- `mobile.png` — Full-page screenshot at 375x667 (mobile viewport)
- `audit.json` — Full Lighthouse audit data (accessibility, SEO, best practices)
- `console.json` — Console messages (errors, warnings, info)

## Workflow

### Step 1: Parse Input

If `ticket_url` is a GitHub URL:
- Extract the issue number from the URL
- Use the GitHub API (via `gh` CLI if available, or browser fetch) to get the issue title, body, and any linked commits
- Look for clues in the issue about what to check (routes, components, specific flows)

If `ticket_url` is a file path:
- Read the file to get test instructions

### Step 2: Launch the App

- Use `mcp__chrome-devtools__new_page` to open the app at `app_url`
- Wait for the page to load fully using `mcp__chrome-devtools__wait_for` (wait for a key element or text that indicates app is ready)
- Note: assume the app is already running; do not start a dev server

### Step 3: Desktop Viewport Check

1. Set desktop viewport: `mcp__chrome-devtools__emulate` with `viewport: "1280x1024x1"` 
2. Navigate to the app's home route if not already there
3. Run Lighthouse audit: `mcp__chrome-devtools__lighthouse_audit` (mode: "snapshot", device: "desktop")
4. Capture desktop screenshot: `mcp__chrome-devtools__take_screenshot` (fullPage: true)
5. List console messages: `mcp__chrome-devtools__list_console_messages` (capture all)

### Step 4: Mobile Viewport Check

1. Set mobile viewport: `mcp__chrome-devtools__emulate` with `viewport: "375x667x1,mobile,touch"`
2. Reload the page: `mcp__chrome-devtools__navigate_page` (type: "reload")
3. Capture mobile screenshot: `mcp__chrome-devtools__take_screenshot` (fullPage: true)
4. List console messages again

### Step 5: Generate Report

Create `verification-report/run-YYYY-MM-DD-HH-MM-SS/report.md` with:

```markdown
# Visual Code Review Report

**Ticket:** [Issue Title] ([Link])
**Date:** YYYY-MM-DD HH:MM:SS
**App URL:** http://127.0.0.1:5173/

## Summary

[1-2 sentence summary of findings]

## Desktop Audit (1280x1024)

### Lighthouse Scores
- Accessibility: X/100
- SEO: X/100
- Best Practices: X/100

### Issues Found
- [List any failed audits, console errors, or warnings]

### Screenshot
![Desktop](desktop.png)

## Mobile Audit (375x667)

### Issues Found
- [Responsive layout issues, touch target problems, etc.]

### Screenshot
![Mobile](mobile.png)

## Console Messages

[List any errors or warnings from console — filter out noisy messages]

## Findings

- ✅ or ❌ [Specific checks: layout intact, no JS errors, buttons clickable, forms responsive, etc.]

## Recommendation

[Pass / Request Changes / Needs Testing]
```

### Step 6: Save Outputs

Save all files to `verification-report/run-{timestamp}/`:
- `report.md` — The generated report
- `desktop.png` — Desktop screenshot
- `mobile.png` — Mobile screenshot
- `audit.json` — Raw Lighthouse audit data
- `console.json` — Raw console messages

### Step 7: Return Result

Return the full path: `verification-report/run-{timestamp}`

## Important Notes

- **Do not modify code or tests** — this is observation only
- **No Git operations** — no commits, pushes, or branch changes
- **Report findings** as facts, not recommendations for code changes
- **Assume the app is running** — do not attempt to start a dev server
- **Close the browser tab** after capturing all data to avoid memory leaks
- **Timestamps** use ISO format: `2026-11-12-14-30-45`

## Example Usage

```
ticket_url: https://github.com/stcomiin/expense-tracker-workshop-starter/issues/2
app_url: http://127.0.0.1:5173/
```

Result: `verification-report/run-2026-11-12-14-30-45`
