/**
 * hook for categories operations
 */

import { useCallback, useEffect, useState } from "react";
import { Category } from "../types";
import { fetchCategories } from "../services/api";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setCategories(await fetchCategories());
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, loading, reloadCategories: loadCategories };
}
