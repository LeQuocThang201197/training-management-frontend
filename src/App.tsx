import { AuthProvider } from "./contexts/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/Register";
import { AppLayout } from "./components/AppLayout";
import { OverviewPage } from "./pages/Overview";
import { DocumentsPage } from "./pages/Documents";
import { TagsPage } from "./pages/Tags";
import { TrainingPage } from "./pages/Training";
import { AdditionalTrainingPage } from "./pages/AdditionalTraining";
import { PersonnelPage } from "./pages/Personnel";
import { SportsPage } from "./pages/Sports";
import { TeamsPage } from "./pages/Teams";
import { PermissionGate } from "./components/PermissionGate";
import { Permission } from "./types/auth";

function App() {
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
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<OverviewPage />} />

                    {/* Quản lý routes */}
                    <Route path="/management">
                      <Route path="documents" element={<DocumentsPage />} />
                      <Route path="training" element={<TrainingPage />} />
                      <Route
                        path="additional-training"
                        element={<AdditionalTrainingPage />}
                      />
                      <Route
                        path="minus-training"
                        element={<div>Thôi tập huấn</div>}
                      />
                      <Route
                        path="training-camp"
                        element={<div>Tập huấn</div>}
                      />
                      <Route path="competition" element={<div>Thi đấu</div>} />
                      <Route
                        path="personnel"
                        element={
                          <ProtectedRoute>
                            <PermissionGate
                              permission={Permission.MANAGE_PERSONNEL}
                            >
                              <PersonnelPage />
                            </PermissionGate>
                          </ProtectedRoute>
                        }
                      />
                    </Route>

                    {/* Thiết lập routes */}
                    <Route path="/settings">
                      <Route path="personnel" element={<PersonnelPage />} />
                      <Route
                        path="tags"
                        element={
                          <ProtectedRoute>
                            <TagsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="roles" element={<div>Vai trò</div>} />
                      <Route path="sports" element={<SportsPage />} />
                      <Route path="teams" element={<TeamsPage />} />
                    </Route>

                    <Route
                      path="/achievement"
                      element={<div>Thành tích</div>}
                    />

                    {/* Tổ chuyên môn routes */}
                    <Route path="/specialized-team">
                      <Route
                        path="habit"
                        element={<div>Thói quen ghi chép</div>}
                      />
                      <Route path="statistics" element={<div>Chỉ số</div>} />
                    </Route>
                  </Routes>
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
