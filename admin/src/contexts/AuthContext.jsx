import axios from 'axios';
import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration de l'intercepteur Axios
  useEffect(() => {
    // Intercepteur pour ajouter le token à chaque requête
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs d'authentification
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Nettoyage des intercepteurs lors du démontage
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Vérification de l'authentification au chargement
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = Cookies.get('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Appel API pour vérifier le token et récupérer les données utilisateur
        const response = await axios.get('http://localhost:3000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Vérification du rôle admin
        if (response.data.user.role === 'admin') {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          // Si l'utilisateur n'est pas admin, on le déconnecte
          Cookies.remove('token');
          setError('Accès réservé aux administrateurs');
        }
      } catch (err) {
        Cookies.remove('token');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:3000/api/user/login', {
        email,
        password
      });
      
      // Vérification du rôle admin
      if (response.data.user.role === 'admin') {
        Cookies.set('token', response.data.token, { expires: 1 });
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError('Accès réservé aux administrateurs');
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Valeur du contexte
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 