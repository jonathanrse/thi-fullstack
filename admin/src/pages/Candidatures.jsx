import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Candidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState('');
  const [adminComment, setAdminComment] = useState('');

  // Statuts possibles
  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'reviewing', label: 'En cours d\'examen' },
    { value: 'accepted', label: 'Acceptée' },
    { value: 'rejected', label: 'Refusée' }
  ];

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/candidatures/admin/all');
      setCandidatures(response.data.candidatures || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des candidatures:', err);
      setError("Une erreur s'est produite lors du chargement des candidatures.");
    } finally {
      setLoading(false);
    }
  };

  const openCandidatureDetails = async (candidature) => {
    try {
      // Récupérer les détails complets de la candidature
      const response = await axios.get(`http://localhost:3000/api/candidatures/admin/${candidature.id}`);
      const detailedCandidature = response.data.candidature;
      
      setSelectedCandidature(detailedCandidature);
      setFeedback(detailedCandidature.feedback || '');
      setAdminComment(detailedCandidature.adminComment || '');
      setIsModalOpen(true);
    } catch (err) {
      console.error('Erreur lors de la récupération des détails de la candidature:', err);
      setError("Impossible de charger les détails de cette candidature.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidature(null);
    setFeedback('');
    setAdminComment('');
  };

  const updateCandidatureStatus = async (newStatus) => {
    if (!selectedCandidature) return;
    
    try {
      const response = await axios.put(`http://localhost:3000/api/candidatures/admin/${selectedCandidature.id}`, {
        status: newStatus,
        feedback,
        adminComment
      });
      
      // Mettre à jour la candidature dans la liste
      setCandidatures(candidatures.map(c => 
        c.id === selectedCandidature.id ? { ...c, status: newStatus } : c
      ));
      
      // Mettre à jour la candidature sélectionnée
      setSelectedCandidature({
        ...selectedCandidature,
        status: newStatus,
        feedback,
        adminComment
      });
      
      alert('Candidature mise à jour avec succès');
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la candidature:', err);
      alert("Une erreur s'est produite lors de la mise à jour de la candidature.");
    }
  };

  const getFilteredCandidatures = () => {
    if (statusFilter === 'all') {
      return candidatures;
    }
    return candidatures.filter(c => c.status === statusFilter);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  if (loading) {
    return <div className="loading">Chargement des candidatures...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchCandidatures} className="retry-button">Réessayer</button>
      </div>
    );
  }

  const filteredCandidatures = getFilteredCandidatures();

  return (
    <div className="candidatures-page">
      <div className="page-header">
        <h1>Gestion des candidatures</h1>
        <div className="header-actions">
          <select 
            value={statusFilter} 
            onChange={handleStatusFilterChange}
            className="status-filter"
          >
            <option value="all">Tous les statuts</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="candidatures-list">
        <table className="candidatures-table">
          <thead>
            <tr>
              <th>Candidat</th>
              <th>Offre</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidatures.length > 0 ? (
              filteredCandidatures.map((candidature) => (
                <tr key={candidature.id}>
                  <td>{candidature.candidate?.nom} {candidature.candidate?.prenom}</td>
                  <td>{candidature.offer?.title}</td>
                  <td>{new Date(candidature.applicationDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${candidature.status}`}>
                      {candidature.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => openCandidatureDetails(candidature)} 
                      className="action-button view-button"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">Aucune candidature trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedCandidature && (
        <div className="modal-overlay">
          <div className="modal-content candidature-modal">
            <div className="modal-header">
              <h2>Détails de la candidature</h2>
              <button onClick={closeModal} className="close-button">&times;</button>
            </div>
            <div className="modal-body">
              <div className="candidature-details">
                <div className="section">
                  <h3>Informations sur le candidat</h3>
                  <div className="detail-group">
                    <label>Nom:</label>
                    <p>{selectedCandidature.candidate?.nom} {selectedCandidature.candidate?.prenom}</p>
                  </div>
                  <div className="detail-group">
                    <label>Email:</label>
                    <p>{selectedCandidature.candidate?.email}</p>
                  </div>
                  <div className="detail-group">
                    <label>Téléphone:</label>
                    <p>{selectedCandidature.candidate?.numero}</p>
                  </div>
                  <div className="detail-group">
                    <label>Ville:</label>
                    <p>{selectedCandidature.candidate?.ville}</p>
                  </div>
                </div>

                <div className="section">
                  <h3>Informations sur l'offre</h3>
                  <div className="detail-group">
                    <label>Titre:</label>
                    <p>{selectedCandidature.offer?.title}</p>
                  </div>
                  <div className="detail-group">
                    <label>Type de contrat:</label>
                    <p>{selectedCandidature.offer?.typeContrat}</p>
                  </div>
                  <div className="detail-group">
                    <label>Ville:</label>
                    <p>{selectedCandidature.offer?.ville}</p>
                  </div>
                </div>

                <div className="section">
                  <h3>CV et lettre de motivation</h3>
                  {selectedCandidature.cvInfo?.path ? (
                    <div className="cv-preview">
                      <a 
                        href={`http://localhost:3000/${selectedCandidature.cvInfo.path}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cv-link"
                      >
                        Voir le CV: {selectedCandidature.cvInfo.name || 'CV'}
                      </a>
                    </div>
                  ) : (
                    <p>Aucun CV disponible</p>
                  )}
                  
                  {selectedCandidature.motivationLetter ? (
                    <div className="motivation-letter">
                      <h4>Lettre de motivation:</h4>
                      <div className="letter-content">
                        {selectedCandidature.motivationLetter}
                      </div>
                    </div>
                  ) : (
                    <p>Pas de lettre de motivation</p>
                  )}
                </div>

                <div className="section">
                  <h3>Statut de la candidature</h3>
                  <div className="status-control">
                    <div className="current-status">
                      <p>Statut actuel: </p>
                      <span className={`status-badge status-${selectedCandidature.status}`}>
                        {selectedCandidature.status}
                      </span>
                    </div>
                    <div className="status-actions">
                      {statusOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => updateCandidatureStatus(option.value)}
                          className={`status-button status-${option.value} ${selectedCandidature.status === option.value ? 'active' : ''}`}
                          disabled={selectedCandidature.status === option.value}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="section">
                  <h3>Commentaires et feedback</h3>
                  <div className="comment-section">
                    <div className="form-group">
                      <label>Commentaire interne (visible uniquement par les administrateurs):</label>
                      <textarea
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        rows="3"
                        placeholder="Notes administratives sur cette candidature..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Feedback au candidat:</label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows="3"
                        placeholder="Feedback qui sera visible par le candidat..."
                      />
                    </div>
                    <button 
                      onClick={() => updateCandidatureStatus(selectedCandidature.status)}
                      className="save-comments-button"
                    >
                      Enregistrer les commentaires
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidatures; 