import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import '../styles/Offers.css';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour gérer les modaux
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    ville: '',
    typeContrat: 'interim',
    dateDebut: '',
    duration: '',
    categoryIds: []
  });
  
  // État pour les messages de succès
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchOffers();
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/category/list');
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des catégories:', err);
    }
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/offers/list');
      setOffers(response.data.offers || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des offres:', err);
      setError("Une erreur s'est produite lors du chargement des offres.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setFormData({
        ...formData,
        categoryIds: [...formData.categoryIds, categoryId]
      });
    } else {
      setFormData({
        ...formData,
        categoryIds: formData.categoryIds.filter(id => id !== categoryId)
      });
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      salary: '',
      ville: '',
      typeContrat: 'interim',
      dateDebut: '',
      duration: '',
      categoryIds: []
    });
  };
  
  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };
  
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  
  const openEditModal = (offer) => {
    // Préparer les données de l'offre pour l'édition
    const categoryIds = offer.offerCategories ? 
      offer.offerCategories.map(category => category.id) : [];
    
    setFormData({
      title: offer.title,
      description: offer.description,
      salary: offer.salary,
      ville: offer.ville,
      typeContrat: offer.typeContrat,
      dateDebut: new Date(offer.dateDebut).toISOString().split('T')[0],
      duration: offer.duration || '',
      categoryIds
    });
    
    setSelectedOffer(offer);
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedOffer(null);
  };
  
  const handleCreateOffer = async (e) => {
    e.preventDefault();
    
    try {
      const token = Cookies.get('token');
      
      if (!token) {
        setError("Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette page.");
        return;
      }
      
      await axios.post('http://localhost:3000/api/offers/create', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccessMessage('Offre créée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
      closeCreateModal();
      fetchOffers();
    } catch (err) {
      console.error('Erreur lors de la création de l\'offre:', err);
      setError("Une erreur s'est produite lors de la création de l'offre.");
    }
  };
  
  const handleUpdateOffer = async (e) => {
    e.preventDefault();
    
    try {
      const token = Cookies.get('token');
      
      if (!token) {
        setError("Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette page.");
        return;
      }
      
      await axios.put(`http://localhost:3000/api/offers/update/${selectedOffer.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccessMessage('Offre mise à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
      closeEditModal();
      fetchOffers();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'offre:', err);
      setError("Une erreur s'est produite lors de la mise à jour de l'offre.");
    }
  };
  
  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      return;
    }
    
    try {
      const token = Cookies.get('token');
      
      if (!token) {
        setError("Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette page.");
        return;
      }
      
      await axios.delete(`http://localhost:3000/api/offers/delete/${offerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccessMessage('Offre supprimée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchOffers();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'offre:', err);
      setError("Une erreur s'est produite lors de la suppression de l'offre.");
    }
  };

  if (loading) {
    return <div className="loading">Chargement des offres...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchOffers} className="retry-button">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="offers-page">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="page-header">
        <h1>Gestion des offres d'emploi</h1>
        <div className="header-actions">
          <button className="add-button" onClick={openCreateModal}>
            Ajouter une offre
          </button>
        </div>
      </div>

      <div className="offers-list">
        <table className="offers-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Type de contrat</th>
              <th>Ville</th>
              <th>Date de début</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.length > 0 ? (
              offers.map((offer) => (
                <tr key={offer.id}>
                  <td>{offer.title}</td>
                  <td>{offer.typeContrat}</td>
                  <td>{offer.ville}</td>
                  <td>{new Date(offer.dateDebut).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-button edit-button"
                        onClick={() => openEditModal(offer)}
                      >
                        Modifier
                      </button>
                      <button 
                        className="action-button delete-button"
                        onClick={() => handleDeleteOffer(offer.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">Aucune offre trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal de création d'offre */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Créer une nouvelle offre</h2>
              <button className="close-button" onClick={closeCreateModal}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateOffer}>
                <div className="form-group">
                  <label htmlFor="title">Titre de l'offre *</label>
                  <input 
                    type="text" 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="salary">Salaire *</label>
                  <input 
                    type="text" 
                    id="salary" 
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="ville">Ville *</label>
                  <input 
                    type="text" 
                    id="ville" 
                    name="ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="typeContrat">Type de contrat *</label>
                  <select 
                    id="typeContrat" 
                    name="typeContrat"
                    value={formData.typeContrat}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="interim">Intérim</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="dateDebut">Date de début *</label>
                  <input 
                    type="date" 
                    id="dateDebut" 
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="duration">Durée</label>
                  <input 
                    type="text" 
                    id="duration" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Ex: 3 mois, 6 mois, etc."
                  />
                </div>
                
                <div className="form-group">
                  <label>Catégories</label>
                  <div className="categories-list">
                    {categories.map(category => (
                      <div key={category.id} className="category-checkbox">
                        <input 
                          type="checkbox" 
                          id={`category-${category.id}`}
                          value={category.id}
                          checked={formData.categoryIds.includes(category.id)}
                          onChange={handleCategoryChange}
                        />
                        <label htmlFor={`category-${category.id}`}>{category.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={closeCreateModal}>
                    Annuler
                  </button>
                  <button type="submit" className="submit-button">
                    Créer l'offre
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de modification d'offre */}
      {isEditModalOpen && selectedOffer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Modifier l'offre</h2>
              <button className="close-button" onClick={closeEditModal}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateOffer}>
                <div className="form-group">
                  <label htmlFor="edit-title">Titre de l'offre *</label>
                  <input 
                    type="text" 
                    id="edit-title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-description">Description *</label>
                  <textarea 
                    id="edit-description" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-salary">Salaire *</label>
                  <input 
                    type="text" 
                    id="edit-salary" 
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-ville">Ville *</label>
                  <input 
                    type="text" 
                    id="edit-ville" 
                    name="ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-typeContrat">Type de contrat *</label>
                  <select 
                    id="edit-typeContrat" 
                    name="typeContrat"
                    value={formData.typeContrat}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="interim">Intérim</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-dateDebut">Date de début *</label>
                  <input 
                    type="date" 
                    id="edit-dateDebut" 
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-duration">Durée</label>
                  <input 
                    type="text" 
                    id="edit-duration" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Ex: 3 mois, 6 mois, etc."
                  />
                </div>
                
                <div className="form-group">
                  <label>Catégories</label>
                  <div className="categories-list">
                    {categories.map(category => (
                      <div key={category.id} className="category-checkbox">
                        <input 
                          type="checkbox" 
                          id={`edit-category-${category.id}`}
                          value={category.id}
                          checked={formData.categoryIds.includes(category.id)}
                          onChange={handleCategoryChange}
                        />
                        <label htmlFor={`edit-category-${category.id}`}>{category.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={closeEditModal}>
                    Annuler
                  </button>
                  <button type="submit" className="submit-button">
                    Mettre à jour
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers; 