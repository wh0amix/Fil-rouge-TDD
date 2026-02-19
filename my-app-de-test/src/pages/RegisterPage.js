import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateFormData } from '../validators';
import { UsersContext } from '../UsersContext';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const { addUser } = useContext(UsersContext);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    ville: '',
    codePostal: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateFormData(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Ajouter l'utilisateur via le contexte
    addUser(formData);

    // Réinitialiser le formulaire et afficher le succès
    setFormData({ nom: '', prenom: '', email: '', dateNaissance: '', ville: '', codePostal: '' });
    setSuccess(true);

    // Rediriger vers l'accueil après 2 secondes
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="register-container">
      <h1>Formulaire d'enregistrement</h1>
      {success && <p className="success" data-cy="success-message">Enregistrement réussi!</p>}
      <form onSubmit={handleSubmit} data-cy="register-form">
        <div>
          <label htmlFor="nom">Nom:</label>
          <input
            id="nom"
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            data-cy="input-nom"
          />
          {errors.nom && <span className="error" data-cy="error-nom">{errors.nom}</span>}
        </div>

        <div>
          <label htmlFor="prenom">Prénom:</label>
          <input
            id="prenom"
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            data-cy="input-prenom"
          />
          {errors.prenom && <span className="error" data-cy="error-prenom">{errors.prenom}</span>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            data-cy="input-email"
          />
          {errors.email && <span className="error" data-cy="error-email">{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="dateNaissance">Date de naissance:</label>
          <input
            id="dateNaissance"
            type="date"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleChange}
            data-cy="input-dateNaissance"
          />
          {errors.dateNaissance && <span className="error" data-cy="error-dateNaissance">{errors.dateNaissance}</span>}
        </div>

        <div>
          <label htmlFor="ville">Ville:</label>
          <input
            id="ville"
            type="text"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            data-cy="input-ville"
          />
          {errors.ville && <span className="error" data-cy="error-ville">{errors.ville}</span>}
        </div>

        <div>
          <label htmlFor="codePostal">Code postal:</label>
          <input
            id="codePostal"
            type="text"
            name="codePostal"
            value={formData.codePostal}
            onChange={handleChange}
            placeholder="5 chiffres"
            data-cy="input-codePostal"
          />
          {errors.codePostal && <span className="error" data-cy="error-codePostal">{errors.codePostal}</span>}
        </div>

        <button type="submit" data-cy="submit-btn">S'enregistrer</button>
      </form>
    </div>
  );
}

export default RegisterPage;
