import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOffers: 0,
    totalCandidatures: 0,
    recentCandidatures: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Récupérer les statistiques des utilisateurs
        const usersResponse = await axios.get('http://localhost:3000/api/user/list');
        const users = usersResponse.data.users || [];
        
        // Récupérer les offres
        const offersResponse = await axios.get('http://localhost:3000/api/offers/list');
        const offers = offersResponse.data.offers || [];
        
        // Récupérer les candidatures
        const candidaturesResponse = await axios.get('http://localhost:3000/api/candidatures/admin/all');
        const candidatures = candidaturesResponse.data.candidatures || [];
        
        // Trier les candidatures par date et prendre les 5 plus récentes
        const recentCandidatures = [...candidatures]
          .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
          .slice(0, 5);
        
        setStats({
          totalUsers: users.length,
          totalOffers: offers.length,
          totalCandidatures: candidatures.length,
          recentCandidatures
        });
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        setError("Impossible de charger les statistiques. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Utilisateurs</h3>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Offres</h3>
            <div className="stat-value">{stats.totalOffers}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Candidatures</h3>
            <div className="stat-value">{stats.totalCandidatures}</div>
          </div>
        </div>
      </div>
      
      <div className="recent-section">
        <h2>Candidatures récentes</h2>
        {stats.recentCandidatures.length > 0 ? (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Candidat</th>
                <th>Offre</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentCandidatures.map((candidature) => (
                <tr key={candidature.id}>
                  <td>{candidature.candidate?.nom} {candidature.candidate?.prenom}</td>
                  <td>{candidature.offer?.title}</td>
                  <td>{new Date(candidature.applicationDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${candidature.status}`}>
                      {candidature.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune candidature récente</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 