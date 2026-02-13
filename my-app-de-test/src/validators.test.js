import {
  validateEmail,
  validateCodePostal,
  validateAge,
  validateNom,
  validatePrenom,
  validateVille,
  validateFormData
} from './validators';

describe('validateEmail', () => {
  test('should return true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.email@domain.co.uk')).toBe(true);
  });

  test('should return false for invalid email', () => {
    expect(validateEmail('invalidemail')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user @example.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
    expect(validateEmail(123)).toBe(false);
    expect(validateEmail({})).toBe(false);
    expect(validateEmail([])).toBe(false);
  });
});

describe('validateCodePostal', () => {
  test('should return true for valid French postal code', () => {
    expect(validateCodePostal('75001')).toBe(true);
    expect(validateCodePostal('13000')).toBe(true);
    expect(validateCodePostal('69000')).toBe(true);
  });

  test('should return false for invalid postal code', () => {
    expect(validateCodePostal('7500')).toBe(false);
    expect(validateCodePostal('750001')).toBe(false);
    expect(validateCodePostal('ABCDE')).toBe(false);
    expect(validateCodePostal('750 01')).toBe(false);
    expect(validateCodePostal('')).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(validateCodePostal(null)).toBe(false);
    expect(validateCodePostal(undefined)).toBe(false);
    expect(validateCodePostal(75001)).toBe(false);
    expect(validateCodePostal({})).toBe(false);
    expect(validateCodePostal([])).toBe(false);
  });
});

describe('validateAge', () => {
  test('should return true for person 18 or older', () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    expect(validateAge(eighteenYearsAgo.toISOString().split('T')[0])).toBe(true);
    expect(validateAge(twentyYearsAgo.toISOString().split('T')[0])).toBe(true);
  });

  test('should return false for person under 18', () => {
    const today = new Date();
    const seventeenYearsAgo = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());

    expect(validateAge(seventeenYearsAgo.toISOString().split('T')[0])).toBe(false);
  });

  test('should return false for future date', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    expect(validateAge(futureDate.toISOString().split('T')[0])).toBe(false);
  });

  test('should return false for invalid date', () => {
    expect(validateAge('invalid-date')).toBe(false);
    expect(validateAge('')).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(validateAge(null)).toBe(false);
    expect(validateAge(undefined)).toBe(false);
    expect(validateAge(123)).toBe(false);
    expect(validateAge({})).toBe(false);
    expect(validateAge([])).toBe(false);
  });

  test('should handle birthday edge cases', () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const oneYearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    expect(validateAge(eighteenYearsAgo.toISOString().split('T')[0])).toBe(true);
    expect(validateAge(oneYearFromNow.toISOString().split('T')[0])).toBe(false);
  });

  test('should correctly handle birthday not yet occurred this year', () => {
    // Cas : anniversaire plus tard dans le même mois
    // Exemple : aujourd'hui c'est le 5 du mois
    // Et la personne est née le 20 du même mois
    // Elle est techniquement 18 ans (calculé) mais l'anniversaire n'a pas eu lieu
    // Donc on soustrait 1 → elle a 17 ans effectifs

    const today = new Date();
    const daysPassed = today.getDate();

    // Créer une date de naissance : 18 ans mais avec un jour PLUS TARD ce mois
    const futureDay = daysPassed + 5;
    if (futureDay <= 28) { // S'assurer que le jour existe dans tous les mois
      const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), futureDay);
      // Cette personne a calculé 18 ans mais l'anniversaire n'a pas eu lieu
      // donc elle a effectivement 17 ans
      expect(validateAge(birthDate.toISOString().split('T')[0])).toBe(false);
    }
  });
});

describe('validateNom', () => {
  test('should return true for valid nom', () => {
    expect(validateNom('Dupont')).toBe(true);
    expect(validateNom('Martin-Durand')).toBe(true);
    expect(validateNom('O\'Brien')).toBe(true);
  });

  test('should return false for nom with numbers', () => {
    expect(validateNom('Dupont123')).toBe(false);
    expect(validateNom('123')).toBe(false);
    expect(validateNom('Jean1')).toBe(false);
  });

  test('should return false for empty or whitespace only', () => {
    expect(validateNom('')).toBe(false);
    expect(validateNom('   ')).toBe(false);
    expect(validateNom('\t')).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(validateNom(null)).toBe(false);
    expect(validateNom(undefined)).toBe(false);
    expect(validateNom(123)).toBe(false);
    expect(validateNom({})).toBe(false);
    expect(validateNom([])).toBe(false);
  });
});

describe('validatePrenom', () => {
  test('should return true for valid prenom', () => {
    expect(validatePrenom('Jean')).toBe(true);
    expect(validatePrenom('Marie-Louise')).toBe(true);
    expect(validatePrenom('Anne')).toBe(true);
  });

  test('should return false for prenom with numbers', () => {
    expect(validatePrenom('Jean123')).toBe(false);
    expect(validatePrenom('123')).toBe(false);
    expect(validatePrenom('Marie1')).toBe(false);
  });

  test('should return false for empty or whitespace only', () => {
    expect(validatePrenom('')).toBe(false);
    expect(validatePrenom('   ')).toBe(false);
    expect(validatePrenom('\n')).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(validatePrenom(null)).toBe(false);
    expect(validatePrenom(undefined)).toBe(false);
    expect(validatePrenom(123)).toBe(false);
    expect(validatePrenom({})).toBe(false);
    expect(validatePrenom([])).toBe(false);
  });
});

describe('validateVille', () => {
  test('should return true for valid ville', () => {
    expect(validateVille('Paris')).toBe(true);
    expect(validateVille('Lyon')).toBe(true);
    expect(validateVille('Saint-Étienne')).toBe(true);
  });

  test('should return false for empty or whitespace only', () => {
    expect(validateVille('')).toBe(false);
    expect(validateVille('   ')).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(validateVille(null)).toBe(false);
    expect(validateVille(undefined)).toBe(false);
    expect(validateVille(123)).toBe(false);
    expect(validateVille({})).toBe(false);
    expect(validateVille([])).toBe(false);
  });
});

describe('validateFormData', () => {
  test('should return empty object for valid form data', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    const validData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      dateNaissance: birthDate.toISOString().split('T')[0],
      ville: 'Paris',
      codePostal: '75001'
    };

    expect(validateFormData(validData)).toEqual({});
  });

  test('should return errors for invalid nom', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    const invalidData = {
      nom: '',
      prenom: 'Jean',
      email: 'jean@example.com',
      dateNaissance: birthDate.toISOString().split('T')[0],
      ville: 'Paris',
      codePostal: '75001'
    };

    expect(validateFormData(invalidData)).toHaveProperty('nom');
  });

  test('should return errors for invalid prenom', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    const invalidData = {
      nom: 'Dupont',
      prenom: '',
      email: 'jean@example.com',
      dateNaissance: birthDate.toISOString().split('T')[0],
      ville: 'Paris',
      codePostal: '75001'
    };

    expect(validateFormData(invalidData)).toHaveProperty('prenom');
  });

  test('should return errors for invalid email', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    const invalidData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'invalidemail',
      dateNaissance: birthDate.toISOString().split('T')[0],
      ville: 'Paris',
      codePostal: '75001'
    };

    expect(validateFormData(invalidData)).toHaveProperty('email');
  });

  test('should return errors for missing dateNaissance', () => {
    const invalidData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      dateNaissance: '',
      ville: 'Paris',
      codePostal: '75001'
    };

    expect(validateFormData(invalidData)).toHaveProperty('dateNaissance');
  });

  test('should return errors for age under 18', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());

    const invalidData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      dateNaissance: birthDate.toISOString().split('T')[0],
      ville: 'Paris',
      codePostal: '75001'
    };

    expect(validateFormData(invalidData)).toHaveProperty('dateNaissance');
  });

  test('should return errors for invalid ville', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    const invalidData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      dateNaissance: birthDate.toISOString().split('T')[0],
      ville: '',
      codePostal: '75001'
    };

    expect(validateFormData(invalidData)).toHaveProperty('ville');
  });

  test('should return errors for invalid codePostal', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());

    const invalidData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@example.com',
      dateNaissance: birthDate.toISOString().split('T')[0],
      ville: 'Paris',
      codePostal: '750'
    };

    expect(validateFormData(invalidData)).toHaveProperty('codePostal');
  });

  test('should return multiple errors', () => {
    const invalidData = {
      nom: '',
      prenom: '',
      email: 'invalid',
      dateNaissance: '',
      ville: '',
      codePostal: ''
    };

    const errors = validateFormData(invalidData);
    expect(Object.keys(errors).length).toBeGreaterThan(1);
  });
});
