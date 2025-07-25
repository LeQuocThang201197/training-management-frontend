import { AuthProvider } from "./contexts/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/Register";
import { AppLayout } from "./components/AppLayout";
import { OverviewPage } from "./pages/Overview";
import { DocumentsPage } from "./pages/Documents";
import { TagsPage } from "./pages/Tags";
import { PersonnelPage } from "./pages/Personnel";
import { SportsPage } from "./pages/Sports";
import { TeamsPage } from "./pages/Teams";
import { PermissionGate } from "./components/PermissionGate";
import { ConcentrationPage } from "./pages/Concentration";
import { ConcentrationDetailPage } from "./pages/ConcentrationDetail";
import { DocumentDetailPage } from "./pages/DocumentDetail";
import { PersonnelRolesPage } from "./pages/PersonnelRoles";
import { OrganizationsPage } from "./pages/Organizations";
import { UserManagementPage } from "@/pages/UserManagement";
import { RoleManagementPage } from "./pages/RoleManagement";
import { PermissionManagementPage } from "./pages/PermissionManagement";
import { PersonnelDetailPage } from "./pages/PersonnelDetail";
import { CompetitionsPage } from "./pages/Competitions";
import { CompetitionDetailPage } from "./pages/CompetitionDetail";
import { Toaster } from "@/components/ui/toaster";

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
                          <PermissionGate permission="READ_CONCENTRATION">
                            <ConcentrationPage />
                          </PermissionGate>
                        }
                      />
                      <Route path="trainings" element={<div>Tập huấn</div>} />
                      <Route
                        path="competitions"
                        element={
                          <PermissionGate permission="READ_COMPETITION">
                            <CompetitionsPage />
                          </PermissionGate>
                        }
                      />
                      <Route
                        path="competitions/:id"
                        element={
                          <PermissionGate permission="READ_COMPETITION">
                            <CompetitionDetailPage />
                          </PermissionGate>
                        }
                      />
                      <Route
                        path="personnel"
                        element={
                          <PermissionGate permission="READ_PERSON">
                            <PersonnelPage />
                          </PermissionGate>
                        }
                      />
                      <Route
                        path="personnel/:id"
                        element={
                          <PermissionGate permission="READ_PERSON">
                            <PersonnelDetailPage />
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
                      <Route
                        path="roles/personnel"
                        element={
                          <PermissionGate permission="READ_PERSON">
                            <PersonnelRolesPage />
                          </PermissionGate>
                        }
                      />

                      <Route
                        path="users"
                        element={
                          <PermissionGate permission="ADMIN">
                            <UserManagementPage />
                          </PermissionGate>
                        }
                      />
                      <Route path="categories">
                        <Route
                          path="tags"
                          element={
                            <PermissionGate permission="READ_TAG">
                              <TagsPage />
                            </PermissionGate>
                          }
                        />
                        <Route
                          path="sports"
                          element={
                            <PermissionGate permission="READ_SPORT">
                              <SportsPage />
                            </PermissionGate>
                          }
                        />
                        <Route
                          path="teams"
                          element={
                            <PermissionGate permission="READ_TEAM">
                              <TeamsPage />
                            </PermissionGate>
                          }
                        />
                        <Route
                          path="organizations"
                          element={
                            <PermissionGate permission="READ_TAG">
                              <OrganizationsPage />
                            </PermissionGate>
                          }
                        />
                      </Route>
                      <Route
                        path="roles"
                        element={
                          <PermissionGate permission="ADMIN">
                            <RoleManagementPage />
                          </PermissionGate>
                        }
                      />
                      <Route
                        path="permissions"
                        element={
                          <PermissionGate permission="ADMIN">
                            <PermissionManagementPage />
                          </PermissionGate>
                        }
                      />
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
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
