import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UsersContext } from '../UsersContext';
import './HomePage.css';

function HomePage() {
  const { users } = useContext(UsersContext);

  return (
    <div className="home-container">
      <h1>Bienvenue sur notre plateforme</h1>
      <p className="welcome-text">Inscrivez-vous pour rejoindre notre communauté.</p>

      <div className="user-stats" data-cy="user-stats">
        <p data-cy="user-count" className="user-count">
          {users.length} utilisateur(s) inscrit(s)
        </p>
      </div>

      <div className="user-list-section">
        <h2>Liste des inscrits</h2>
        {users.length === 0 ? (
          <p data-cy="empty-list" className="empty-message">Aucun utilisateur inscrit pour le moment.</p>
        ) : (
          <ul data-cy="users-list" className="users-list">
            {users.map((user, index) => (
              <li key={index} data-cy={`user-${index}`}>
                <span className="user-name">{user.name || `${user.nom} ${user.prenom}`}</span>
                <span className="user-email">({user.email})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/register" className="btn-register" data-cy="link-register">
        Aller vers le formulaire d'inscription
      </Link>
    </div>
  );
}

export default HomePage;
