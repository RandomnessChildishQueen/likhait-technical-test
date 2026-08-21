/**
 * Modal dialog for creating a new expense category
 */

import React, { useEffect, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { createCategory, updateCategory } from "../services/api";
import { Modal, TextField, Button } from "../vibes";
import { COLORS } from "../constants/colors";
import { Category } from "../types";

const EMOJI_SUGGESTIONS = [
  "🍔", "🚗", "🎬", "🛍️", "📄", "🏥",
  "📚", "✈️", "🏠", "💰", "🎁", "🐾",
  "☕", "💡", "📱", "🤖", "🎯", "🎰",
  "🌴", "🚊", "📦",
];

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
}

export function AddCategoryModal({ isOpen, onClose, category }: AddCategoryModalProps) {
  const isEditing = Boolean(category);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    setName(category?.name ?? "");
    setEmoji(category?.emoji ?? "");
    setError(undefined);
    setIsPickerOpen(false);
  }, [category, isOpen]);

  const closeAndReset = () => {
    setName("");
    setEmoji("");
    setError(undefined);
    setIsPickerOpen(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && category) {
        await updateCategory(
          category.id,
          name.trim(),
          emoji.trim() || undefined
        );
      } else {
        await createCategory(
          name.trim(),
          emoji.trim() || undefined
        );
      }
      closeAndReset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  const labelStyle: React.CSSProperties = {
     fontSize: "0.875rem",
     fontWeight: 600,
     color: COLORS.text.primary,
   };

   const suggestionGridStyle: React.CSSProperties = {
     display: "flex",
     flexWrap: "wrap",
     gap: "0.375rem",
   };

   const suggestionStyle = (isSelected: boolean): React.CSSProperties => ({
     fontSize: "1.25rem",
     lineHeight: 1,
     padding: "0.375rem",
     cursor: "pointer",
     borderRadius: "0.375rem",
     background: isSelected ? COLORS.secondary.s03 : "transparent",
     border: `1px solid ${isSelected ? COLORS.primary.p06 : COLORS.border}`,
   });


  return (
    <Modal isOpen={isOpen} onClose={closeAndReset}
      title={isEditing ? "Edit Category" : "Add New Category"}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <TextField
          label="Category Name"
          type="text"
          placeholder="e.g. Groceries"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(undefined);
          }}
          error={error}
          maxLength={100}
          autoFocus
          fullWidth
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={labelStyle}>Icon (optional)</label>
          <div style={suggestionGridStyle}>
            {EMOJI_SUGGESTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={`Use ${option} as the icon`}
                aria-pressed={emoji === option}
                style={suggestionStyle(emoji === option)}
                onClick={() => {
                  setEmoji(emoji === option ? "" : option);
                  setError(undefined);
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsPickerOpen((open) => !open)}
            >
              {isPickerOpen ? "Close picker" : "Choose from all emojis"}
            </Button>

            {isPickerOpen && (
              <EmojiPicker
                onEmojiClick={(emojiData: EmojiClickData) => {
                  setEmoji(emojiData.emoji);
                  setError(undefined);
                  setIsPickerOpen(false);
                }}
                width="100%"
                height={350}
              />
            )}
          </div>
        </div>

        <TextField
          label="Or paste your own"
          type="text"
          placeholder="📦"
          value={emoji}
          onChange={(e) => {
            setEmoji(e.target.value);
            setError(undefined);
          }}
          fullWidth
        />

        <div style={buttonGroupStyle}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Saving..." : isEditing ?
              "Save Changes" : "Add Category"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={closeAndReset}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
