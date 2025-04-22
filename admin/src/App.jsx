import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

// Pages
import Candidatures from './pages/Candidatures';
import Categories from './pages/Categories';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Offers from './pages/Offers';
import Users from './pages/Users';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Auth context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/offers" element={
            <ProtectedRoute>
              <AdminLayout>
                <Offers />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/candidatures" element={
            <ProtectedRoute>
              <AdminLayout>
                <Candidatures />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/categories" element={
            <ProtectedRoute>
              <AdminLayout>
                <Categories />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
