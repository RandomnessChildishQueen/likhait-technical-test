/**
 * Modal showing a category's details, with actions to edit it
 * or jump to its filtered transaction history
 */

import React from "react";
import { Modal, Button } from "../vibes";
import { COLORS } from "../constants/colors";
import { Category } from "../types";
import { useCategoryEmoji } from "../hooks/useCategoryEmoji";

interface CategoryDetailModalProps {
  isOpen: boolean;
  category?: Category;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewTransactions: () => void;
  isDeleting?: boolean;
}

export function CategoryDetailModal({
  isOpen,
  category,
  onClose,
  onEdit,
  onDelete,
  onViewTransactions,
  isDeleting,
}: CategoryDetailModalProps) {
  const categoryEmoji = useCategoryEmoji();

  if (!category) return null;

  const bodyStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  };

  const summaryStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  const emojiStyle: React.CSSProperties = {
    fontSize: "40px",
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: COLORS.secondary.s02,
    borderRadius: "12px",
  };

  const nameStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: 700,
    color: COLORS.text.primary,
  };

  const actionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category Details">
      <div style={bodyStyle}>
        <div style={summaryStyle}>
          <span style={emojiStyle}>{categoryEmoji(category.name)}</span>
          <span style={nameStyle}>{category.name}</span>
        </div>

        <div style={actionsStyle}>
          <Button type="button" variant="primary" onClick={onEdit}>
            Edit
          </Button>
          <Button type="button" variant="secondary" onClick={onViewTransactions}>
            View Transactions
          </Button>
          <Button type="button" variant="danger" disabled={isDeleting} onClick={onDelete}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
