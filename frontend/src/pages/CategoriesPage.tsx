/**
 * Page listing all categories, with edit/view/create actions
 */

import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useCategoryEmoji } from "../hooks/useCategoryEmoji";
import { AddCategoryModal } from "../components/AddCategoryModal";
import { CategoryDetailModal } from "../components/CategoryDetailModal";
import { ItemTable, Button } from "../vibes";
import { Category } from "../types";
import { COLORS } from "../constants/colors";

interface CategoriesPageProps {
  onViewTransactions: (categoryId: number) => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ onViewTransactions }) => {
  const { categories, loading } = useCategories();
  const categoryEmoji = useCategoryEmoji();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [viewingCategory, setViewingCategory] = useState<Category | undefined>();

  const pageStyle: React.CSSProperties = {
    padding: "48px 64px",
    minHeight: "100vh",
    background: COLORS.secondary.s01,
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "40px",
    fontWeight: 700,
    color: COLORS.secondary.s10,
    margin: 0,
  };

  const columns = [
    {
      key: "emoji",
      header: "",
      width: "56px",
      render: (item: Category) => (
        <span style={{ fontSize: "24px" }}>{categoryEmoji(item.name)}</span>
      ),
    },
    {
      key: "name",
      header: "Name",
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (item: Category) => (
        <Button
          type="button"
          variant="secondary"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setEditingCategory(item);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Categories</h1>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          Add Category
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ItemTable
          columns={columns}
          data={categories}
          emptyMessage="No categories yet"
          onRowClick={(item: Category) => setViewingCategory(item)}
        />
      )}

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <AddCategoryModal
        isOpen={Boolean(editingCategory)}
        category={editingCategory}
        onClose={() => setEditingCategory(undefined)}
      />

      <CategoryDetailModal
        isOpen={Boolean(viewingCategory)}
        category={viewingCategory}
        onClose={() => setViewingCategory(undefined)}
        onEdit={() => {
          setEditingCategory(viewingCategory);
          setViewingCategory(undefined);
        }}
        onViewTransactions={() => {
          if (viewingCategory) onViewTransactions(viewingCategory.id);
        }}
      />
    </div>
  );
};

export default CategoriesPage;
