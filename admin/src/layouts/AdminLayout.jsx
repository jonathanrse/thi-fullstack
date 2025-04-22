import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Liens de la sidebar
  const menuItems = [
    { to: '/', icon: '📊', label: 'Tableau de bord' },
    { to: '/users', icon: '👥', label: 'Utilisateurs' },
    { to: '/offers', icon: '📋', label: 'Offres d\'emploi' },
    { to: '/candidatures', icon: '📝', label: 'Candidatures' },
    { to: '/categories', icon: '🏷️', label: 'Catégories' }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>THI Admin</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link 
                  to={item.to}
                  className={location.pathname === item.to ? 'active' : ''}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {!isSidebarCollapsed && <span className="menu-label">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
        {/* Header */}
        <header className="admin-header">
          <div className="header-title">
            {menuItems.find(item => item.to === location.pathname)?.label || 'Tableau de bord'}
          </div>
          
          <div className="user-menu">
            {user && (
              <>
                <span className="user-name">{user.nom} {user.prenom}</span>
                <div className="user-dropdown">
                  <button onClick={handleLogout} className="logout-btn">
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 