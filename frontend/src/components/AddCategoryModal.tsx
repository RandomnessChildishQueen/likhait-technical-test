/**
 * Modal dialog for creating a new expense category
 */

import React, { useState } from "react";
import { createCategory } from "../services/api";
import { Modal, TextField, Button } from "../vibes";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeAndReset = () => {
    setName("");
    setError(undefined);
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
      await createCategory(name.trim());
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

  return (
    <Modal isOpen={isOpen} onClose={closeAndReset} title="Add New Category">
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

        <div style={buttonGroupStyle}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Saving..." : "Add Category"}
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
