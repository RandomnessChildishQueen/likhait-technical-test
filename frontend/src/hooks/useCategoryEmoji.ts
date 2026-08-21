/**
 * Resolves a category name to its emoji: stored value first,
 * then the built-in map for categories created before emojis existed.
 */

import { useCallback } from "react";
import { useCategories } from "./useCategories";
import {
  CATEGORY_EMOJIS,
  DEFAULT_CATEGORY_EMOJI,
} from "../constants/categoryEmojis";

export function useCategoryEmoji() {
  const { categories } = useCategories();

  return useCallback(
    (name: string): string => {
      const stored = categories.find((category) => category.name === name);

      return (
        stored?.emoji || CATEGORY_EMOJIS[name] || DEFAULT_CATEGORY_EMOJI
      );
    },
    [categories],
  );
}
