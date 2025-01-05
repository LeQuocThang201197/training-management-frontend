import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoginPage } from "@/pages/auth/Login";
import { RegisterPage } from "@/pages/auth/Register";
import { AppLayout } from "@/components/AppLayout";
import { OverviewPage } from "@/pages/Overview";
import { DocumentsPage } from "@/pages/Documents";
import { TagsPage } from "@/pages/Tags";
import { TrainingPage } from "@/pages/Training";
import { AdditionalTrainingPage } from "@/pages/AdditionalTraining";
import { PersonnelPage } from "@/pages/Personnel";
import { SportsPage } from "@/pages/Sports";
import { TeamsPage } from "@/pages/Teams";

function App() {
  const [currentPage, setCurrentPage] = useState("Tổng quan");

  useEffect(() => {
    document.title = `${currentPage} | Quản lý Huấn luyện và Công tác Chính trị`;
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "Tổng quan":
        return <OverviewPage />;
      case "Văn bản, giấy tờ":
        return <DocumentsPage />;
      case "Thẻ":
        return <TagsPage />;
      case "Tập trung":
        return <TrainingPage />;
      case "Tập huấn Bổ sung":
        return <AdditionalTrainingPage />;
      case "Nhân sự":
        return <PersonnelPage />;
      case "Môn thể thao":
        return <SportsPage />;
      case "Đội":
        return <TeamsPage />;
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                >
                  {renderPage()}
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
