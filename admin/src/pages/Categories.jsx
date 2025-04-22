import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/category/list');
      setCategories(response.data.categories || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des catégories:', err);
      setError("Une erreur s'est produite lors du chargement des catégories.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des catégories...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchCategories} className="retry-button">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Gestion des catégories</h1>
        <div className="header-actions">
          <button className="add-button">
            Ajouter une catégorie
          </button>
        </div>
      </div>

      <div className="categories-list">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Nombre d'offres</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.offers?.length || 0}</td>
                  <td>
                    <button className="action-button edit-button">
                      Modifier
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">Aucune catégorie trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories; 