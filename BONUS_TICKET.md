## BONUS-002: Implement cache to improve performance

## 📝 Summary

Add cache for Expense History to lessen the wait time for fetching expenses and reduce redundant API calls.

### 🔍 Actual Behavior

Expenses are fetched from the API on every page load, even if the data hasn't changed.

### 🎯 Expected Behavior

The Expense History table should only fetch expenses from the API when the page loads, and cache the results to avoid redundant calls.

### 🎬 Steps to Reproduce

N/A - Feature doesn't exist yet
