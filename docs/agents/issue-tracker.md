# Issue Tracker Configuration

## Tracker: GitHub Issues

Issues for this repository are tracked in **GitHub Issues** on `darknight101/expense-tracker-workshop-starter`.

### How Skills Use This

Engineering skills (`to-tickets`, `triage`, etc.) interact with GitHub Issues via the `gh` CLI:
- Create issues with `gh issue create`
- List, filter, and read issues with `gh issue list` and `gh issue view`
- Update labels and status via `gh issue`

### PRs as a Request Surface

**Setting: OFF** (disabled by default)

Pull requests are not added to the issue queue. If you want external PRs to be triaged as issues, you can enable this by editing this file.

### Labels

Standard GitHub labels are used as-is. No custom label mapping is configured.

### How to Manually Create Issues

```bash
gh issue create --title "Issue title" --body "Description"
```

For more options, see `gh issue create --help`.
