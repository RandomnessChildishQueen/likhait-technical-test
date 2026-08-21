import React, { useEffect, useState } from "react";
import { fetchCategories } from "./services/api";
import Sidebar from "./components/Sidebar";
import HistoryPage from "./pages/HistoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import { COLORS } from "./constants/colors";

function App() {
  const [currentPage, setCurrentPage] = useState("history");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const appStyle: React.CSSProperties = {
    display: "flex",
    minHeight: "100vh",
    background: COLORS.secondary.s01,
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    marginLeft: isSidebarCollapsed ? "80px" : "360px",
    transition: "margin-left 0.3s ease",
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleViewCategoryTransactions = (categoryId: number) => {
     const params = new URLSearchParams(window.location.search);
     params.set("category", categoryId.toString());
     window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
     setCurrentPage("history");
  };

  //useEffect for preloading categories on the get go
  useEffect(() => {
      fetchCategories().catch(() => {
        // useCategories surfaces the failure when a form actually needs the list.
      });
    }, []);

  return (
    <div style={appStyle}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <main style={mainStyle}>
        {currentPage === "history" && <HistoryPage />}
        {currentPage === "categories" && (
          <CategoriesPage onViewTransactions={handleViewCategoryTransactions} />
        )}
      </main>
    </div>
  );
}

export default App;
