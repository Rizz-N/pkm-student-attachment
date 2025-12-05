import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import PanelGuru from "./pages/PanelGuru";
import PanelMurid from "./pages/PanelMurid";
import PanelKelas from "./pages/PanelKelas";
import DaftarAdmin from "./pages/DaftarAdmin";
import AdminDash from "./pages/AdminDash";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin", "guru"]}>
                <RoleRedirect />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["guru"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* path khusus admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDash />} />
            <Route path="panelguru" element={<PanelGuru />} />
            <Route path="panelmurid" element={<PanelMurid />} />
            <Route path="panelkelas" element={<PanelKelas />} />
          </Route>
          <Route
            path="/admin/daftar"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DaftarAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
