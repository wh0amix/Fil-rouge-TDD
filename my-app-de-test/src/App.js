import React, { useState } from 'react';
import './App.css';
import { validateFormData } from './validators';

function App() {
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

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(formData);
    localStorage.setItem('users', JSON.stringify(users));

    setFormData({ nom: '', prenom: '', email: '', dateNaissance: '', ville: '', codePostal: '' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };


  return (
    <div className="form-container">
      <h1>Formulaire d'enregistrement</h1>
      {success && <p className="success">Enregistrement réussi!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom">Nom:</label>
          <input
            id="nom"
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
          {errors.nom && <span className="error">{errors.nom}</span>}
        </div>

        <div>
          <label htmlFor="prenom">Prénom:</label>
          <input
            id="prenom"
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
          {errors.prenom && <span className="error">{errors.prenom}</span>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="dateNaissance">Date de naissance:</label>
          <input
            id="dateNaissance"
            type="date"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleChange}
          />
          {errors.dateNaissance && <span className="error">{errors.dateNaissance}</span>}
        </div>

        <div>
          <label htmlFor="ville">Ville:</label>
          <input
            id="ville"
            type="text"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
          />
          {errors.ville && <span className="error">{errors.ville}</span>}
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
          />
          {errors.codePostal && <span className="error">{errors.codePostal}</span>}
        </div>

        <button type="submit">S'enregistrer</button>
      </form>
    </div>
  );
}

export default App;
