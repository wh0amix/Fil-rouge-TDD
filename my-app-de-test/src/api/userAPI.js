import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const userAPI = {
  /**
   * Crée un nouvel utilisateur via l'API
   * @param {Object} userData - Les données de l'utilisateur
   * @returns {Promise<Object>} - L'utilisateur créé
   */
  createUser: async (userData) => {
    const response = await axios.post(`${API_URL}/users`, {
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
    });
    return response.data;
  },

  /**
   * Récupère tous les utilisateurs
   * @returns {Promise<Array>} - La liste des utilisateurs
   */
  getUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    // l'api retourne { utilisateurs: [[id, nom, prenom, email, mdp, date], ...] }
    return response.data.utilisateurs.map(u => ({
      id: u[0],
      nom: u[1],
      prenom: u[2],
      email: u[3],
    }));
  },
};
