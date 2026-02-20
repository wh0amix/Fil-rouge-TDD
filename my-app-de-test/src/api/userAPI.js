import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const userAPI = {
  /**
   * Crée un nouvel utilisateur via l'API
   * @param {Object} userData - Les données de l'utilisateur
   * @returns {Promise<Object>} - L'utilisateur créé
   */
  createUser: async (userData) => {
    const response = await axios.post(API_URL, {
      name: `${userData.nom} ${userData.prenom}`,
      email: userData.email,
      phone: userData.codePostal,
      username: userData.nom.toLowerCase(),
    });
    return response.data;
  },

  /**
   * Récupère tous les utilisateurs
   * @returns {Promise<Array>} - La liste des utilisateurs
   */
  getUsers: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
};
