/**
 * Utility functions for expense calculations and data manipulation
 */

import { Expense } from "../types";

/**
 * Calculate total amount from an array of expenses
 */
export function calculateTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
}

/**
 * Display a stored business date-time without applying timezone conversion.
 */
export function formatOccurredAt(value: string): string {
  return value.slice(0, 16).replace("T", " ");
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Format the current local clock value for date and time form defaults.
 */
export function toDateTimeInput(value: Date = new Date()): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hour = String(value.getHours()).padStart(2, "0");
  const minute = String(value.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/**
 * Get days in month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Group expenses by day
 */
export function groupExpensesByDay(expenses: Expense[]) {
  const grouped = new Map<number, Expense[]>();

  expenses.forEach((expense) => {
    const day = Number(expense.occurredAt.slice(8, 10));
    const dayExpenses = grouped.get(day) || [];
    dayExpenses.push(expense);
    grouped.set(day, dayExpenses);
  });

  return grouped;
}
