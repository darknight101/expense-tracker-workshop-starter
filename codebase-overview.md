# Expense Tracker Codebase Overview

## Architecture

This is a **single-page React 19 + Vite expense tracker application** with a straightforward, monolithic architecture.

### Key Characteristics
- **Type**: React/Vite SPA (no backend, no persistence)
- **Build Tool**: Vite with React plugin
- **Testing**: Playwright E2E tests
- **Data State**: Synthetic in-memory transactions that reset on reload
- **Package Manager**: npm 11.0.0, Node 22.23.0+

---

## Directory Structure

```
expense-tracker-workshop-starter/
├── src/                    # All application code
│   ├── main.jsx           # Entry point - renders React root
│   ├── App.jsx            # Main component (entire app logic)
│   ├── App.css            # Application styling
│   ├── index.css          # Global styles
│   └── assets/            # Static assets (React logo)
├── tests/
│   └── baseline.spec.js   # Playwright E2E test suite
├── public/                # Static files (Vite favicon)
├── docs/
│   └── images/            # Documentation screenshots
├── vite.config.js         # Vite build configuration
├── package.json           # Dependencies and scripts
├── eslint.config.js       # ESLint rules
└── index.html             # HTML entry point
```

---

## Key Components & Data Flow

### Single Component Architecture

The **entire app is one React component** (`App.jsx`):

```
App (root component)
├── State Management (useState hooks):
│   ├── transactions[]     - all income/expense records
│   ├── Form fields        - description, amount, type, category
│   ├── Filters            - filterType, filterCategory
│   └── UI state           - error messages
├── Derived State:
│   ├── totalIncomeCents   - sum of income transactions
│   ├── totalExpensesCents - sum of expense transactions  
│   ├── balanceCents       - income - expenses
│   └── filteredTransactions - transactions after applying filters
└── UI Sections (main > 3 sections):
    ├── Summary Cards      - displays totals (read-only from all data)
    ├── Add Transaction    - form for creating new transactions
    └── Transactions Table - filtered view of transactions
```

### Data Model

Each transaction object:
```javascript
{
  id: UUID,           // unique identifier
  description: string,  // 1-120 chars
  amount: number,     // $0.01 to $1,000,000.00, max 2 decimals
  type: 'income' | 'expense',
  category: string,   // one of 7 predefined categories
  date: string        // YYYY-MM-DD (UTC)
}
```

### State Flow

1. **Transaction Creation**: Form → validation → `setTransactions()` → re-render
2. **Filtering**: Filter selects → `setFilterType/Category()` → computed `filteredTransactions` → table re-renders
3. **Totals**: Computed from **all** transactions (unaffected by filters)

---

## Totals vs Filters: Code & Design

### The Code

**Totals (App.jsx:36-38)** — computed from **ALL** transactions:
```javascript
const totalIncomeCents = sumCents(transactions.filter(t => t.type === 'income'))
const totalExpensesCents = sumCents(transactions.filter(t => t.type === 'expense'))
const balanceCents = totalIncomeCents - totalExpensesCents
```

**Filters (App.jsx:40-46)** — applied only to **table display**:
```javascript
let filteredTransactions = transactions
if (filterType !== 'all') {
  filteredTransactions = filteredTransactions.filter(t => t.type === filterType)
}
if (filterCategory !== 'all') {
  filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory)
}
```

**Helper function (App.jsx:22)** — converts amounts to cents to avoid floating-point errors:
```javascript
const sumCents = items => items.reduce((sum, item) => sum + Math.round(item.amount * 100), 0)
```

### Why Totals Stay the Same When Filtering

The totals **ignore `filterType` and `filterCategory` entirely**. They calculate from the raw `transactions` array, while the filters only affect `filteredTransactions`, which is used only for table rendering.

This is an **intentional design choice**: 
- **Summary cards** show your **account totals** (what you've actually earned and spent)
- **Table filters** provide a **view filter** to help you browse transactions
- Filtering the table doesn't hide money from your account balance—you still spent that coffee money even if you're filtering to show only "housing" expenses

The README confirms this (line 3): "Filters affect table rows, not account totals."

---

## Key Features & Logic

| Feature | Implementation |
|---------|-----------------|
| **Form Validation** | `handleSubmit()` checks description length, amount format, numeric range |
| **Money Formatting** | Stored as cents (multiply by 100) to avoid floating-point errors; formatted with `$` when displayed |
| **Filtering** | Two independent dropdowns (type + category); filters only affect table rows, NOT summary totals |
| **Categories** | Hardcoded list of 7: food, housing, utilities, transport, entertainment, salary, other |
| **Initial Data** | 8 synthetic transactions generated with UTC dates relative to "now" |

---

## Build & Dev Scripts

```bash
npm run dev              # Start Vite dev server (port 5173)
npm run build           # Production build
npm test                # Run all Playwright tests
npm test:baseline       # Run baseline.spec.js only
npm run lint            # ESLint check
```

---

## Testing Strategy

The **baseline.spec.js** test suite validates:
- ✅ Numeric totals (not string concatenation bugs)
- ✅ Form scoping (selectors target correct form when duplicates exist)
- ✅ UTC date determinism across year boundaries
- ✅ Decimal amount handling
- ✅ Validation error states
- ✅ Filter combination logic (empty state when no matches)
- ✅ Reload resets synthetic changes
- ✅ Mobile responsiveness (controls min 44px, no horizontal scroll)

---

## Styling Approach

- **CSS**: Vanilla CSS with BEM-like class naming (`.summary-card`, `.income-amount`, `.expense-amount`)
- **Accessibility**: Semantic HTML (sections with `aria-label`, labels with `htmlFor`, table headers with `scope`, error alerts with `role="alert"`)
- **Responsive**: Mobile-first design with min font sizes and touch targets

---

## Tool Integration

- **Chrome DevTools MCP**: Configured in `.mcp.json` for agent-driven browser inspection/interaction
- **ESLint + Prettier**: Code quality and formatting
- **Playwright**: E2E testing with fake clock for deterministic date testing

---

## Notable Design Decisions

1. **No external dependencies for state/UI**: Entire app uses React hooks only—no Redux, Zustand, or component libraries
2. **In-memory only**: No persistence layer, database, or API; data resets on reload
3. **Synthetic test data**: UTC dates relative to "now"; designed to be deterministic for testing
4. **Floating-point avoidance**: Money stored and summed in cents (integers) to prevent precision errors
5. **Filter independence**: Two separate filter states that combine; filters don't affect business logic (totals)

This makes it ideal for a workshop starter—the code is simple enough to understand in one sitting, yet covers essential patterns like state management, form validation, filtering, and data formatting.
