'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserData {
  id: string;
  nom: string;
  prenom: string;
  ville: string;
  numero: string;
  email: string;
  cvs?: Array<{
    id: number;
    name: string;
    path: string;
  }>;
}

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  const fetchUserData = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          Cookies.remove('token');
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data.user);
      setEditedData(data.user);
    } catch (error) {
      setError('Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
    setError('');
  };

  const handleSave = async () => {
    if (!editedData || !userData?.id) return;

    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Ne garder que les champs que le backend accepte
      const changedFields: any = {};
      const fieldsToCheck = ['email', 'ville', 'numero'] as const;
      
      fieldsToCheck.forEach(field => {
        if (editedData[field] !== userData[field]) {
          changedFields[field] = editedData[field];
        }
      });

      // Si aucun champ n'a été modifié, ne pas faire de requête
      if (Object.keys(changedFields).length === 0) {
        setIsEditing(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/user/update/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(changedFields)
      });

      if (!response.ok) {
        if (response.status === 401) {
          Cookies.remove('token');
          router.push('/login');
          return;
        }
        if (response.status === 403) {
          setError('Vous ne pouvez modifier que votre propre compte');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      // Rafraîchir les données après la mise à jour
      await fetchUserData();
      setIsEditing(false);
      setSuccess('Profil mis à jour avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erreur lors de la mise à jour du profil');
      }
    }
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>, cvNumber: number) => {
    const file = event.target.files?.[0];
    if (!file || !userData?.id) return;

    const formData = new FormData();
    formData.append(`cv${cvNumber}`, file);
    formData.append(`cv${cvNumber}Name`, file.name);

    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/user/update/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401) {
          Cookies.remove('token');
          router.push('/login');
          return;
        }
        if (response.status === 403) {
          setError('Vous ne pouvez modifier que votre propre compte');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'upload du CV');
      }

      // Rafraîchir les données utilisateur après l'upload
      await fetchUserData();
      setSuccess('CV uploadé avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erreur lors de l\'upload du CV');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <div className="flex space-x-4">
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Modifier
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Se déconnecter
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="space-y-6">
            {isEditing ? (
              // Formulaire d'édition
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <p className="mt-1 text-lg text-gray-500">{userData?.nom}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <p className="mt-1 text-lg text-gray-500">{userData?.prenom}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ville</label>
                  <input
                    type="text"
                    value={editedData?.ville || ''}
                    onChange={(e) => setEditedData(prev => prev ? { ...prev, ville: e.target.value } : null)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                  <input
                    type="tel"
                    value={editedData?.numero || ''}
                    onChange={(e) => setEditedData(prev => prev ? { ...prev, numero: e.target.value } : null)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editedData?.email || ''}
                    onChange={(e) => setEditedData(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              // Affichage des informations
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <p className="mt-1 text-lg">{userData?.nom}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <p className="mt-1 text-lg">{userData?.prenom}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ville</label>
                  <p className="mt-1 text-lg">{userData?.ville}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                  <p className="mt-1 text-lg">{userData?.numero}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-lg">{userData?.email}</p>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            )}

            {/* Section CV */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Mes CV</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((cvNumber) => (
                  <div key={cvNumber} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        CV {cvNumber}
                      </label>
                      <p className="text-sm text-gray-500">
                        {userData?.cvs?.find(cv => cv.id === cvNumber)?.name || 'Aucun CV uploadé'}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleCVUpload(e, cvNumber)}
                      className="hidden"
                      id={`cv${cvNumber}`}
                    />
                    <label
                      htmlFor={`cv${cvNumber}`}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer"
                    >
                      {userData?.cvs?.find(cv => cv.id === cvNumber) ? 'Modifier' : 'Ajouter'}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 