import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/user/list', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data); // Log pour vérifier la structure des données

        // Assure-toi que la réponse est un tableau
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('La réponse n\'est pas un tableau:', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        navigate('/login');
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('token'); // Supprime le cookie de session
    navigate('/login'); // Redirige vers la page de connexion
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Se déconnecter</button>
      <h3>Users List</h3>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              {user.nom} {user.prenom} - {user.email}
            </li>
          ))
        ) : (
          <p>Aucun utilisateur trouvé</p>
        )}
      </ul>
    </div>
  );
};

export default Admin;
