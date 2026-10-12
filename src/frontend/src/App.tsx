import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { warmupBackend } from './services/api';

// Public Pages
import Dashboard from './pages/Dashboard';
import PublicDepartments from './pages/PublicDepartments';
import DepartmentDetail from './pages/DepartmentDetail';
import PublicProjects from './pages/PublicProjects';
import ProjectDetail from './pages/ProjectDetail';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import TagList from './pages/TagList';
import SearchPage from './pages/SearchPage';

// Auth Pages (Assignment 2)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Management Pages (Assignment 2)
import AdminDashboard from './pages/AdminDashboard';
import DepartmentList from './pages/DepartmentList';
import ProjectList from './pages/ProjectList';
import AccountList from './pages/AccountList';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  useEffect(() => {
    warmupBackend();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* Public Read-Only Pages */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/departments" element={<PublicDepartments />} />
                <Route path="/departments/:id" element={<DepartmentDetail />} />
                <Route path="/projects" element={<PublicProjects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/tags" element={<TagList />} />
                <Route path="/search" element={<SearchPage />} />

                {/* Authentication Pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Management Pages (Authentication required) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/departments"
                  element={
                    <ProtectedRoute>
                      <DepartmentList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/projects"
                  element={
                    <ProtectedRoute>
                      <ProjectList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/tasks"
                  element={
                    <ProtectedRoute>
                      <TaskList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/tags"
                  element={
                    <ProtectedRoute>
                      <TagList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/accounts"
                  element={
                    <ProtectedRoute adminOnly>
                      <AccountList />
                    </ProtectedRoute>
                  }
                />

                {/* User Profile (Bonus) */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Backward compatibility redirects from Assignment 1 */}
                <Route path="/departments/manage" element={<Navigate to="/admin/departments" replace />} />
                <Route path="/projects/manage" element={<Navigate to="/admin/projects" replace />} />
                <Route path="/tasks/manage" element={<Navigate to="/admin/tasks" replace />} />
                <Route path="/tags/manage" element={<Navigate to="/admin/tags" replace />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
