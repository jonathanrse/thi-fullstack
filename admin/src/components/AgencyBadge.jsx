import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Composant qui affiche un badge avec l'agence de l'utilisateur connecté
 */
const AgencyBadge = () => {
  const { user } = useAuth();
  
  // Si l'utilisateur n'a pas d'agence, on n'affiche rien
  if (!user || !user.agence) return null;

  // Capitaliser la première lettre de l'agence
  const formattedAgency = user.agence.charAt(0).toUpperCase() + user.agence.slice(1);

  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
      Agence {formattedAgency}
    </div>
  );
};

export default AgencyBadge; 