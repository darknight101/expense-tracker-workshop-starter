# Expense Tracker Domain Model

## Core Concepts

### Transaction
A record of money in or out of the account.

- **Type**: `'income'` or `'expense'`
- **Amount**: Positive number in USD (stored internally as cents to avoid floating-point errors)
- **Category**: One of seven predefined categories: `food`, `housing`, `utilities`, `transport`, `entertainment`, `salary`, `other`
- **Date**: `YYYY-MM-DD` (UTC). Used to determine which month a transaction belongs to.
- **Description**: 1-120 character narrative (e.g., "Salary," "Coffee")

**Invariants:**
- Amount must be between $0.01 and $1,000,000.00, max 2 decimal places
- All dates use UTC; no timezone conversion
- Transactions are immutable once created (no edit/delete in current scope)

### Account
The user's financial position at a moment in time.

- **Balance**: Sum of all income minus all expenses (across all transactions)
- **Total Income**: Sum of all transactions where `type === 'income'`
- **Total Expenses**: Sum of all transactions where `type === 'expense'`

**Invariant:** Filters applied to the transaction table do NOT affect account totals. Totals are always computed from the full transaction set.

### Monthly Budget
A spending target for a single calendar month. User-defined; not enforced.

- **Month**: Derived from `new Date()` at render time (current calendar month, e.g., November 2026)
- **Limit**: User-set positive number in USD (no upper bound)
- **Reset**: Resets on page reload (synthetic data lifecycle)

**Invariant:** There is at most one budget per month. In MVP, only "current month" budgets exist.

### Monthly Budget Spent
The cumulative expenses in a given month (used to compare against the budget limit).

- **Calculated as**: Sum of all transactions where `type === 'expense'` AND the transaction's `date` falls within the same calendar month as today
- **Not affected by table filters**: Computed from the full transaction set, just like account totals

### Budget Overage
The amount by which monthly spending exceeds the budget limit.

- **Defined as**: `max(0, MonthlyBudgetSpent - BudgetLimit)`
- **Display**: "OVER BUDGET: +$X" when overage > 0

**Invariant:** Overage is never negative. If budget is not set, overage is undefined (not applicable).

---

## Key Relationships

**Account** ← contains many → **Transaction**
- Every transaction is part of the account balance

**Monthly Budget** ← constrains → **Monthly Budget Spent**
- Budget is a user-set limit; spent is computed from transactions in that month
- If spent > limit, overage exists

**Transaction.date** ← determines → **Monthly Budget Spent**
- Only transactions in the same calendar month as today count toward current month's spent

---

## Design Decisions

### 1. Totals Ignore Filters; Budget Ignores Filters
Both account totals (Income/Expenses/Balance) and monthly budget spent are computed from the full transaction set. Table filters are view-only—they don't change business logic.

**Why**: Filtering to show only "housing" should not hide your actual spending. A budget is a real constraint on money; it shouldn't disappear because you filtered the table.

### 2. Budget is Current Month Only (MVP)
User can only set/view a budget for the current calendar month. Budgets for past or future months are not supported yet.

**Why**: Simpler state model (one number, not a dict keyed by month). Clear UX (no month picker). Can add multi-month support later without breaking the model.

### 3. Budget is Not Enforced; Overage is Informational
Adding a transaction that exceeds the budget is **allowed**. The UI shows a warning.

**Why**: Flexibility + learnability. Users may have legitimate reasons to overspend a category. Workshop learners benefit from seeing the logic flow (transaction → spend update → budget warning) rather than hitting a hard constraint.

### 4. Budget Resets on Reload (Synthetic Lifecycle)
Budgets are not persisted. Like transactions, they reset when the page reloads.

**Why**: Consistency with the synthetic workshop data model. No localStorage or backend; all state is in-memory. Keeps scope tight.

---

## Validation Rules

### Transaction Validation
- Description: 1–120 characters, non-empty after trim
- Amount: $0.01–$1,000,000.00, max 2 decimal places (regex: `^\d+(\.\d{1,2})?$`)
- Type and Category: Selected from predefined lists

### Budget Validation
- Limit: Positive number (no zero, no negative)
- No upper bound (user can set $10M if desired)

---

## Glossary

- **Account Total / Balance**: Sum of all income minus all expenses, across all transactions, unaffected by filters
- **Budget Limit**: The user-set monthly spending target (a positive number or undefined)
- **Budget Spent / Monthly Budget Spent**: Sum of expenses in the current calendar month
- **Overage**: Positive difference between spent and limit (if spent > limit; otherwise, undefined)
- **Current Month**: The calendar month of `new Date()` at render time
- **Filter**: A view-only constraint on which transactions appear in the table; does not affect totals or budget calculations
