import React, { createContext, useState, useEffect } from 'react';
import { userAPI } from './api/userAPI';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Charger les utilisateurs au montage (simule une fetch)
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await userAPI.getUsers();
        setUsers(data);
        setApiError(null);
      } catch (error) {
        setApiError(error.response?.data?.message || error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Ajouter un nouvel utilisateur via l'API
  const addUser = async (newUser) => {
    try {
      setLoading(true);
      setApiError(null);
      const createdUser = await userAPI.createUser(newUser);
      setUsers([...users, createdUser]);
      return createdUser;
    } catch (error) {
      setApiError(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UsersContext.Provider value={{ users, addUser, loading, apiError }}>
      {children}
    </UsersContext.Provider>
  );
};
