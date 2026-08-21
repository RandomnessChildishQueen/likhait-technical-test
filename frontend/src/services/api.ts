/**
 * API service for communicating with the backend
 */

import { Category, Expense, ExpenseFormData } from "../types";

const API_BASE_URL = "http://localhost:3000/api";

interface ExpenseResponse {
  id: number;
  amount: number;
  description: string;
  category: string;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

function toExpense(data: ExpenseResponse): Expense {
  return {
    id: data.id,
    amount: Number(data.amount),
    description: data.description,
    category: data.category,
    occurredAt: data.occurred_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Fetch all expenses
 */
export async function fetchExpenses(): Promise<Expense[]> {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  const data: ExpenseResponse[] = await response.json();
  return data.map(toExpense);
}

/**
 * Fetch expenses for a specific year and month
 */
export async function getExpenses(
  year: number,
  month: number,
): Promise<Expense[]> {
  const response = await fetch(
    `${API_BASE_URL}/expenses?year=${year}&month=${month}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  const data: ExpenseResponse[] = await response.json();
  return data.map(toExpense);
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]>
 {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function createCategory(name: string): Promise<Category>
 {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category: { name } }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.errors?.[0] ?? "Failed to create category");
  }
  return response.json();
}

async function buildExpensePayload(data: ExpenseFormData) {
  const categories = await fetchCategories();
  const category = categories.find((item) => item.name === data.category);

  if (!category) {
    throw new Error(`Category "${data.category}" was not found`);
  }

  return {
    description: data.description,
    amount: data.amount,
    category_id: category.id,
    // Keep the entered clock value unchanged.
    occurred_at: `${data.date}T${data.time}`,
  };
}

/**
 * Create a new expense
 */
export async function createExpense(data: ExpenseFormData): Promise<Expense> {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expense: await buildExpensePayload(data) }),
  });

  if (!response.ok) throw new Error("Failed to create expense");

  return toExpense(await response.json());
}

/**
 * Update an existing expense
 */
export async function updateExpense(
  id: number,
  data: ExpenseFormData,
): Promise<Expense> {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expense: await buildExpensePayload(data) }),
  });

  if (!response.ok) {
    throw new Error("Failed to update expense");
  }

  return toExpense(await response.json());
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }
}
