import { AuthProvider } from "./contexts/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/Register";
import { AppLayout } from "./components/AppLayout";
import { OverviewPage } from "./pages/Overview";
import { DocumentsPage } from "./pages/Documents";
import { TagsPage } from "./pages/Tags";
import { AdditionalTrainingPage } from "./pages/AdditionalTraining";
import { PersonnelPage } from "./pages/Personnel";
import { SportsPage } from "./pages/Sports";
import { TeamsPage } from "./pages/Teams";
import { PermissionGate } from "./components/PermissionGate";
import { Permission } from "./types/auth";
import { ConcentrationPage } from "./pages/Concentration";
import { ConcentrationDetailPage } from "./pages/ConcentrationDetail";
import { DocumentDetailPage } from "./pages/DocumentDetail";
import { PersonnelRolesPage } from "./pages/PersonnelRoles";
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
                    {/* Trang chủ */}
                    <Route path="/overview" element={<OverviewPage />} />

                    {/* Quản lý routes */}
                    <Route path="/management">
                      <Route path="papers" element={<DocumentsPage />} />
                      <Route
                        path="papers/:id"
                        element={<DocumentDetailPage />}
                      />
                      <Route
                        path="concentrations"
                        element={
                          <PermissionGate permission={Permission.VIEW_TRAINING}>
                            <ConcentrationPage />
                          </PermissionGate>
                        }
                      />
                      <Route
                        path="additional-training"
                        element={<AdditionalTrainingPage />}
                      />
                      <Route
                        path="minus-training"
                        element={<div>Thôi tập huấn</div>}
                      />
                      <Route path="trainings" element={<div>Tập huấn</div>} />
                      <Route path="competitions" element={<div>Thi đấu</div>} />
                      <Route
                        path="personnel"
                        element={
                          <PermissionGate
                            permission={Permission.MANAGE_PERSONNEL}
                          >
                            <PersonnelPage />
                          </PermissionGate>
                        }
                      />
                      <Route path="teams" element={<TeamsPage />} />
                      <Route path="sports" element={<SportsPage />} />
                      <Route
                        path="concentrations/:id"
                        element={<ConcentrationDetailPage />}
                      />
                    </Route>

                    {/* Thiết lập routes */}
                    <Route path="/settings">
                      <Route path="roles">
                        <Route
                          path="personnel"
                          element={
                            <PermissionGate
                              permission={Permission.MANAGE_PERSONNEL}
                            >
                              <PersonnelRolesPage />
                            </PermissionGate>
                          }
                        />
                        <Route
                          path="users"
                          element={
                            <PermissionGate
                              permission={Permission.MANAGE_PERSONNEL}
                            >
                              <div>Vai trò người dùng</div>
                            </PermissionGate>
                          }
                        />
                      </Route>
                      <Route path="categories">
                        <Route
                          path="tags"
                          element={
                            <PermissionGate permission={Permission.VIEW_TAG}>
                              <TagsPage />
                            </PermissionGate>
                          }
                        />
                        <Route
                          path="sports"
                          element={
                            <PermissionGate permission={Permission.VIEW_TAG}>
                              <SportsPage />
                            </PermissionGate>
                          }
                        />
                        <Route
                          path="teams"
                          element={
                            <PermissionGate permission={Permission.VIEW_TAG}>
                              <TeamsPage />
                            </PermissionGate>
                          }
                        />
                      </Route>
                    </Route>

                    {/* Thành tích */}
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
