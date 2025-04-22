import React, { useState } from 'react';
import '../styles/UsersTable.css';
import Modal from './Modal';

const UsersTable = ({ users, onEdit, onDelete }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(i => i !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleBulkAction = (action) => {
    // Implement bulk action logic here
    console.log(`Bulk action: ${action}`);
  };

  return (
    <div>
      <div className="table-header">
        <h2>Utilisateurs</h2>
        {selectedUsers.length > 0 && (
          <div className="bulk-actions">
            <button className="bulk-action-button" onClick={() => handleBulkAction('activate')}>Activer sélection</button>
            <button className="bulk-action-button" onClick={() => handleBulkAction('deactivate')}>Désactiver sélection</button>
            <button className="bulk-action-button" onClick={() => handleBulkAction('delete')}>Supprimer sélection</button>
          </div>
        )}
      </div>
      
      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th><input type="checkbox" className="select-checkbox" onChange={handleSelectAll} /></th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} onClick={() => handleViewDetails(user)}>
                <td onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    className="select-checkbox"
                    checked={selectedUsers.includes(user.id)} 
                    onChange={() => handleSelectUser(user.id)} 
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`user-status status-${user.active ? 'active' : 'inactive'}`}>
                    {user.active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="user-actions">
                    <button 
                      className="action-button edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(user);
                      }}
                    >
                      Modifier
                    </button>
                    <button 
                      className="action-button delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user.id);
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          title="Détails de l'utilisateur"
          className="user-detail-modal"
        >
          <div className="user-detail-content">
            <div className="user-detail-field">
              <span className="user-detail-label">ID:</span>
              <span className="user-detail-value">{selectedUser.id}</span>
            </div>
            <div className="user-detail-field">
              <span className="user-detail-label">Nom:</span>
              <span className="user-detail-value">{selectedUser.name}</span>
            </div>
            <div className="user-detail-field">
              <span className="user-detail-label">Email:</span>
              <span className="user-detail-value">{selectedUser.email}</span>
            </div>
            <div className="user-detail-field">
              <span className="user-detail-label">Rôle:</span>
              <span className="user-detail-value">{selectedUser.role}</span>
            </div>
            <div className="user-detail-field">
              <span className="user-detail-label">Status:</span>
              <span className={`user-status status-${selectedUser.active ? 'active' : 'inactive'}`}>
                {selectedUser.active ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <div className="user-detail-field">
              <span className="user-detail-label">Date d'inscription:</span>
              <span className="user-detail-value">{selectedUser.createdAt}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UsersTable; 