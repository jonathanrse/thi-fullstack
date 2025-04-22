import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Récupérer le token d'authentification des cookies
      const token = Cookies.get('token');
      
      if (!token) {
        setError("Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette page.");
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:3000/api/user/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Réponse du serveur:', response.data);
      setUsers(response.data.users || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setError("Une erreur s'est produite lors du chargement des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return <div className="loading">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchUsers} className="retry-button">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Gestion des utilisateurs</h1>
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="users-list">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Ville</th>
              <th>Numéro</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.nom} {user.prenom}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.ville}</td>
                  <td>{user.numero}</td>
                  <td>
                    <button 
                      onClick={() => openUserDetails(user)} 
                      className="action-button view-button"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">Aucun utilisateur trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Détails de l'utilisateur</h2>
              <button onClick={closeModal} className="close-button">&times;</button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                <div className="detail-group">
                  <label>Nom complet:</label>
                  <p>{selectedUser.nom} {selectedUser.prenom}</p>
                </div>
                <div className="detail-group">
                  <label>Email:</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="detail-group">
                  <label>Rôle:</label>
                  <p>{selectedUser.role}</p>
                </div>
                <div className="detail-group">
                  <label>Ville:</label>
                  <p>{selectedUser.ville}</p>
                </div>
                <div className="detail-group">
                  <label>Numéro:</label>
                  <p>{selectedUser.numero}</p>
                </div>
                <div className="detail-group">
                  <label>Inscrit le:</label>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* CV section */}
              <div className="cv-section">
                <h3>CV disponibles</h3>
                <div className="cv-list">
                  {selectedUser.cv1Name && (
                    <div className="cv-item">
                      <span>CV #1: {selectedUser.cv1Name}</span>
                      <a href={`http://localhost:3000/${selectedUser.cv1Path}`} target="_blank" rel="noopener noreferrer">
                        Voir le CV
                      </a>
                    </div>
                  )}
                  {selectedUser.cv2Name && (
                    <div className="cv-item">
                      <span>CV #2: {selectedUser.cv2Name}</span>
                      <a href={`http://localhost:3000/${selectedUser.cv2Path}`} target="_blank" rel="noopener noreferrer">
                        Voir le CV
                      </a>
                    </div>
                  )}
                  {selectedUser.cv3Name && (
                    <div className="cv-item">
                      <span>CV #3: {selectedUser.cv3Name}</span>
                      <a href={`http://localhost:3000/${selectedUser.cv3Path}`} target="_blank" rel="noopener noreferrer">
                        Voir le CV
                      </a>
                    </div>
                  )}
                  {!selectedUser.cv1Name && !selectedUser.cv2Name && !selectedUser.cv3Name && (
                    <p>Aucun CV disponible</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 