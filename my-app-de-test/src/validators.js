export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateCodePostal = (code) => {
  if (typeof code !== 'string') return false;
  return /^\d{5}$/.test(code);
};

export const validateAge = (dateString) => {
  if (typeof dateString !== 'string' || !dateString) return false;

  const today = new Date();
  const birthDate = new Date(dateString);

  if (isNaN(birthDate.getTime())) return false;

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
};

export const validateNom = (nom) => {
  if (typeof nom !== 'string') return false;
  const trimmed = nom.trim();
  if (trimmed.length === 0) return false;
  return !/\d/.test(trimmed);
};

export const validatePrenom = (prenom) => {
  if (typeof prenom !== 'string') return false;
  const trimmed = prenom.trim();
  if (trimmed.length === 0) return false;
  return !/\d/.test(trimmed);
};

export const validateVille = (ville) => {
  if (typeof ville !== 'string') return false;
  return ville.trim().length > 0;
};

export const validateFormData = (formData) => {
  if (!formData) return {};
  const errors = {};

  if (!validateNom(formData.nom)) {
    errors.nom = 'Le nom doit contenir uniquement des lettres';
  }

  if (!validatePrenom(formData.prenom)) {
    errors.prenom = 'Le prénom doit contenir uniquement des lettres';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Email invalide';
  }

  if (!formData.dateNaissance) {
    errors.dateNaissance = 'La date de naissance est requise';
  } else if (!validateAge(formData.dateNaissance)) {
    errors.dateNaissance = 'Vous devez avoir au moins 18 ans';
  }

  if (!validateVille(formData.ville)) {
    errors.ville = 'La ville est requise';
  }

  if (!validateCodePostal(formData.codePostal)) {
    errors.codePostal = 'Code postal invalide (5 chiffres)';
  }

  return errors;
};
